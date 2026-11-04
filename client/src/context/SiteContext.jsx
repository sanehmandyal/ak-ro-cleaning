import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { get } from '../services/api';

const SiteContext = createContext(null);

const DEFAULT_SETTINGS = {
  businessName: 'Aqua Ak Enterprises',
  tagline: 'Pure Drinking Water. Certified Tank Sanitization. Healthy Families.',
  contact: {
    phone: '9219254461',
    whatsapp: '9219254461',
    email: 'contact@aquaakenterprises.com',
    address: 'Aqua Ak Enterprises, Jankipuram',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    postalCode: '226021',
    mapEmbedUrl: 'https://www.google.com/maps?q=Jankipuram%2C+Lucknow&output=embed',
  },
  businessHours: [
    { day: 'Monday – Saturday', hours: '8:00 AM – 8:00 PM' },
    { day: 'Sunday', hours: '9:00 AM – 6:00 PM' },
  ],
};

export function SiteProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await get('/settings');
      setSettings(res.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const value = useMemo(() => ({ settings, loading, error, reload: load }), [settings, loading, error, load]);
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export const useSite = () => useContext(SiteContext);
