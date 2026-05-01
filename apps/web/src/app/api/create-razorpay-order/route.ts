import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency = 'INR', receipt = 'receipt#1' } = body;

    const options = {
      amount: amount, // amount in the smallest currency unit
      currency: currency,
      receipt: receipt,
    };

    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'dummy_key_id') {
      const order = await razorpay.orders.create(options);
      return NextResponse.json({ orderId: order.id });
    } else {
      // Simulate order creation if keys are missing
      return NextResponse.json({ orderId: 'order_' + Math.random().toString(36).substring(7) });
    }
    
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Error creating Razorpay order', details: error.message },
      { status: 500 }
    );
  }
}
