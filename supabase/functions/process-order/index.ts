import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.2";
import { splitCart, calculateSubtotal, calculateCommission } from "../../../packages/shared/src/cart.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  try {
    const { parent_order_id } = await req.json();

    // 1. Fetch Parent Order
    const { data: parentOrder, error: parentError } = await supabase
      .from('parent_orders')
      .select('*')
      .eq('id', parent_order_id)
      .single();

    if (parentError || !parentOrder) throw new Error("Order not found");

    // 2. Fetch Items from temporary cart table or passed in payload
    // For this implementation, we assume items are passed or stored in parent_order metadata
    const items = parentOrder.metadata?.items || [];

    // 3. Split Cart
    const { darkStoreItems, sellerItems } = splitCart(items);

    // 4. Create Dark Store Sub-Order
    if (darkStoreItems.length > 0) {
      const subtotal = calculateSubtotal(darkStoreItems);
      await supabase.from('sub_orders').insert({
        parent_id: parent_order_id,
        source: 'dark_store',
        items: darkStoreItems,
        subtotal,
        status: 'pending'
      });
    }

    // 5. Create Seller Sub-Orders
    for (const [sellerId, items] of Object.entries(sellerItems)) {
      const subtotal = calculateSubtotal(items);
      const commission = calculateCommission(subtotal);
      
      await supabase.from('sub_orders').insert({
        parent_id: parent_order_id,
        source: 'seller',
        seller_id: sellerId,
        items,
        subtotal,
        commission_amount: commission,
        status: 'pending'
      });

      // REVENUE STREAM: Marketplace commission (6%)
      // logic to trigger Razorpay Route transfer here
    }

    return new Response(JSON.stringify({ success: true }), { 
      headers: { "Content-Type": "application/json" } 
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
});
