import { DARK_STORE_CATEGORIES } from '@bazar/shared';

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
      {DARK_STORE_CATEGORIES.map((category) => (
        <div
          key={category.id}
          className="rounded-2xl border border-bazar-border bg-white p-4 text-sm font-semibold text-bazar-text shadow-card"
        >
          {category.name}
        </div>
      ))}
    </div>
  );
}
