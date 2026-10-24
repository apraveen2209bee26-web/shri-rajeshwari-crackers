import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, register } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated && user?.role === 'user') {
    return <Navigate replace to="/" />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await register(form);
      navigate('/');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="shell flex min-h-[80vh] items-center justify-center py-12">
      <div className="page-banner w-full max-w-xl p-8 sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-ember-700">Create account</p>
        <h1 className="mt-4 font-display text-4xl font-extrabold text-coal-900">Start your festive shopping</h1>
        <p className="mt-3 text-sm leading-7 text-coal-700">
          Register once to manage purchases, track deliveries, and checkout faster next time.
        </p>

        <form className="mt-8 grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
          <label className="sm:col-span-2">
            <span className="label">Full name</span>
            <input
              className="input"
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              required
              value={form.name}
            />
          </label>
          <label>
            <span className="label">Email address</span>
            <input
              className="input"
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              required
              type="email"
              value={form.email}
            />
          </label>
          <label>
            <span className="label">Phone number</span>
            <input
              className="input"
              onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
              value={form.phone}
            />
          </label>
          <label className="sm:col-span-2">
            <span className="label">Password</span>
            <input
              className="input"
              minLength="6"
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              required
              type="password"
              value={form.password}
            />
          </label>

          <div className="sm:col-span-2">
            <Button className="w-full" disabled={submitting} type="submit" variant="accent">
              {submitting ? 'Creating account...' : 'Register'}
            </Button>
          </div>
        </form>

        <p className="mt-6 text-sm text-coal-700">
          Already have an account?{' '}
          <Link className="font-bold text-ember-700 underline-offset-4 hover:underline" to="/login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
