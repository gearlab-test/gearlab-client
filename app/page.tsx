'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, ShieldCheck, Zap, Cog, Star, ArrowRight, Sparkles, 
  Users, Award, Clock, Wrench, Layers, CheckCircle2, Car, Bike, ChevronDown
} from 'lucide-react';
import ScrollReveal from './components/ScrollReveal';
import API from '@/lib/api';
import { getFallbackVehicles } from '@/lib/fallbackVehicles';

/* ─── Fast Hero Background ─── */
function ParallaxHero() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Dark mode background: moody cyberpunk garage with smooth 700ms crossfade */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ease-in-out dark:opacity-100 opacity-0"
        style={{ backgroundImage: 'url("/images/hero_v2.png")' }}
      />
      {/* Light mode background: luminous luxury hypercar showroom with smooth 700ms crossfade */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ease-in-out dark:opacity-0 opacity-100"
        style={{ backgroundImage: 'url("/images/hero_light.jpg")' }}
      />

      {/* Dark mode gradient overlays with smooth crossfade */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/20 to-background transition-opacity duration-700 ease-in-out dark:opacity-100 opacity-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_var(--background)_70%)] transition-opacity duration-700 ease-in-out dark:opacity-60 opacity-0" />

      {/* Light mode gentle overlays: clean feather into navbar and bottom into page without obscuring vehicles */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-[#f8fafc] transition-opacity duration-700 ease-in-out dark:opacity-0 opacity-100" />

      {/* GPU Texture Orbs */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] glow-orb-primary rounded-full pointer-events-none transition-opacity duration-700" />
      <div className="absolute bottom-1/4 right-1/5 w-[400px] h-[400px] glow-orb-secondary rounded-full pointer-events-none transition-opacity duration-700" />
    </div>
  );
}

