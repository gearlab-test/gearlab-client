'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  Cog, 
  Star, 
  ArrowRight, 
  Sparkles, 
  Users, 
  Award, 
  Clock, 
  Wrench, 
  Layers,
  CheckCircle2,
  Car,
  Bike
} from 'lucide-react';
import ScrollReveal from './components/ScrollReveal';
import API from '@/lib/api';
import { getFallbackVehicles } from '@/lib/fallbackVehicles';

/* ─── Animated Counter ─── */
interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  duration?: number;
}

function AnimatedCounter({ target, suffix = '', duration = 2000 }: AnimatedCounterProps) {
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
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Feature Card ─── */
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="p-8 rounded-2xl bg-surface border border-border hover:border-primary/20 transition-all group card-glow">
      <div className="mb-5 p-3.5 rounded-xl bg-primary/[0.06] inline-block group-hover:bg-primary/10 transition-colors">
        {icon}
      </div>
      <h3 className="font-orbitron text-lg font-bold mb-2.5 text-white">{title}</h3>
      <p className="text-gray-500 leading-relaxed text-sm">{description}</p>
    </div>
  );
}

/* ─── Step Card ─── */
interface StepCardProps {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

function StepCard({ number, title, description, icon }: StepCardProps) {
  return (
    <div className="relative text-center group">
      <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-surface border border-border group-hover:border-primary/20 flex items-center justify-center text-primary transition-all card-glow">
        {icon}
      </div>
      <div className="absolute -top-2 -right-0.5 w-7 h-7 rounded-full bg-primary text-background flex items-center justify-center text-[10px] font-bold font-orbitron">
        {number}
      </div>
      <h4 className="font-orbitron text-xs font-bold uppercase tracking-tight mb-1.5 text-white">{title}</h4>
      <p className="text-gray-500 text-[13px] leading-relaxed">{description}</p>
    </div>
  );
}

/* ─── Testimonial Card ─── */
interface TestimonialCardProps {
  name: string;
  role: string;
  text: string;
  rating: number;
}

function TestimonialCard({ name, role, text, rating }: TestimonialCardProps) {
  return (
    <div className="p-7 rounded-2xl bg-surface border border-border hover:border-white/[0.08] transition-all card-glow">
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={14} className={i < rating ? 'text-primary fill-primary' : 'text-white/[0.06]'} />
        ))}
      </div>
      <p className="text-gray-400 text-sm leading-relaxed mb-5">&ldquo;{text}&rdquo;</p>
      <div>
        <p className="font-semibold text-white text-sm">{name}</p>
        <p className="text-[11px] text-gray-500 tracking-wide mt-0.5">{role}</p>
      </div>
    </div>
  );
}

