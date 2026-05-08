'use client';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, Zap, Cog } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/images/hero.png")' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/20 to-background"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center animate-fade-in">
          <h1 className="font-orbitron text-5xl md:text-8xl font-black tracking-tighter text-white mb-6 uppercase">
            Define Your <span className="text-primary neon-glow">Legacy</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Engineered for the bold. Customize, price, and book your high-performance vehicle in a few clicks.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/category" className="group relative px-8 py-4 bg-primary text-background font-bold text-lg rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95">
              <span className="relative z-10 flex items-center gap-2">
                Start Customizing <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link href="/vehicles" className="px-8 py-4 border border-white/20 hover:border-primary/50 text-white font-medium text-lg rounded-full backdrop-blur-sm transition-all hover:bg-white/5">
              Explore Fleet
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-surface/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4">Precision Engineering</h2>
            <div className="h-1 w-20 bg-primary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="text-primary" size={32} />}
              title="Next-Gen Performance"
              description="Every component is optimized for maximum efficiency and raw power output."
            />
            <FeatureCard 
              icon={<Cog className="text-primary" size={32} />}
              title="Total Control"
              description="Millions of combinations to make your vehicle truly one-of-a-kind."
            />
            <FeatureCard 
              icon={<ShieldCheck className="text-primary" size={32} />}
              title="Built to Last"
              description="Premium materials and rigorous testing ensure your legacy endures."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-8 rounded-3xl bg-surface border border-border hover:border-primary/30 transition-all group">
      <div className="mb-6 p-4 rounded-2xl bg-primary/5 inline-block group-hover:bg-primary/10 transition-colors">
        {icon}
      </div>
      <h3 className="font-orbitron text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed font-light">{description}</p>
    </div>
  );
}