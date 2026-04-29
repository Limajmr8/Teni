import { NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { createClient } from '@/lib/supabase/server';
import { logError } from '@/lib/logging';

export async function POST(request: Request) {
  const signature = request.headers.get('x-razorpay-signature');
  if (!signature) {
    await logError('razorpay_signature_missing', {});
    return NextResponse.json({ error: 'Missing signature.' }, { status: 400 });
  }

  const body = await request.text();
  const valid = verifyRazorpaySignature(body, signature, process.env.RAZORPAY_WEBHOOK_SECRET!);
  if (!valid) {
    await logError('razorpay_signature_invalid', {});
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 });
  }

  const payload = JSON.parse(body);
  const orderId = payload?.payload?.payment?.entity?.order_id;

  try {
    const supabase = createClient();
    await supabase.from('parent_orders').update({ payment_status: 'paid' }).eq('razorpay_order_id', orderId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    await logError('razorpay_verify_failed', { error, orderId });
    return NextResponse.json({ error: 'Unable to verify payment.' }, { status: 500 });
  }
}
