import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, login } = useAuth();
  const [form, setForm] = useState({
    email: '',
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
      await login(form);
      navigate('/');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="shell flex min-h-[80vh] items-center justify-center py-12">
      <div className="page-banner w-full max-w-lg p-8 sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-ember-700">User login</p>
        <h1 className="mt-4 font-display text-4xl font-extrabold text-coal-900">Welcome back</h1>
        <p className="mt-3 text-sm leading-7 text-coal-700">
          Sign in to access your cart, checkout, order tracking, and saved profile details.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
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
            <span className="label">Password</span>
            <input
              className="input"
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              required
              type="password"
              value={form.password}
            />
          </label>

          <Button className="w-full" disabled={submitting} type="submit" variant="accent">
            {submitting ? 'Signing in...' : 'Login'}
          </Button>
        </form>

        <p className="mt-6 text-sm text-coal-700">
          New here?{' '}
          <Link className="font-bold text-ember-700 underline-offset-4 hover:underline" to="/register">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
