import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Save, KeyRound } from 'lucide-react';
import { put, errorMessage } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { PageHeader, Card, Toggle } from './shared';
import { Field, Spinner } from '../../components/ui';

export default function Settings() {
  const { admin, setAdmin } = useAuth();
  const toast = useToast();
  const [notify, setNotify] = useState({ newBooking: admin.notifications?.newBooking !== false, newContact: admin.notifications?.newContact !== false });
  const profile = useForm({ defaultValues: { name: admin.name, email: admin.email, phone: admin.phone || '' } });
  const pw = useForm();

  const saveProfile = async (v) => {
    try { const { data } = await put('/auth/profile', { ...v, notifications: notify }); setAdmin(data); toast.success('Profile updated'); } catch (e) { toast.error(errorMessage(e)); }
  };
  const savePassword = async (v) => {
    try { await put('/auth/password', { currentPassword: v.currentPassword, newPassword: v.newPassword }); toast.success('Password changed'); pw.reset(); } catch (e) { toast.error(errorMessage(e)); }
  };

  return (
    <>
      <PageHeader title="Settings" subtitle="Your profile, password and alerts" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Profile & notifications">
          <form onSubmit={profile.handleSubmit(saveProfile)} noValidate className="space-y-4">
            <Field label="Name" required error={profile.formState.errors.name?.message} htmlFor="p-name"><input id="p-name" className="input" {...profile.register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name is too short' } })} /></Field>
            <Field label="Email" required error={profile.formState.errors.email?.message} htmlFor="p-email"><input id="p-email" type="email" className="input" {...profile.register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })} /></Field>
            <Field label="Phone" htmlFor="p-phone"><input id="p-phone" type="tel" className="input" {...profile.register('phone')} /></Field>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="mb-1 text-sm font-semibold text-navy-800">Dashboard alerts</p>
              <Toggle checked={notify.newBooking} onChange={(v) => setNotify({ ...notify, newBooking: v })} label="Alert me about new bookings" />
              <Toggle checked={notify.newContact} onChange={(v) => setNotify({ ...notify, newContact: v })} label="Alert me about new inquiries" />
            </div>
            <button className="btn-primary" disabled={profile.formState.isSubmitting}>{profile.formState.isSubmitting ? <Spinner className="h-4 w-4" /> : <Save className="h-4 w-4" />} Save profile</button>
          </form>
        </Card>
        <div className="space-y-6">
          <Card title="Change password">
            <form onSubmit={pw.handleSubmit(savePassword)} noValidate className="space-y-4">
              <Field label="Current password" required error={pw.formState.errors.currentPassword?.message} htmlFor="pw-cur"><input id="pw-cur" type="password" autoComplete="current-password" className="input" {...pw.register('currentPassword', { required: 'Enter your current password' })} /></Field>
              <Field label="New password" required error={pw.formState.errors.newPassword?.message} hint="At least 8 characters, with a letter and a number" htmlFor="pw-new"><input id="pw-new" type="password" autoComplete="new-password" className="input" {...pw.register('newPassword', { required: 'Enter a new password', minLength: { value: 8, message: 'At least 8 characters' }, validate: (v) => (/[A-Za-z]/.test(v) && /\d/.test(v)) || 'Must contain a letter and a number' })} /></Field>
              <Field label="Confirm new password" required error={pw.formState.errors.confirm?.message} htmlFor="pw-conf"><input id="pw-conf" type="password" autoComplete="new-password" className="input" {...pw.register('confirm', { validate: (v) => v === pw.getValues('newPassword') || 'Passwords do not match' })} /></Field>
              <button className="btn-primary" disabled={pw.formState.isSubmitting}>{pw.formState.isSubmitting ? <Spinner className="h-4 w-4" /> : <KeyRound className="h-4 w-4" />} Update password</button>
            </form>
          </Card>
          <Card title="Business information"><p className="text-sm text-slate-600">Phone, WhatsApp, email, address, hours and social links are managed under <Link to="/admin/content" className="font-semibold text-brand-600">Website Content</Link>.</p></Card>
        </div>
      </div>
    </>
  );
}
