'use client';
import { useEffect, useRef, useState } from 'react';

const VARIANTS = {
  'fade-up':    { hidden: { opacity: 0, y: 16, scale: 1 },    visible: {} },
  'fade-down':  { hidden: { opacity: 0, y: -16, scale: 1 },   visible: {} },
  'fade-left':  { hidden: { opacity: 0, x: 20, scale: 1 },    visible: {} },
  'fade-right': { hidden: { opacity: 0, x: -20, scale: 1 },   visible: {} },
  'scale-in':   { hidden: { opacity: 0, y: 0, scale: 0.96 },  visible: {} },
  'fade':       { hidden: { opacity: 0, y: 0, scale: 1 },     visible: {} },
  'blur-in':    { hidden: { opacity: 0, y: 10, scale: 1 },    visible: {} },
};

export default function ScrollReveal({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 450,
  threshold = 0.08,
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
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: '0px 0px -20px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const v = VARIANTS[variant] || VARIANTS['fade-up'];
  const h = v.hidden;

  const hiddenStyle = {
    opacity: h.opacity ?? 0,
    transform: `translate3d(${h.x || 0}px, ${h.y || 0}px, 0) scale(${h.scale || 1})`,
  };

  const visibleStyle = {
    opacity: 1,
    transform: 'translate3d(0, 0, 0) scale(1)',
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...(isVisible ? visibleStyle : hiddenStyle),
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
