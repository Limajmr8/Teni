const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ngjxwtmysvsqzrpmhnfi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nanh3dG15c3ZzcXpycG1obmZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MzYwMzksImV4cCI6MjA5MzAxMjAzOX0.G7M0ZNH8b1jqdGro9Le0Sm6ADFBoQ5x--YDfK60v3SY'
);

async function checkAdminReady() {
  const { data, error } = await supabase.from('sub_orders').select('*').in('status', ['pending', 'accepted']);
  console.log('Pending orders:', data?.length);
  
  const { data: sellers } = await supabase.from('seller_profiles').select('*');
  console.log('Total sellers:', sellers?.length);
}

checkAdminReady();
