'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { Lock, Mail, Hotel, AlertCircle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // If already logged in, redirect to dashboard immediately
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          router.replace('/admin-dashboard');
        }
      });
    } else {
      // In offline/demo mode, check if we have our mock session token
      const offlineSession = localStorage.getItem('grand_emaar_demo_session');
      if (offlineSession) {
        router.replace('/admin-dashboard');
      }
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password) {
      setError('Please provide both administrative email and password.');
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured) {
      // Demo authentication flow for direct immediate testing
      console.log('Running in demo mock authentication mode...');
      setTimeout(() => {
        if (email.trim().toLowerCase() === 'admin@grandemaar.com' && password === 'admin123') {
          localStorage.setItem('grand_emaar_demo_session', JSON.stringify({ email, token: 'mock_jwt_token_grand_emaar' }));
          router.replace('/admin-dashboard');
        } else if (email && password.length >= 6) {
          // Allow any 6-character password in demo mode to be super accommodating.
          localStorage.setItem('grand_emaar_demo_session', JSON.stringify({ email, token: 'mock_jwt_token' }));
          router.replace('/admin-dashboard');
        } else {
          setError('Invalid login credentials in Demo Mode. (Recommended: admin@grandemaar.com / admin123)');
        }
        setLoading(false);
      }, 800);
      return;
    }

    try {
      const { data, error: authError } = await supabase!.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      if (data.session) {
        router.replace('/admin-dashboard');
      } else {
        setError('No active administrative session. Contact developer.');
      }
    } catch (err: any) {
      console.error('Error logging in:', err);
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white p-4 sm:p-6 relative overflow-hidden font-sans">
      
      {/* Decorative stars / geometric dots in background */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1.5px,transparent_1.5px)] [background-size:32px_32px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        
        {/* Brand Banner Badge */}
        <div className="text-center mb-8 space-y-2">
          <Link href="/" className="inline-flex flex-col items-center group">
            <div className="w-12 h-12 rounded-sm bg-[#C5A059] text-neutral-950 flex items-center justify-center mb-3 border border-[#C5A059]/25 group-hover:scale-105 transition-transform">
              <Hotel className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-white group-hover:text-[#C5A059] transition-colors">
              GRAND EMAAR
            </span>
            <span className="text-[10px] font-sans tracking-[0.25em] uppercase text-[#C5A059] font-semibold">
              Hotel Nawabshah Admin
            </span>
          </Link>
        </div>

        {/* Core login card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-neutral-900 border border-[#C5A059]/20 p-8 rounded-sm shadow-2xl relative"
        >
          {/* Internal thin layout borders */}
          <div className="absolute inset-1.5 border border-[#C5A059]/5 pointer-events-none" />

          <div className="mb-6 text-center">
            <h2 className="font-serif text-xl font-medium tracking-wide">Manager Credentials Signature</h2>
            <p className="text-xs text-neutral-400 font-light mt-1">Access the dynamic menus matrix database</p>
          </div>

          {/* Demo Fallback Information block */}
          {!isSupabaseConfigured && (
            <div className="mb-6 p-4 bg-[#C5A059]/10 border border-[#C5A059]/30 text-xs text-neutral-300 font-light rounded-sm space-y-1 text-left">
              <span className="text-[#C5A059] font-bold uppercase tracking-wider block mb-1">
                Demo Auth Mode Active
              </span>
              <p>Supabase variables are missing, meaning offline simulation is currently active. Any credentials with a password &ge; 6 characters can log in.</p>
              <p className="pt-1.5 font-mono text-[#C5A059]">
                Login with: <br />
                User: <strong className="underline">admin@grandemaar.com</strong> <br />
                Pass: <strong className="underline">admin123</strong>
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-3 bg-red-950/40 border border-red-500/20 text-red-200 text-xs rounded-sm flex items-start gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5 text-left">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email-login-auth" className="text-xs uppercase tracking-wider text-neutral-400 font-bold">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="email-login-auth"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-950 border border-[#C5A059]/15 focus:border-[#C5A059] text-sm text-white pl-10 pr-4 py-3 rounded-sm shadow-inner transition-colors duration-200 focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password-login-auth" className="text-xs uppercase tracking-wider text-neutral-400 font-bold">
                  Credentials Password
                </label>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="password-login-auth"
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-950 border border-[#C5A059]/15 focus:border-[#C5A059] text-sm text-white pl-10 pr-4 py-3 rounded-sm shadow-inner transition-colors duration-200 focus:outline-none"
                />
              </div>
            </div>

            {/* Submit Auth Buttons */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                id="admin-form-login-submit"
                className="w-full py-3.5 bg-[#C5A059] hover:bg-[#A98443] text-neutral-950 hover:text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-lg rounded-sm cursor-pointer select-none active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Authenticating Gate...' : 'Sign In as Administrator'}
              </button>
            </div>
          </form>

        </motion.div>

        {/* Back link to Home */}
        <div className="mt-6 text-center select-none font-mono">
          <Link
            href="/"
            className="text-xs text-neutral-500 hover:text-[#C5A059] transition-colors"
          >
            &larr; Return to Public Website
          </Link>
        </div>

      </div>
    </div>
  );
}
