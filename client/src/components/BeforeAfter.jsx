import { useState } from 'react';
import Img from './Img';

export default function BeforeAfter({ before, after, title }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="relative aspect-[4/3] w-full select-none overflow-hidden rounded-2xl bg-slate-100">
      <Img src={after} alt={`${title} - after cleaning`} className="absolute inset-0 h-full w-full object-cover" sizes="(min-width:1024px) 33vw, 100vw" />
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Img src={before} alt={`${title} - before cleaning`} className="h-full w-full object-cover" sizes="(min-width:1024px) 33vw, 100vw" />
      </div>
      <span className="absolute left-3 top-3 rounded-full bg-navy-800/80 px-2.5 py-1 text-xs font-bold text-white">Before</span>
      <span className="absolute right-3 top-3 rounded-full bg-aqua-500 px-2.5 py-1 text-xs font-bold text-navy-900">After</span>
      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow" style={{ left: `${pos}%` }}>
        <div className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xs font-bold text-brand-600 shadow-lg">↔</div>
      </div>
      <input
        type="range" min="0" max="100" value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={`Compare before and after for ${title}`}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
