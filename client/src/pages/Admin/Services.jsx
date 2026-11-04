import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, ArrowLeft, Save } from 'lucide-react';
import { get, post, put, del, errorMessage } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';
import useDebounce from '../../hooks/useDebounce';
import { ICONS } from '../../components/Icon';
import Img from '../../components/Img';
import { PageHeader, StatusBadge, Pagination, Card, ImageUploader, StringListEditor, ObjectListEditor, Toggle } from './shared';
import { Spinner, EmptyState, ErrorState, Field, FullPageLoader } from '../../components/ui';
import { formatPrice } from '../../utils/format';

export function ServicesList() {
  const toast = useToast();
  const confirm = useConfirm();
  const [search, setSearch] = useState('');
  const q = useDebounce(search);
  const [page, setPage] = useState(1);
  const [state, setState] = useState({ items: [], pagination: null, loading: true, error: null });
  const [tick, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  useEffect(() => {
    setPage(1);
  }, [q]);
  useEffect(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    get('/admin/services', { search: q, page, limit: 12 })
      .then((r) => active && setState({ items: r.data, pagination: r.pagination, loading: false, error: null }))
      .catch((e) => active && setState((s) => ({ ...s, loading: false, error: errorMessage(e) })));
    return () => { active = false; };
  }, [q, page, tick]);

  const toggleAvail = async (s) => {
    try { await put(`/admin/services/${s._id}`, { isAvailable: !s.isAvailable }); toast.success(s.isAvailable ? 'Service hidden from website' : 'Service is now live'); refresh(); } catch (e) { toast.error(errorMessage(e)); }
  };

  const remove = async (s) => {
    if (!(await confirm({ title: 'Delete service?', message: `"${s.title}" will be permanently removed from the website.` }))) return;
    try {
      await del(`/admin/services/${s._id}`);
      toast.success('Service deleted');
      refresh();
    } catch (e) {
      if (e.response?.status === 409 && (await confirm({ title: 'Active bookings exist', message: `${e.response.data.message.split('.')[0]}. Delete anyway?`, confirmText: 'Delete anyway' }))) {
        try { await del(`/admin/services/${s._id}`, { force: true }); toast.success('Service deleted'); refresh(); } catch (e2) { toast.error(errorMessage(e2)); }
      } else if (e.response?.status !== 409) toast.error(errorMessage(e));
    }
  };

  return (
    <>
      <PageHeader title="Services" subtitle="Everything here appears on your public website">
        <Link to="/admin/services/new" className="btn-primary btn-sm"><Plus className="h-4 w-4" /> Add service</Link>
      </PageHeader>
      <div className="relative mb-5 max-w-md"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input className="input pl-9" placeholder="Search services..." value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search services" /></div>
      {state.error ? <ErrorState message={state.error} onRetry={refresh} /> : state.loading && !state.items.length ? <div className="flex justify-center py-16 text-brand-600"><Spinner className="h-8 w-8" /></div> : state.items.length === 0 ? <EmptyState title="No services yet" text="Add your first service." /> : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {state.items.map((s) => (
              <article key={s._id} className="card flex flex-col overflow-hidden">
                <Img src={s.image?.url} alt={s.title} className="h-36 w-full object-cover" width={500} />
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-start justify-between gap-2"><h2 className="break-words font-display text-base font-bold text-navy-800">{s.title}</h2><StatusBadge status={s.isAvailable ? 'available' : 'unavailable'} /></div>
                  <p className="mt-1 text-xs text-slate-500">/{s.slug}{formatPrice(s.price) ? ` · ${formatPrice(s.price)}` : ''}</p>
                  <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
                    <Link to={`/admin/services/${s._id}`} className="btn-outline btn-sm"><Pencil className="h-4 w-4" /> Edit</Link>
                    <button className="btn-outline btn-sm" onClick={() => toggleAvail(s)}>{s.isAvailable ? 'Hide' : 'Show'}</button>
                    <button className="btn-outline btn-sm ml-auto text-red-600" onClick={() => remove(s)} aria-label={`Delete ${s.title}`}><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <Pagination pagination={state.pagination} onPage={setPage} />
        </>
      )}
    </>
  );
}

const EMPTY = {
  title: '', slug: '', shortDescription: '', description: '', image: { url: '', publicId: '' }, icon: 'Sparkles',
  benefits: [], process: [], whyChooseUs: [], faqs: [], price: { amount: '', unit: '', label: '' },
  ctaText: 'Book this service', isAvailable: true, isPopular: false, order: 0, seo: { title: '', description: '', keywords: '' },
};

export function ServiceForm() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isNew) return undefined;
    let active = true;
    get(`/admin/services/${id}`)
      .then((r) => active && setForm({ ...EMPTY, ...r.data, price: { ...EMPTY.price, ...r.data.price }, seo: { ...EMPTY.seo, ...r.data.seo } }))
      .catch((e) => { toast.error(errorMessage(e)); navigate('/admin/services'); })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [id, isNew, navigate, toast]);

  if (loading) return <FullPageLoader />;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setNested = (k, sub, v) => setForm((f) => ({ ...f, [k]: { ...f[k], [sub]: v } }));

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (form.title.trim().length < 2) errs.title = 'Title is required';
    if (form.price.amount !== '' && Number(form.price.amount) < 0) errs.price = 'Price cannot be negative';
    setErrors(errs);
    if (Object.keys(errs).length) return toast.error(Object.values(errs)[0]);
    setSaving(true);
    const payload = {
      ...form,
      price: { ...form.price, amount: form.price.amount === '' ? 0 : Number(form.price.amount) },
      order: Number(form.order) || 0,
      benefits: form.benefits.filter((x) => x.trim()),
      whyChooseUs: form.whyChooseUs.filter((x) => x.trim()),
      process: form.process.filter((p) => p.title?.trim()),
      faqs: form.faqs.filter((f) => f.question?.trim() && f.answer?.trim()),
    };
    delete payload._id; delete payload.__v; delete payload.createdAt; delete payload.updatedAt;
    try {
      if (isNew) await post('/admin/services', payload);
      else await put(`/admin/services/${id}`, payload);
      toast.success(isNew ? 'Service created' : 'Service updated');
      navigate('/admin/services');
    } catch (err) { toast.error(errorMessage(err)); } finally { setSaving(false); }
  };

  return (
    <form onSubmit={submit} noValidate>
      <PageHeader title={isNew ? 'Add service' : 'Edit service'}>
        <Link to="/admin/services" className="btn-outline btn-sm"><ArrowLeft className="h-4 w-4" /> Back</Link>
        <button type="submit" className="btn-primary btn-sm" disabled={saving}>{saving ? <Spinner className="h-4 w-4" /> : <Save className="h-4 w-4" />} Save</button>
      </PageHeader>
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-6">
          <Card title="Basic information">
            <div className="space-y-4">
              <Field label="Title" required error={errors.title} htmlFor="s-title"><input id="s-title" className={`input ${errors.title ? 'input-error' : ''}`} value={form.title} onChange={(e) => set('title', e.target.value)} /></Field>
              <Field label="URL slug" hint="Leave empty to generate from the title" htmlFor="s-slug"><input id="s-slug" className="input" value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="water-tank-cleaning" /></Field>
              <Field label="Short description" hint="Shown on service cards (max 300 chars)" htmlFor="s-short"><textarea id="s-short" rows={2} maxLength={300} className="input" value={form.shortDescription} onChange={(e) => set('shortDescription', e.target.value)} /></Field>
              <Field label="Full description" htmlFor="s-desc"><textarea id="s-desc" rows={6} className="input" value={form.description} onChange={(e) => set('description', e.target.value)} /></Field>
            </div>
          </Card>
          <Card title="Benefits & Why choose us">
            <div className="space-y-5">
              <StringListEditor label="Benefits" items={form.benefits} onChange={(v) => set('benefits', v)} placeholder="e.g. Removes sludge and algae" />
              <StringListEditor label="Why choose us (for this service)" items={form.whyChooseUs} onChange={(v) => set('whyChooseUs', v)} />
            </div>
          </Card>
          <Card title="Cleaning process">
            <ObjectListEditor label="Steps" items={form.process} onChange={(v) => set('process', v)} fields={[{ key: 'title', label: 'Step title' }, { key: 'description', label: 'Description', textarea: true }]} />
          </Card>
          <Card title="FAQs">
            <ObjectListEditor label="Questions" items={form.faqs} onChange={(v) => set('faqs', v)} fields={[{ key: 'question', label: 'Question' }, { key: 'answer', label: 'Answer', textarea: true }]} />
          </Card>
          <Card title="SEO">
            <div className="space-y-4">
              <Field label="SEO title" hint={`${form.seo.title.length}/60 recommended`} htmlFor="s-seot"><input id="s-seot" className="input" value={form.seo.title} onChange={(e) => setNested('seo', 'title', e.target.value)} /></Field>
              <Field label="Meta description" hint={`${form.seo.description.length}/160 recommended`} htmlFor="s-seod"><textarea id="s-seod" rows={2} className="input" value={form.seo.description} onChange={(e) => setNested('seo', 'description', e.target.value)} /></Field>
              <Field label="Keywords" hint="Comma separated, optional" htmlFor="s-seok"><input id="s-seok" className="input" value={form.seo.keywords} onChange={(e) => setNested('seo', 'keywords', e.target.value)} /></Field>
            </div>
          </Card>
        </div>
        <div className="min-w-0 space-y-6">
          <Card title="Visibility">
            <Toggle checked={form.isAvailable} onChange={(v) => set('isAvailable', v)} label="Available (shown on website)" />
            <Toggle checked={form.isPopular} onChange={(v) => set('isPopular', v)} label="Show in popular services" />
            <Field label="Display order" hint="Lower numbers appear first" htmlFor="s-order"><input id="s-order" type="number" className="input" value={form.order} onChange={(e) => set('order', e.target.value)} /></Field>
          </Card>
          <Card title="Image"><ImageUploader value={form.image} onChange={(v) => set('image', v)} folder="services" label="Service image" /></Card>
          <Card title="Pricing & call to action">
            <div className="space-y-4">
              <Field label="Starting price (optional)" error={errors.price} htmlFor="s-price"><input id="s-price" type="number" min="0" className="input" value={form.price.amount} onChange={(e) => setNested('price', 'amount', e.target.value)} placeholder="0 = no price shown" /></Field>
              <Field label="Price unit" htmlFor="s-unit"><input id="s-unit" className="input" value={form.price.unit} onChange={(e) => setNested('price', 'unit', e.target.value)} placeholder="per tank" /></Field>
              <Field label="Price label (when no price)" htmlFor="s-label"><input id="s-label" className="input" value={form.price.label} onChange={(e) => setNested('price', 'label', e.target.value)} placeholder="Contact us for a quote" /></Field>
              <Field label="CTA button text" htmlFor="s-cta"><input id="s-cta" className="input" value={form.ctaText} onChange={(e) => set('ctaText', e.target.value)} /></Field>
            </div>
          </Card>
          <Card title="Icon">
            <select className="input" value={form.icon} onChange={(e) => set('icon', e.target.value)} aria-label="Icon">
              {Object.keys(ICONS).map((n) => <option key={n}>{n}</option>)}
            </select>
          </Card>
        </div>
      </div>
    </form>
  );
}
