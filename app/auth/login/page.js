'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import API from '@/lib/api';
import useStore from '@/store/useStore';
import useToast from '@/store/useToast';
import { Mail, Lock, Eye, EyeOff, ChevronRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = useStore();
  const { showError } = useToast();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/login', form);
      setUser(res.data.user, res.data.token);
      router.push(res.data.user.role === 'workshop' ? '/workshop' : '/');
    } catch (err) {
      showError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[90vh] flex items-center justify-center px-6 py-16 relative overflow-hidden">
      {/* Background glow elements */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/8 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary/8 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="font-orbitron text-3xl font-bold text-primary tracking-tighter inline-block mb-4 hover:opacity-80 transition-opacity">
            GEARLAB
          </Link>
          <h1 className="font-orbitron text-2xl font-bold text-white uppercase tracking-tight mb-2">Welcome Back</h1>
          <p className="text-sm text-gray-500">Sign in to access your garage and builds.</p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 md:p-10 space-y-6">

          {/* Email */}
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-5 text-sm text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-sm text-white placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="group w-full py-4 bg-primary text-background font-black uppercase tracking-widest text-sm rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(0,255,136,0.15)]"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                Sign In <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 pt-2">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-primary font-bold hover:underline">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}