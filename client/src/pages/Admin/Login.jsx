import { useState } from 'react';
import { Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Lock, ArrowLeft, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { errorMessage } from '../../services/api';
import { Field, Spinner, FullPageLoader } from '../../components/ui';
import { LogoMark } from '../../components/Logo';
import Seo from '../../components/Seo';

export default function Login() {
  const { admin, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm();

  if (loading) return <FullPageLoader />;
  if (admin) return <Navigate to={location.state?.from || '/admin'} replace />;

  const fillAdmin = () => {
    setValue('email', 'akrocleaning@gmail.com', { shouldValidate: true });
    setValue('password', 'AkRoCleaning@2026#', { shouldValidate: true });
  };

  const onSubmit = async ({ email, password }) => {
    setError('');
    try {
      await login(email, password);
      navigate(location.state?.from || '/admin', { replace: true });
    } catch (e) {
      setError(errorMessage(e, 'Login failed'));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-navy-950 via-navy-900 to-[#031e3d] p-4">
      <Seo title="Admin Login | Aqua Ak Enterprises" noindex />
      <div className="card w-full max-w-md p-6 sm:p-8 shadow-2xl border border-aqua-500/20">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-aqua-600 mb-2">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Website
        </Link>
        <LogoMark className="mx-auto h-14 w-14" />
        <h1 className="mt-3 text-center text-2xl font-extrabold text-navy-950">Aqua Ak Admin Portal</h1>
        <p className="mt-1 text-center text-sm text-slate-500">Sign in to manage bookings, gallery & content</p>

        {/* Demo Credentials Quick Fill */}
        <div className="mt-4 rounded-xl bg-aqua-50/60 p-3 border border-aqua-200/80">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-navy-900 flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5 text-aqua-600" /> AK RO Cleaning Admin:
            </span>
            <button
              type="button"
              onClick={fillAdmin}
              className="font-bold text-aqua-600 hover:text-aqua-700 underline text-xs cursor-pointer"
            >
              Auto-fill credentials
            </button>
          </div>
          <p className="mt-1 font-mono text-[11px] text-slate-600 font-semibold truncate">
            akrocleaning@gmail.com / AkRoCleaning@2026#
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 space-y-4">
          {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</div>}
          <Field label="Email" error={errors.email?.message} htmlFor="l-email">
            <input id="l-email" type="email" autoComplete="username" className={`input ${errors.email ? 'input-error' : ''}`} {...register('email', { required: 'Enter your email', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })} />
          </Field>
          <Field label="Password" error={errors.password?.message} htmlFor="l-pass">
            <input id="l-pass" type="password" autoComplete="current-password" className={`input ${errors.password ? 'input-error' : ''}`} {...register('password', { required: 'Enter your password' })} />
          </Field>
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full shadow-md">
            {isSubmitting ? <Spinner className="h-4 w-4" /> : <Lock className="h-4 w-4" />} Sign in to Admin Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
