import { Star } from 'lucide-react';
import ListManager from './ListManager';

export default function Testimonials() {
  return (
    <ListManager
      title="Testimonials" subtitle="Only publish genuine reviews from real customers" endpoint="/admin/testimonials" noun="Testimonial"
      empty={{ name: '', location: '', service: '', rating: 5, message: '', isPublished: true, order: 0 }}
      fields={[
        { key: 'name', label: 'Customer name', required: true }, { key: 'location', label: 'Location' }, { key: 'service', label: 'Service used' },
        { key: 'rating', label: 'Rating', type: 'rating' }, { key: 'message', label: 'Review', type: 'textarea', required: true }, { key: 'order', label: 'Display order', type: 'number' },
      ]}
      validate={(t) => (!t.name?.trim() ? 'Name is required' : (t.message?.trim().length || 0) < 5 ? 'Review must be at least 5 characters' : null)}
      renderItem={(t) => (
        <>
          <p className="font-display font-bold text-navy-800">{t.name} <span className="text-xs font-normal text-slate-500">{[t.service, t.location].filter(Boolean).join(' · ')}</span></p>
          <div className="mt-0.5 flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-3.5 w-3.5 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />)}</div>
          <p className="mt-1 line-clamp-3 break-words text-sm text-slate-600">{t.message}</p>
        </>
      )}
    />
  );
}
