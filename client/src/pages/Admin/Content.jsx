import { useEffect, useState } from 'react';
import { Save, Plus } from 'lucide-react';
import { get, put, errorMessage } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useSite } from '../../context/SiteContext';
import { ICONS } from '../../components/Icon';
import { PageHeader, Card, ImageUploader, StringListEditor, ObjectListEditor, Toggle } from './shared';
import { Field, Spinner, ErrorState, FullPageLoader } from '../../components/ui';

const TABS = ['Branding & Hero', 'About', 'Contact & Hours', 'Sections', 'Footer & Banner'];
const img = (v) => v || { url: '', publicId: '' };

function Text({ label, value, onChange, rows, hint, type = 'text', placeholder }) {
  const id = `f-${label.replace(/\W+/g, '-').toLowerCase()}`;
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      {rows ? <textarea id={id} rows={rows} className="input" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
        : <input id={id} type={type} className="input" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />}
    </Field>
  );
}

export default function Content() {
  const toast = useToast();
  const { reload } = useSite();
  const [form, setForm] = useState(null);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    get('/settings').then((r) => setForm(r.data)).catch((e) => setError(errorMessage(e)));
  }, []);

  if (error) return <ErrorState message={error} />;
  if (!form) return <FullPageLoader />;

  const set = (path, value) => setForm((f) => {
    const next = { ...f };
    const keys = path.split('.');
    let cur = next;
    keys.slice(0, -1).forEach((k) => { cur[k] = { ...(cur[k] || {}) }; cur = cur[k]; });
    cur[keys[keys.length - 1]] = value;
    return next;
  });

  const save = async () => {
    setSaving(true);
    try {
      const body = { ...form };
      ['_id', '__v', 'createdAt', 'updatedAt', 'key'].forEach((k) => delete body[k]);
      const { data } = await put('/admin/settings', body);
      setForm(data);
      reload();
      toast.success('Website content saved');
    } catch (e) { toast.error(errorMessage(e)); } finally { setSaving(false); }
  };

  const c = form.contact || {};
  return (
    <>
      <PageHeader title="Website Content" subtitle="Edit your website without touching code">
        <button className="btn-primary btn-sm" onClick={save} disabled={saving}>{saving ? <Spinner className="h-4 w-4" /> : <Save className="h-4 w-4" />} Save all changes</button>
      </PageHeader>
      <div className="-mx-4 mb-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="flex w-max gap-2" role="tablist">
          {TABS.map((t, i) => <button key={t} role="tab" aria-selected={tab === i} onClick={() => setTab(i)} className={`min-h-[40px] whitespace-nowrap rounded-full px-4 text-sm font-semibold ${tab === i ? 'bg-brand-600 text-white' : 'bg-white text-navy-800 ring-1 ring-slate-200'}`}>{t}</button>)}
        </div>
      </div>

      {tab === 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Brand">
            <div className="space-y-4">
              <Text label="Business name" value={form.businessName} onChange={(v) => set('businessName', v)} />
              <Text label="Tagline" value={form.tagline} onChange={(v) => set('tagline', v)} />
              <ImageUploader label="Website logo" value={img(form.logo)} onChange={(v) => set('logo', v)} folder="site" aspect="aspect-[3/1]" />
            </div>
          </Card>
          <Card title="Hero section">
            <div className="space-y-4">
              <Text label="Hero heading" value={form.hero?.heading} onChange={(v) => set('hero.heading', v)} rows={2} />
              <Text label="Hero description" value={form.hero?.description} onChange={(v) => set('hero.description', v)} rows={3} />
              <ImageUploader label="Hero banner image" value={img(form.hero?.image)} onChange={(v) => set('hero.image', v)} folder="site" />
            </div>
          </Card>
          <Card title="Stats (shown beside hero)" className="lg:col-span-2">
            <ObjectListEditor label="Stats" items={form.stats} onChange={(v) => set('stats', v)} fields={[{ key: 'value', label: 'Value (e.g. 500+)' }, { key: 'label', label: 'Label (e.g. Happy customers)' }]} />
          </Card>
        </div>
      )}

      {tab === 1 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="About section">
            <div className="space-y-4">
              <Text label="Company introduction" value={form.about?.intro} onChange={(v) => set('about.intro', v)} rows={4} />
              <Text label="Our experience" value={form.about?.experience} onChange={(v) => set('about.experience', v)} rows={4} />
              <Text label="Mission" value={form.about?.mission} onChange={(v) => set('about.mission', v)} rows={3} />
              <Text label="Vision" value={form.about?.vision} onChange={(v) => set('about.vision', v)} rows={3} />
              <ImageUploader label="About image" value={img(form.about?.image)} onChange={(v) => set('about.image', v)} folder="site" aspect="aspect-[4/3]" />
            </div>
          </Card>
          <div className="space-y-6">
            <Card title="Standards & trust"><div className="space-y-5">
              <StringListEditor label="Professional cleaning standards" items={form.about?.standards} onChange={(v) => set('about.standards', v)} />
              <StringListEditor label="Why customers trust us" items={form.about?.trustPoints} onChange={(v) => set('about.trustPoints', v)} />
            </div></Card>
            <Card title="Team">
              <div className="space-y-3">
                {(form.team || []).map((m, i) => (
                  <div key={i} className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                    <ImageUploader label="Photo" value={img(m.photo)} onChange={(v) => set('team', form.team.map((x, j) => (j === i ? { ...x, photo: v } : x)))} folder="site" aspect="aspect-square" />
                    {[['name', 'Name'], ['role', 'Role']].map(([k, l]) => (
                      <div key={k}><label className="mb-1 block text-xs font-medium text-slate-500">{l}</label><input className="input" value={m[k] || ''} onChange={(e) => set('team', form.team.map((x, j) => (j === i ? { ...x, [k]: e.target.value } : x)))} /></div>
                    ))}
                    <div><label className="mb-1 block text-xs font-medium text-slate-500">Short bio</label><textarea rows={2} className="input" value={m.bio || ''} onChange={(e) => set('team', form.team.map((x, j) => (j === i ? { ...x, bio: e.target.value } : x)))} /></div>
                    <button type="button" className="text-xs font-semibold text-red-600" onClick={() => set('team', form.team.filter((_, j) => j !== i))}>Remove member</button>
                  </div>
                ))}
              </div>
              <button type="button" className="btn-outline btn-sm mt-3" onClick={() => set('team', [...(form.team || []), { name: '', role: '', bio: '', photo: { url: '', publicId: '' } }])}><Plus className="h-4 w-4" /> Add team member</button>
            </Card>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Contact details"><div className="space-y-4">
            <Text label="Phone number" type="tel" value={c.phone} onChange={(v) => set('contact.phone', v)} placeholder="+91 98765 43210" />
            <Text label="WhatsApp number" type="tel" value={c.whatsapp} onChange={(v) => set('contact.whatsapp', v)} hint="10-digit Indian numbers get +91 automatically" />
            <Text label="Email address" type="email" value={c.email} onChange={(v) => set('contact.email', v)} />
            <Text label="Business address" value={c.address} onChange={(v) => set('contact.address', v)} rows={2} />
            <div className="grid gap-4 sm:grid-cols-3">
              <Text label="City" value={c.city} onChange={(v) => set('contact.city', v)} />
              <Text label="State" value={c.state} onChange={(v) => set('contact.state', v)} />
              <Text label="PIN code" value={c.postalCode} onChange={(v) => set('contact.postalCode', v)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Text label="Latitude" value={c.latitude} onChange={(v) => set('contact.latitude', v)} hint="Optional, improves local SEO" />
              <Text label="Longitude" value={c.longitude} onChange={(v) => set('contact.longitude', v)} />
            </div>
            <Text label="Google Maps embed URL" value={c.mapEmbedUrl} onChange={(v) => set('contact.mapEmbedUrl', v)} hint="Google Maps > Share > Embed a map > copy the src URL. If empty, your address is used." />
            <Text label="Google Business Profile link" value={c.googleBusinessUrl} onChange={(v) => set('contact.googleBusinessUrl', v)} />
          </div></Card>
          <div className="space-y-6">
            <Card title="Business hours"><ObjectListEditor label="Hours" items={form.businessHours} onChange={(v) => set('businessHours', v)} fields={[{ key: 'day', label: 'Days' }, { key: 'hours', label: 'Hours' }]} /></Card>
            <Card title="Social media links"><div className="space-y-4">
              {['facebook', 'instagram', 'youtube', 'twitter', 'linkedin'].map((k) => <Text key={k} label={k[0].toUpperCase() + k.slice(1)} value={form.social?.[k]} onChange={(v) => set(`social.${k}`, v)} placeholder="https://" />)}
            </div></Card>
          </div>
        </div>
      )}

      {tab === 3 && (
        <div className="space-y-6">
          <Card title="Why choose us">
            <div className="space-y-3">
              {(form.whyChooseUs || []).map((w, i) => (
                <div key={i} className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50/60 p-3 sm:grid-cols-[1fr_160px]">
                  <input className="input" placeholder="Title" aria-label="Title" value={w.title || ''} onChange={(e) => set('whyChooseUs', form.whyChooseUs.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} />
                  <select className="input" aria-label="Icon" value={w.icon || 'ShieldCheck'} onChange={(e) => set('whyChooseUs', form.whyChooseUs.map((x, j) => (j === i ? { ...x, icon: e.target.value } : x)))}>{Object.keys(ICONS).map((n) => <option key={n}>{n}</option>)}</select>
                  <textarea rows={2} className="input sm:col-span-2" placeholder="Description" aria-label="Description" value={w.description || ''} onChange={(e) => set('whyChooseUs', form.whyChooseUs.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))} />
                  <button type="button" className="justify-self-start text-xs font-semibold text-red-600" onClick={() => set('whyChooseUs', form.whyChooseUs.filter((_, j) => j !== i))}>Remove</button>
                </div>
              ))}
            </div>
            <button type="button" className="btn-outline btn-sm mt-3" onClick={() => set('whyChooseUs', [...(form.whyChooseUs || []), { title: '', description: '', icon: 'ShieldCheck' }])}><Plus className="h-4 w-4" /> Add</button>
          </Card>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card title="How it works"><ObjectListEditor label="Steps" items={form.howItWorks} onChange={(v) => set('howItWorks', v)} fields={[{ key: 'title', label: 'Title' }, { key: 'description', label: 'Description', textarea: true }]} /></Card>
            <Card title="Service areas"><ObjectListEditor label="Areas" items={form.serviceAreas} onChange={(v) => set('serviceAreas', v)} fields={[{ key: 'name', label: 'Area / locality' }, { key: 'description', label: 'Note (optional)' }]} /></Card>
          </div>
        </div>
      )}

      {tab === 4 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Promotional banner"><div className="space-y-4">
            <Toggle checked={form.promoBanner?.enabled} onChange={(v) => set('promoBanner.enabled', v)} label="Show banner at top of website" />
            <Text label="Banner text" value={form.promoBanner?.text} onChange={(v) => set('promoBanner.text', v)} />
            <Text label="Link text" value={form.promoBanner?.linkText} onChange={(v) => set('promoBanner.linkText', v)} />
            <Text label="Link URL" value={form.promoBanner?.linkUrl} onChange={(v) => set('promoBanner.linkUrl', v)} hint="e.g. /booking or https://..." />
          </div></Card>
          <Card title="Footer"><div className="space-y-4">
            <Text label="Footer description" value={form.footer?.about} onChange={(v) => set('footer.about', v)} rows={3} />
            <Text label="Copyright text" value={form.footer?.copyright} onChange={(v) => set('footer.copyright', v)} hint="Leave empty for the automatic © line" />
          </div></Card>
        </div>
      )}
    </>
  );
}
