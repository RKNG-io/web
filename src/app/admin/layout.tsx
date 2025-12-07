import Link from 'next/link';
import { LogoutButton } from './LogoutButton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ice">
      {/* Admin header */}
      <header className="bg-charcoal text-white py-3 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-semibold">
              Reckoning Admin
            </Link>
            <nav className="flex items-center gap-4 text-sm text-white/70">
              <Link href="/admin" className="hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/admin/reports" className="hover:text-white transition-colors">
                Reports
              </Link>
              <Link href="/admin/orders" className="hover:text-white transition-colors">
                Orders
              </Link>
              <Link href="/admin/intakes" className="hover:text-white transition-colors">
                Intakes
              </Link>
              <Link href="/admin/agents" className="hover:text-white transition-colors">
                Agents
              </Link>
            </nav>
          </div>
          <LogoutButton />
        </div>
      </header>

      {/* Content */}
      {children}
    </div>
  );
}
