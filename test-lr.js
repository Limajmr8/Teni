const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ngjxwtmysvsqzrpmhnfi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nanh3dG15c3ZzcXpycG1obmZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MzYwMzksImV4cCI6MjA5MzAxMjAzOX0.G7M0ZNH8b1jqdGro9Le0Sm6ADFBoQ5x--YDfK60v3SY'
);

async function checkLR() {
  const { data, error } = await supabase.from('lorry_receipts').select('*').limit(1);
  if (error) {
    console.log('Error checking LR:', error.message);
  } else {
    console.log('LR found:', data);
  }
}

checkLR();
