import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, ArrowLeft, Save, Settings2, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [showAdvanced, setShowAdvanced] = useState(false);
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

    const generatedSlug = form.slug?.trim() || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const generatedShortDesc = form.shortDescription?.trim() || (form.description ? form.description.slice(0, 160) : '');

    const payload = {
      ...form,
      slug: generatedSlug,
      shortDescription: generatedShortDesc,
      description: form.description || form.shortDescription || form.title,
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
      <PageHeader title={isNew ? 'Add Service' : 'Edit Service'}>
        <Link to="/admin/services" className="btn-outline btn-sm"><ArrowLeft className="h-4 w-4" /> Back</Link>
        <button type="submit" className="btn-primary btn-sm" disabled={saving}>
          {saving ? <Spinner className="h-4 w-4" /> : <Save className="h-4 w-4" />} Save Service
        </button>
      </PageHeader>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* Main Simple Column */}
        <div className="min-w-0 space-y-6">
          <Card title="Quick Service Details">
            <div className="space-y-4">
              <Field label="Service Name / Title" required error={errors.title} htmlFor="s-title">
                <input
                  id="s-title"
                  className={`input font-medium ${errors.title ? 'input-error' : ''}`}
                  value={form.title}
                  placeholder="e.g. RO Purifier Deep Cleaning & Descaling"
                  onChange={(e) => set('title', e.target.value)}
                />
              </Field>

              <Field label="Description" hint="Simple description of what you clean or service" htmlFor="s-desc">
                <textarea
                  id="s-desc"
                  rows={4}
                  className="input leading-relaxed"
                  value={form.description}
                  placeholder="Detailed explanation of the service and what benefits customers will receive..."
                  onChange={(e) => set('description', e.target.value)}
                />
              </Field>

              <StringListEditor
                label="Key Highlights / Features"
                items={form.benefits}
                onChange={(v) => set('benefits', v)}
                placeholder="e.g. Removes algae, sludge & bacterial biofilm"
              />
            </div>
          </Card>

          {/* Toggle Advanced Section Button */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex w-full items-center justify-between text-left text-sm font-bold text-navy-900 hover:text-aqua-600 transition"
            >
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-aqua-600" />
                <span>Advanced Settings (Optional: Steps, FAQs, Slug, SEO)</span>
              </div>
              {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showAdvanced && (
              <div className="mt-5 space-y-6 border-t border-slate-100 pt-5">
                <Field label="Custom URL Slug" hint="Auto-generated if left empty" htmlFor="s-slug">
                  <input
                    id="s-slug"
                    className="input"
                    value={form.slug}
                    onChange={(e) => set('slug', e.target.value)}
                    placeholder="water-tank-cleaning"
                  />
                </Field>

                <Field label="Short Card Summary" hint="Shown on homepage cards (optional)" htmlFor="s-short">
                  <textarea
                    id="s-short"
                    rows={2}
                    maxLength={300}
                    className="input"
                    value={form.shortDescription}
                    onChange={(e) => set('shortDescription', e.target.value)}
                  />
                </Field>

                <StringListEditor
                  label="Why Choose Us Points"
                  items={form.whyChooseUs}
                  onChange={(v) => set('whyChooseUs', v)}
                  placeholder="e.g. Trained technicians in uniform"
                />

                <div>
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Service Process Steps</h4>
                  <ObjectListEditor
                    label="Steps"
                    items={form.process}
                    onChange={(v) => set('process', v)}
                    fields={[{ key: 'title', label: 'Step title' }, { key: 'description', label: 'Description', textarea: true }]}
                  />
                </div>

                <div>
                  <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Service FAQs</h4>
                  <ObjectListEditor
                    label="Questions"
                    items={form.faqs}
                    onChange={(v) => set('faqs', v)}
                    fields={[{ key: 'question', label: 'Question' }, { key: 'answer', label: 'Answer', textarea: true }]}
                  />
                </div>

                <div>
                  <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Search Engine Optimization (SEO)</h4>
                  <div className="space-y-3">
                    <Field label="SEO Title" hint="Optional, auto-generated from service name" htmlFor="s-seot">
                      <input id="s-seot" className="input" value={form.seo.title} onChange={(e) => setNested('seo', 'title', e.target.value)} />
                    </Field>
                    <Field label="Meta Description" hint="Optional" htmlFor="s-seod">
                      <textarea id="s-seod" rows={2} className="input" value={form.seo.description} onChange={(e) => setNested('seo', 'description', e.target.value)} />
                    </Field>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Image & Visibility */}
        <div className="min-w-0 space-y-6">
          <Card title="Service Image">
            <ImageUploader value={form.image} onChange={(v) => set('image', v)} folder="services" label="Featured Image" />
          </Card>

          <Card title="Display & Visibility">
            <div className="space-y-3">
              <Toggle checked={form.isAvailable} onChange={(v) => set('isAvailable', v)} label="Show on public website" />
              <Toggle checked={form.isPopular} onChange={(v) => set('isPopular', v)} label="Show in Popular Services on Home" />
              <Field label="Display Order" hint="Lower numbers appear first" htmlFor="s-order">
                <input id="s-order" type="number" className="input" value={form.order} onChange={(e) => set('order', e.target.value)} />
              </Field>
            </div>
          </Card>

          <Card title="Pricing (Optional)">
            <div className="space-y-3">
              <Field label="Price (optional)" error={errors.price} htmlFor="s-price">
                <input id="s-price" type="number" min="0" className="input" value={form.price.amount} onChange={(e) => setNested('price', 'amount', e.target.value)} placeholder="0 = Call for quote" />
              </Field>
              <Field label="Price unit (e.g. per tank, per visit)" htmlFor="s-unit">
                <input id="s-unit" className="input" value={form.price.unit} onChange={(e) => setNested('price', 'unit', e.target.value)} placeholder="per unit" />
              </Field>
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}
