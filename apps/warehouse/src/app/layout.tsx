import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'BAZAR Warehouse',
  description: 'Picker and packer dashboard for dark store operations.',
};

const navItems = [
  { href: '/picker', label: 'Picker queue' },
  { href: '/packer', label: 'Packer queue' },
  { href: '/inventory', label: 'Inventory' },
  { href: '/purchase-orders', label: 'Purchase orders' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bazar-background text-bazar-text">
        <div className="flex min-h-screen">
          <aside className="w-64 border-r border-bazar-border bg-white p-6">
            <div className="mb-6 text-lg font-semibold">BAZAR Warehouse</div>
            <nav className="space-y-3 text-sm">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="block text-bazar-text/70 hover:text-bazar-primary">
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
          <main className="flex-1 p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
