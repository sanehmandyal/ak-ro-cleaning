import { useState } from 'react';
import { Droplets } from 'lucide-react';
import { optimizeImage, srcSet } from '../utils/format';

// Responsive, lazy image with a graceful fallback (never a broken-image icon).
export default function Img({ src, alt, className = '', width = 800, sizes = '(min-width:1024px) 33vw, 100vw', eager = false, ...rest }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-gradient-to-br from-brand-50 to-aqua-100 text-aqua-600 ${className}`}
      >
        <Droplets className="h-1/4 w-1/4 max-h-16 max-w-16 opacity-60" />
      </div>
    );
  }
  return (
    <img
      src={optimizeImage(src, width)}
      srcSet={srcSet(src)}
      sizes={sizes}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : undefined}
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
}
