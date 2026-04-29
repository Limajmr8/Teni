import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { DELIVERY_FEE_PAISE } from '@bazar/shared';
import { logError } from '@/lib/logging';

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const payload = await request.json();

    const { buyerId, townId, items, deliveryAddress } = payload as {
      buyerId: string;
      townId: string;
      items: Array<{ id: string; source: 'dark_store' | 'seller'; quantity: number; price: number; sellerId?: string }>;
      deliveryAddress: Record<string, unknown>;
    };

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0) + DELIVERY_FEE_PAISE;

    const { data: parentOrder, error: parentError } = await supabase
      .from('parent_orders')
      .insert({ buyer_id: buyerId, town_id: townId, total_amount: totalAmount, payment_status: 'pending' })
      .select('*')
      .single();

    if (parentError) {
      await logError('parent_order_create_failed', { parentError, buyerId, townId });
      return NextResponse.json({ error: 'Could not create order.' }, { status: 400 });
    }

    const darkStoreItems = items.filter((item) => item.source === 'dark_store');
    for (const item of darkStoreItems) {
      const { data, error } = await supabase.rpc('decrement_inventory', {
        p_sku_id: item.id,
        p_amount: item.quantity,
      });
      if (error || !data) {
        await logError('inventory_decrement_failed', { error, skuId: item.id, quantity: item.quantity });
        return NextResponse.json({ error: 'Item out of stock.' }, { status: 409 });
      }
    }

    const grouped = items.reduce<Record<string, typeof items>>((acc, item) => {
      const key = item.source === 'dark_store' ? 'dark_store' : item.sellerId ?? 'seller';
      acc[key] = acc[key] ? [...acc[key], item] : [item];
      return acc;
    }, {});

    const subOrders = Object.entries(grouped).map(([, group]) => ({
      parent_order_id: parentOrder.id,
      source: group[0].source,
      seller_id: group[0].source === 'seller' ? group[0].sellerId : null,
      status: 'placed',
      items_json: group,
      subtotal: group.reduce((sum, item) => sum + item.price * item.quantity, 0),
      delivery_fee: DELIVERY_FEE_PAISE,
      delivery_address_json: deliveryAddress,
    }));

    const { error: subError } = await supabase.from('sub_orders').insert(subOrders);
    if (subError) {
      await logError('sub_order_create_failed', { subError, parentOrderId: parentOrder.id });
      return NextResponse.json({ error: 'Could not create sub orders.' }, { status: 400 });
    }

    return NextResponse.json({ parentOrderId: parentOrder.id });
  } catch (error) {
    await logError('order_create_exception', { error });
    return NextResponse.json({ error: 'Unable to place order right now.' }, { status: 500 });
  }
}
