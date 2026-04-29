import Image from 'next/image';
import ProductCard from '@/components/products/product-card';

const products = [
  { id: 'prod-1', name: 'Smoked Pork 500g', price: 38000, image: '/next.svg', unit: '500g', sellerId: 'seller-1' },
  { id: 'prod-2', name: 'Smoked Pork 1kg', price: 72000, image: '/next.svg', unit: '1kg', sellerId: 'seller-1' },
];

export default function SellerProfilePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-card">
        <div className="relative h-16 w-16 overflow-hidden rounded-full">
          <Image src="/next.svg" alt="Seller" fill className="object-cover" />
        </div>
        <div>
          <h1 className="font-serif text-xl font-semibold">Aunty Imtisunep</h1>
          <p className="text-sm text-bazar-text/60">From Mopungchuket village</p>
        </div>
      </div>
      <section>
        <h2 className="text-lg font-semibold">Story</h2>
        <p className="text-sm text-bazar-text/70">
          Smoked pork batches twice a week, delivered by BAZAR runners across Mokokchung.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold">Products</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} source="seller" {...product} />
          ))}
        </div>
      </section>
    </div>
  );
}
