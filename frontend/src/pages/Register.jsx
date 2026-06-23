import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Could not create your account.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-3xl">✦</span>
          <h1 className="font-display text-3xl font-semibold text-ink mt-2">Create your account</h1>
          <p className="text-inkMuted text-sm mt-1">A few seconds, then straight to planning.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-ticketBorder rounded-2xl p-8 shadow-sm space-y-5"
        >
          {error && (
            <div className="text-sm text-danger bg-danger/10 border border-danger/30 rounded-lg px-4 py-2">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase tracking-wide text-inkMuted mb-1.5">
              Name
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-ticketBorder px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
              placeholder="Jordan Lee"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wide text-inkMuted mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-ticketBorder px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wide text-inkMuted mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-lg border border-ticketBorder px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
              placeholder="At least 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-accent text-parchment font-medium rounded-full py-2.5 hover:bg-accentDark transition-colors disabled:opacity-60"
          >
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-inkMuted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-accent font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
