import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, loginAdmin } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated && user?.role === 'admin') {
    return <Navigate replace to="/admin" />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await loginAdmin(form);
      navigate('/admin');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-festive-paper px-4 py-12">
      <div className="page-banner w-full max-w-lg p-8 sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-ember-700">Administrator</p>
        <h1 className="mt-4 font-display text-4xl font-extrabold text-coal-900">Admin login</h1>
        <p className="mt-3 text-sm leading-7 text-coal-700">
          Access product inventory, stock updates, Cloudinary image upload, and order management from one place.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label>
            <span className="label">Admin email</span>
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
            {submitting ? 'Signing in...' : 'Login as admin'}
          </Button>
        </form>

        <p className="mt-6 text-sm text-coal-700">
          Need the storefront instead?{' '}
          <Link className="font-bold text-ember-700 underline-offset-4 hover:underline" to="/">
            Go back home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
