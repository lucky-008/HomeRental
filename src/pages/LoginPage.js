import React, { useState } from 'react';
import { useAuth } from '../hooks/AuthContext';

export default function LoginPage({ onClose }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { signIn, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    
    try {
      if (mode === 'login') {
        await signIn(form.username, form.password);
        alert('Login successful!');
      } else {
        if (!form.email) {
          setErrorMsg('Email is required');
          setLoading(false);
          return;
        }
        await register(form.username, form.password, form.email);
        alert('Account created!');
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || (mode === 'login' ? 'Login failed' : 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Decorative top */}
        <div className="h-2 bg-gradient-to-r from-amber-400 to-orange-500"></div>

        <div className="p-8">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">🏠</span>
              </div>
              <span className="font-black text-2xl text-gray-900">Nest<span className="text-amber-500">Luck</span></span>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-light w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">✕</button>
          </div>

          {/* Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${mode === 'login' ? 'bg-amber-500 text-white shadow' : 'text-gray-500'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${mode === 'register' ? 'bg-amber-500 text-white shadow' : 'text-gray-500'}`}
            >
              Register
            </button>
          </div>

          <h2 className="text-2xl font-black text-gray-900 mb-1">
            {mode === 'login' ? 'Welcome back!' : 'Create account'}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {mode === 'login' ? 'Sign into your NestLuck account' : 'Join thousands of happy homeowners'}
          </p>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-semibold">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email" required placeholder="you@example.com"
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Username</label>
              <input
                required placeholder="Enter your username"
                value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  required type={showPass ? 'text' : 'password'} placeholder="Enter your password"
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 pr-12"
                />
                <button
                  type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 text-white font-black py-4 rounded-xl transition-colors shadow-lg shadow-amber-100 text-sm"
            >
              {loading ? 'Loading...' : (mode === 'login' ? '→ Sign In' : '→ Create Account')}
            </button>
          </form>

          <div className="flex justify-between items-center mt-5 text-xs text-amber-600 font-semibold">
            {mode === 'login' ? (
              <>
                <button onClick={() => setMode('register')} className="hover:underline">Register here!</button>
                <button className="hover:underline">Forgot password?</button>
              </>
            ) : (
              <button onClick={() => setMode('login')} className="hover:underline">Already have an account? Sign In</button>
            )}
          </div>

          {/* Social */}
          <div className="mt-5 pt-5 border-t border-gray-100">
            <p className="text-center text-xs text-gray-400 mb-3">Or continue with</p>
            <div className="grid grid-cols-2 gap-3">
              {[['📘', 'Facebook'], ['🔍', 'Google']].map(([icon, name]) => (
                <button key={name} className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                  <span>{icon}</span> {name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
