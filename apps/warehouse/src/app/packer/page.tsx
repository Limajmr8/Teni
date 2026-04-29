import OrderCard from '@/components/picker/order-card';

const orders = [
  { id: '2398', buyer: 'Imkong', locality: 'Aongza', itemCount: 5 },
];

export default function PackerQueuePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Packer queue</h1>
      {orders.map((order) => (
        <OrderCard key={order.id} {...order} />
      ))}
    </div>
  );
}
