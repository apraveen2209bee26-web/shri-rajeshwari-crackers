import http from 'http';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const parsedUrl = new URL(BASE_URL);
const HOST = parsedUrl.hostname;
const PORT = parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80);

const TOTAL_REQUESTS = parseInt(process.env.REQUESTS || '200', 10);
const CONCURRENCY = parseInt(process.env.CONCURRENCY || '25', 10);

console.log(`
===============================================================
💥 SRI RAJESHWARI CRACKERS - FESTIVE TRAFFIC STRESS TEST
===============================================================
Target URL:      ${BASE_URL}
Total Requests:  ${TOTAL_REQUESTS}
Concurrency:     ${CONCURRENCY} parallel virtual users
Testing Scenarios:
  - Catalog Browsing (GET /api/products)
  - Live Store Settings (GET /api/settings)
  - Price Matrix (GET /price-list)
  - Concurrent Order Submissions (POST /api/orders) with Stock Decrements
===============================================================
`);

const endpoints = [
  { method: 'GET', path: '/api/products?sort=sNo-asc', weight: 6 },
  { method: 'GET', path: '/api/settings', weight: 2 },
  { method: 'GET', path: '/price-list', weight: 1 },
  {
    method: 'POST',
    path: '/api/orders',
    weight: 1,
    getBody: () => JSON.stringify({
      customerName: 'Stress Test Customer',
      whatsappNumber: '9159802698',
      address: 'Festive Testing Street, Sivakasi',
      city: 'Sivakasi',
      pincode: '626123',
      items: [{ id: 1, name: '2 3/4" Kuruvi', quantity: 1, price: 20 }],
      totalMrp: 100,
      totalSavings: 80,
      finalAmount: 20
    })
  }
];

// Weighted random endpoint selector
function getRandomEndpoint() {
  const totalWeight = endpoints.reduce((acc, ep) => acc + ep.weight, 0);
  let random = Math.random() * totalWeight;
  for (const ep of endpoints) {
    if (random < ep.weight) return ep;
    random -= ep.weight;
  }
  return endpoints[0];
}

function makeRequest(ep) {
  return new Promise((resolve) => {
    const startTime = performance.now();
    const payload = ep.getBody ? ep.getBody() : null;

    const options = {
      hostname: HOST,
      port: PORT,
      path: ep.path,
      method: ep.method,
      headers: {
        'Accept': 'application/json, text/html',
        'User-Agent': 'FestiveStressTester/1.0',
        ...(payload ? {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        } : {})
      },
      timeout: 10000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        const duration = performance.now() - startTime;
        resolve({
          statusCode: res.statusCode,
          duration,
          success: res.statusCode >= 200 && res.statusCode < 400
        });
      });
    });

    req.on('error', (err) => {
      const duration = performance.now() - startTime;
      resolve({
        statusCode: 0,
        duration,
        success: false,
        error: err.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      const duration = performance.now() - startTime;
      resolve({
        statusCode: 408,
        duration,
        success: false,
        error: 'Request Timeout'
      });
    });

    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

async function runStressTest() {
  const results = [];
  let requestIndex = 0;
  const globalStart = performance.now();

  async function worker() {
    while (requestIndex < TOTAL_REQUESTS) {
      const current = requestIndex++;
      const ep = getRandomEndpoint();
      const res = await makeRequest(ep);
      results.push(res);
      if (current % 25 === 0 && current > 0) {
        process.stdout.write(`⚡ ${current}/${TOTAL_REQUESTS} requests processed...\r`);
      }
    }
  }

  // Spawn parallel workers matching concurrency level
  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  const totalTime = performance.now() - globalStart;
  const durations = results.map(r => r.duration).sort((a, b) => a - b);
  const successCount = results.filter(r => r.success).length;
  const failureCount = results.length - successCount;

  const avgLatency = durations.reduce((a, b) => a + b, 0) / durations.length;
  const p50 = durations[Math.floor(durations.length * 0.50)] || 0;
  const p95 = durations[Math.floor(durations.length * 0.95)] || 0;
  const p99 = durations[Math.floor(durations.length * 0.99)] || 0;
  const minLatency = durations[0] || 0;
  const maxLatency = durations[durations.length - 1] || 0;
  const rps = (results.length / (totalTime / 1000)).toFixed(1);

  console.log(`
===============================================================
📊 FESTIVE STRESS TEST RESULTS
===============================================================
Total Requests:     ${results.length}
Successful (2xx):   ${successCount} (${((successCount / results.length) * 100).toFixed(1)}%)
Failed / Errors:    ${failureCount}
Total Test Time:    ${(totalTime / 1000).toFixed(2)}s
Throughput:         ${rps} requests/second

Latency Breakdown:
  - Fastest (Min):   ${minLatency.toFixed(1)} ms
  - 50th % (Median): ${p50.toFixed(1)} ms
  - Average:         ${avgLatency.toFixed(1)} ms
  - 95th Percentile: ${p95.toFixed(1)} ms
  - 99th Percentile: ${p99.toFixed(1)} ms
  - Slowest (Max):   ${maxLatency.toFixed(1)} ms
===============================================================
STATUS: ${failureCount === 0 && p95 < 500 ? '✅ 100% BULLETPROOF - READY FOR FESTIVE PEAK TRAFFIC!' : '⚠️ REVIEW BOTTLENECKS'}
===============================================================
`);
}

runStressTest().catch(err => console.error('Stress test failed:', err));
