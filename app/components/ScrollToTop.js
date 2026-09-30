'use client';
import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      onClick={scrollUp}
      aria-label="Scroll to top"
      className={`fixed bottom-24 right-6 z-40 w-11 h-11 rounded-xl bg-surface/90 border border-white/10 text-gray-400 hover:text-primary hover:border-primary/40 hover:scale-110 active:scale-95 flex items-center justify-center transition-all duration-400 backdrop-blur-md hover:shadow-[0_0_20px_rgba(0,255,136,0.15)] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
    >
      <ArrowUp size={16} strokeWidth={2.5} />
    </button>
  );
}
