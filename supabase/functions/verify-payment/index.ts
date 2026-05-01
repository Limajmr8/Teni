import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.2";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const razorpaySecret = Deno.env.get("RAZORPAY_SECRET")!;

const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, parent_order_id } = await req.json();

    // 1. Verify Signature
    // In a real app, use the razorpay-node lib or manual HMAC-SHA256
    // const expectedSignature = hmac_sha256(razorpay_order_id + "|" + razorpay_payment_id, razorpaySecret);
    const isValid = true; // Placeholder for signature verification

    if (!isValid) throw new Error("Invalid signature");

    // 2. Update Parent Order
    await supabase
      .from('parent_orders')
      .update({ 
        payment_id: razorpay_payment_id,
        payment_status: 'paid' 
      })
      .eq('id', parent_order_id);

    // 3. Trigger Sub-Order Creation (Order Routing)
    await fetch(`${supabaseUrl}/functions/v1/process-order`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({ parent_order_id })
    });

    // 4. Send WhatsApp Notification (Stub)
    // REVENUE STREAM: Marketplace commission tracking happens here
    
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
