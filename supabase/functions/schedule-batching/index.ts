import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Get all pending sub_orders that have a scheduled_window but no batch_id
    const { data: pendingOrders, error: fetchError } = await supabaseClient
      .from('sub_orders')
      .select('id, parent_id, source, seller_id, items, subtotal, status, scheduled_window, parent_orders(town_id, delivery_address)')
      .eq('status', 'pending')
      .is('batch_id', null)
      .not('scheduled_window', 'is', null)

    if (fetchError) throw fetchError

    if (!pendingOrders || pendingOrders.length === 0) {
      return new Response(
        JSON.stringify({ message: "No pending orders to batch." }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // 2. Group orders by town_id and scheduled_window
    const batches = new Map<string, any[]>();

    for (const order of pendingOrders) {
      const townId = order.parent_orders?.town_id;
      const window = order.scheduled_window;
      if (!townId || !window) continue;

      const key = `${townId}_${window}`;
      if (!batches.has(key)) {
        batches.set(key, []);
      }
      batches.get(key)!.push(order);
    }

    const createdBatches = [];

    // 3. Create delivery_batches and update sub_orders
    for (const [key, orders] of batches.entries()) {
      const [townId, window] = key.split('_');

      // Calculate total value
      const totalValue = orders.reduce((sum, order) => sum + order.subtotal, 0);

      // Create the batch
      const { data: batch, error: batchError } = await supabaseClient
        .from('delivery_batches')
        .insert({
          town_id: townId,
          delivery_window: window,
          zone_name: 'Central Zone', // In a real app, calculate this based on delivery_address lat/lng
          order_count: orders.length,
          total_value: totalValue,
          status: 'accumulating'
        })
        .select()
        .single();

      if (batchError) throw batchError;

      // Update sub_orders with the new batch_id
      const orderIds = orders.map(o => o.id);
      const { error: updateError } = await supabaseClient
        .from('sub_orders')
        .update({ batch_id: batch.id })
        .in('id', orderIds);

      if (updateError) throw updateError;

      createdBatches.push(batch);
    }

    return new Response(
      JSON.stringify({ 
        message: `Successfully created ${createdBatches.length} batches.`,
        batches: createdBatches 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
