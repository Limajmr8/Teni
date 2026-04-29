import Image from 'next/image';

interface SellerCardProps {
  name: string;
  locality: string;
  photo: string;
  productPhoto: string;
}

export default function SellerCard({ name, locality, photo, productPhoto }: SellerCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-bazar-border bg-white p-3 shadow-card">
      <div className="relative h-12 w-12 overflow-hidden rounded-full">
        <Image src={photo} alt={name} fill className="object-cover" />
      </div>
      <div className="flex-1">
        <p className="font-serif text-sm font-semibold">{name}</p>
        <p className="text-xs text-bazar-text/60">{locality}</p>
      </div>
      <div className="relative h-12 w-12 overflow-hidden rounded-xl">
        <Image src={productPhoto} alt="Product" fill className="object-cover" />
      </div>
    </div>
  );
}
