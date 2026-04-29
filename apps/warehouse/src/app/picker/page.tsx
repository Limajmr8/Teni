import OrderCard from '@/components/picker/order-card';

const orders = [
  { id: '2401', buyer: 'Alongla', locality: 'Town center', itemCount: 6 },
  { id: '2402', buyer: 'Temsula', locality: 'Yimyu Ward', itemCount: 4 },
];

export default function PickerQueuePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Picker queue</h1>
      {orders.map((order) => (
        <OrderCard key={order.id} {...order} />
      ))}
    </div>
  );
}
