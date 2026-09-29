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
    <div className="p-8 rounded-3xl bg-surface border border-border hover:border-primary/30 transition-all group card-glow">
      <div className="mb-6 p-4 rounded-2xl bg-primary/5 inline-block group-hover:bg-primary/10 transition-colors">
        {icon}
      </div>
      <h3 className="font-orbitron text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed font-light">{description}</p>
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
      <div className="mx-auto mb-6 w-20 h-20 rounded-3xl bg-surface border border-border group-hover:border-primary/30 flex items-center justify-center text-primary transition-all card-glow">
        {icon}
      </div>
      <div className="absolute -top-3 -right-1 w-8 h-8 rounded-full bg-primary text-background flex items-center justify-center text-xs font-black font-orbitron">
        {number}
      </div>
      <h4 className="font-orbitron text-sm font-bold uppercase tracking-tight mb-2">{title}</h4>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
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
    <div className="p-8 rounded-3xl bg-surface border border-border hover:border-primary/20 transition-all card-glow">
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={16} className={i < rating ? 'text-primary fill-primary' : 'text-gray-700'} />
        ))}
      </div>
      <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">&ldquo;{text}&rdquo;</p>
      <div>
        <p className="font-bold text-white text-sm">{name}</p>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{role}</p>
      </div>
    </div>
  );
}

