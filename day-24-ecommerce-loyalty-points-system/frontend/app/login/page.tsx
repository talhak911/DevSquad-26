'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';
import api from '@/lib/api';
import { Loader2, ArrowRight, Lock, Mail } from 'lucide-react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      if (data.user.role === 'admin' || data.user.role === 'super_admin') {
        setError('Admins must log in via the Admin Portal.');
        setLoading(false);
        return;
      }

      login(data.access_token, data.refresh_token, data.user);
      router.push(callbackUrl);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-gray-200/50 border border-gray-50 relative overflow-hidden group">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-black/5 transition-colors" />
        
        <div className="relative z-10 text-center mb-10">
          <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-2 italic">Welcome Back</h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Enter your credentials to continue</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-2 border border-red-100 animate-shake">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl pl-14 pr-5 py-4 font-bold outline-none transition-all placeholder:text-gray-300"
                placeholder="style@shop.co"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Password</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl pl-14 pr-5 py-4 font-bold outline-none transition-all placeholder:text-gray-300"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white hover:bg-gray-800 rounded-2xl h-16 text-sm font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-gray-200 flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <>
                SIGN IN
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-50 text-center">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
            New here? 
            <Link href={`/register?callbackUrl=${callbackUrl}`} className="text-black ml-2 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] hover:text-black transition-colors">
          ← BACK TO SHOP
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F2F0F1] p-4 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none select-none overflow-hidden">
        <h1 className="text-[30rem] font-black italic uppercase -rotate-12 absolute -top-40 -left-40">SHOP</h1>
      </div>

      <Suspense fallback={
        <div className="flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-black" />
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