/* ─── Featured Vehicle Card ─── */
function VehicleShowcaseCard({ vehicle }: { vehicle: any }) {
  return (
    <div className="group flex-shrink-0 w-[300px] md:w-[340px] bg-surface border border-border rounded-2xl overflow-hidden transition-all hover:border-primary/20 card-glow flex flex-col justify-between">
      <div>
        <div className="aspect-[16/10] overflow-hidden bg-black/30 relative">
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
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-700">
              <Cog size={40} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-70" />
          <div className="absolute top-3.5 left-3.5">
            <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-[10px] font-semibold text-gray-300 uppercase tracking-wider rounded-md border border-white/[0.06]">
              {vehicle.type === 'car' ? 'Car' : 'Bike'}
            </span>
          </div>
        </div>

        <div className="p-5 pb-4">
          <h4 className="font-orbitron text-base font-bold text-white group-hover:text-primary transition-colors mb-1">{vehicle.name}</h4>
          <div className="flex justify-between items-center">
            <p className="text-[11px] text-gray-500 font-medium tracking-wide">Starting from</p>
            <p className="font-orbitron text-sm font-bold text-primary">₹{vehicle.basePrice.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 grid grid-cols-2 gap-2.5 border-t border-border/50 pt-4">
        <Link 
          href={`/configurator/${vehicle._id}?mode=maintenance`}
          className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-white/[0.03] hover:bg-primary/10 hover:text-primary text-gray-400 text-[11px] font-semibold transition-all border border-white/[0.04] hover:border-primary/25"
        >
          <Wrench size={12} className="text-primary/60" />
          Service
        </Link>
        <Link 
          href={`/configurator/${vehicle._id}?mode=customize`}
          className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-primary text-background hover:brightness-110 text-[11px] font-bold uppercase tracking-wide transition-all"
        >
          <Zap size={12} />
          Modify
        </Link>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   HOMEPAGE
   ═══════════════════════════════════════════════════════════════════ */

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
    // Balanced selection of cars and bikes for 'all'
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

      {/* ── Hero Section ── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/images/hero_v2.png")' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/30 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#0a0a0a_75%)] opacity-50" />
          <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-primary/[0.06] rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/[0.05] rounded-full blur-[130px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="animate-fade-in space-y-5">
            <div className="inline-block px-4 py-1.5 rounded-full border border-primary/20 bg-primary/[0.04] text-primary text-[11px] font-semibold uppercase tracking-widest mb-2 backdrop-blur-sm">
              Automotive Engineering & Care
            </div>

            <h1 className="font-orbitron text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-4 uppercase leading-[0.9]">
              Choose Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient-x">
                Experience
              </span>
            </h1>

            <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              Whether you need routine certified maintenance or extreme performance modifications, GearLab provides complete, transparent workshop booking.
            </p>

            {/* Dual Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link 
                href="/category?mode=maintenance" 
                className="w-full sm:w-auto group relative px-7 py-4 bg-white/[0.04] border border-white/[0.08] hover:border-primary/40 text-white rounded-xl overflow-hidden transition-all hover:bg-white/[0.06] active:scale-[0.98] flex items-center justify-center gap-3 backdrop-blur-sm"
              >
                <div className="p-2 rounded-lg bg-primary/[0.08] text-primary group-hover:bg-primary group-hover:text-background transition-colors">
                  <Wrench size={18} />
                </div>
                <div className="text-left">
                  <span className="block text-[10px] text-gray-500 uppercase tracking-wider font-medium">Periodic Care</span>
                  <span className="text-sm font-semibold text-white group-hover:text-primary transition-colors">Regular Maintenance</span>
                </div>
                <ChevronRight size={16} className="text-gray-600 group-hover:translate-x-0.5 group-hover:text-primary transition-all ml-1" />
              </Link>

              <Link 
                href="/category?mode=customize" 
                className="w-full sm:w-auto group relative px-7 py-4 bg-primary text-background font-bold rounded-xl overflow-hidden transition-all hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-3"
              >
                <div className="p-2 rounded-lg bg-background/15 text-background group-hover:bg-background/25 transition-colors">
                  <Zap size={18} />
                </div>
                <div className="text-left">
                  <span className="block text-[10px] text-background/70 uppercase tracking-wider font-bold">Performance & Mods</span>
                  <span className="text-sm font-bold">Vehicle Customization</span>
                </div>
                <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform ml-1" />
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-30">
          <div className="w-px h-10 bg-gradient-to-b from-primary/50 to-transparent" />
        </div>
      </section>

      {/* ── Two Distinct Tracks ── */}
      <section className="py-20 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="text-primary text-[11px] font-semibold uppercase tracking-widest mb-2 block">Choose Your Requirement</span>
              <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-white tracking-tight">
                Two Purpose-Built <span className="text-primary">Tracks</span>
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto mt-3 text-sm">
                Select whether you need standard routine servicing or want to build a fully customized, aftermarket machine.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Track 1: Regular Maintenance */}
            <ScrollReveal variant="fade-up" delay={100}>
              <div className="relative p-8 md:p-10 rounded-2xl bg-surface border border-border hover:border-primary/30 transition-all duration-300 card-glow flex flex-col justify-between h-full group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                  <Wrench size={120} />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 rounded-xl bg-primary/[0.06] border border-primary/15 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                      <Wrench size={28} />
                    </div>
                    <span className="px-3 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      Routine Care
                    </span>
                  </div>

                  <h3 className="font-orbitron text-xl md:text-2xl font-bold text-white mb-2.5">
                    Regular Maintenance
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    Keep your ride performing at peak mechanical safety and efficiency. Comprehensive diagnostic evaluations, fluid replacements, and periodic servicing by vetted multi-brand mechanics.
                  </p>

                  <div className="space-y-3 mb-8">
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Included Services</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        'Complete Multi-Point Diagnostics',
                        'Synthetic Engine Oil & Filter Change',
                        'Brake Pad & Rotor Overhaul',
                        'AC Deep Cleaning & Cabin Sanitization',
                        'Chain Cleaning, Tensioning & Lubing',
                        'Factory Fluid Flushing & Top-up'
                      ].map((service, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[13px] text-gray-400">
                          <CheckCircle2 size={14} className="text-primary/60 flex-shrink-0" />
                          <span>{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Link
                  href="/category?mode=maintenance"
                  className="w-full py-3.5 rounded-xl bg-white/[0.04] hover:bg-primary hover:text-background border border-white/[0.06] hover:border-primary text-white font-semibold text-sm tracking-wide flex items-center justify-center gap-2 transition-all"
                >
                  Book Periodic Maintenance
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>

            {/* Track 2: Customization */}
            <ScrollReveal variant="fade-up" delay={200}>
              <div className="relative p-8 md:p-10 rounded-2xl bg-surface border border-border hover:border-primary/30 transition-all duration-300 card-glow flex flex-col justify-between h-full group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                  <Zap size={120} />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 rounded-xl bg-secondary/[0.06] border border-secondary/15 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                      <Zap size={28} />
                    </div>
                    <span className="px-3 py-1 rounded-md bg-primary/[0.04] border border-primary/15 text-[10px] font-semibold uppercase tracking-wider text-primary">
                      Aftermarket Builds
                    </span>
                  </div>

                  <h3 className="font-orbitron text-xl md:text-2xl font-bold text-white mb-2.5">
                    Parts & Customization
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    Transform your machine with high-performance parts, bespoke aesthetics, and visual upgrades. Tune your exhaust note, apply custom vinyl wraps, and configure aftermarket body kits.
                  </p>

                  <div className="space-y-3 mb-8">
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Included Modifications</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        'Performance Exhausts (Akrapovic, Arrow)',
                        'Matte, Gloss & Custom Color Wraps',
                        'Lightweight Forged & Diamond Cut Alloys',
                        'High-Performance & All-Terrain Tyres',
                        'Aero Trunk Spoilers & Sunroofs',
                        'Bull Bars, Crash Guards & Touring Kits'
                      ].map((mod, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[13px] text-gray-400">
                          <Zap size={13} className="text-primary/60 flex-shrink-0" />
                          <span>{mod}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Link
                  href="/category?mode=customize"
                  className="w-full py-3.5 rounded-xl bg-primary text-background font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all hover:brightness-110"
                >
                  Launch Customization Studio
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* ── Stats Counter Section ── */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 500, suffix: '+', label: 'Builds & Services', icon: <Sparkles size={22} className="text-primary" /> },
              { value: 50, suffix: '+', label: 'Certified Workshops', icon: <Users size={22} className="text-primary" /> },
              { value: 98, suffix: '%', label: 'Customer Satisfaction', icon: <Award size={22} className="text-primary" /> },
              { value: 24, suffix: '/7', label: 'Support & Tracking', icon: <Clock size={22} className="text-primary" /> },
            ].map((stat, i) => (
              <ScrollReveal key={i} variant="fade-up" delay={i * 100}>
                <div className="text-center space-y-2.5">
                  <div className="mx-auto w-12 h-12 rounded-xl bg-primary/[0.05] border border-primary/10 flex items-center justify-center">
                    {stat.icon}
                  </div>
                  <p className="font-orbitron text-2xl md:text-3xl font-bold text-white">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-[11px] text-gray-500 font-medium tracking-wide">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="font-orbitron text-2xl md:text-3xl font-bold mb-3 text-white">Precision Engineering</h2>
              <div className="h-0.5 w-14 bg-primary/50 mx-auto rounded-full" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Zap className="text-primary" size={28} />, title: "Certified Excellence", description: "All maintenance tasks and modifications are carried out by certified partner workshops." },
              { icon: <Cog className="text-primary" size={28} />, title: "Full Custom Control", description: "Configure exhausts, wraps, accessories, and parts with real-time pricing breakdowns." },
              { icon: <ShieldCheck className="text-primary" size={28} />, title: "Guaranteed Fitment", description: "Every aftermarket component and maintenance fluid meets exact OEM specifications." },
            ].map((feature, i) => (
              <ScrollReveal key={i} variant="fade-up" delay={i * 120}>
                <FeatureCard {...feature} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Vehicles Showcase ── */}
      {displayedVehicles.length > 0 && (
        <section className="py-20 px-6 border-t border-border/50">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
                <div>
                  <h2 className="font-orbitron text-2xl md:text-3xl font-bold mb-1.5 text-white">Featured <span className="text-primary">Fleet</span></h2>
                  <p className="text-gray-500 text-sm">Select any model to book routine maintenance or start modifying.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Fleet Type Switcher */}
                  <div className="flex p-0.5 bg-surface border border-border rounded-lg">
                    {[
                      { key: 'all', label: 'All', icon: <Layers size={12} /> },
                      { key: 'car', label: 'Cars', icon: <Car size={12} /> },
                      { key: 'bike', label: 'Bikes', icon: <Bike size={12} /> },
                    ].map(({ key, label, icon }) => (
                      <button
                        key={key}
                        onClick={() => setFleetType(key as any)}
                        className={`px-3 py-1.5 rounded-md text-[11px] font-semibold tracking-wide flex items-center gap-1.5 transition-all ${
                          fleetType === key ? 'bg-primary text-background' : 'text-gray-500 hover:text-white'
                        }`}
                      >
                        {icon} {label}
                      </button>
                    ))}
                  </div>

                  <Link 
                    href={fleetType === 'all' ? '/vehicles' : `/vehicles?type=${fleetType}`} 
                    className="hidden md:flex items-center gap-1.5 text-primary font-semibold text-sm hover:gap-2 transition-all"
                  >
                    View All {fleetType === 'car' ? 'Cars' : fleetType === 'bike' ? 'Bikes' : 'Models'} <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 snap-x snap-mandatory">
              {displayedVehicles.map((v) => (
                <ScrollReveal key={v._id} variant="fade-up">
                  <div className="snap-start">
                    <VehicleShowcaseCard vehicle={v} />
                  </div>
                </ScrollReveal>
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

      {/* ── How It Works ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="font-orbitron text-2xl md:text-3xl font-bold mb-3 text-white">How It <span className="text-primary">Works</span></h2>
              <p className="text-gray-500 max-w-md mx-auto text-sm">Simple, transparent, four-step booking workflow.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            {[
              { number: '01', title: 'Choose Track', description: 'Pick Regular Maintenance or Custom Mods.', icon: <Layers size={24} /> },
              { number: '02', title: 'Select Vehicle', description: 'Choose your exact bike or car model.', icon: <Sparkles size={24} /> },
              { number: '03', title: 'Configure', description: 'Add services or performance upgrades.', icon: <Cog size={24} /> },
              { number: '04', title: 'Book Workshop', description: 'Schedule with an approved specialist.', icon: <Clock size={24} /> },
            ].map((step, i) => (
              <ScrollReveal key={i} variant="scale-in" delay={i * 120}>
                <StepCard {...step} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="font-orbitron text-2xl md:text-3xl font-bold mb-3 text-white">What Riders <span className="text-primary">Say</span></h2>
              <p className="text-gray-500 max-w-md mx-auto text-sm">Trusted by hundreds of car and bike enthusiasts across the country.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Arjun Reddy', role: 'KTM Duke 390 Owner', rating: 5, text: 'The customizer is insanely detailed. Got an Akrapovic exhaust and ceramic coating — the workshop did a flawless job. Sounds and looks like a beast.' },
              { name: 'Priya Sharma', role: 'Hyundai Creta Owner', rating: 5, text: 'I only needed scheduled periodic maintenance and synthetic oil service. Booked through the Maintenance track, dropped off the car, and got it back spotless.' },
              { name: 'Vikram Joshi', role: 'Royal Enfield Meteor Owner', rating: 5, text: 'Great division between standard service and custom parts. I added touring saddlebags and had a full health check completed in a single workshop visit.' },
            ].map((testimonial, i) => (
              <ScrollReveal key={i} variant="fade-up" delay={i * 120}>
                <TestimonialCard {...testimonial} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-6">
        <ScrollReveal variant="scale-in">
          <div className="max-w-4xl mx-auto relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/[0.06] via-surface to-secondary/[0.04] border border-white/[0.06] p-10 md:p-16 text-center">
            <div className="absolute top-0 left-1/4 w-48 h-48 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-secondary/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10">
              <h2 className="font-orbitron text-2xl md:text-4xl font-bold text-white tracking-tight mb-3">
                Ready to Upgrade Your <span className="text-primary">Vehicle</span>?
              </h2>
              <p className="text-gray-500 text-base max-w-lg mx-auto mb-8">
                Book scheduled service or start engineering your dream build today.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/category?mode=maintenance" className="px-7 py-3.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-primary/30 text-white font-semibold text-sm rounded-xl transition-all flex items-center gap-2">
                  <Wrench size={15} className="text-primary/70" /> Book Maintenance
                </Link>
                <Link href="/category?mode=customize" className="px-7 py-3.5 bg-primary text-background font-bold text-sm rounded-xl hover:brightness-110 transition-all flex items-center gap-2">
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