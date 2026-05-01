// Apply database fixes using Supabase Management API
// Requires the service_role key or database password

const https = require('https');

const SUPABASE_URL = 'https://ngjxwtmysvsqzrpmhnfi.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nanh3dG15c3ZzcXpycG1obmZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MzYwMzksImV4cCI6MjA5MzAxMjAzOX0.G7M0ZNH8b1jqdGro9Le0Sm6ADFBoQ5x--YDfK60v3SY';

const sqls = [
  "ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS store_slug TEXT",
  "ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS bio TEXT",
  "ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS village_origin TEXT", 
  "ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS locality TEXT",
  "ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS whatsapp_number TEXT",
  "ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS upi_id TEXT",
  "ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false",
  "ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'starter'",
  "ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0",
  "ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS category TEXT",
  "ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS user_id UUID",
  "ALTER TABLE sub_orders ADD COLUMN IF NOT EXISTS subtotal BIGINT",
  "ALTER TABLE sub_orders ADD COLUMN IF NOT EXISTS commission_amount BIGINT DEFAULT 0",
  "ALTER TABLE sub_orders ADD COLUMN IF NOT EXISTS runner_id UUID",
  "ALTER TABLE sub_orders ADD COLUMN IF NOT EXISTS batch_id UUID",
];

// Try using the rpc endpoint with a SQL function
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(SUPABASE_URL, ANON_KEY);

async function tryRPC() {
  // Check if there's an rpc function we can use
  const { data, error } = await supabase.rpc('exec_sql', { sql: sqls[0] });
  console.log('RPC attempt:', data, error?.message);
  
  // Alternative: try the raw REST endpoint for DDL
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({ sql: sqls[0] })
  });
  console.log('REST RPC:', response.status, await response.text());
}

tryRPC();
