import 'dotenv/config';
import { db } from '../../../prisma/db.js';



async function main() {
  await db.connect();

  console.log('🌱 Seed started');
  console.log('🌱 Database connection successful');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db[Symbol.asyncDispose]();
  });