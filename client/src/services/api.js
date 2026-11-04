import axios from 'axios';

const rawApiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');
const API_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`;
export const TOKEN_KEY = 'ro_admin_token';

const api = axios.create({ baseURL: API_URL, timeout: 30000 });

api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && config.url?.match(/^\/(admin|auth\/(me|profile|password))/)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    /* storage unavailable */
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && error.config?.url?.startsWith('/admin')) {
      try {
        localStorage.removeItem(TOKEN_KEY);
      } catch {
        /* ignore */
      }
      if (!window.location.pathname.startsWith('/admin/login')) window.location.assign('/admin/login');
    }
    return Promise.reject(error);
  }
);

export function errorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.code === 'ERR_NETWORK') return 'Cannot reach the server. Check your connection and try again.';
  if (error?.code === 'ECONNABORTED') return 'The request timed out. Please try again.';
  return fallback;
}

// unwrap { success, data, ...extra } into { data, ...extra }
const unwrap = (res) => res.data;

export const get = (url, params) => api.get(url, { params }).then(unwrap);
export const post = (url, body) => api.post(url, body).then(unwrap);
export const put = (url, body) => api.put(url, body).then(unwrap);
export const del = (url, params) => api.delete(url, { params }).then(unwrap);

export async function uploadImages(files, folder = 'misc') {
  const form = new FormData();
  [...files].forEach((f) => form.append('images', f));
  form.append('folder', folder);
  const res = await api.post('/admin/upload', form, { timeout: 120000 });
  return res.data.data; // [{ url, publicId }]
}

export default api;
