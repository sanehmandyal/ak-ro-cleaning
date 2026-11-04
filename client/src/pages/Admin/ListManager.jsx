import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { get, post, put, del, errorMessage } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';
import { PageHeader, Pagination, Modal, StatusBadge, Toggle } from './shared';
import { Spinner, EmptyState, ErrorState, Field } from '../../components/ui';

// Generic admin CRUD screen used for Testimonials and FAQs.
export default function ListManager({ title, subtitle, endpoint, noun, fields, empty, renderItem, validate }) {
  const toast = useToast();
  const confirm = useConfirm();
  const [page, setPage] = useState(1);
  const [state, setState] = useState({ items: [], pagination: null, loading: true, error: null });
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  useEffect(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    get(endpoint, { page, limit: 10 })
      .then((r) => active && setState({ items: r.data, pagination: r.pagination, loading: false, error: null }))
      .catch((e) => active && setState((s) => ({ ...s, loading: false, error: errorMessage(e) })));
    return () => { active = false; };
  }, [endpoint, page, tick]);

  const save = async () => {
    const problem = validate?.(editing);
    if (problem) return toast.error(problem);
    setSaving(true);
    try {
      const body = { ...editing };
      ['_id', '__v', 'createdAt', 'updatedAt'].forEach((k) => delete body[k]);
      if (editing._id) await put(`${endpoint}/${editing._id}`, body); else await post(endpoint, body);
      toast.success(`${noun} saved`);
      setEditing(null);
      refresh();
    } catch (e) { toast.error(errorMessage(e)); } finally { setSaving(false); }
  };

  const remove = async (item) => {
    if (!(await confirm({ title: `Delete ${noun.toLowerCase()}?`, message: 'This cannot be undone.' }))) return;
    try { await del(`${endpoint}/${item._id}`); toast.success(`${noun} deleted`); refresh(); } catch (e) { toast.error(errorMessage(e)); }
  };

  return (
    <>
      <PageHeader title={title} subtitle={subtitle}>
        <button className="btn-primary btn-sm" onClick={() => setEditing({ ...empty })}><Plus className="h-4 w-4" /> Add {noun.toLowerCase()}</button>
      </PageHeader>
      {state.error ? <ErrorState message={state.error} onRetry={refresh} /> : state.loading && !state.items.length ? <div className="flex justify-center py-16 text-brand-600"><Spinner className="h-8 w-8" /></div> : state.items.length === 0 ? <EmptyState title={`No ${noun.toLowerCase()}s yet`} /> : (
        <>
          <ul className="space-y-3">
            {state.items.map((item) => (
              <li key={item._id} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">{renderItem(item)}</div>
                <div className="flex shrink-0 items-center gap-2">
                  <StatusBadge status={item.isPublished ? 'published' : 'hidden'} />
                  <button className="btn-outline btn-sm" onClick={() => setEditing(item)} aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                  <button className="btn-outline btn-sm text-red-600" onClick={() => remove(item)} aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                </div>
              </li>
            ))}
          </ul>
          <Pagination pagination={state.pagination} onPage={setPage} />
        </>
      )}
      {editing && (
        <Modal title={`${editing._id ? 'Edit' : 'Add'} ${noun.toLowerCase()}`} onClose={() => setEditing(null)}>
          <div className="space-y-4">
            {fields.map((f) => (
              <Field key={f.key} label={f.label} required={f.required} htmlFor={`m-${f.key}`}>
                {f.type === 'textarea' ? <textarea id={`m-${f.key}`} rows={4} className="input" value={editing[f.key] ?? ''} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })} />
                  : f.type === 'rating' ? <select id={`m-${f.key}`} className="input" value={editing[f.key] ?? 5} onChange={(e) => setEditing({ ...editing, [f.key]: Number(e.target.value) })}>{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}</select>
                  : <input id={`m-${f.key}`} type={f.type || 'text'} className="input" value={editing[f.key] ?? ''} onChange={(e) => setEditing({ ...editing, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value })} />}
              </Field>
            ))}
            <Toggle checked={editing.isPublished} onChange={(v) => setEditing({ ...editing, isPublished: v })} label="Published on website" />
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button className="btn-outline" onClick={() => setEditing(null)}>Cancel</button><button className="btn-primary" onClick={save} disabled={saving}>{saving && <Spinner className="h-4 w-4" />} Save</button></div>
          </div>
        </Modal>
      )}
    </>
  );
}
