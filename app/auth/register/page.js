'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import API from '@/lib/api';
import useStore from '@/store/useStore';
import useToast from '@/store/useToast';
import { Mail, Lock, Eye, EyeOff, User, Wrench, ChevronRight, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = useStore();
  const { showError, showInfo } = useToast();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/register', form);
      setUser(res.data.user, res.data.token);
      if (form.role === 'workshop') {
        showInfo('Workshop registered! Awaiting admin approval before you can log in.');
      }
      router.push(res.data.user.role === 'workshop' ? '/workshop' : '/');
    } catch (err) {
      showError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: 'customer', label: 'Customer', icon: <User size={18} />, desc: 'Book services & customize' },
    { value: 'workshop', label: 'Workshop', icon: <Wrench size={18} />, desc: 'Manage & fulfill orders' },
  ];

  return (
    <main className="min-h-[90vh] flex items-center justify-center px-6 py-16 relative overflow-hidden">
      {/* Background glow elements */}
      <div className="absolute inset-0 gradient-mesh pointer-events-none opacity-40" />
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-primary/[0.04] rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-secondary/[0.04] rounded-full blur-[120px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

      <div className="w-full max-w-md animate-hero-reveal relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="font-orbitron text-2xl font-bold tracking-tight inline-flex items-center gap-1.5 mb-3 hover:opacity-80 transition-all duration-300 group">
            <span className="text-primary group-hover:drop-shadow-[0_0_8px_rgba(0,255,136,0.3)] transition-all duration-500">GEAR</span>
            <span className="text-white">LAB</span>
          </Link>
          <h1 className="font-orbitron text-xl font-bold text-white tracking-tight mb-1.5">Create Account</h1>
          <p className="text-sm text-gray-500">Join the future of vehicle customization.</p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-7 md:p-8 space-y-5">

          {/* Role Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Account Type</label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map(({ value, label, icon, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm({ ...form, role: value })}
                  className={`p-3.5 rounded-xl border text-left transition-all duration-400 group ${
                    form.role === value
                      ? 'bg-primary/[0.06] border-primary/50 shadow-[0_0_20px_rgba(0,255,136,0.08)] scale-[1.01]'
                      : 'bg-black/20 border-white/[0.05] hover:border-white/15 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className={`mb-1.5 transition-colors duration-300 ${form.role === value ? 'text-primary' : 'text-gray-500 group-hover:text-gray-300'}`}>
                    {icon}
                  </div>
                  <p className={`text-xs font-bold uppercase tracking-tight transition-colors duration-300 ${form.role === value ? 'text-primary' : 'text-gray-300'}`}>
                    {label}
                  </p>
                  <p className="text-[10px] text-gray-600 mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
              <input
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-5 text-sm text-white placeholder-gray-600 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all duration-300"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-5 text-sm text-white placeholder-gray-600 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all duration-300"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Min 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-11 text-sm text-white placeholder-gray-600 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="magnetic-btn group w-full py-3.5 bg-primary text-background font-bold uppercase tracking-wider text-xs rounded-xl hover:brightness-110 active:scale-[0.98] transition-all duration-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(0,255,136,0.2)]"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                Create Account <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform duration-300" />
              </>
            )}
          </button>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 pt-2">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}