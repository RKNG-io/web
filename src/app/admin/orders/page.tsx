import Link from 'next/link';
import { getRecentOrders, getOrderStats, type Order } from '@/lib/db';

export const dynamic = 'force-dynamic';

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  }).format(cents / 100);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

function StatusBadge({ status }: { status: Order['status'] }) {
  const styles = {
    pending: 'bg-amber-100 text-amber-800',
    paid: 'bg-mint/20 text-mint',
    fulfilled: 'bg-charcoal/10 text-charcoal',
    refunded: 'bg-fuchsia/10 text-fuchsia',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

export default async function OrdersPage() {
  const [orders, stats] = await Promise.all([
    getRecentOrders(50),
    getOrderStats(),
  ]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">Orders</h1>
          <p className="text-charcoal/60 text-sm mt-1">
            Track customer orders and fulfilment status
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-[10px] p-4 border border-stone">
          <div className="text-sm text-charcoal/60">Pending</div>
          <div className="text-2xl font-semibold text-charcoal">{stats.pending}</div>
        </div>
        <div className="bg-white rounded-[10px] p-4 border border-stone">
          <div className="text-sm text-charcoal/60">Paid</div>
          <div className="text-2xl font-semibold text-mint">{stats.paid}</div>
        </div>
        <div className="bg-white rounded-[10px] p-4 border border-stone">
          <div className="text-sm text-charcoal/60">Fulfilled</div>
          <div className="text-2xl font-semibold text-charcoal">{stats.fulfilled}</div>
        </div>
        <div className="bg-white rounded-[10px] p-4 border border-stone">
          <div className="text-sm text-charcoal/60">Total Revenue</div>
          <div className="text-2xl font-semibold text-charcoal">
            {formatCurrency(stats.totalRevenue)}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[10px] border border-stone overflow-hidden">
        <table className="w-full">
          <thead className="bg-ice border-b border-stone">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-charcoal/60 uppercase tracking-wider">
                Order
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-charcoal/60 uppercase tracking-wider">
                Customer
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-charcoal/60 uppercase tracking-wider">
                Items
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-charcoal/60 uppercase tracking-wider">
                Total
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-charcoal/60 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-charcoal/60 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-charcoal/60">
                  No orders yet
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-ice/50">
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm text-charcoal">
                      {order.id.slice(0, 8)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-charcoal">
                      {order.customer_name || '—'}
                    </div>
                    <div className="text-xs text-charcoal/60">
                      {order.customer_email || '—'}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-charcoal">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </div>
                    <div className="text-xs text-charcoal/60 truncate max-w-[200px]">
                      {order.items.map(i => i.name).join(', ')}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-charcoal">
                      {formatCurrency(order.total_amount)}
                    </span>
                    {order.discount_amount > 0 && (
                      <div className="text-xs text-mint">
                        -{formatCurrency(order.discount_amount)} discount
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-charcoal/60">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-sm text-fuchsia hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