/* ─── Fast Animated Counter ─── */
function AnimatedCounter({ target, suffix = '', duration = 1200 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          tick();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Zero-Lag Feature Card with Multi-Color Support ─── */
function FeatureCard({ icon, title, description, colorClass = 'text-primary bg-primary/[0.05] border-primary/20' }: { icon: React.ReactNode; title: string; description: string; colorClass?: string }) {
  return (
    <div className="relative p-8 rounded-2xl bg-surface border border-border hover:border-primary/30 transition-all duration-300 group card-glow overflow-hidden">
      <div className="relative z-10">
        <div className={`mb-5 p-4 rounded-xl inline-flex border transition-transform duration-300 group-hover:scale-110 ${colorClass}`}>
          {icon}
        </div>
        <h3 className="font-orbitron text-lg font-bold mb-2.5 text-white group-hover:text-primary transition-colors duration-200">{title}</h3>
        <p className="text-gray-500 leading-relaxed text-sm">{description}</p>
      </div>
    </div>
  );
}

/* ─── Step Card with Multi-Color Accent ─── */
function StepCard({ number, title, description, icon, color = 'emerald' }: { number: string; title: string; description: string; icon: React.ReactNode; color?: string }) {
  const colorMap: Record<string, { badge: string; icon: string; border: string }> = {
    emerald: { badge: 'bg-emerald-500 text-black shadow-emerald-500/30', icon: 'text-emerald-500', border: 'group-hover:border-emerald-500/40 group-hover:shadow-emerald-500/10' },
    sky: { badge: 'bg-sky-500 text-white shadow-sky-500/30', icon: 'text-sky-500', border: 'group-hover:border-sky-500/40 group-hover:shadow-sky-500/10' },
    purple: { badge: 'bg-purple-500 text-white shadow-purple-500/30', icon: 'text-purple-500', border: 'group-hover:border-purple-500/40 group-hover:shadow-purple-500/10' },
    amber: { badge: 'bg-amber-500 text-black shadow-amber-500/30', icon: 'text-amber-500', border: 'group-hover:border-amber-500/40 group-hover:shadow-amber-500/10' },
  };
  const c = colorMap[color] || colorMap.emerald;

  return (
    <div className="relative text-center group">
      <div className={`mx-auto mb-5 w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center transition-all duration-300 card-glow shadow-sm ${c.border} ${c.icon}`}>
        {icon}
      </div>
      <div className={`absolute -top-2 -right-0.5 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold font-orbitron shadow-lg ${c.badge}`}>
        {number}
      </div>
      <h4 className="font-orbitron text-xs font-bold uppercase tracking-tight mb-1.5 text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-200">{title}</h4>
      <p className="text-slate-500 dark:text-gray-500 text-[13px] leading-relaxed">{description}</p>
    </div>
  );
}

/* ─── Testimonial Card ─── */
function TestimonialCard({ name, role, text, rating }: { name: string; role: string; text: string; rating: number }) {
  return (
    <div className="p-7 rounded-2xl bg-surface border border-border hover:border-slate-300 dark:hover:border-white/[0.08] transition-colors duration-200 card-glow group shadow-sm">
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={14} className={i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 dark:text-white/[0.06]'} />
        ))}
      </div>
      <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed mb-5 italic">&ldquo;{text}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-500/10 dark:bg-primary/10 border border-emerald-500/20 dark:border-primary/20 flex items-center justify-center text-emerald-600 dark:text-primary font-orbitron text-xs font-bold">
          {name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-white text-sm">{name}</p>
          <p className="text-[11px] text-slate-500 dark:text-gray-500 tracking-wide">{role}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Featured Vehicle Card ─── */
function VehicleShowcaseCard({ vehicle }: { vehicle: any }) {
  return (
    <div className="group flex-shrink-0 w-[300px] md:w-[340px] bg-surface border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/40 card-glow flex flex-col justify-between shadow-sm">
      <div>
        <div className="aspect-[16/10] overflow-hidden bg-slate-900 relative">
          {vehicle.images?.[0] ? (
            <img 
              src={vehicle.images[0]} 
              alt={vehicle.name}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).onerror = null;
                (e.currentTarget as HTMLImageElement).src = vehicle.type === 'bike'
                  ? 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800'
                  : 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800';
              }}
              className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-700">
              <Cog size={40} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
          <div className="absolute top-3.5 left-3.5">
            <span className="px-2.5 py-1 bg-black/75 backdrop-blur-sm text-[10px] font-semibold text-white uppercase tracking-wider rounded-md border border-white/20">
              {vehicle.type === 'car' ? 'Car' : 'Bike'}
            </span>
          </div>
        </div>

        <div className="p-5 pb-4">
          <h4 className="font-orbitron text-base font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-200 mb-1">{vehicle.name}</h4>
          <div className="flex justify-between items-center">
            <p className="text-[11px] text-slate-500 dark:text-gray-500 font-medium tracking-wide">Starting from</p>
            <p className="font-orbitron text-sm font-bold text-emerald-600 dark:text-primary">&nbsp;₹{vehicle.basePrice.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 grid grid-cols-2 gap-2.5 border-t border-slate-200 dark:border-border/50 pt-4">
        <Link 
          href={`/configurator/${vehicle._id}?mode=maintenance`}
          className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-slate-100 hover:bg-sky-50 dark:bg-white/[0.04] dark:hover:bg-primary/10 hover:text-sky-600 dark:hover:text-primary text-slate-700 dark:text-gray-400 text-[11px] font-semibold transition-colors duration-200 border border-slate-200 dark:border-white/[0.06] hover:border-sky-400 dark:hover:border-primary/25 magnetic-btn"
        >
          <Wrench size={12} className="text-sky-500 dark:text-primary/60" />
          Service
        </Link>
        <Link 
          href={`/configurator/${vehicle._id}?mode=customize`}
          className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 dark:bg-primary text-white dark:text-background text-[11px] font-bold uppercase tracking-wide transition-colors duration-200 magnetic-btn shadow-sm"
        >
          <Zap size={12} />
          Modify
        </Link>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [allVehicles, setAllVehicles] = useState<any[]>([]);
  const [fleetType, setFleetType] = useState<'all' | 'car' | 'bike'>('all');

  useEffect(() => {
    API.get('/vehicles')
      .then(r => {
        if (Array.isArray(r.data) && r.data.length > 0) {
          setAllVehicles(r.data);
        } else {
          setAllVehicles(getFallbackVehicles());
        }
      })
      .catch(() => {
        setAllVehicles(getFallbackVehicles());
      });
  }, []);

  const displayedVehicles = (() => {
    if (fleetType === 'car') {
      return allVehicles.filter(v => v.type === 'car').slice(0, 8);
    }
    if (fleetType === 'bike') {
      return allVehicles.filter(v => v.type === 'bike').slice(0, 8);
    }
    const cars = allVehicles.filter(v => v.type === 'car').slice(0, 4);
    const bikes = allVehicles.filter(v => v.type === 'bike').slice(0, 4);
    const interleaved: any[] = [];
    const max = Math.max(cars.length, bikes.length);
    for (let i = 0; i < max; i++) {
      if (cars[i]) interleaved.push(cars[i]);
      if (bikes[i]) interleaved.push(bikes[i]);
    }
    return interleaved.length > 0 ? interleaved : allVehicles.slice(0, 8);
  })();

  return (
    <div className="flex flex-col">

      {/* ━━━ HERO ━━━ */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-10 md:py-16">
        <ParallaxHero />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="animate-hero-reveal space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 dark:border-primary/20 bg-white/80 dark:bg-primary/[0.04] text-emerald-800 dark:text-primary text-[11px] font-semibold uppercase tracking-widest backdrop-blur-md shadow-sm">
              <Sparkles size={13} />
              Automotive Engineering & Care
            </div>

            <h1 className="font-orbitron text-4xl sm:text-6xl md:text-7xl lg:text-[5.4rem] font-black tracking-tighter text-slate-900 dark:text-white mb-3 uppercase leading-[0.9] drop-shadow-sm dark:drop-shadow-none">
              Choose Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-sky-600 to-emerald-600 dark:from-primary dark:via-secondary dark:to-primary inline-block">
                Experience
              </span>
            </h1>

            <p className="text-base md:text-lg text-slate-800 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed font-medium bg-white/60 dark:bg-transparent backdrop-blur-md px-6 py-2.5 rounded-2xl border border-white/80 dark:border-transparent shadow-sm dark:shadow-none">
              Whether you need routine certified maintenance or extreme performance modifications, GearLab provides complete, transparent workshop booking.
            </p>

            {/* Dual Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link 
                href="/category?mode=maintenance" 
                className="w-full sm:w-auto group relative px-7 py-4 bg-white/95 hover:bg-white dark:bg-surface border border-slate-300/90 hover:border-sky-500 dark:border-sky-500/20 dark:hover:border-sky-500/60 text-slate-900 dark:text-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/15 flex items-center justify-center gap-3 magnetic-btn shadow-md backdrop-blur-md"
              >
                <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-colors duration-200">
                  <Wrench size={18} />
                </div>
                <div className="text-left">
                  <span className="block text-[10px] text-slate-500 dark:text-gray-500 uppercase tracking-wider font-semibold">Periodic Care</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-500 transition-colors duration-200">Regular Maintenance</span>
                </div>
                <ChevronRight size={16} className="text-slate-400 dark:text-gray-500 group-hover:translate-x-1 group-hover:text-sky-600 dark:group-hover:text-sky-500 transition-transform duration-200 ml-1" />
              </Link>

              <Link 
                href="/category?mode=customize" 
                className="w-full sm:w-auto group relative px-7 py-4 bg-gradient-to-r from-emerald-500 to-emerald-400 dark:from-primary dark:to-primary text-black font-extrabold rounded-xl overflow-hidden transition-all duration-300 hover:brightness-110 flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/25 magnetic-btn border border-emerald-400/40"
              >
                <div className="p-2.5 rounded-lg bg-black/15 text-black">
                  <Zap size={18} />
                </div>
                <div className="text-left">
                  <span className="block text-[10px] text-black/75 uppercase tracking-wider font-bold">Performance & Mods</span>
                  <span className="text-sm font-extrabold text-black">Vehicle Customization</span>
                </div>
                <ChevronRight size={16} className="text-black group-hover:translate-x-1 transition-transform duration-200 ml-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-60">
          <span className="text-[9px] uppercase tracking-[0.3em] text-slate-600 dark:text-gray-500 font-semibold">Scroll</span>
          <ChevronDown size={14} className="text-emerald-600 dark:text-primary animate-scroll-down" />
        </div>
      </section>

      {/* ━━━ TWO TRACKS ━━━ */}
      <section className="py-20 px-6 relative">
        <div className="absolute inset-0 gradient-mesh pointer-events-none opacity-40" />
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="text-primary text-[11px] font-semibold uppercase tracking-[0.2em] mb-2 block">Choose Your Requirement</span>
              <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-white tracking-tight">
                Two Purpose-Built <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Tracks</span>
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto mt-2 text-sm leading-relaxed">
                Select whether you need standard routine servicing or want to build a fully customized, aftermarket machine.
              </p>
              <div className="h-0.5 w-16 bg-primary/30 mx-auto mt-5" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Track 1: Maintenance */}
            <ScrollReveal delay={50}>
              <div className="relative p-8 md:p-10 rounded-2xl bg-surface border border-border hover:border-sky-500/40 transition-all duration-300 card-glow flex flex-col justify-between h-full group overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-500 group-hover:bg-sky-500/20 transition-colors duration-200">
                      <Wrench size={28} />
                    </div>
                    <span className="px-3 py-1 rounded-md bg-sky-500/10 border border-sky-500/20 text-[10px] font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                      Routine Care
                    </span>
                  </div>

                  <h3 className="font-orbitron text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-sky-500 transition-colors duration-200">
                    Regular Maintenance
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    Keep your ride performing at peak mechanical safety and efficiency. Comprehensive diagnostic evaluations, fluid replacements, and periodic servicing.
                  </p>

                  <div className="space-y-3 mb-8">
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Included Services</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        'Complete Multi-Point Diagnostics',
                        'Synthetic Engine Oil & Filter Change',
                        'Brake Pad & Rotor Overhaul',
                        'AC Deep Cleaning & Sanitization',
                        'Chain Cleaning & Tensioning',
                        'Factory Fluid Flushing & Top-up'
                      ].map((service, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[13px] text-gray-500 dark:text-gray-400">
                          <CheckCircle2 size={14} className="text-sky-500 flex-shrink-0" />
                          <span>{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Link
                  href="/category?mode=maintenance"
                  className="relative z-10 w-full py-3.5 rounded-xl bg-sky-500/10 hover:bg-sky-500 hover:text-white border border-sky-500/25 hover:border-sky-500 text-sky-600 dark:text-sky-300 font-semibold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-sky-500/20 magnetic-btn"
                >
                  Book Periodic Maintenance
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </ScrollReveal>

            {/* Track 2: Customization */}
            <ScrollReveal delay={100}>
              <div className="relative p-8 md:p-10 rounded-2xl bg-surface border border-border hover:border-emerald-500/40 transition-all duration-300 card-glow flex flex-col justify-between h-full group overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500/20 transition-colors duration-200">
                      <Zap size={28} />
                    </div>
                    <span className="px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Aftermarket Builds
                    </span>
                  </div>

                  <h3 className="font-orbitron text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-emerald-500 transition-colors duration-200">
                    Parts & Customization
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    Transform your machine with high-performance parts, bespoke aesthetics, and visual upgrades. Exhaust tuning, custom wraps, and aftermarket body kits.
                  </p>

                  <div className="space-y-3 mb-8">
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Included Modifications</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        'Performance Exhausts (Akrapovic)',
                        'Matte, Gloss & Custom Wraps',
                        'Lightweight Forged Alloys',
                        'High-Performance Tyres',
                        'Aero Spoilers & Sunroofs',
                        'Crash Guards & Touring Kits'
                      ].map((mod, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[13px] text-gray-500 dark:text-gray-400">
                          <Zap size={13} className="text-emerald-500 flex-shrink-0" />
                          <span>{mod}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Link
                  href="/category?mode=customize"
                  className="relative z-10 w-full py-3.5 rounded-xl bg-primary text-black font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-300 hover:brightness-110 shadow-lg shadow-emerald-500/25 magnetic-btn"
                >
                  Launch Customization Studio
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ━━━ STATS ━━━ */}
      <section className="py-16 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: 500, suffix: '+', label: 'Builds & Services', icon: <Sparkles size={22} className="text-emerald-500" />, border: 'border-emerald-500/20 bg-emerald-500/10' },
              { value: 50, suffix: '+', label: 'Certified Workshops', icon: <Users size={22} className="text-sky-500" />, border: 'border-sky-500/20 bg-sky-500/10' },
              { value: 98, suffix: '%', label: 'Customer Satisfaction', icon: <Award size={22} className="text-amber-500" />, border: 'border-amber-500/20 bg-amber-500/10' },
              { value: 24, suffix: '/7', label: 'Support & Tracking', icon: <Clock size={22} className="text-purple-500" />, border: 'border-purple-500/20 bg-purple-500/10' },
            ].map((stat, i) => (
              <ScrollReveal key={i} delay={i * 40}>
                <div className="text-center space-y-2 group">
                  <div className={`mx-auto w-12 h-12 rounded-xl border flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${stat.border}`}>
                    {stat.icon}
                  </div>
                  <p className="font-orbitron text-3xl md:text-4xl font-bold text-white tracking-tight">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-[11px] text-gray-500 font-semibold tracking-wider uppercase">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ FEATURES ━━━ */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="font-orbitron text-2xl md:text-3xl font-bold mb-2 text-white">Precision <span className="text-primary">Engineering</span></h2>
              <div className="h-0.5 w-16 bg-primary/30 mx-auto rounded-full" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Zap size={26} />, title: "Certified Excellence", description: "All maintenance tasks and modifications are carried out by certified partner workshops with verified credentials.", colorClass: "text-emerald-500 bg-emerald-500/10 border-emerald-500/25" },
              { icon: <Cog size={26} />, title: "Full Custom Control", description: "Configure exhausts, wraps, accessories, and parts with real-time pricing breakdowns and visual previews.", colorClass: "text-sky-500 bg-sky-500/10 border-sky-500/25" },
              { icon: <ShieldCheck size={26} />, title: "Guaranteed Fitment", description: "Every aftermarket component and maintenance fluid meets exact OEM specifications for your vehicle.", colorClass: "text-purple-500 bg-purple-500/10 border-purple-500/25" },
            ].map((feature, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <FeatureCard {...feature} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ FEATURED FLEET ━━━ */}
      {displayedVehicles.length > 0 && (
        <section className="py-20 px-6 relative">
          <div className="max-w-7xl mx-auto relative z-10">
            <ScrollReveal>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
                <div>
                  <h2 className="font-orbitron text-2xl md:text-3xl font-bold mb-1 text-white">Featured <span className="text-primary">Fleet</span></h2>
                  <p className="text-gray-500 text-sm">Select any model to book routine maintenance or start modifying.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex p-0.5 bg-surface border border-border rounded-lg">
                    {[
                      { key: 'all', label: 'All', icon: <Layers size={12} /> },
                      { key: 'car', label: 'Cars', icon: <Car size={12} /> },
                      { key: 'bike', label: 'Bikes', icon: <Bike size={12} /> },
                    ].map(({ key, label, icon }) => (
                      <button
                        key={key}
                        onClick={() => setFleetType(key as any)}
                        className={`px-3.5 py-1.5 rounded-md text-[11px] font-semibold tracking-wide flex items-center gap-1.5 transition-colors duration-150 ${
                          fleetType === key ? 'bg-primary text-background' : 'text-gray-500 hover:text-white'
                        }`}
                      >
                        {icon} {label}
                      </button>
                    ))}
                  </div>

                  <Link 
                    href={fleetType === 'all' ? '/vehicles' : `/vehicles?type=${fleetType}`} 
                    className="hidden md:flex items-center gap-1.5 text-primary font-semibold text-sm hover:gap-2 transition-all duration-200 group"
                  >
                    View All {fleetType === 'car' ? 'Cars' : fleetType === 'bike' ? 'Bikes' : 'Models'} 
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Zero-Lag Carousel (No per-card ScrollReveal) */}
            <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 snap-x snap-mandatory">
              {displayedVehicles.map((v) => (
                <div key={v._id} className="snap-start flex-shrink-0">
                  <VehicleShowcaseCard vehicle={v} />
                </div>
              ))}
            </div>

            <Link 
              href={fleetType === 'all' ? '/vehicles' : `/vehicles?type=${fleetType}`} 
              className="mt-6 md:hidden flex items-center justify-center gap-1.5 text-primary font-semibold text-sm"
            >
              View All {fleetType === 'car' ? 'Cars' : fleetType === 'bike' ? 'Bikes' : 'Vehicles'} <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      )}

      {/* ━━━ HOW IT WORKS ━━━ */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="font-orbitron text-2xl md:text-3xl font-bold mb-2 text-white">How It <span className="text-primary">Works</span></h2>
              <p className="text-gray-500 max-w-md mx-auto text-sm">Simple, transparent, four-step booking workflow.</p>
              <div className="h-0.5 w-16 bg-primary/30 mx-auto mt-4" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            {[
              { number: '01', title: 'Choose Track', description: 'Pick Regular Maintenance or Custom Mods.', icon: <Layers size={22} />, color: 'sky' },
              { number: '02', title: 'Select Vehicle', description: 'Choose your exact bike or car model.', icon: <Sparkles size={22} />, color: 'emerald' },
              { number: '03', title: 'Configure', description: 'Add services or performance upgrades.', icon: <Cog size={22} />, color: 'purple' },
              { number: '04', title: 'Book Workshop', description: 'Schedule with an approved specialist.', icon: <Clock size={22} />, color: 'amber' },
            ].map((step, i) => (
              <ScrollReveal key={i} delay={i * 50}>
                <StepCard {...step} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ TESTIMONIALS ━━━ */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="font-orbitron text-2xl md:text-3xl font-bold mb-2 text-white">What Riders <span className="text-primary">Say</span></h2>
              <p className="text-gray-500 max-w-md mx-auto text-sm">Trusted by hundreds of car and bike enthusiasts across the country.</p>
              <div className="h-0.5 w-16 bg-primary/30 mx-auto mt-4" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Arjun Reddy', role: 'KTM Duke 390 Owner', rating: 5, text: 'The customizer is insanely detailed. Got an Akrapovic exhaust and ceramic coating — the workshop did a flawless job. Sounds and looks like a beast.' },
              { name: 'Priya Sharma', role: 'Hyundai Creta Owner', rating: 5, text: 'I only needed scheduled periodic maintenance and synthetic oil service. Booked through the Maintenance track, dropped off the car, and got it back spotless.' },
              { name: 'Vikram Joshi', role: 'Royal Enfield Meteor Owner', rating: 5, text: 'Great division between standard service and custom parts. I added touring saddlebags and had a full health check completed in a single workshop visit.' },
            ].map((testimonial, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <TestimonialCard {...testimonial} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ CTA BANNER ━━━ */}
      <section className="py-20 px-6">
        <ScrollReveal>
          <div className="max-w-4xl mx-auto relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 via-surface to-sky-500/10 dark:from-primary/[0.05] dark:via-surface dark:to-secondary/[0.03] border border-slate-200 dark:border-white/[0.05] p-10 md:p-14 text-center shadow-lg dark:shadow-none">
            <div className="relative z-10">
              <h2 className="font-orbitron text-2xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                Ready to Upgrade Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-sky-600 dark:from-primary dark:to-secondary">Vehicle</span>?
              </h2>
              <p className="text-slate-600 dark:text-gray-400 text-base max-w-lg mx-auto mb-8 leading-relaxed">
                Book scheduled service or start engineering your dream build today.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/category?mode=maintenance" className="px-7 py-3.5 bg-white dark:bg-white/[0.04] hover:bg-slate-50 dark:hover:bg-white/[0.08] border border-slate-300 dark:border-white/[0.06] hover:border-sky-500 dark:hover:border-primary/25 text-slate-900 dark:text-white font-semibold text-sm rounded-xl transition-all duration-200 flex items-center gap-2 magnetic-btn shadow-sm">
                  <Wrench size={15} className="text-sky-500 dark:text-primary/60" /> Book Maintenance
                </Link>
                <Link href="/category?mode=customize" className="px-7 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-400 dark:from-primary dark:to-primary text-black font-bold text-sm rounded-xl transition-all duration-200 hover:brightness-110 flex items-center gap-2 magnetic-btn shadow-md shadow-emerald-500/20">
                  <Zap size={15} /> Start Customizing <ChevronRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}