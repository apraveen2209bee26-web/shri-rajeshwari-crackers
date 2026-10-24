import 'dotenv/config';

import app from './app.js';
import connectDatabase from './config/db.js';
import { seedAdminUser, seedSampleProducts } from './seed/sampleData.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDatabase();
    await seedAdminUser();
    if (process.env.SEED_SAMPLE_PRODUCTS === 'true') {
      await seedSampleProducts();
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
