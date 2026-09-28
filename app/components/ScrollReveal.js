'use client';
import { useEffect, useRef, useState } from 'react';

const VARIANTS = {
  'fade-up': { hidden: 'opacity-0 translate-y-8', visible: 'opacity-100 translate-y-0' },
  'fade-down': { hidden: 'opacity-0 -translate-y-8', visible: 'opacity-100 translate-y-0' },
  'fade-left': { hidden: 'opacity-0 translate-x-8', visible: 'opacity-100 translate-x-0' },
  'fade-right': { hidden: 'opacity-0 -translate-x-8', visible: 'opacity-100 translate-x-0' },
  'scale-in': { hidden: 'opacity-0 scale-90', visible: 'opacity-100 scale-100' },
  'fade': { hidden: 'opacity-0', visible: 'opacity-100' },
};

export default function ScrollReveal({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 700,
  threshold = 0.15,
  className = '',
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const v = VARIANTS[variant] || VARIANTS['fade-up'];

  return (
    <div
      ref={ref}
      className={`transition-all ${isVisible ? v.visible : v.hidden} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {children}
    </div>
  );
}
