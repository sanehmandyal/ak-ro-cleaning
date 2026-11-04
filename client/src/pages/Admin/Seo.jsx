import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { get, put, errorMessage } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { PageHeader, Card, ImageUploader } from './shared';
import { Field, Spinner, ErrorState, FullPageLoader } from '../../components/ui';

const LABELS = { home: 'Home', about: 'About', services: 'Services list', gallery: 'Gallery', contact: 'Contact', booking: 'Booking' };

function SeoCard({ doc }) {
  const toast = useToast();
  const [f, setF] = useState({ title: '', description: '', keywords: '', canonicalUrl: '', ogTitle: '', ogDescription: '', ogImage: '', ogImagePublicId: '', ...doc });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const save = async () => {
    setSaving(true);
    try {
      const { title, description, keywords, canonicalUrl, ogTitle, ogDescription, ogImage, ogImagePublicId } = f;
      await put(`/admin/seo/${doc.page}`, { title, description, keywords, canonicalUrl, ogTitle, ogDescription, ogImage, ogImagePublicId });
      toast.success(`${LABELS[doc.page]} SEO saved`);
    } catch (e) { toast.error(errorMessage(e)); } finally { setSaving(false); }
  };
  const id = (k) => `seo-${doc.page}-${k}`;
  return (
    <Card title={`${LABELS[doc.page]} page`}>
      <div className="space-y-4">
        <Field label="Page title" hint={`${f.title.length}/60 recommended`} htmlFor={id('t')}><input id={id('t')} className="input" value={f.title} onChange={(e) => set('title', e.target.value)} /></Field>
        <Field label="Meta description" hint={`${f.description.length}/160 recommended`} htmlFor={id('d')}><textarea id={id('d')} rows={2} className="input" value={f.description} onChange={(e) => set('description', e.target.value)} /></Field>
        <Field label="Meta keywords" hint="Optional, comma separated" htmlFor={id('k')}><input id={id('k')} className="input" value={f.keywords} onChange={(e) => set('keywords', e.target.value)} /></Field>
        <Field label="Canonical URL" hint="Leave empty to use the page's own URL" htmlFor={id('c')}><input id={id('c')} type="url" className="input" value={f.canonicalUrl} onChange={(e) => set('canonicalUrl', e.target.value)} placeholder="https://" /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Open Graph title" htmlFor={id('ot')}><input id={id('ot')} className="input" value={f.ogTitle} onChange={(e) => set('ogTitle', e.target.value)} /></Field>
          <Field label="Open Graph description" htmlFor={id('od')}><input id={id('od')} className="input" value={f.ogDescription} onChange={(e) => set('ogDescription', e.target.value)} /></Field>
        </div>
        <ImageUploader label="Social sharing image (1200×630 ideal)" value={{ url: f.ogImage, publicId: f.ogImagePublicId }} onChange={(v) => setF((x) => ({ ...x, ogImage: v.url, ogImagePublicId: v.publicId }))} folder="seo" />
        <button className="btn-primary btn-sm" onClick={save} disabled={saving}>{saving ? <Spinner className="h-4 w-4" /> : <Save className="h-4 w-4" />} Save</button>
      </div>
    </Card>
  );
}

export default function SeoAdmin() {
  const [docs, setDocs] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => { get('/admin/seo').then((r) => setDocs(r.data)).catch((e) => setError(errorMessage(e))); }, []);
  if (error) return <ErrorState message={error} />;
  if (!docs) return <FullPageLoader />;
  return (
    <>
      <PageHeader title="SEO" subtitle="Search and social sharing settings per page. Service SEO is edited inside each service." />
      <div className="grid gap-6 xl:grid-cols-2">{docs.map((d) => <SeoCard key={d.page} doc={d} />)}</div>
    </>
  );
}
