import { useState, useEffect } from 'react';
import { Droplets } from 'lucide-react';
import { optimizeImage, srcSet } from '../utils/format';

// Responsive, lazy image with graceful fallback (never a broken-image icon).
// Supports string URLs, base64 data URIs, or image objects { url, secure_url }.
export default function Img({ src, alt, className = '', width = 800, sizes = '(min-width:1024px) 33vw, 100vw', eager = false, ...rest }) {
  const rawUrl = typeof src === 'object' && src !== null ? (src.url || src.secure_url || '') : (src || '');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [rawUrl]);

  if (!rawUrl || failed) {
    return (
      <div
        role="img"
        aria-label={alt || 'Aqua Ak Enterprises'}
        className={`flex items-center justify-center bg-gradient-to-br from-brand-50 to-aqua-100 text-aqua-600 ${className}`}
      >
        <Droplets className="h-1/4 w-1/4 max-h-16 max-w-16 opacity-60" />
      </div>
    );
  }

  const isDataOrExternal = rawUrl.startsWith('data:') || !rawUrl.includes('/image/upload/');
  const optimizedSrc = isDataOrExternal ? rawUrl : optimizeImage(rawUrl, width);
  const calculatedSrcSet = isDataOrExternal ? undefined : srcSet(rawUrl);

  return (
    <img
      src={optimizedSrc}
      srcSet={calculatedSrcSet}
      sizes={sizes}
      alt={alt || 'Aqua Ak Enterprises'}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : undefined}
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
}
