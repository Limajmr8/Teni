import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logError } from '@/lib/logging';

export async function GET() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('inventory').select('*');
    if (error) {
      await logError('inventory_fetch_failed', { error });
      return NextResponse.json({ error: 'Unable to load inventory.' }, { status: 400 });
    }
    return NextResponse.json(data);
  } catch (error) {
    await logError('inventory_fetch_exception', { error });
    return NextResponse.json({ error: 'Unable to load inventory.' }, { status: 500 });
  }
}
