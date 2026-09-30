'use client';
import { useEffect, useRef, useState } from 'react';

const VARIANTS = {
  'fade-up':    { hidden: { opacity: 0, y: 24, blur: 6, scale: 1 },    visible: {} },
  'fade-down':  { hidden: { opacity: 0, y: -24, blur: 6, scale: 1 },   visible: {} },
  'fade-left':  { hidden: { opacity: 0, x: 30, blur: 4, scale: 1 },    visible: {} },
  'fade-right': { hidden: { opacity: 0, x: -30, blur: 4, scale: 1 },   visible: {} },
  'scale-in':   { hidden: { opacity: 0, y: 0, blur: 8, scale: 0.92 },  visible: {} },
  'fade':       { hidden: { opacity: 0, y: 0, blur: 4, scale: 1 },     visible: {} },
  'blur-in':    { hidden: { opacity: 0, y: 8, blur: 12, scale: 1 },    visible: {} },
};

export default function ScrollReveal({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 800,
  threshold = 0.12,
  className = '',
  once = true,
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
          if (once) observer.unobserve(el);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const v = VARIANTS[variant] || VARIANTS['fade-up'];
  const h = v.hidden;

  const hiddenStyle = {
    opacity: h.opacity ?? 0,
    transform: `translateY(${h.y || 0}px) translateX(${h.x || 0}px) scale(${h.scale || 1})`,
    filter: `blur(${h.blur || 0}px)`,
  };

  const visibleStyle = {
    opacity: 1,
    transform: 'translateY(0) translateX(0) scale(1)',
    filter: 'blur(0px)',
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...(isVisible ? visibleStyle : hiddenStyle),
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration + 100}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, filter ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'opacity, transform, filter',
      }}
    >
      {children}
    </div>
  );
}
