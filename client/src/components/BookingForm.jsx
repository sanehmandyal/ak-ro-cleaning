import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle2, Send } from 'lucide-react';
import { get, post, errorMessage } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Field, Spinner } from './ui';
import { todayISO } from '../utils/format';

export const TIME_SLOTS = [
  '9:00 AM - 11:00 AM',
  '11:00 AM - 1:00 PM',
  '1:00 PM - 3:00 PM',
  '3:00 PM - 5:00 PM',
  '5:00 PM - 7:00 PM',
];

export default function BookingForm({ defaultServiceId = '', compact = false }) {
  const toast = useToast();
  const [services, setServices] = useState([]);
  const [loadError, setLoadError] = useState(false);
  const [done, setDone] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { service: defaultServiceId } });

  useEffect(() => {
    let active = true;
    get('/services')
      .then((r) => active && setServices(r.data))
      .catch(() => active && setLoadError(true));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (defaultServiceId && services.length) setValue('service', defaultServiceId);
  }, [defaultServiceId, services, setValue]);

  const onSubmit = async (values) => {
    if (values.website) return; // honeypot
    try {
      const { data } = await post('/bookings', {
        name: values.name,
        phone: values.phone,
        email: values.email,
        service: values.service,
        address: values.address,
        preferredDate: values.preferredDate,
        preferredTime: values.preferredTime,
        message: values.message,
      });
      setDone(data.reference);
      reset();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  if (done) {
    return (
      <div className="card p-6 text-center sm:p-10" role="status">
        <CheckCircle2 className="mx-auto h-14 w-14 text-green-500" />
        <h3 className="mt-4 text-2xl font-extrabold">Booking request received!</h3>
        <p className="mt-2 text-slate-600">
          Thank you. Our team will contact you shortly to confirm your slot.
        </p>
        <p className="mt-4 inline-block rounded-lg bg-slate-100 px-4 py-2 font-mono text-sm text-navy-800">
          Reference: {done}
        </p>
        <div className="mt-6">
          <button className="btn-outline" onClick={() => setDone(null)}>
            Make another booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="card space-y-4 p-5 sm:p-7" aria-label="Book a service">
      {/* honeypot field: hidden from people, bots fill it */}
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" {...register('website')} />

      <div className={`grid gap-4 ${compact ? '' : 'sm:grid-cols-2'}`}>
        <Field label="Full name" required error={errors.name?.message} htmlFor="b-name">
          <input
            id="b-name"
            autoComplete="name"
            className={`input ${errors.name ? 'input-error' : ''}`}
            {...register('name', {
              required: 'Please enter your name',
              minLength: { value: 2, message: 'Name is too short' },
              maxLength: { value: 80, message: 'Name is too long' },
            })}
          />
        </Field>
        <Field label="Mobile number" required error={errors.phone?.message} htmlFor="b-phone">
          <input
            id="b-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="92192 54461"
            className={`input ${errors.phone ? 'input-error' : ''}`}
            {...register('phone', {
              required: 'Please enter your mobile number',
              pattern: { value: /^\+?[0-9][0-9\s-]{8,14}$/, message: 'Enter a valid mobile number' },
            })}
          />
        </Field>
      </div>

      <div className={`grid gap-4 ${compact ? '' : 'sm:grid-cols-2'}`}>
        <Field label="Email" error={errors.email?.message} htmlFor="b-email" hint="Optional">
          <input
            id="b-email"
            type="email"
            autoComplete="email"
            className={`input ${errors.email ? 'input-error' : ''}`}
            {...register('email', { pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })}
          />
        </Field>
        <Field label="Service" required error={errors.service?.message} htmlFor="b-service">
          <select
            id="b-service"
            className={`input ${errors.service ? 'input-error' : ''}`}
            {...register('service', { required: 'Please select a service' })}
          >
            <option value="">{loadError ? 'Could not load services' : 'Select a service'}</option>
            {services.map((s) => (
              <option key={s._id} value={s._id}>
                {s.title}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Service address" required error={errors.address?.message} htmlFor="b-address">
        <textarea
          id="b-address"
          rows={2}
          autoComplete="street-address"
          className={`input ${errors.address ? 'input-error' : ''}`}
          {...register('address', {
            required: 'Please enter your address',
            minLength: { value: 5, message: 'Please enter your full address' },
          })}
        />
      </Field>

      <div className={`grid gap-4 ${compact ? '' : 'sm:grid-cols-2'}`}>
        <Field label="Preferred date" required error={errors.preferredDate?.message} htmlFor="b-date">
          <input
            id="b-date"
            type="date"
            min={todayISO()}
            className={`input ${errors.preferredDate ? 'input-error' : ''}`}
            {...register('preferredDate', {
              required: 'Select a preferred date',
              validate: (v) => v >= todayISO() || 'Date cannot be in the past',
            })}
          />
        </Field>
        <Field label="Preferred time" required error={errors.preferredTime?.message} htmlFor="b-time">
          <select
            id="b-time"
            className={`input ${errors.preferredTime ? 'input-error' : ''}`}
            {...register('preferredTime', { required: 'Select a preferred time' })}
          >
            <option value="">Select a time slot</option>
            {TIME_SLOTS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Additional message" error={errors.message?.message} htmlFor="b-message" hint="Optional: tank size, floor, special requests">
        <textarea
          id="b-message"
          rows={3}
          className="input"
          {...register('message', { maxLength: { value: 1000, message: 'Message is too long' } })}
        />
      </Field>

      <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
        {isSubmitting ? <Spinner className="h-4 w-4" /> : <Send className="h-4 w-4" />}
        {isSubmitting ? 'Submitting...' : 'Request Booking'}
      </button>
      <p className="text-center text-xs text-slate-500">We will call or message you to confirm. No payment is taken online.</p>
    </form>
  );
}
