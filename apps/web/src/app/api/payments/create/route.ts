import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { logError } from '@/lib/logging';

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      payment_capture: true,
    });

    return NextResponse.json(order);
  } catch (error) {
    await logError('razorpay_order_create_failed', { error });
    return NextResponse.json({ error: 'Unable to create payment order.' }, { status: 500 });
  }
}
