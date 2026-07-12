import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false },
});

async function migrate() {
  const sql = fs.readFileSync(
    path.join(__dirname, '..', 'migrations', '001_init.sql'),
    'utf-8'
  );
  const client = await pool.connect();
  try {
    await client.query(sql);
    console.log('Migration complete');
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
