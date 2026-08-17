import pkg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  // Use Supabase's direct connection (port 5432)
  const client = new Client({
    host: 'db.cojmvzjnjizxuithuhem.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'BkcdPfhuRIef9uH3',
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('Connecting to Supabase database...');
    await client.connect();
    console.log('Connected successfully!\n');

    const sqlPath = path.join(__dirname, 'supabase', 'migrations', '20240101000000_initial_schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Running migration...');
    await client.query(sql);
    console.log('✅ Migration completed successfully!');
    console.log('All tables, RLS policies, and functions have been created.');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    // If tables already exist, that's fine
    if (err.message.includes('already exists')) {
      console.log('ℹ️  Some tables already exist — schema may already be applied.');
    }
  } finally {
    await client.end();
  }
}

runMigration();
