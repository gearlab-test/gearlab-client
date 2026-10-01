'use client';
import { useEffect, useRef, useState } from 'react';

const VARIANTS = {
  'fade-up':    { hidden: { opacity: 0, y: 22, x: 0, scale: 1 },    visible: { opacity: 1, y: 0, x: 0, scale: 1 } },
  'fade-down':  { hidden: { opacity: 0, y: -22, x: 0, scale: 1 },   visible: { opacity: 1, y: 0, x: 0, scale: 1 } },
  'fade-left':  { hidden: { opacity: 0, y: 0, x: 26, scale: 1 },    visible: { opacity: 1, y: 0, x: 0, scale: 1 } },
  'fade-right': { hidden: { opacity: 0, y: 0, x: -26, scale: 1 },   visible: { opacity: 1, y: 0, x: 0, scale: 1 } },
  'scale-in':   { hidden: { opacity: 0, y: 12, x: 0, scale: 0.94 }, visible: { opacity: 1, y: 0, x: 0, scale: 1 } },
  'fade':       { hidden: { opacity: 0, y: 0, x: 0, scale: 1 },     visible: { opacity: 1, y: 0, x: 0, scale: 1 } },
};

export default function ScrollReveal({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 550,
  threshold = 0.05,
  className = '',
  once = true,
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fast check if element is already in viewport on page load
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 30) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const v = VARIANTS[variant] || VARIANTS['fade-up'];
  const cur = isVisible ? v.visible : v.hidden;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: cur.opacity,
        transform: `translate3d(${cur.x}px, ${cur.y}px, 0) scale(${cur.scale})`,
        transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
