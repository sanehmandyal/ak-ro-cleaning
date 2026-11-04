import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Send,
  CalendarCheck,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Zap,
} from 'lucide-react';
import Seo, { localBusinessJsonLd } from '../../components/Seo';
import { useSite } from '../../context/SiteContext';
import { useToast } from '../../context/ToastContext';
import { post, errorMessage } from '../../services/api';
import { Field, Spinner } from '../../components/ui';
import { SocialLinks } from '../../components/Footer';
import BookingForm from '../../components/BookingForm';
import { telHref, whatsappHref } from '../../utils/format';

export default function Contact() {
  const { settings } = useSite();
  const toast = useToast();
  const [params] = useSearchParams();
  const initialTab = params.get('tab') === 'inquiry' ? 'inquiry' : 'booking';
  const [activeTab, setActiveTab] = useState(initialTab);

  const c = settings?.contact || {};
  const name = settings?.businessName || 'Aqua Ak Enterprises';
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onInquirySubmit = async (v) => {
    if (v.website) return;
    try {
      const { data } = await post('/contact', {
        name: v.name,
        phone: v.phone,
        email: v.email,
        subject: v.subject,
        message: v.message,
      });
      toast.success(data?.message || 'Thank you! Your message has been sent successfully.');
      reset();
    } catch (e) {
      toast.error(errorMessage(e));
    }
  };

  const mapSrc =
    c.mapEmbedUrl ||
    (c.address
      ? `https://www.google.com/maps?q=${encodeURIComponent([c.address, c.city, c.state].filter(Boolean).join(', '))}&output=embed`
      : 'https://www.google.com/maps?q=Jankipuram%2C+Lucknow&output=embed');

  const contactCards = [
    c.phone && {
      Icon: Phone,
      label: 'Call Direct Helpline',
      value: c.phone,
      sub: 'Mon - Sat: 8:00 AM - 8:00 PM',
      href: telHref(c.phone),
      action: 'Call Now',
    },
    c.whatsapp && {
      Icon: MessageCircle,
      label: 'Chat on WhatsApp',
      value: c.whatsapp,
      sub: 'Instant reply for photos & quotes',
      href: whatsappHref(c.whatsapp, 'Hello, I want to inquire about cleaning and maintenance services.'),
      action: 'Chat Live',
      external: true,
    },
    c.email && {
      Icon: Mail,
      label: 'Official Email',
      value: c.email,
      sub: 'For corporate AMC & general queries',
      href: `mailto:${c.email}`,
      action: 'Email Us',
    },
    c.address && {
      Icon: MapPin,
      label: 'Registered Office',
      value: [c.address, c.city, c.state, c.postalCode].filter(Boolean).join(', '),
      sub: 'Doorstep service across Lucknow',
      href: c.googleBusinessUrl || '#map',
      action: 'View Map',
      external: !!c.googleBusinessUrl,
    },
  ].filter(Boolean);

  return (
    <>
      <Seo
        page="contact"
        title={`Contact Us & Book a Service | ${name}`}
        description={`Get in touch with ${name}. Book water tank cleaning, RO purifier maintenance, or home deep cleaning, or contact our support team.`}
        keywords="contact RO cleaning, book water tank cleaning, purifier repair contact, cleaning service helpline"
        jsonLd={localBusinessJsonLd(settings)}
      />

      {/* Hero Header */}
      <section className="relative isolate overflow-hidden bg-navy-800 text-white">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800" />
        <div className="container-x py-16 text-center sm:py-24">
          <span className="glass mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-aqua-300">
            <Zap className="h-3.5 w-3.5 text-aqua-400" /> Fast Doorstep Service Across All Sectors
          </span>
          <h1 className="text-3xl font-extrabold leading-tight !text-white sm:text-5xl lg:text-6xl">
            Contact Us & Book a Service
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-200 sm:text-lg">
            Have questions or need an urgent cleaning visit? Choose between instant online booking or send an inquiry to our team.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setActiveTab('booking')}
              className={`min-h-[44px] rounded-xl px-5 text-sm font-bold transition flex items-center gap-2 ${
                activeTab === 'booking' ? 'bg-aqua-500 text-navy-950 shadow-glow' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <CalendarCheck className="h-4 w-4" /> Book Service Online
            </button>
            <button
              onClick={() => setActiveTab('inquiry')}
              className={`min-h-[44px] rounded-xl px-5 text-sm font-bold transition flex items-center gap-2 ${
                activeTab === 'inquiry' ? 'bg-aqua-500 text-navy-950 shadow-glow' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Mail className="h-4 w-4" /> Send Direct Inquiry
            </button>
            {c.phone && (
              <a href={telHref(c.phone)} className="btn-ghost-light">
                <Phone className="h-4 w-4" /> Call {c.phone}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Trust Highlights */}
      <section className="border-b border-slate-200 bg-slate-50 py-4">
        <div className="container-x">
          <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-navy-900 sm:text-sm">
              <Clock className="h-4 w-4 text-brand-600" /> 60-Minute Response
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-navy-900 sm:text-sm">
              <ShieldCheck className="h-4 w-4 text-aqua-600" /> Verified Technicians
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-navy-900 sm:text-sm">
              <CheckCircle2 className="h-4 w-4 text-teal-600" /> Transparent Quotes
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-navy-900 sm:text-sm">
              <Sparkles className="h-4 w-4 text-brand-600" /> 100% Genuine Spares
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Form + Contact Cards */}
      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-[1.1fr_.9fr]">
          {/* Left Column: Interactive Tabbed Form */}
          <div className="min-w-0">
            {/* Form Mode Toggle */}
            <div className="mb-6 flex rounded-2xl bg-slate-100 p-1.5" role="tablist">
              <button
                role="tab"
                aria-selected={activeTab === 'booking'}
                onClick={() => setActiveTab('booking')}
                className={`flex-1 rounded-xl py-3 text-sm font-bold transition flex items-center justify-center gap-2 ${
                  activeTab === 'booking'
                    ? 'bg-white text-navy-900 shadow-sm'
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                <CalendarCheck className="h-4 w-4 text-brand-600" /> Instant Service Booking
              </button>
              <button
                role="tab"
                aria-selected={activeTab === 'inquiry'}
                onClick={() => setActiveTab('inquiry')}
                className={`flex-1 rounded-xl py-3 text-sm font-bold transition flex items-center justify-center gap-2 ${
                  activeTab === 'inquiry'
                    ? 'bg-white text-navy-900 shadow-sm'
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                <Send className="h-4 w-4 text-aqua-600" /> Send an Inquiry
              </button>
            </div>

            {/* Tab 1: Service Booking Form */}
            {activeTab === 'booking' && (
              <div className="card p-6 sm:p-8 border-brand-200 shadow-card">
                <div className="mb-6">
                  <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
                    Step 1 of 1 • Fast Booking
                  </span>
                  <h2 className="mt-2 text-2xl font-extrabold text-navy-900">
                    Schedule Your Doorstep Cleaning
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Choose your service and preferred date. Our operations coordinator will call or WhatsApp you to confirm your slot.
                  </p>
                </div>
                <BookingForm />
              </div>
            )}

            {/* Tab 2: Contact Message Form */}
            {activeTab === 'inquiry' && (
              <form
                onSubmit={handleSubmit(onInquirySubmit)}
                noValidate
                className="card space-y-4 p-6 sm:p-8 shadow-card border-slate-200"
                aria-label="Contact message form"
              >
                <div className="mb-2">
                  <span className="inline-block rounded-full bg-aqua-50 px-3 py-1 text-xs font-bold text-aqua-700">
                    General Inquiries & Quotes
                  </span>
                  <h2 className="mt-2 text-2xl font-extrabold text-navy-900">
                    Send Our Support Team a Message
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Need a custom quote for commercial RO plants, corporate AMC, or large overhead sumps? Drop us a note.
                  </p>
                </div>

                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                  {...register('website')}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name" required error={errors.name?.message} htmlFor="c-name">
                    <input
                      id="c-name"
                      autoComplete="name"
                      placeholder="e.g. Rahul Sharma"
                      className={`input ${errors.name ? 'input-error' : ''}`}
                      {...register('name', {
                        required: 'Please enter your name',
                        minLength: { value: 2, message: 'Name is too short' },
                      })}
                    />
                  </Field>
                  <Field label="Mobile number" required error={errors.phone?.message} htmlFor="c-phone">
                    <input
                      id="c-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="e.g. 9219254461"
                      className={`input ${errors.phone ? 'input-error' : ''}`}
                      {...register('phone', {
                        required: 'Please enter your mobile number',
                        pattern: { value: /^\+?[0-9][0-9\s-]{8,14}$/, message: 'Enter a valid mobile number' },
                      })}
                    />
                  </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Email address" error={errors.email?.message} htmlFor="c-email">
                    <input
                      id="c-email"
                      type="email"
                      autoComplete="email"
                      placeholder="e.g. rahul@example.com"
                      className={`input ${errors.email ? 'input-error' : ''}`}
                      {...register('email', {
                        pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                      })}
                    />
                  </Field>
                  <Field label="Subject / Service of Interest" htmlFor="c-subject">
                    <input
                      id="c-subject"
                      placeholder="e.g. Commercial RO AMC or Tank Cleaning"
                      className="input"
                      {...register('subject')}
                    />
                  </Field>
                </div>

                <Field label="Message details" required error={errors.message?.message} htmlFor="c-message">
                  <textarea
                    id="c-message"
                    rows={4}
                    placeholder="Tell us about tank capacity, purifier model, address location, or any specific problem..."
                    className={`input ${errors.message ? 'input-error' : ''}`}
                    {...register('message', {
                      required: 'Please write a message',
                      minLength: { value: 5, message: 'Message is too short' },
                    })}
                  />
                </Field>

                <button type="submit" disabled={isSubmitting} className="btn-primary w-full sm:w-auto">
                  {isSubmitting ? <Spinner className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                  {isSubmitting ? 'Sending inquiry...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Contact Cards & Operating Info */}
          <div className="min-w-0 space-y-6">
            {/* Quick Contact Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {contactCards.map(({ Icon, label, value, sub, href, action, external }) => (
                <div
                  key={label}
                  className="card flex flex-col justify-between p-5 transition hover:shadow-card group"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
                      <p className="font-display text-base font-bold text-navy-900 break-words mt-0.5">{value}</p>
                      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
                    </div>
                  </div>
                  {href && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                      <a
                        href={href}
                        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700"
                      >
                        {action} <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Business Hours */}
            {settings?.businessHours && settings.businessHours.length > 0 && (
              <div className="card p-5">
                <p className="mb-3 flex items-center gap-2 font-display font-bold text-navy-800">
                  <Clock className="h-5 w-5 text-brand-600" /> Operating Business Hours
                </p>
                <dl className="space-y-2 text-xs sm:text-sm">
                  {settings.businessHours.map((h, i) => (
                    <div key={i} className="flex justify-between gap-4 border-b border-slate-100 pb-1.5 last:border-0 last:pb-0">
                      <dt className="text-slate-600">{h.day}</dt>
                      <dd className="text-right font-bold text-navy-900">{h.hours}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 flex items-start gap-2">
                  <Sparkles className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                  <span>
                    <strong>Emergency Support:</strong> Need urgent weekend water tank pump restoration? Call our helpline directly.
                  </span>
                </div>
              </div>
            )}

            {/* Social Media Links */}
            {Object.values(settings?.social || {}).some(Boolean) && (
              <div className="rounded-2xl bg-navy-800 p-6 text-white shadow-card">
                <p className="font-display font-bold text-white text-base">Connect with Us Online</p>
                <p className="text-xs text-slate-300 mt-1 mb-4">
                  Follow for pure water health tips, seasonal cleaning reminders, and video transformations.
                </p>
                <SocialLinks social={settings.social} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Interactive Google Map Section */}
      <section id="map" className="section bg-slate-50 border-t border-slate-200">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center mb-8">
            <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
              Service Center & Headquarters
            </span>
            <h2 className="mt-2 text-2xl font-extrabold text-navy-900 sm:text-3xl">
              Locate Our Operations Hub
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Our mobile service vans are dispatched daily from Jankipuram across Aliganj, Gomti Nagar, Indira Nagar, and all Lucknow sectors.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-card">
            <iframe
              title={`Map showing ${name} location`}
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-80 w-full border-0 sm:h-96"
              allowFullScreen
            />
          </div>

          {c.googleBusinessUrl && (
            <p className="mt-4 text-center text-sm">
              <a
                href={c.googleBusinessUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-brand-600 hover:underline inline-flex items-center gap-1.5"
              >
                View our verified Google Business Profile & Customer Reviews <ExternalLink className="h-4 w-4" />
              </a>
            </p>
          )}
        </div>
      </section>
    </>
  );
}
