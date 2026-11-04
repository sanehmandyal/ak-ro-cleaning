export const digits = (s = '') => String(s).replace(/\D/g, '');

export function telHref(phone) {
  const d = digits(phone);
  return d ? `tel:+${d.length === 10 ? `91${d}` : d}` : '#';
}

export function whatsappHref(number, text = 'Hello, I would like to book a cleaning service.') {
  let d = digits(number);
  if (!d) return '#';
  if (d.length === 10) d = `91${d}`;
  return `https://wa.me/${d}?text=${encodeURIComponent(text)}`;
}

export function formatPrice() {
  return '';
}

export const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

export const formatDateTime = (d) =>
  d
    ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '';

export const todayISO = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

// Insert Cloudinary transformations (auto format/quality + width) into delivery URLs.
export function optimizeImage(url, width) {
  if (!url || !url.includes('/image/upload/')) return url;
  const t = `f_auto,q_auto${width ? `,w_${width},c_limit` : ''}`;
  return url.replace('/image/upload/', `/image/upload/${t}/`);
}

export function srcSet(url, widths = [400, 800, 1200]) {
  if (!url || !url.includes('/image/upload/')) return undefined;
  return widths.map((w) => `${optimizeImage(url, w)} ${w}w`).join(', ');
}
