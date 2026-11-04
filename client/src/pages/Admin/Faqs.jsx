import ListManager from './ListManager';

export default function Faqs() {
  return (
    <ListManager
      title="FAQs" subtitle="Shown on the home page" endpoint="/admin/faqs" noun="FAQ"
      empty={{ question: '', answer: '', isPublished: true, order: 0 }}
      fields={[{ key: 'question', label: 'Question', required: true }, { key: 'answer', label: 'Answer', type: 'textarea', required: true }, { key: 'order', label: 'Display order', type: 'number' }]}
      validate={(f) => (!f.question?.trim() ? 'Question is required' : !f.answer?.trim() ? 'Answer is required' : null)}
      renderItem={(f) => (<><p className="break-words font-display font-bold text-navy-800">{f.question}</p><p className="mt-1 line-clamp-3 break-words text-sm text-slate-600">{f.answer}</p></>)}
    />
  );
}
