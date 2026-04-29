import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logError } from '@/lib/logging';

export async function GET() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('products').select('*').limit(50);
    if (error) {
      await logError('products_fetch_failed', { error });
      return NextResponse.json({ error: 'Unable to load products.' }, { status: 400 });
    }
    return NextResponse.json(data);
  } catch (error) {
    await logError('products_fetch_exception', { error });
    return NextResponse.json({ error: 'Unable to load products.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const payload = await request.json();
    const { data, error } = await supabase.from('products').insert(payload).select('*').single();
    if (error) {
      await logError('product_create_failed', { error });
      return NextResponse.json({ error: 'Unable to create product.' }, { status: 400 });
    }
    return NextResponse.json(data);
  } catch (error) {
    await logError('product_create_exception', { error });
    return NextResponse.json({ error: 'Unable to create product.' }, { status: 500 });
  }
}
