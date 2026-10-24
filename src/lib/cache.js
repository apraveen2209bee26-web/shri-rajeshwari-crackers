// Fast in-memory cache shared across Next.js API routes

let productsCache = null;
let productsTimestamp = 0;
const PRODUCTS_TTL = 30 * 1000; // 30 seconds

let settingsCache = null;
let settingsTimestamp = 0;
const SETTINGS_TTL = 60 * 1000; // 60 seconds

export function getCachedProducts() {
  if (productsCache && Date.now() - productsTimestamp < PRODUCTS_TTL) {
    return productsCache;
  }
  return null;
}

export function setCachedProducts(products) {
  productsCache = products;
  productsTimestamp = Date.now();
}

export function invalidateProductsCache() {
  productsCache = null;
  productsTimestamp = 0;
}

export function getCachedSettings() {
  if (settingsCache && Date.now() - settingsTimestamp < SETTINGS_TTL) {
    return settingsCache;
  }
  return null;
}

export function setCachedSettings(settings) {
  settingsCache = settings;
  settingsTimestamp = Date.now();
}

export function invalidateSettingsCache() {
  settingsCache = null;
  settingsTimestamp = 0;
}
