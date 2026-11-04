import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FaqAccordion({ items = [] }) {
  const [open, setOpen] = useState(0);
  if (!items.length) return null;
  return (
    <div className="mx-auto max-w-3xl divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white shadow-card">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f._id || i}>
            <h3>
              <button
                className="flex min-h-[56px] w-full items-center justify-between gap-4 px-5 py-4 text-left font-display text-sm font-bold text-navy-800 sm:text-base"
                aria-expanded={isOpen}
                aria-controls={`faq-${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <span className="min-w-0 break-words">{f.question}</span>
                <ChevronDown className={`h-5 w-5 shrink-0 text-brand-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
            </h3>
            {isOpen && (
              <div id={`faq-${i}`} className="px-5 pb-5 text-sm leading-relaxed text-slate-600">
                {f.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
