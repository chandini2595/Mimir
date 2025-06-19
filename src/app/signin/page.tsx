"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    // Developer backdoor (UI only, no backend call)
    if (email === 'dev@mimir.dev' && password === '@A1b2C3d4E5f6G7h8I9') {
      const devUser = {
        username: 'dev@mimir.dev',
        firstName: 'Developer',
        lastName: 'Admin',
        id: 'dev-001',
        role: 'developer',
      };
      localStorage.setItem('token', 'dev-demo-token');
      localStorage.setItem('user', JSON.stringify(devUser));
      router.push('/');
      return;
    }
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    let data = null;
    let rawText = '';
    try {
      rawText = await res.text();
      data = JSON.parse(rawText);
    } catch (err) {
      // Not JSON, keep rawText
    }    if (res.ok && data) {
      console.log('Sign-in successful, data received:', data);
      // Store token and user data
      localStorage.setItem('token', data.token);
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      console.log('Redirecting to home page...');
      router.push('/');
    } else {
      console.log('Sign-in failed:', { status: res.status, data, rawText });
      setError((data && data.error) || rawText || 'Sign in failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white">
      <form onSubmit={handleSubmit} className="bg-white/60 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-8 shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>        <input
          className="glass-input block w-full mb-4 px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 text-slate-800"
          type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input
          className="glass-input block w-full mb-6 px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 text-slate-800"
          type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}        <button type="submit" className="button-glass w-full py-2 text-lg font-semibold">Sign In</button>
        
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account? <a href="/signup" className="text-blue-600 underline">Sign up</a>
        </div>
      </form>
    </div>
  );
}
