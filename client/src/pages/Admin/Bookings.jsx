import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Trash2, Check, X, CircleCheckBig, Phone, Mail, MapPin } from 'lucide-react';
import { get, put, del, errorMessage } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';
import useDebounce from '../../hooks/useDebounce';
import { PageHeader, StatusBadge, Pagination, Modal } from './shared';
import { Spinner, EmptyState, ErrorState } from '../../components/ui';
import { formatDate, formatDateTime, telHref } from '../../utils/format';

export default function Bookings() {
  const toast = useToast();
  const confirm = useConfirm();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const q = useDebounce(search);
  const status = params.get('status') || '';
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);
  const [state, setState] = useState({ items: [], pagination: null, loading: true, error: null });
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setPage(1);
  }, [q, status, from, to]);

  useEffect(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    get('/admin/bookings', { search: q, status, from, to, page, limit: 10 })
      .then((r) => active && setState({ items: r.data, pagination: r.pagination, loading: false, error: null }))
      .catch((e) => active && setState((s) => ({ ...s, loading: false, error: errorMessage(e) })));
    return () => { active = false; };
  }, [q, status, from, to, page, tick]);

  const refresh = () => setTick((t) => t + 1);

  const open = async (b) => {
    setSelected(b);
    setNotes(b.adminNotes || '');
    if (!b.isRead) {
      put(`/admin/bookings/${b._id}`, { isRead: true }).then(refresh).catch(() => {});
    }
  };

  const update = async (id, body, msg) => {
    setSaving(true);
    try {
      const { data } = await put(`/admin/bookings/${id}`, body);
      toast.success(msg);
      setSelected((s) => (s && s._id === id ? data : s));
      refresh();
    } catch (e) { toast.error(errorMessage(e)); } finally { setSaving(false); }
  };

  const remove = async (b) => {
    if (!(await confirm({ title: 'Delete booking?', message: `Delete the booking from ${b.name}? This cannot be undone.` }))) return;
    try { await del(`/admin/bookings/${b._id}`); toast.success('Booking deleted'); setSelected(null); refresh(); } catch (e) { toast.error(errorMessage(e)); }
  };

  const setStatus = (v) => { const p = new URLSearchParams(params); if (v) p.set('status', v); else p.delete('status'); setParams(p); };

  return (
    <>
      <PageHeader title="Bookings" subtitle="Manage customer service requests" />
      <div className="card mb-5 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input className="input pl-9" placeholder="Search name, phone, service..." value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search bookings" />
        </div>
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
          <option value="">All statuses</option>
          {['pending', 'confirmed', 'completed', 'rejected'].map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
        <input type="date" className="input" value={from} onChange={(e) => setFrom(e.target.value)} aria-label="From date" />
        <input type="date" className="input" value={to} onChange={(e) => setTo(e.target.value)} aria-label="To date" />
      </div>

      {state.error ? <ErrorState message={state.error} onRetry={refresh} /> : state.loading && !state.items.length ? <div className="flex justify-center py-16 text-brand-600"><Spinner className="h-8 w-8" /></div> : state.items.length === 0 ? <EmptyState title="No bookings found" text="Try changing your filters." /> : (
        <>
          {/* Desktop table */}
          <div className="card hidden overflow-hidden md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="p-3">Customer</th><th className="p-3">Service</th><th className="p-3">Date & time</th><th className="p-3">Status</th><th className="p-3" /></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {state.items.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50">
                    <td className="max-w-[220px] p-3"><p className="truncate font-semibold text-navy-800">{b.name} {!b.isRead && <span className="badge bg-aqua-100 text-aqua-600">New</span>}</p><p className="truncate text-slate-500">{b.phone}</p></td>
                    <td className="max-w-[200px] truncate p-3">{b.serviceTitle}</td>
                    <td className="p-3 whitespace-nowrap">{formatDate(b.preferredDate)}<br /><span className="text-slate-500">{b.preferredTime}</span></td>
                    <td className="p-3"><StatusBadge status={b.status} /></td>
                    <td className="p-3 text-right"><button className="btn-outline btn-sm" onClick={() => open(b)}>View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile cards */}
          <ul className="space-y-3 md:hidden">
            {state.items.map((b) => (
              <li key={b._id} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0"><p className="truncate font-semibold text-navy-800">{b.name} {!b.isRead && <span className="badge bg-aqua-100 text-aqua-600">New</span>}</p><p className="truncate text-sm text-slate-500">{b.serviceTitle}</p></div>
                  <StatusBadge status={b.status} />
                </div>
                <p className="mt-2 text-sm text-slate-600">{formatDate(b.preferredDate)} · {b.preferredTime}</p>
                <button className="btn-outline btn-sm mt-3 w-full" onClick={() => open(b)}>View details</button>
              </li>
            ))}
          </ul>
          <Pagination pagination={state.pagination} onPage={setPage} />
        </>
      )}

      {selected && (
        <Modal title="Booking details" onClose={() => setSelected(null)}>
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between gap-2"><p className="font-display text-lg font-bold text-navy-800">{selected.name}</p><StatusBadge status={selected.status} /></div>
            <dl className="space-y-2">
              <div className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" /><a href={telHref(selected.phone)} className="text-brand-600">{selected.phone}</a></div>
              {selected.email && <div className="flex gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" /><a href={`mailto:${selected.email}`} className="break-all text-brand-600">{selected.email}</a></div>}
              <div className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" /><span className="break-words">{selected.address}</span></div>
            </dl>
            <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
              <div><p className="text-xs text-slate-500">Service</p><p className="font-semibold text-navy-800">{selected.serviceTitle}</p></div>
              <div><p className="text-xs text-slate-500">Preferred slot</p><p className="font-semibold text-navy-800">{formatDate(selected.preferredDate)}<br />{selected.preferredTime}</p></div>
            </div>
            {selected.message && <div><p className="text-xs text-slate-500">Customer message</p><p className="break-words">{selected.message}</p></div>}
            <p className="text-xs text-slate-400">Received {formatDateTime(selected.createdAt)}</p>
            <div>
              <label htmlFor="notes" className="label">Internal notes</label>
              <textarea id="notes" rows={3} className="input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Only visible to admins" />
              <button className="btn-outline btn-sm mt-2" disabled={saving || notes === (selected.adminNotes || '')} onClick={() => update(selected._id, { adminNotes: notes }, 'Notes saved')}>Save notes</button>
            </div>
            <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
              <button className="btn-primary btn-sm" disabled={saving || selected.status === 'confirmed'} onClick={() => update(selected._id, { status: 'confirmed' }, 'Booking confirmed')}><Check className="h-4 w-4" /> Confirm</button>
              <button className="btn-outline btn-sm" disabled={saving || selected.status === 'rejected'} onClick={() => update(selected._id, { status: 'rejected' }, 'Booking rejected')}><X className="h-4 w-4" /> Reject</button>
              <button className="btn-aqua btn-sm" disabled={saving || selected.status === 'completed'} onClick={() => update(selected._id, { status: 'completed' }, 'Marked as completed')}><CircleCheckBig className="h-4 w-4" /> Complete</button>
              <button className="btn-outline btn-sm text-red-600" onClick={() => remove(selected)}><Trash2 className="h-4 w-4" /> Delete</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
