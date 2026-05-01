const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ngjxwtmysvsqzrpmhnfi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nanh3dG15c3ZzcXpycG1obmZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MzYwMzksImV4cCI6MjA5MzAxMjAzOX0.G7M0ZNH8b1jqdGro9Le0Sm6ADFBoQ5x--YDfK60v3SY'
);

async function checkBatchCols() {
  const cols = ['id', 'town_id', 'status', 'runner_id', 'created_at', 'updated_at', 'delivery_window', 'zone_name', 'order_count', 'optimized_route', 'estimated_duration_min'];
  
  for (const col of cols) {
    const { error } = await supabase.from('delivery_batches').select(col).limit(1);
    if (!error) {
      console.log(`Column exists: ${col}`);
    }
  }
}

checkBatchCols();
