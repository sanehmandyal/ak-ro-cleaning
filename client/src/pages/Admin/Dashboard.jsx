import { Link } from 'react-router-dom';
import { CalendarCheck, Clock, CheckCircle2, CircleCheckBig, Wrench, Images } from 'lucide-react';
import useFetch from '../../hooks/useFetch';
import { PageHeader, Card, StatusBadge } from './shared';
import { Skeleton, ErrorState } from '../../components/ui';
import { formatDate, formatDateTime } from '../../utils/format';

function Stat({ label, value, Icon, tone, to }) {
  return (
    <Link to={to} className="card flex items-center gap-4 p-5 transition hover:-translate-y-0.5">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tone}`}><Icon className="h-6 w-6" /></span>
      <div className="min-w-0"><p className="font-display text-2xl font-extrabold text-navy-800">{value}</p><p className="truncate text-sm text-slate-500">{label}</p></div>
    </Link>
  );
}

export default function Dashboard() {
  const { data, loading, error, reload } = useFetch('/admin/stats');
  if (loading) return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  const b = data.bookings;
  return (
    <>
      <PageHeader title="Dashboard" subtitle="Overview of your business" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Stat label="Total bookings" value={b.total} Icon={CalendarCheck} tone="bg-brand-50 text-brand-600" to="/admin/bookings" />
        <Stat label="Pending bookings" value={b.pending} Icon={Clock} tone="bg-amber-50 text-amber-600" to="/admin/bookings?status=pending" />
        <Stat label="Confirmed bookings" value={b.confirmed} Icon={CheckCircle2} tone="bg-blue-50 text-blue-600" to="/admin/bookings?status=confirmed" />
        <Stat label="Completed bookings" value={b.completed} Icon={CircleCheckBig} tone="bg-green-50 text-green-600" to="/admin/bookings?status=completed" />
        <Stat label="Total services" value={data.services} Icon={Wrench} tone="bg-aqua-50 text-aqua-600" to="/admin/services" />
        <Stat label="Gallery images" value={data.gallery} Icon={Images} tone="bg-purple-50 text-purple-600" to="/admin/gallery" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title={`Recent bookings${b.unread ? ` (${b.unread} new)` : ''}`}>
          {data.recentBookings.length === 0 ? <p className="text-sm text-slate-500">No bookings yet.</p> : (
            <ul className="divide-y divide-slate-100">
              {data.recentBookings.map((x) => (
                <li key={x._id} className="flex items-start justify-between gap-3 py-3">
                  <div className="min-w-0"><p className="truncate font-semibold text-navy-800">{x.name} {!x.isRead && <span className="badge ml-1 bg-aqua-100 text-aqua-600">New</span>}</p><p className="truncate text-sm text-slate-500">{x.serviceTitle} · {formatDate(x.preferredDate)}</p></div>
                  <StatusBadge status={x.status} />
                </li>
              ))}
            </ul>
          )}
          <Link to="/admin/bookings" className="mt-3 inline-block text-sm font-semibold text-brand-600">View all →</Link>
        </Card>
        <Card title={`Recent customer inquiries${data.unreadContacts ? ` (${data.unreadContacts} new)` : ''}`}>
          {data.recentContacts.length === 0 ? <p className="text-sm text-slate-500">No inquiries yet.</p> : (
            <ul className="divide-y divide-slate-100">
              {data.recentContacts.map((x) => (
                <li key={x._id} className="py-3"><p className="truncate font-semibold text-navy-800">{x.name} {!x.isRead && <span className="badge ml-1 bg-aqua-100 text-aqua-600">New</span>}</p><p className="line-clamp-2 break-words text-sm text-slate-500">{x.message}</p><p className="mt-1 text-xs text-slate-400">{formatDateTime(x.createdAt)}</p></li>
              ))}
            </ul>
          )}
          <Link to="/admin/inquiries" className="mt-3 inline-block text-sm font-semibold text-brand-600">View all →</Link>
        </Card>
      </div>
    </>
  );
}
