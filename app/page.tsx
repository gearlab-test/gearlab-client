'use client';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, Zap, Cog } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Creative Overlays */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s] hover:scale-110"
          style={{ backgroundImage: 'url("/images/hero_v2.png")' }}
        >
          {/* Multi-layered Overlay for Visibility & Mood */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#0a0a0a_80%)] opacity-60"></div>
          
          {/* Animated Glow Elements */}
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

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <div className="w-1 h-12 rounded-full bg-gradient-to-b from-primary to-transparent"></div>
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

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
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