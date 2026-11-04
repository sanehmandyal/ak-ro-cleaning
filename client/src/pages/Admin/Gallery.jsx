import { useEffect, useRef, useState } from 'react';
import { Plus, Trash2, Pencil, Upload, ImagePlus } from 'lucide-react';
import { get, post, put, del, uploadImages, errorMessage } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';
import Img from '../../components/Img';
import { PageHeader, Pagination, Modal, StatusBadge, ImageUploader, Toggle } from './shared';
import { Spinner, EmptyState, ErrorState, Field } from '../../components/ui';

const CATEGORY_SUGGESTIONS = ['Water Tank', 'RO Purifier', 'Bathroom', 'Kitchen', 'Glass', 'Sofa & Carpet', 'Home', 'Office'];

function Slot({ label, value, onFile }) {
  const ref = useRef(null);
  return (
    <div>
      <span className="label">{label}</span>
      <button type="button" onClick={() => ref.current?.click()} className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 hover:border-brand-600">
        {value ? <img src={value.preview} alt={`${label} preview`} className="h-full w-full object-cover" /> : <ImagePlus className="h-8 w-8" />}
      </button>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) onFile(f); }} />
    </div>
  );
}

function UploadModal({ categories, onClose, onDone }) {
  const toast = useToast();
  const input = useRef(null);
  const [type, setType] = useState('single');
  const [category, setCategory] = useState(categories[0] || 'General');
  const [files, setFiles] = useState([]); // { file, preview, title, description }
  const [before, setBefore] = useState(null);
  const [after, setAfter] = useState(null);
  const [pair, setPair] = useState({ title: '', description: '' });
  const [busy, setBusy] = useState(false);

  useEffect(() => () => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    if (before) URL.revokeObjectURL(before.preview);
    if (after) URL.revokeObjectURL(after.preview);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const wrap = (file) => ({ file, preview: URL.createObjectURL(file) });
  const valid = (list) => [...list].filter((f) => {
    if (f.size > 8 * 1024 * 1024) { toast.error(`${f.name} is larger than 8 MB`); return false; }
    return true;
  });

  const addFiles = (e) => {
    const list = valid(e.target.files);
    e.target.value = '';
    setFiles((prev) => [...prev, ...list.map((f) => ({ ...wrap(f), title: f.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '), description: '' }))].slice(0, 20));
  };
  const updateFile = (i, k, v) => setFiles((prev) => prev.map((f, j) => (j === i ? { ...f, [k]: v } : f)));
  const removeFile = (i) => setFiles((prev) => { URL.revokeObjectURL(prev[i].preview); return prev.filter((_, j) => j !== i); });

  const publish = async () => {
    if (!category.trim()) return toast.error('Choose a category');
    if (type === 'single' && !files.length) return toast.error('Select at least one image');
    if (type === 'before-after' && (!before || !after)) return toast.error('Select both before and after images');
    if (type === 'before-after' && !pair.title.trim()) return toast.error('Enter a title');
    if (type === 'single' && files.some((f) => !f.title.trim())) return toast.error('Every image needs a title');
    setBusy(true);
    try {
      if (type === 'single') {
        const uploaded = await uploadImages(files.map((f) => f.file), 'gallery');
        await Promise.all(uploaded.map((img, i) => post('/admin/gallery', { title: files[i].title, description: files[i].description, category, type: 'single', image: img })));
        toast.success(`${uploaded.length} image${uploaded.length > 1 ? 's' : ''} published`);
      } else {
        const [b, a] = await uploadImages([before.file, after.file], 'gallery');
        await post('/admin/gallery', { ...pair, category, type: 'before-after', beforeImage: b, afterImage: a });
        toast.success('Before & after published');
      }
      onDone();
    } catch (e) { toast.error(errorMessage(e)); } finally { setBusy(false); }
  };

  return (
    <Modal title="Upload to gallery" onClose={busy ? () => {} : onClose} wide>
      <div className="space-y-5">
        <div className="flex gap-2" role="tablist">
          {[['single', 'Photos'], ['before-after', 'Before & After']].map(([v, l]) => (
            <button key={v} role="tab" aria-selected={type === v} onClick={() => setType(v)} className={`min-h-[40px] rounded-full px-4 text-sm font-semibold ${type === v ? 'bg-brand-600 text-white' : 'bg-slate-100 text-navy-800'}`}>{l}</button>
          ))}
        </div>
        <Field label="Category" htmlFor="g-cat">
          <input id="g-cat" list="g-cats" className="input" value={category} onChange={(e) => setCategory(e.target.value)} />
          <datalist id="g-cats">{[...new Set([...categories, ...CATEGORY_SUGGESTIONS])].map((c) => <option key={c} value={c} />)}</datalist>
        </Field>

        {type === 'single' ? (
          <>
            <button type="button" className="btn-outline w-full" onClick={() => input.current?.click()}><Upload className="h-4 w-4" /> Choose images (up to 20)</button>
            <input ref={input} type="file" accept="image/*" multiple className="hidden" onChange={addFiles} />
            <ul className="grid gap-3 sm:grid-cols-2">
              {files.map((f, i) => (
                <li key={f.preview} className="flex gap-3 rounded-xl border border-slate-200 p-3">
                  <img src={f.preview} alt="" className="h-20 w-20 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <input className="input !min-h-[38px]" value={f.title} onChange={(e) => updateFile(i, 'title', e.target.value)} placeholder="Title" aria-label="Title" />
                    <input className="input !min-h-[38px]" value={f.description} onChange={(e) => updateFile(i, 'description', e.target.value)} placeholder="Description (optional)" aria-label="Description" />
                    <button type="button" className="text-xs font-semibold text-red-600" onClick={() => removeFile(i)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Slot label="Before image" value={before} onFile={(f) => { const [ok] = valid([f]); if (ok) setBefore(wrap(ok)); }} />
              <Slot label="After image" value={after} onFile={(f) => { const [ok] = valid([f]); if (ok) setAfter(wrap(ok)); }} />
            </div>
            <Field label="Title" required htmlFor="g-title"><input id="g-title" className="input" value={pair.title} onChange={(e) => setPair({ ...pair, title: e.target.value })} /></Field>
            <Field label="Description" htmlFor="g-desc"><input id="g-desc" className="input" value={pair.description} onChange={(e) => setPair({ ...pair, description: e.target.value })} /></Field>
          </div>
        )}

        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
          <button className="btn-outline" onClick={onClose} disabled={busy}>Cancel</button>
          <button className="btn-primary" onClick={publish} disabled={busy}>{busy ? <Spinner className="h-4 w-4" /> : <Upload className="h-4 w-4" />} {busy ? 'Publishing...' : 'Publish'}</button>
        </div>
      </div>
    </Modal>
  );
}

function EditModal({ item, categories, onClose, onDone }) {
  const toast = useToast();
  const [f, setF] = useState({ ...item });
  const [busy, setBusy] = useState(false);
  const save = async () => {
    if (!f.title.trim()) return toast.error('Title is required');
    setBusy(true);
    try {
      await put(`/admin/gallery/${item._id}`, { title: f.title, description: f.description, category: f.category, isPublished: f.isPublished, image: f.image, beforeImage: f.beforeImage, afterImage: f.afterImage });
      toast.success('Gallery item updated');
      onDone();
    } catch (e) { toast.error(errorMessage(e)); } finally { setBusy(false); }
  };
  return (
    <Modal title="Edit gallery item" onClose={onClose}>
      <div className="space-y-4">
        {item.type === 'before-after' ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <ImageUploader label="Before" value={f.beforeImage} onChange={(v) => setF({ ...f, beforeImage: v })} folder="gallery" aspect="aspect-[4/3]" />
            <ImageUploader label="After" value={f.afterImage} onChange={(v) => setF({ ...f, afterImage: v })} folder="gallery" aspect="aspect-[4/3]" />
          </div>
        ) : <ImageUploader label="Image" value={f.image} onChange={(v) => setF({ ...f, image: v })} folder="gallery" aspect="aspect-[4/3]" />}
        <Field label="Title" required htmlFor="e-title"><input id="e-title" className="input" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field>
        <Field label="Description" htmlFor="e-desc"><textarea id="e-desc" rows={2} className="input" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field>
        <Field label="Category" htmlFor="e-cat"><input id="e-cat" list="e-cats" className="input" value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} /><datalist id="e-cats">{categories.map((c) => <option key={c} value={c} />)}</datalist></Field>
        <Toggle checked={f.isPublished} onChange={(v) => setF({ ...f, isPublished: v })} label="Published on website" />
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button className="btn-outline" onClick={onClose}>Cancel</button><button className="btn-primary" onClick={save} disabled={busy}>{busy && <Spinner className="h-4 w-4" />} Save changes</button></div>
      </div>
    </Modal>
  );
}

export default function GalleryAdmin() {
  const toast = useToast();
  const confirm = useConfirm();
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [state, setState] = useState({ items: [], pagination: null, categories: [], loading: true, error: null });
  const [modal, setModal] = useState(null);
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  useEffect(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    get('/admin/gallery', { category, page, limit: 12 })
      .then((r) => active && setState({ items: r.data, pagination: r.pagination, categories: r.categories, loading: false, error: null }))
      .catch((e) => active && setState((s) => ({ ...s, loading: false, error: errorMessage(e) })));
    return () => { active = false; };
  }, [category, page, tick]);

  const remove = async (g) => {
    if (!(await confirm({ title: 'Delete image?', message: `"${g.title}" will be removed from the gallery and image storage.` }))) return;
    try { await del(`/admin/gallery/${g._id}`); toast.success('Deleted'); refresh(); } catch (e) { toast.error(errorMessage(e)); }
  };
  const done = () => { setModal(null); refresh(); };

  return (
    <>
      <PageHeader title="Gallery" subtitle="Project photos and before & after comparisons">
        <button className="btn-primary btn-sm" onClick={() => setModal({ type: 'upload' })}><Plus className="h-4 w-4" /> Upload</button>
      </PageHeader>
      <div className="mb-5 flex flex-wrap gap-2">
        {['All', ...state.categories].map((c) => (
          <button key={c} onClick={() => { setCategory(c); setPage(1); }} className={`min-h-[36px] rounded-full px-3.5 text-sm font-semibold ${category === c ? 'bg-brand-600 text-white' : 'bg-white text-navy-800 ring-1 ring-slate-200'}`}>{c}</button>
        ))}
      </div>
      {state.error ? <ErrorState message={state.error} onRetry={refresh} /> : state.loading && !state.items.length ? <div className="flex justify-center py-16 text-brand-600"><Spinner className="h-8 w-8" /></div> : state.items.length === 0 ? <EmptyState title="Gallery is empty" text="Upload your first project photos." /> : (
        <>
          <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {state.items.map((g) => (
              <article key={g._id} className="card overflow-hidden">
                {g.type === 'before-after' ? (
                  <div className="grid grid-cols-2"><Img src={g.beforeImage?.url} alt={`${g.title} before`} className="aspect-square w-full object-cover" width={300} /><Img src={g.afterImage?.url} alt={`${g.title} after`} className="aspect-square w-full object-cover" width={300} /></div>
                ) : <Img src={g.image?.url} alt={g.title} className="aspect-[4/3] w-full object-cover" width={400} />}
                <div className="p-3">
                  <p className="truncate font-semibold text-navy-800">{g.title}</p>
                  <p className="truncate text-xs text-slate-500">{g.category} · {g.type === 'before-after' ? 'Before/After' : 'Photo'}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <StatusBadge status={g.isPublished ? 'published' : 'hidden'} />
                    <button className="btn-outline btn-sm ml-auto" onClick={() => setModal({ type: 'edit', item: g })} aria-label={`Edit ${g.title}`}><Pencil className="h-4 w-4" /></button>
                    <button className="btn-outline btn-sm text-red-600" onClick={() => remove(g)} aria-label={`Delete ${g.title}`}><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <Pagination pagination={state.pagination} onPage={setPage} />
        </>
      )}
      {modal?.type === 'upload' && <UploadModal categories={state.categories} onClose={() => setModal(null)} onDone={done} />}
      {modal?.type === 'edit' && <EditModal item={modal.item} categories={state.categories} onClose={() => setModal(null)} onDone={done} />}
    </>
  );
}
