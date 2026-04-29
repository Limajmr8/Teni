import CategoryGrid from '@/components/products/category-grid';
import ProductCard from '@/components/products/product-card';
import StoryStrip from '@/components/seller/story-strip';
import SellerCard from '@/components/seller/seller-card';

const darkStoreProducts = [
  {
    id: 'sku-1',
    name: 'Amul Milk 1L',
    price: 5400,
    image: '/next.svg',
    unit: '1L',
  },
  {
    id: 'sku-2',
    name: 'Farm Eggs 6 pcs',
    price: 6500,
    image: '/next.svg',
    unit: 'Pack',
  },
  {
    id: 'sku-3',
    name: 'Tomato 500g',
    price: 2500,
    image: '/next.svg',
    unit: '500g',
  },
];

const marketplaceProducts = [
  {
    id: 'prod-1',
    name: 'Smoked Pork (500g)',
    price: 38000,
    image: '/next.svg',
    unit: '500g',
    sellerId: 'seller-1',
  },
  {
    id: 'prod-2',
    name: 'Ao Shawl (Handwoven)',
    price: 125000,
    image: '/next.svg',
    unit: 'Piece',
    sellerId: 'seller-2',
  },
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold">Today from local sellers</h2>
        <p className="text-sm text-bazar-text/60">Fresh stories, limited batches.</p>
        <div className="mt-4">
          <StoryStrip />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Shop by category</h2>
        <div className="mt-4">
          <CategoryGrid />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">BAZAR Now (15-30 min)</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
          {darkStoreProducts.map((product) => (
            <ProductCard key={product.id} source="dark_store" {...product} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">BAZAR Market</h2>
          <span className="rounded-full bg-bazar-accent px-3 py-1 text-xs text-white">
            Wednesday pre-orders open Tuesday night
          </span>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <SellerCard
            name="Aunty Imtisunep"
            locality="Mokokchung"
            photo="/next.svg"
            productPhoto="/next.svg"
          />
          <SellerCard name="Ao Shawl House" locality="Longkong" photo="/next.svg" productPhoto="/next.svg" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
          {marketplaceProducts.map((product) => (
            <ProductCard key={product.id} source="seller" {...product} />
          ))}
        </div>
      </section>
    </div>
  );
}
