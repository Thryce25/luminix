'use client';

import { useEffect, useState } from 'react';

interface FloatingBackgroundProps {
  variant?: 'default' | 'minimal' | 'intense';
}

// Reduced particles for better performance (6 instead of 50)
const desktopParticles = [
  { id: 0, left: '15%', top: '20%', delay: '0s', duration: '5s' },
  { id: 1, left: '85%', top: '15%', delay: '1s', duration: '6s' },
  { id: 2, left: '25%', top: '80%', delay: '2s', duration: '5.5s' },
  { id: 3, left: '70%', top: '60%', delay: '3s', duration: '4.5s' },
  { id: 4, left: '45%', top: '40%', delay: '1.5s', duration: '5s' },
  { id: 5, left: '55%', top: '75%', delay: '2.5s', duration: '6s' },
];

// Mobile-optimized minimal particles (3 only)
const mobileParticles = [
  { id: 0, left: '20%', top: '30%' },
  { id: 1, left: '80%', top: '70%' },
  { id: 2, left: '50%', top: '50%' },
];

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

  // Minimal or no animations for mobile/reduced motion
  const shouldReduceAnimations = isMobile || prefersReducedMotion;

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

      {/* Mobile: Static gradient only - no animations */}
      {shouldReduceAnimations && (
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-burnt-lilac/15 blur-[60px]" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-purple-900/10 blur-[50px]" />
        </div>
      )}

      {/* Particles - Desktop animated, Mobile static */}
      {shouldReduceAnimations ? (
        // Mobile: Static particles, no animation
        mobileParticles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-mist-lilac/40 rounded-full"
            style={{ left: particle.left, top: particle.top }}
          />
        ))
      ) : (
        // Desktop: Animated particles
        desktopParticles.map((particle) => (
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
        ))
      )}

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
