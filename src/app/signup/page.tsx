"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ConfirmSignup from './ConfirmSignup';

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getPasswordValidationErrors(password: string) {
  const errors = [];
  if (password.length < 8) errors.push('At least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('One lowercase letter');
  if (!/\d/.test(password)) errors.push('One number');
  if (!/[^A-Za-z0-9]/.test(password)) errors.push('One special character');
  return errors;
}

export default function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState<{[k:string]:boolean}>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const router = useRouter();

  const passwordErrors = getPasswordValidationErrors(password);
  const passwordValid = passwordErrors.length === 0;
  const confirmPasswordValid = confirmPassword && confirmPassword === password && passwordValid;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (!validateEmail(email)) {
      setError('Invalid email address');
      return;
    }
    if (!passwordValid) {
      setError('Password does not meet requirements');
      return;
    }
    if (!confirmPasswordValid) {
      setError('Passwords do not match');
      return;
    }
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });
    if (res.ok) {
      setSignupEmail(email);
      setShowConfirm(true);
      setSuccess(true);
      setError('');
      return;
    } else {
      const data = await res.json();
      setError(data.error || 'Sign up failed');
    }
  }

  if (showConfirm && signupEmail) {
    return <ConfirmSignup email={signupEmail} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white">
      <form onSubmit={handleSubmit} className="bg-white/60 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-8 shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <div className="flex gap-2 mb-4">
          <input
            className={`glass-input block w-1/2 px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 text-slate-800 ${touched.firstName ? (firstName.trim() ? 'bg-green-50' : 'bg-red-50') : ''}`}
            type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} required onBlur={() => setTouched(t => ({...t, firstName:true}))} />
          <input
            className={`glass-input block w-1/2 px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 text-slate-800 ${touched.lastName ? (lastName.trim() ? 'bg-green-50' : 'bg-red-50') : ''}`}
            type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} required onBlur={() => setTouched(t => ({...t, lastName:true}))} />
        </div>
        <input
          className={`glass-input block w-full mb-4 px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 text-slate-800 ${touched.email ? (validateEmail(email) ? 'bg-green-50' : 'bg-red-50') : ''}`}
          type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required onBlur={() => setTouched(t => ({...t, email:true}))} />        <div style={{position: 'relative', marginBottom: '0.5rem'}}>
          <div className={`liquid-glass-input ${touched.password ? (passwordValid ? 'liquid-glass-green' : 'liquid-glass-red') : 'liquid-glass-red'}`}>
            <div className="glass-specular"></div>
            <input
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              onBlur={() => setTouched(t => ({...t, password:true}))} />
          </div>
        </div>
        {/* Password requirements */}
        {(!passwordValid || !touched.password) && (
          <ul className="mb-4 text-xs text-slate-600 pl-5 list-disc">
            <li className={password.length >= 8 ? 'text-green-600' : ''}>At least 8 characters</li>
            <li className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>One uppercase letter</li>
            <li className={/[a-z]/.test(password) ? 'text-green-600' : ''}>One lowercase letter</li>
            <li className={/\d/.test(password) ? 'text-green-600' : ''}>One number</li>
            <li className={/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : ''}>One special character</li>
          </ul>
        )}        <div style={{position: 'relative', marginBottom: '0.5rem'}}>
          <div className={`liquid-glass-input ${touched.confirmPassword ? (confirmPasswordValid ? 'liquid-glass-green' : 'liquid-glass-red') : 'liquid-glass-red'}`}>
            <div className="glass-specular"></div>
            <input
              type="password" 
              placeholder="Confirm Password" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              required 
              onBlur={() => setTouched(t => ({...t, confirmPassword:true}))} />
          </div>
        </div>
        {touched.confirmPassword && confirmPassword && (
          <div className={confirmPasswordValid ? 'text-green-600 text-xs mb-2 text-center' : 'text-red-500 text-xs mb-2 text-center'}>
            {confirmPasswordValid ? 'Passwords match' : 'Passwords do not match'}
          </div>
        )}
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        {success && <div className="text-green-600 mb-4 text-center">Account created! Redirecting...</div>}
        <button type="submit" className="button-glass w-full py-2 text-lg font-semibold">Sign Up</button>
        <div className="mt-4 text-center text-sm">
          Already have an account? <a href="/signin" className="text-blue-600 underline">Sign in</a>
        </div>
      </form>
      
      {/* SVG Filter for liquid glass distortion effect */}
      <svg className="glass-distortion-filter" style={{position: 'absolute', width: 0, height: 0, pointerEvents: 'none'}}>
        <filter id="lg-dist" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="92" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
          <feDisplacementMap in="SourceGraphic" in2="blurred" scale="70" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    </div>
  );
}
