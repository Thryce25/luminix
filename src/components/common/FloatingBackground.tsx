'use client';

import { useEffect, useState } from 'react';

interface FloatingBackgroundProps {
  variant?: 'default' | 'minimal' | 'intense';
}

// Generate particles programmatically
const generateParticles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${5 + (i * 1.9) % 90}%`,
    top: `${10 + (i * 1.7) % 80}%`,
    delay: `${(i * 0.2) % 5}s`,
    duration: `${4 + (i % 3)}s`,
  }));
};

// 50 particles for desktop
const desktopParticles = generateParticles(50);

// 10 particles for mobile (with animations)
const mobileParticles = generateParticles(10);

export default function FloatingBackground({ variant = 'default' }: FloatingBackgroundProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check for mobile device
    const checkMobile = () => {
      const width = window.innerWidth;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(width < 768 || isTouchDevice);
    };
    
    // Check for reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Only reduce animations if user prefers reduced motion
  const shouldReduceAnimations = prefersReducedMotion;
  
  // Use appropriate particle count based on device
  const particles = isMobile ? mobileParticles : desktopParticles;

  // Server-side render safe - return minimal version
  if (!mounted) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-black via-[#0a0612] to-[#050208]" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Deep Dark Base Gradient - Static, no animation */}
      <div className="absolute inset-0 bg-linear-to-b from-black via-[#0a0612] to-[#050208]" />
      
      {/* Desktop: Subtle animated gradient */}
      {!shouldReduceAnimations && (
        <div className="absolute inset-0 opacity-25">
          <div 
            className="absolute top-0 left-1/4 w-[80vw] h-[80vh] -translate-x-1/2 rounded-full bg-burnt-lilac/10 blur-[100px]"
            style={{ animation: 'aurora-slow 25s ease-in-out infinite' }}
          />
          <div 
            className="absolute bottom-0 right-1/4 w-[60vw] h-[60vh] rounded-full bg-purple-900/10 blur-[80px]"
            style={{ animation: 'aurora-slow 30s ease-in-out infinite reverse' }}
          />
        </div>
      )}

      {/* Static gradient for reduced motion users */}
      {shouldReduceAnimations && (
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-burnt-lilac/15 blur-[60px]" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-purple-900/10 blur-[50px]" />
        </div>
      )}

      {/* Animated Particles - 50 on desktop, 10 on mobile */}
      {!shouldReduceAnimations && particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-mist-lilac/30 rounded-full"
          style={{
            left: particle.left,
            top: particle.top,
            animation: `twinkle ${particle.duration} ease-in-out infinite`,
            animationDelay: particle.delay,
          }}
        />
      ))}

      {/* Static mesh gradient - No animation */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(111,78,124,0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(26,10,46,0.12) 0%, transparent 50%)
          `,
        }}
      />

      {/* Vignette Effect - Static */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* Minimal CSS Animations - Only for desktop */}
      <style jsx global>{`
        @keyframes aurora-slow {
          0%, 100% { 
            opacity: 0.25;
            transform: translate3d(0, 0, 0);
          }
          50% { 
            opacity: 0.4;
            transform: translate3d(2%, -2%, 0);
          }
        }
        
        @keyframes twinkle {
          0%, 100% { 
            opacity: 0.2;
          }
          50% { 
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
}
