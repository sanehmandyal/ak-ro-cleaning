import { useSearchParams } from 'react-router-dom';
import { ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import Seo from '../../components/Seo';
import BookingForm from '../../components/BookingForm';
import useFetch from '../../hooks/useFetch';
import { useSite } from '../../context/SiteContext';

export default function Booking() {
  const [params] = useSearchParams();
  const { settings } = useSite();
  const { data: services } = useFetch('/services');
  const slug = params.get('service');
  const preselected = services?.find((s) => s.slug === slug)?._id || '';
  const name = settings?.businessName || 'Aqua Ak Enterprises';
  return (
    <>
      <Seo page="booking" title={`Book a Cleaning Service | ${name}`} description="Book water tank, RO purifier, bathroom, kitchen or home deep cleaning online." />
      <section className="bg-navy-800 py-14 text-center sm:py-20">
        <div className="container-x">
          <h1 className="text-3xl font-extrabold !text-white sm:text-5xl">Book a Service</h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">Tell us what you need and when. We will confirm your slot shortly.</p>
        </div>
      </section>
      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_340px]">
          <div className="min-w-0"><BookingForm defaultServiceId={preselected} /></div>
          <aside className="space-y-4">
            {[[ShieldCheck, 'Trained professionals', 'Verified, experienced cleaning staff.'], [Clock, 'Quick confirmation', 'We contact you to confirm your slot.'], [CheckCircle2, 'Transparent Service', 'Zero hidden fees. Full details shared upfront before work begins.']].map(([I, t, d]) => (
              <div key={t} className="card flex gap-4 p-5"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><I className="h-5 w-5" /></span><div><p className="font-display font-bold text-navy-800">{t}</p><p className="text-sm text-slate-600">{d}</p></div></div>
            ))}
          </aside>
        </div>
      </section>
    </>
  );
}
