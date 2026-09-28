'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, Zap, Cog, Star, ArrowRight, Sparkles, Users, Award, Clock } from 'lucide-react';
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
    <Link href={`/configurator/${vehicle._id}`} className="group flex-shrink-0 w-[320px] md:w-[360px]">
      <div className="bg-surface border border-border rounded-3xl overflow-hidden transition-all hover:border-primary/30 card-glow">
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
        </div>
        <div className="p-6">
          <h4 className="font-orbitron text-lg font-bold text-white group-hover:text-primary transition-colors mb-1">{vehicle.name}</h4>
          <div className="flex justify-between items-center">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{vehicle.type}</p>
            <p className="font-orbitron text-sm font-bold text-primary">₹{vehicle.basePrice.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   HOMEPAGE
   ═══════════════════════════════════════════════════════════════════ */

export default function HomePage() {
  const [vehicles, setVehicles] = useState<any[]>([]);

  useEffect(() => {
    API.get('/vehicles')
      .then(r => {
        if (Array.isArray(r.data) && r.data.length > 0) {
          setVehicles(r.data.slice(0, 6));
        } else {
          setVehicles(getFallbackVehicles().slice(0, 6));
        }
      })
      .catch(() => {
        setVehicles(getFallbackVehicles().slice(0, 6));
      });
  }, []);

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
            <div className="inline-block px-4 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-bold uppercase tracking-[0.3em] mb-4 backdrop-blur-md">
              The Future of Customization
            </div>

            <h1 className="font-orbitron text-6xl md:text-9xl font-black tracking-tighter text-white mb-6 uppercase leading-[0.8] animate-floating">
              Define Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient-x neon-glow">
                Legacy
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed font-light drop-shadow-lg">
              Engineered for the bold. Maintain, customize, and book premium services for your vehicle in a few clicks.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
              <Link href="/category" className="group relative px-10 py-5 bg-primary text-background font-bold text-lg rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,136,0.4)] active:scale-95">
                <span className="relative z-10 flex items-center gap-2">
                  Get Started <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link href="/vehicles" className="group px-10 py-5 border border-white/20 hover:border-primary/50 text-white font-medium text-lg rounded-full backdrop-blur-md transition-all hover:bg-white/5 flex items-center gap-2">
                <span>Explore Fleet</span>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse group-hover:scale-150 transition-transform"></div>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <div className="w-1 h-12 rounded-full bg-gradient-to-b from-primary to-transparent"></div>
        </div>
      </section>

      {/* ── Stats Counter Section ── */}
      <section className="py-16 px-6 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 500, suffix: '+', label: 'Builds Completed', icon: <Sparkles size={24} className="text-primary" /> },
              { value: 50, suffix: '+', label: 'Partner Workshops', icon: <Users size={24} className="text-primary" /> },
              { value: 98, suffix: '%', label: 'Client Satisfaction', icon: <Award size={24} className="text-primary" /> },
              { value: 24, suffix: '/7', label: 'Support Available', icon: <Clock size={24} className="text-primary" /> },
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
              { icon: <Zap className="text-primary" size={32} />, title: "Next-Gen Performance", description: "Every component is optimized for maximum efficiency and raw power output." },
              { icon: <Cog className="text-primary" size={32} />, title: "Total Control", description: "Millions of combinations to make your vehicle truly one-of-a-kind." },
              { icon: <ShieldCheck className="text-primary" size={32} />, title: "Built to Last", description: "Premium materials and rigorous testing ensure your legacy endures." },
            ].map((feature, i) => (
              <ScrollReveal key={i} variant="fade-up" delay={i * 150}>
                <FeatureCard {...feature} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Vehicles Showcase ── */}
      {vehicles.length > 0 && (
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="flex items-end justify-between mb-12">
                <div>
                  <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-2">Featured <span className="text-primary">Fleet</span></h2>
                  <p className="text-gray-500 text-sm">Explore our most popular vehicles and start configuring.</p>
                </div>
                <Link href="/category" className="hidden md:flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all">
                  View All <ArrowRight size={16} />
                </Link>
              </div>
            </ScrollReveal>

            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide -mx-6 px-6 snap-x snap-mandatory">
              {vehicles.map((v, i) => (
                <ScrollReveal key={v._id} variant="fade-up" delay={i * 100}>
                  <div className="snap-start">
                    <VehicleShowcaseCard vehicle={v} />
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <Link href="/category" className="mt-8 md:hidden flex items-center justify-center gap-2 text-primary font-bold text-sm">
              View All Vehicles <ArrowRight size={16} />
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
              <p className="text-gray-500 max-w-lg mx-auto">Four simple steps from dream to reality.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            {[
              { number: '01', title: 'Choose', description: 'Pick your vehicle from our curated fleet.', icon: <Sparkles size={28} /> },
              { number: '02', title: 'Configure', description: 'Customize colors, parts, and services.', icon: <Cog size={28} /> },
              { number: '03', title: 'Book', description: 'Select a workshop and schedule your visit.', icon: <Clock size={28} /> },
              { number: '04', title: 'Drive', description: 'Collect your custom build and hit the road.', icon: <Zap size={28} /> },
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
              { name: 'Arjun Reddy', role: 'KTM Duke 390 Owner', rating: 5, text: 'The configurator is insanely detailed. Got an Akrapovic exhaust and ceramic coating — the workshop did a flawless job. My Duke sounds and looks like a beast now.' },
              { name: 'Priya Sharma', role: 'Hyundai Creta Owner', rating: 5, text: 'Booking was seamless. Selected my workshop, picked a date, and the panoramic sunroof installation was done perfectly. Premium experience end to end.' },
              { name: 'Vikram Joshi', role: 'Royal Enfield Meteor Owner', rating: 4, text: 'Love the platform. The build summary and pricing transparency is excellent. My Meteor now has touring saddlebags and a performance exhaust. Road trips leveled up!' },
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
            {/* Glow effects */}
            <div className="absolute top-0 left-1/4 w-60 h-60 bg-primary/15 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-secondary/15 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10">
              <h2 className="font-orbitron text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
                Ready to Build Your <span className="text-primary neon-glow">Legacy</span>?
              </h2>
              <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
                Join hundreds of enthusiasts who have already transformed their ride. Start your custom build today.
              </p>
              <Link href="/category" className="group inline-flex items-center gap-3 px-12 py-5 bg-primary text-background font-black uppercase tracking-widest text-sm rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(0,255,136,0.25)]">
                Start Customizing <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}