/* ─── Featured Vehicle Card ─── */
function VehicleShowcaseCard({ vehicle }: { vehicle: any }) {
  return (
    <div className="group flex-shrink-0 w-[320px] md:w-[360px] bg-surface border border-border rounded-3xl overflow-hidden transition-all hover:border-primary/30 card-glow flex flex-col justify-between">
      <div>
        <div className="aspect-video overflow-hidden bg-black/40 relative">
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
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-700">
              <Cog size={48} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-60"></div>
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-[10px] font-bold text-primary uppercase tracking-widest rounded-full border border-primary/20">
              {vehicle.type === 'car' ? '🚗 Car' : '🏍️ Bike'}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h4 className="font-orbitron text-lg font-bold text-white group-hover:text-primary transition-colors mb-1">{vehicle.name}</h4>
          <div className="flex justify-between items-center mb-6">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Base Rate</p>
            <p className="font-orbitron text-sm font-bold text-primary">₹{vehicle.basePrice.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="p-6 pt-0 grid grid-cols-2 gap-3 border-t border-border/50">
        <Link 
          href={`/configurator/${vehicle._id}?mode=maintenance`}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-primary/20 hover:text-primary text-gray-300 text-xs font-bold transition-all border border-white/5 hover:border-primary/40 text-center"
        >
          <Wrench size={13} className="text-primary" />
          <span>Service</span>
        </Link>
        <Link 
          href={`/configurator/${vehicle._id}?mode=customize`}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-primary text-background hover:brightness-110 text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,255,136,0.2)] text-center"
        >
          <Zap size={13} />
          <span>Modify</span>
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
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s] hover:scale-110"
          style={{ backgroundImage: 'url("/images/hero_v2.png")' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#0a0a0a_80%)] opacity-60"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="animate-fade-in space-y-6">
            <div className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-bold uppercase tracking-[0.3em] mb-4 backdrop-blur-md">
              Automotive Engineering & Care
            </div>

            <h1 className="font-orbitron text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white mb-6 uppercase leading-[0.85] animate-floating">
              Choose Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient-x neon-glow">
                Experience
              </span>
            </h1>

            <p className="text-lg md:text-2xl text-gray-200 max-w-3xl mx-auto mb-10 leading-relaxed font-light drop-shadow-lg">
              Whether you need routine certified maintenance or extreme performance modifications, GearLab provides complete, transparent workshop booking.
            </p>

            {/* Direct Dual Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
              <Link 
                href="/category?mode=maintenance" 
                className="w-full sm:w-auto group relative px-8 py-5 bg-surface border border-primary/40 hover:border-primary text-white font-bold text-base md:text-lg rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] active:scale-95 flex items-center justify-center gap-3 backdrop-blur-md"
              >
                <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-background transition-colors">
                  <Wrench size={20} />
                </div>
                <div className="text-left">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Periodic Care</span>
                  <span className="text-white group-hover:text-primary transition-colors">Regular Maintenance</span>
                </div>
                <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 group-hover:text-primary transition-all ml-1" />
              </Link>

              <Link 
                href="/category?mode=customize" 
                className="w-full sm:w-auto group relative px-8 py-5 bg-primary text-background font-black text-base md:text-lg rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_35px_rgba(0,255,136,0.5)] active:scale-95 flex items-center justify-center gap-3"
              >
                <div className="p-2 rounded-full bg-background/20 text-background group-hover:bg-background group-hover:text-primary transition-colors">
                  <Zap size={20} />
                </div>
                <div className="text-left">
                  <span className="block text-[10px] text-background/80 uppercase tracking-widest font-black">Performance & Mods</span>
                  <span>Vehicle Customization</span>
                </div>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform ml-1" />
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <div className="w-1 h-12 rounded-full bg-gradient-to-b from-primary to-transparent"></div>
        </div>
      </section>

      {/* ── Two Distinct Paths (Maintenance vs Customize) ── */}
      <section className="py-20 px-6 border-y border-border bg-gradient-to-b from-surface/20 to-background">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="text-primary text-xs font-black uppercase tracking-[0.25em] mb-2 block">Choose Your Requirement</span>
              <h2 className="font-orbitron text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
                Two Purpose-Built <span className="text-primary neon-glow">Tracks</span>
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto mt-3 text-sm md:text-base">
                Select whether you need standard routine servicing or want to build a fully customized, aftermarket machine.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Track 1: Regular Maintenance */}
            <ScrollReveal variant="fade-up" delay={100}>
              <div className="relative p-8 md:p-10 rounded-[2.5rem] bg-surface border border-border hover:border-primary/50 transition-all duration-300 card-glow flex flex-col justify-between h-full group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Wrench size={140} />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Wrench size={32} />
                    </div>
                    <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-primary">
                      Routine Care
                    </span>
                  </div>

                  <h3 className="font-orbitron text-2xl md:text-3xl font-bold text-white mb-3">
                    Regular Maintenance
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 font-light">
                    Keep your ride performing at peak mechanical safety and efficiency. Comprehensive diagnostic evaluations, fluid replacements, and periodic servicing by vetted multi-brand mechanics.
                  </p>

                  <div className="space-y-3 mb-8">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Included Services:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        'Complete Multi-Point Diagnostics',
                        'Synthetic Engine Oil & Filter Change',
                        'Brake Pad & Rotor Overhaul',
                        'AC Deep Cleaning & Cabin Sanitization',
                        'Chain Cleaning, Tensioning & Lubing',
                        'Factory Fluid Flushing & Top-up'
                      ].map((service, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                          <CheckCircle2 size={15} className="text-primary flex-shrink-0" />
                          <span>{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Link
                  href="/category?mode=maintenance"
                  className="w-full py-4 rounded-2xl bg-surface-hover hover:bg-primary hover:text-background border border-border group-hover:border-primary/50 text-white font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <span>Book Periodic Maintenance</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>

            {/* Track 2: Customization & Mods */}
            <ScrollReveal variant="fade-up" delay={200}>
              <div className="relative p-8 md:p-10 rounded-[2.5rem] bg-surface border border-border hover:border-primary/50 transition-all duration-300 card-glow flex flex-col justify-between h-full group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Zap size={140} />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Zap size={32} />
                    </div>
                    <span className="px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary">
                      Aftermarket Builds
                    </span>
                  </div>

                  <h3 className="font-orbitron text-2xl md:text-3xl font-bold text-white mb-3">
                    Parts & Customization
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 font-light">
                    Transform your machine with high-performance parts, bespoke aesthetics, and visual upgrades. Tune your exhaust note, apply custom vinyl wraps, and configure aftermarket body kits.
                  </p>

                  <div className="space-y-3 mb-8">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Included Modifications:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        'Performance Exhausts (Akrapovic, Arrow)',
                        'Matte, Gloss & Custom Color Wraps',
                        'Lightweight Forged & Diamond Cut Alloys',
                        'High-Performance & All-Terrain Tyres',
                        'Aero Trunk Spoilers & Sunroofs',
                        'Bull Bars, Crash Guards & Touring Kits'
                      ].map((mod, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                          <Zap size={14} className="text-primary flex-shrink-0" />
                          <span>{mod}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Link
                  href="/category?mode=customize"
                  className="w-full py-4 rounded-2xl bg-primary text-background font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-[0_0_25px_rgba(0,255,136,0.3)]"
                >
                  <span>Launch Customization Studio</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* ── Stats Counter Section ── */}
      <section className="py-16 px-6 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 500, suffix: '+', label: 'Builds & Services', icon: <Sparkles size={24} className="text-primary" /> },
              { value: 50, suffix: '+', label: 'Certified Workshops', icon: <Users size={24} className="text-primary" /> },
              { value: 98, suffix: '%', label: 'Customer Satisfaction', icon: <Award size={24} className="text-primary" /> },
              { value: 24, suffix: '/7', label: 'Support & Tracking', icon: <Clock size={24} className="text-primary" /> },
            ].map((stat, i) => (
              <ScrollReveal key={i} variant="fade-up" delay={i * 100}>
                <div className="text-center space-y-3">
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center">
                    {stat.icon}
                  </div>
                  <p className="font-orbitron text-3xl md:text-4xl font-black text-white">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="py-24 px-6 bg-surface/30">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4">Precision Engineering</h2>
              <div className="h-1 w-20 bg-primary mx-auto"></div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Zap className="text-primary" size={32} />, title: "Certified Excellence", description: "All maintenance tasks and modifications are carried out by certified partner workshops." },
              { icon: <Cog className="text-primary" size={32} />, title: "Full Custom Control", description: "Configure exhausts, wraps, accessories, and parts with real-time pricing breakdowns." },
              { icon: <ShieldCheck className="text-primary" size={32} />, title: "Guaranteed Fitment", description: "Every aftermarket component and maintenance fluid meets exact OEM specifications." },
            ].map((feature, i) => (
              <ScrollReveal key={i} variant="fade-up" delay={i * 150}>
                <FeatureCard {...feature} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Vehicles Showcase ── */}
      {displayedVehicles.length > 0 && (
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                  <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-2">Featured <span className="text-primary">Fleet</span></h2>
                  <p className="text-gray-500 text-sm">Select any model to book routine maintenance or start modifying.</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  {/* Fleet Type Switcher */}
                  <div className="flex p-1 bg-surface border border-border rounded-xl">
                    <button
                      onClick={() => setFleetType('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-orbitron uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                        fleetType === 'all' ? 'bg-primary text-background shadow-md' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Layers size={13} /> All
                    </button>
                    <button
                      onClick={() => setFleetType('car')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-orbitron uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                        fleetType === 'car' ? 'bg-primary text-background shadow-md' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Car size={13} /> Cars
                    </button>
                    <button
                      onClick={() => setFleetType('bike')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-orbitron uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                        fleetType === 'bike' ? 'bg-primary text-background shadow-md' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Bike size={13} /> Bikes
                    </button>
                  </div>

                  <Link 
                    href={fleetType === 'all' ? '/vehicles' : `/vehicles?type=${fleetType}`} 
                    className="hidden md:flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all"
                  >
                    View All {fleetType === 'car' ? 'Cars' : fleetType === 'bike' ? 'Bikes' : 'Models'} <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide -mx-6 px-6 snap-x snap-mandatory">
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
              className="mt-8 md:hidden flex items-center justify-center gap-2 text-primary font-bold text-sm"
            >
              View All {fleetType === 'car' ? 'Cars' : fleetType === 'bike' ? 'Bikes' : 'Vehicles'} <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      )}

      {/* ── How It Works ── */}
      <section className="py-24 px-6 bg-surface/30">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4">How It <span className="text-primary">Works</span></h2>
              <p className="text-gray-500 max-w-lg mx-auto">Simple, transparent, four-step booking workflow.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            {[
              { number: '01', title: 'Choose Track', description: 'Pick Regular Maintenance or Custom Mods.', icon: <Layers size={28} /> },
              { number: '02', title: 'Select Vehicle', description: 'Choose your exact bike or car model.', icon: <Sparkles size={28} /> },
              { number: '03', title: 'Configure', description: 'Add services or performance upgrades.', icon: <Cog size={28} /> },
              { number: '04', title: 'Book Workshop', description: 'Schedule with an approved specialist.', icon: <Clock size={28} /> },
            ].map((step, i) => (
              <ScrollReveal key={i} variant="scale-in" delay={i * 150}>
                <StepCard {...step} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4">What Riders <span className="text-primary">Say</span></h2>
              <p className="text-gray-500 max-w-lg mx-auto">Trusted by hundreds of car and bike enthusiasts across the country.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Arjun Reddy', role: 'KTM Duke 390 Owner', rating: 5, text: 'The customizer is insanely detailed. Got an Akrapovic exhaust and ceramic coating — the workshop did a flawless job. Sounds and looks like a beast.' },
              { name: 'Priya Sharma', role: 'Hyundai Creta Owner', rating: 5, text: 'I only needed scheduled periodic maintenance and synthetic oil service. Booked through the Maintenance track, dropped off the car, and got it back spotless.' },
              { name: 'Vikram Joshi', role: 'Royal Enfield Meteor Owner', rating: 5, text: 'Great division between standard service and custom parts. I added touring saddlebags and had a full health check completed in a single workshop visit.' },
            ].map((testimonial, i) => (
              <ScrollReveal key={i} variant="fade-up" delay={i * 150}>
                <TestimonialCard {...testimonial} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-24 px-6">
        <ScrollReveal variant="scale-in">
          <div className="max-w-5xl mx-auto relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-primary/10 via-surface to-secondary/10 border border-primary/20 p-12 md:p-20 text-center">
            <div className="absolute top-0 left-1/4 w-60 h-60 bg-primary/15 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-secondary/15 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10">
              <h2 className="font-orbitron text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
                Ready to Upgrade Your <span className="text-primary neon-glow">Vehicle</span>?
              </h2>
              <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
                Book scheduled service or start engineering your dream build today.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/category?mode=maintenance" className="px-8 py-4 bg-surface hover:bg-surface-hover border border-border hover:border-primary text-white font-bold uppercase tracking-wider text-xs rounded-full transition-all flex items-center gap-2">
                  <Wrench size={16} className="text-primary" /> Book Maintenance
                </Link>
                <Link href="/category?mode=customize" className="px-8 py-4 bg-primary text-background font-black uppercase tracking-widest text-xs rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,255,136,0.3)] flex items-center gap-2">
                  <Zap size={16} /> Start Customizing <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}