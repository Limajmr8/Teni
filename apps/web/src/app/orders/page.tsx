import OrderCard from '@/components/orders/order-card';

const orders = [
  { id: '2411', status: 'Out for delivery', total: '₹420', eta: '25 min' },
  { id: '2407', status: 'Delivered', total: '₹680', eta: 'Completed' },
];

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold">Your orders</h1>
      {orders.map((order) => (
        <OrderCard key={order.id} {...order} />
      ))}
    </div>
  );
}
