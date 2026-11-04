import { MessageCircle, Phone } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { telHref, whatsappHref } from '../utils/format';

export default function FloatingActions() {
  const { settings } = useSite();
  const c = settings?.contact || {};
  if (!c.whatsapp && !c.phone) return null;
  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-3 sm:bottom-6 sm:right-6">
      {c.phone && (
        <a href={telHref(c.phone)} aria-label="Call us" className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white shadow-glow transition hover:scale-110 lg:hidden">
          <Phone className="h-5 w-5" />
        </a>
      )}
      {c.whatsapp && (
        <a href={whatsappHref(c.whatsapp)} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-110">
          <MessageCircle className="h-7 w-7" />
        </a>
      )}
    </div>
  );
}
