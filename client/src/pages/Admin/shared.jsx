import { useEffect, useRef, useState } from 'react';
import { ImagePlus, Trash2, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { uploadImages, errorMessage } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Spinner } from '../../components/ui';

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-extrabold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  published: 'bg-green-100 text-green-800',
  hidden: 'bg-slate-200 text-slate-700',
  available: 'bg-green-100 text-green-800',
  unavailable: 'bg-slate-200 text-slate-700',
};
export const StatusBadge = ({ status }) => (
  <span className={`badge capitalize ${STATUS_STYLES[status] || 'bg-slate-100 text-slate-700'}`}>{status}</span>
);

export function Pagination({ pagination, onPage }) {
  if (!pagination || pagination.pages <= 1) return null;
  const { page, pages, total } = pagination;
  return (
    <div className="mt-5 flex items-center justify-between gap-3 text-sm">
      <span className="text-slate-500">{total} total</span>
      <div className="flex items-center gap-2">
        <button className="btn-outline btn-sm" disabled={page <= 1} onClick={() => onPage(page - 1)} aria-label="Previous page"><ChevronLeft className="h-4 w-4" /></button>
        <span className="font-semibold text-navy-800">{page} / {pages}</span>
        <button className="btn-outline btn-sm" disabled={page >= pages} onClick={() => onPage(page + 1)} aria-label="Next page"><ChevronRight className="h-4 w-4" /></button>
      </div>
    </div>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <label className="inline-flex min-h-[44px] cursor-pointer items-center gap-3">
      <input type="checkbox" className="peer sr-only" checked={Boolean(checked)} onChange={(e) => onChange(e.target.checked)} />
      <span className="relative h-6 w-11 shrink-0 rounded-full bg-slate-300 transition peer-checked:bg-brand-600 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-brand-600 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" />
      <span className="text-sm font-medium text-navy-800">{label}</span>
    </label>
  );
}

// Single-image uploader: uploads to Cloudinary through the API and returns { url, publicId }.
export function ImageUploader({ value, onChange, folder = 'misc', label = 'Image', aspect = 'aspect-video' }) {
  const toast = useToast();
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState('');

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) return toast.error('Image is too large (max 8 MB)');
    setPreview(URL.createObjectURL(file));
    setBusy(true);
    try {
      const [img] = await uploadImages([file], folder);
      onChange(img);
    } catch (err) {
      toast.error(errorMessage(err, 'Upload failed'));
    } finally {
      setBusy(false);
      setPreview('');
    }
  };

  const shown = preview || value?.url;
  return (
    <div>
      <span className="label">{label}</span>
      <div className={`relative flex ${aspect} w-full max-w-sm items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50`}>
        {shown ? <img src={shown} alt="" className="h-full w-full object-cover" /> : <ImagePlus className="h-8 w-8 text-slate-400" />}
        {busy && <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-brand-600"><Spinner className="h-7 w-7" /></div>}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" className="btn-outline btn-sm" onClick={() => input.current?.click()} disabled={busy}>
          <ImagePlus className="h-4 w-4" /> {value?.url ? 'Replace' : 'Upload'}
        </button>
        {value?.url && !busy && (
          <button type="button" className="btn-outline btn-sm text-red-600" onClick={() => onChange({ url: '', publicId: '' })}><Trash2 className="h-4 w-4" /> Remove</button>
        )}
      </div>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" className="hidden" onChange={pick} />
    </div>
  );
}

// Editable list of strings
export function StringListEditor({ label, items = [], onChange, placeholder }) {
  return (
    <div>
      <span className="label">{label}</span>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2">
            <input className="input" value={it} placeholder={placeholder} onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))} />
            <button type="button" className="btn-outline btn-sm !min-h-[44px] text-red-600" aria-label="Remove" onClick={() => onChange(items.filter((_, j) => j !== i))}><X className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
      <button type="button" className="btn-outline btn-sm mt-2" onClick={() => onChange([...items, ''])}><Plus className="h-4 w-4" /> Add</button>
    </div>
  );
}

// Editable list of objects. fields: [{ key, label, textarea? }]
export function ObjectListEditor({ label, items = [], onChange, fields, empty = {} }) {
  const update = (i, key, val) => onChange(items.map((x, j) => (j === i ? { ...x, [key]: val } : x)));
  return (
    <div>
      <span className="label">{label}</span>
      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
            <div className="grid gap-2 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.key} className={f.textarea ? 'sm:col-span-2' : ''}>
                  <label className="mb-1 block text-xs font-medium text-slate-500">{f.label}</label>
                  {f.textarea ? (
                    <textarea rows={2} className="input" value={it[f.key] || ''} onChange={(e) => update(i, f.key, e.target.value)} />
                  ) : (
                    <input className="input" value={it[f.key] || ''} onChange={(e) => update(i, f.key, e.target.value)} />
                  )}
                </div>
              ))}
            </div>
            <button type="button" className="mt-2 text-xs font-semibold text-red-600" onClick={() => onChange(items.filter((_, j) => j !== i))}>Remove</button>
          </div>
        ))}
      </div>
      <button type="button" className="btn-outline btn-sm mt-2" onClick={() => onChange([...items, { ...empty }])}><Plus className="h-4 w-4" /> Add</button>
    </div>
  );
}

export function Card({ title, children, className = '' }) {
  return (
    <section className={`card p-5 sm:p-6 ${className}`}>
      {title && <h2 className="mb-4 text-lg font-extrabold">{title}</h2>}
      {children}
    </section>
  );
}

export function Modal({ title, onClose, children, wide = false }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-navy-900/60 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className={`card flex max-h-[92vh] w-full flex-col rounded-b-none sm:rounded-b-2xl ${wide ? 'max-w-3xl' : 'max-w-lg'}`}>
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-extrabold">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
