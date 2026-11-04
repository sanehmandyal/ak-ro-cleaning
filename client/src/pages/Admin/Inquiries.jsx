import { useEffect, useState } from 'react';
import { Search, Trash2, MailOpen, Mail } from 'lucide-react';
import { get, put, del, errorMessage } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';
import useDebounce from '../../hooks/useDebounce';
import { PageHeader, Pagination } from './shared';
import { Spinner, EmptyState, ErrorState } from '../../components/ui';
import { formatDateTime, telHref } from '../../utils/format';

export default function Inquiries() {
  const toast = useToast();
  const confirm = useConfirm();
  const [search, setSearch] = useState('');
  const q = useDebounce(search);
  const [unread, setUnread] = useState(false);
  const [page, setPage] = useState(1);
  const [state, setState] = useState({ items: [], pagination: null, loading: true, error: null });
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  useEffect(() => {
    setPage(1);
  }, [q, unread]);
  useEffect(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    get('/admin/contacts', { search: q, unread: unread || undefined, page, limit: 10 })
      .then((r) => active && setState({ items: r.data, pagination: r.pagination, loading: false, error: null }))
      .catch((e) => active && setState((s) => ({ ...s, loading: false, error: errorMessage(e) })));
    return () => { active = false; };
  }, [q, unread, page, tick]);

  const toggle = async (i) => { try { await put(`/admin/contacts/${i._id}`, { isRead: !i.isRead }); refresh(); } catch (e) { toast.error(errorMessage(e)); } };
  const remove = async (i) => {
    if (!(await confirm({ title: 'Delete inquiry?', message: `Delete the message from ${i.name}?` }))) return;
    try { await del(`/admin/contacts/${i._id}`); toast.success('Inquiry deleted'); refresh(); } catch (e) { toast.error(errorMessage(e)); }
  };

  return (
    <>
      <PageHeader title="Customer Inquiries" subtitle="Messages from the contact form" />
      <div className="card mb-5 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input className="input pl-9" placeholder="Search inquiries..." value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search inquiries" /></div>
        <label className="inline-flex min-h-[44px] items-center gap-2 text-sm font-medium"><input type="checkbox" checked={unread} onChange={(e) => setUnread(e.target.checked)} className="h-4 w-4" /> Unread only</label>
      </div>
      {state.error ? <ErrorState message={state.error} onRetry={refresh} /> : state.loading && !state.items.length ? <div className="flex justify-center py-16 text-brand-600"><Spinner className="h-8 w-8" /></div> : state.items.length === 0 ? <EmptyState title="No inquiries found" /> : (
        <>
          <ul className="space-y-3">
            {state.items.map((i) => (
              <li key={i._id} className={`card p-4 sm:p-5 ${i.isRead ? '' : 'border-l-4 border-l-aqua-500'}`}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-display font-bold text-navy-800">{i.name} {!i.isRead && <span className="badge bg-aqua-100 text-aqua-600">New</span>}</p>
                    <p className="break-words text-sm text-slate-500">{[i.phone && <a key="p" href={telHref(i.phone)} className="text-brand-600">{i.phone}</a>, i.email && <a key="e" href={`mailto:${i.email}`} className="text-brand-600">{i.email}</a>].filter(Boolean).reduce((a, x, idx) => (idx ? [...a, ' · ', x] : [x]), [])}</p>
                  </div>
                  <p className="text-xs text-slate-400">{formatDateTime(i.createdAt)}</p>
                </div>
                {i.subject && <p className="mt-2 text-sm font-semibold text-navy-800">{i.subject}</p>}
                <p className="mt-1 whitespace-pre-line break-words text-sm text-slate-600">{i.message}</p>
                <div className="mt-3 flex gap-2">
                  <button className="btn-outline btn-sm" onClick={() => toggle(i)}>{i.isRead ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />} Mark {i.isRead ? 'unread' : 'read'}</button>
                  <button className="btn-outline btn-sm text-red-600" onClick={() => remove(i)}><Trash2 className="h-4 w-4" /> Delete</button>
                </div>
              </li>
            ))}
          </ul>
          <Pagination pagination={state.pagination} onPage={setPage} />
        </>
      )}
    </>
  );
}
