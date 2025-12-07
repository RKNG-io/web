import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getOrderById, getReckoningById, type Order } from '@/lib/db';
import { OrderActions } from './OrderActions';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  }).format(cents / 100);
}

function formatDate(date: Date | null): string {
  if (!date) return '-';
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
    <span className={`px-3 py-1 rounded text-sm font-medium ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  // Get linked reckoning if exists
  const reckoning = order.reckoning_id
    ? await getReckoningById(order.reckoning_id)
    : null;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link
        href="/admin/orders"
        className="text-sm text-charcoal/60 hover:text-charcoal mb-4 inline-block"
      >
        ← Back to orders
      </Link>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">
            Order {order.id.slice(0, 8)}
          </h1>
          <p className="text-charcoal/60 text-sm mt-1">
            Created {formatDate(order.created_at)}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Customer Info */}
        <div className="bg-white rounded-[10px] p-6 border border-stone">
          <h2 className="text-sm uppercase tracking-wider text-fuchsia font-medium mb-4">
            Customer
          </h2>
          <dl className="space-y-2">
            <div>
              <dt className="text-xs text-charcoal/60">Name</dt>
              <dd className="text-charcoal">{order.customer_name || '-'}</dd>
            </div>
            <div>
              <dt className="text-xs text-charcoal/60">Email</dt>
              <dd className="text-charcoal">{order.customer_email || '-'}</dd>
            </div>
          </dl>
        </div>

        {/* Payment Info */}
        <div className="bg-white rounded-[10px] p-6 border border-stone">
          <h2 className="text-sm uppercase tracking-wider text-fuchsia font-medium mb-4">
            Payment
          </h2>
          <dl className="space-y-2">
            <div>
              <dt className="text-xs text-charcoal/60">Status</dt>
              <dd className="text-charcoal capitalize">{order.status}</dd>
            </div>
            <div>
              <dt className="text-xs text-charcoal/60">Paid At</dt>
              <dd className="text-charcoal">{formatDate(order.paid_at)}</dd>
            </div>
            {order.stripe_payment_intent && (
              <div>
                <dt className="text-xs text-charcoal/60">Stripe Payment Intent</dt>
                <dd className="text-charcoal font-mono text-sm">
                  {order.stripe_payment_intent}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Linked Reckoning */}
      {reckoning && (
        <div className="bg-white rounded-[10px] p-6 border border-stone mb-6">
          <h2 className="text-sm uppercase tracking-wider text-fuchsia font-medium mb-4">
            Linked Reckoning Report
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-charcoal font-medium">{reckoning.name}</div>
              <div className="text-sm text-charcoal/60">
                {reckoning.persona} · {reckoning.status}
              </div>
            </div>
            <Link
              href={`/admin/reports/${reckoning.id}`}
              className="text-sm text-fuchsia hover:underline"
            >
              View Report →
            </Link>
          </div>
        </div>
      )}

      {/* Order Items */}
      <div className="bg-white rounded-[10px] border border-stone overflow-hidden mb-6">
        <div className="p-4 border-b border-stone">
          <h2 className="text-sm uppercase tracking-wider text-fuchsia font-medium">
            Items
          </h2>
        </div>
        <table className="w-full">
          <thead className="bg-ice border-b border-stone">
            <tr>
              <th className="text-left px-4 py-2 text-xs font-medium text-charcoal/60 uppercase">
                Item
              </th>
              <th className="text-left px-4 py-2 text-xs font-medium text-charcoal/60 uppercase">
                Type
              </th>
              <th className="text-right px-4 py-2 text-xs font-medium text-charcoal/60 uppercase">
                Price
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone">
            {order.items.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-3 text-charcoal">{item.name}</td>
                <td className="px-4 py-3 text-charcoal/60 text-sm capitalize">
                  {item.type}
                </td>
                <td className="px-4 py-3 text-charcoal text-right">
                  {formatCurrency(item.price)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-ice border-t border-stone">
            {order.discount_amount > 0 && (
              <tr>
                <td colSpan={2} className="px-4 py-2 text-sm text-charcoal/60">
                  Discount
                </td>
                <td className="px-4 py-2 text-sm text-mint text-right">
                  -{formatCurrency(order.discount_amount)}
                </td>
              </tr>
            )}
            <tr>
              <td colSpan={2} className="px-4 py-3 font-medium text-charcoal">
                Total
              </td>
              <td className="px-4 py-3 font-semibold text-charcoal text-right">
                {formatCurrency(order.total_amount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Actions */}
      <OrderActions orderId={order.id} currentStatus={order.status} />
    </div>
  );
}
