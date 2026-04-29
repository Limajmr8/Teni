import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logError } from '@/lib/logging';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('parent_orders')
      .select('*, sub_orders(*)')
      .eq('id', params.id)
      .single();

    if (error) {
      await logError('order_fetch_failed', { error, id: params.id });
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    await logError('order_fetch_exception', { error, id: params.id });
    return NextResponse.json({ error: 'Unable to load order.' }, { status: 500 });
  }
}
