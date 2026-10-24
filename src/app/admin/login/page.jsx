'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { STORE_CONFIG } from '@/lib/constants';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem('sachin_admin_authenticated', 'true');
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full glass-panel rounded-3xl p-8 border border-sky-200/80 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-amber-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-sky-600/20">
            <Lock className="w-7 h-7 text-yellow-100" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Admin Authentication
          </h2>
          <p className="text-xs text-slate-500">
            Secure management portal for {STORE_CONFIG.name} Sivakasi
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Admin Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Admin Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white text-slate-800"
            />
          </div>

          <div className="p-3 bg-sky-50/60 rounded-xl text-[11px] text-slate-500 border border-sky-100">
            💡 Default demo credentials: <br/>
            Username: <code className="font-mono text-sky-800 font-bold">admin</code> | 
            Password: <code className="font-mono text-sky-800 font-bold">rajeshwari123</code>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-70"
          >
            <span>{loading ? 'Authenticating...' : 'Enter Admin Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-sky-700 hover:underline font-semibold">
            ← Return to Public Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
