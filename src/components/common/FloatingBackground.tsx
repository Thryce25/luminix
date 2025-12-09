'use client';

interface FloatingBackgroundProps {
  variant?: 'default' | 'minimal' | 'intense';
}

// Pre-calculated particle positions to avoid hydration mismatch
const particles = [
  { id: 0, left: '15%', top: '20%', delay: '0s', duration: '3s' },
  { id: 1, left: '85%', top: '15%', delay: '0.5s', duration: '4s' },
  { id: 2, left: '25%', top: '80%', delay: '1s', duration: '3.5s' },
  { id: 3, left: '70%', top: '60%', delay: '1.5s', duration: '2.5s' },
  { id: 4, left: '10%', top: '45%', delay: '2s', duration: '4s' },
  { id: 5, left: '90%', top: '30%', delay: '2.5s', duration: '3s' },
  { id: 6, left: '45%', top: '10%', delay: '0.3s', duration: '3.5s' },
  { id: 7, left: '55%', top: '90%', delay: '0.8s', duration: '4.5s' },
  { id: 8, left: '30%', top: '35%', delay: '1.3s', duration: '2.8s' },
  { id: 9, left: '75%', top: '75%', delay: '1.8s', duration: '3.2s' },
  { id: 10, left: '5%', top: '70%', delay: '2.3s', duration: '4.2s' },
  { id: 11, left: '95%', top: '50%', delay: '2.8s', duration: '3.8s' },
  { id: 12, left: '40%', top: '25%', delay: '0.2s', duration: '2.6s' },
  { id: 13, left: '60%', top: '85%', delay: '0.7s', duration: '3.4s' },
  { id: 14, left: '20%', top: '55%', delay: '1.2s', duration: '4.1s' },
  { id: 15, left: '80%', top: '40%', delay: '1.7s', duration: '2.9s' },
  { id: 16, left: '35%', top: '5%', delay: '2.2s', duration: '3.7s' },
  { id: 17, left: '65%', top: '95%', delay: '2.7s', duration: '4.4s' },
  { id: 18, left: '12%', top: '65%', delay: '0.4s', duration: '3.1s' },
  { id: 19, left: '88%', top: '22%', delay: '0.9s', duration: '2.7s' },
  { id: 20, left: '48%', top: '48%', delay: '1.4s', duration: '3.9s' },
  { id: 21, left: '52%', top: '78%', delay: '1.9s', duration: '4.3s' },
  { id: 22, left: '8%', top: '32%', delay: '2.4s', duration: '2.5s' },
  { id: 23, left: '92%', top: '68%', delay: '2.9s', duration: '3.3s' },
  { id: 24, left: '28%', top: '12%', delay: '0.1s', duration: '4s' },
  { id: 25, left: '72%', top: '88%', delay: '0.6s', duration: '3.6s' },
  { id: 26, left: '18%', top: '42%', delay: '1.1s', duration: '2.8s' },
  { id: 27, left: '82%', top: '58%', delay: '1.6s', duration: '4.2s' },
  { id: 28, left: '38%', top: '72%', delay: '2.1s', duration: '3s' },
  { id: 29, left: '62%', top: '18%', delay: '2.6s', duration: '3.8s' },
  { id: 30, left: '3%', top: '85%', delay: '0.35s', duration: '4.5s' },
  { id: 31, left: '97%', top: '8%', delay: '0.85s', duration: '2.6s' },
  { id: 32, left: '42%', top: '38%', delay: '1.35s', duration: '3.4s' },
  { id: 33, left: '58%', top: '62%', delay: '1.85s', duration: '4.1s' },
  { id: 34, left: '22%', top: '92%', delay: '2.35s', duration: '2.9s' },
  { id: 35, left: '78%', top: '5%', delay: '2.85s', duration: '3.7s' },
  { id: 36, left: '33%', top: '52%', delay: '0.15s', duration: '4.4s' },
  { id: 37, left: '67%', top: '28%', delay: '0.65s', duration: '2.7s' },
  { id: 38, left: '7%', top: '58%', delay: '1.15s', duration: '3.2s' },
  { id: 39, left: '93%', top: '42%', delay: '1.65s', duration: '4.3s' },
  { id: 40, left: '47%', top: '82%', delay: '2.15s', duration: '2.5s' },
  { id: 41, left: '53%', top: '15%', delay: '2.65s', duration: '3.9s' },
  { id: 42, left: '17%', top: '75%', delay: '0.25s', duration: '4.2s' },
  { id: 43, left: '83%', top: '35%', delay: '0.75s', duration: '3.1s' },
  { id: 44, left: '27%', top: '95%', delay: '1.25s', duration: '2.8s' },
  { id: 45, left: '73%', top: '2%', delay: '1.75s', duration: '3.6s' },
  { id: 46, left: '37%', top: '68%', delay: '2.25s', duration: '4s' },
  { id: 47, left: '63%', top: '45%', delay: '2.75s', duration: '3.3s' },
  { id: 48, left: '2%', top: '28%', delay: '0.45s', duration: '4.5s' },
  { id: 49, left: '98%', top: '72%', delay: '0.95s', duration: '2.6s' },
];

// Pre-calculated shooting stars
const shootingStars = [
  { id: 0, top: '10%', left: '5%', delay: '0s' },
  { id: 1, top: '20%', left: '33%', delay: '3s' },
  { id: 2, top: '15%', left: '60%', delay: '6s' },
  { id: 3, top: '25%', left: '80%', delay: '9s' },
];

// Pre-calculated geometric shapes
const shapes = [
  { id: 0, width: '60px', height: '60px', left: '10%', top: '20%', borderRadius: '30%', delay: '0s', duration: '15s' },
  { id: 1, width: '80px', height: '80px', left: '22%', top: '45%', borderRadius: '50%', delay: '0.8s', duration: '17s' },
  { id: 2, width: '100px', height: '100px', left: '34%', top: '70%', borderRadius: '30%', delay: '1.6s', duration: '19s' },
  { id: 3, width: '120px', height: '120px', left: '46%', top: '20%', borderRadius: '50%', delay: '2.4s', duration: '21s' },
  { id: 4, width: '140px', height: '140px', left: '58%', top: '45%', borderRadius: '30%', delay: '3.2s', duration: '23s' },
  { id: 5, width: '160px', height: '160px', left: '70%', top: '70%', borderRadius: '50%', delay: '4s', duration: '25s' },
  { id: 6, width: '180px', height: '180px', left: '82%', top: '20%', borderRadius: '30%', delay: '4.8s', duration: '27s' },
  { id: 7, width: '200px', height: '200px', left: '94%', top: '45%', borderRadius: '50%', delay: '5.6s', duration: '29s' },
];

export default function FloatingBackground({ variant = 'default' }: FloatingBackgroundProps) {
  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Deep Dark Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0612] to-[#050208]" />
        
        {/* Subtle Aurora Effect - Much darker */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-1/4 w-[150vw] h-[150vh] -translate-x-1/2 -translate-y-1/4 animate-aurora-1">
            <div className="absolute inset-0 bg-gradient-conic from-burnt-lilac/15 via-transparent via-30% to-transparent rounded-full blur-[120px]" />
          </div>
          <div className="absolute top-1/4 right-0 w-[120vw] h-[120vh] animate-aurora-2">
            <div className="absolute inset-0 bg-gradient-conic from-purple-900/20 via-transparent via-25% to-transparent rounded-full blur-[100px]" />
          </div>
          <div className="absolute bottom-0 left-1/3 w-screen h-screen animate-aurora-3">
            <div className="absolute inset-0 bg-gradient-conic from-[#1a0a2e]/25 via-transparent via-20% to-transparent rounded-full blur-[80px]" />
          </div>
        </div>

        {/* Dark Floating Orbs - Very subtle */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-burnt-lilac/[0.08] blur-[100px] animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-900/[0.1] blur-[80px] animate-float-slower" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#0f051a]/50 blur-[100px] animate-pulse-slow" />

        {/* Subtle Shooting Stars - Dimmer */}
        {shootingStars.map((star) => (
          <div
            key={star.id}
            className="absolute w-0.5 h-0.5 bg-mist-lilac/30 rounded-full animate-shooting-star"
            style={{ top: star.top, left: star.left, animationDelay: star.delay }}
          />
        ))}

        {/* Particle Field - Very subtle twinkling */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-0.5 h-0.5 bg-mist-lilac/20 rounded-full animate-twinkle"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}

        {/* Dark Mesh Gradient Overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              radial-gradient(ellipse at 20% 30%, rgba(111,78,124,0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 70%, rgba(26,10,46,0.2) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(15,5,26,0.3) 0%, transparent 60%)
            `,
          }}
        />

        {/* Subtle Grid - Nearly invisible */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(111,78,124,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(111,78,124,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            animation: 'grid-move 30s linear infinite',
          }}
        />

        {/* Floating Geometric Shapes - Much darker */}
        {variant !== 'minimal' && shapes.map((shape) => (
          <div
            key={shape.id}
            className="absolute border border-burnt-lilac/[0.06] animate-float-rotate"
            style={{
              width: shape.width,
              height: shape.height,
              left: shape.left,
              top: shape.top,
              borderRadius: shape.borderRadius,
              animationDelay: shape.delay,
              animationDuration: shape.duration,
            }}
          />
        ))}

        {/* Noise/Grain Texture Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Vignette Effect */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
          }}
        />
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        /* Aurora Borealis Animations */
        @keyframes aurora-1 {
          0%, 100% { 
            transform: translate(-50%, -25%) rotate(0deg) scale(1);
            opacity: 0.4;
          }
          25% { 
            transform: translate(-45%, -30%) rotate(90deg) scale(1.1);
            opacity: 0.6;
          }
          50% { 
            transform: translate(-55%, -20%) rotate(180deg) scale(0.9);
            opacity: 0.3;
          }
          75% { 
            transform: translate(-50%, -35%) rotate(270deg) scale(1.05);
            opacity: 0.5;
          }
        }
        
        @keyframes aurora-2 {
          0%, 100% { 
            transform: rotate(0deg) scale(1);
            opacity: 0.3;
          }
          33% { 
            transform: rotate(-120deg) scale(1.2);
            opacity: 0.5;
          }
          66% { 
            transform: rotate(-240deg) scale(0.8);
            opacity: 0.2;
          }
        }
        
        @keyframes aurora-3 {
          0%, 100% { 
            transform: translateX(0) rotate(0deg);
            opacity: 0.25;
          }
          50% { 
            transform: translateX(10%) rotate(180deg);
            opacity: 0.4;
          }
        }
        
        .animate-aurora-1 {
          animation: aurora-1 25s ease-in-out infinite;
        }
        
        .animate-aurora-2 {
          animation: aurora-2 30s ease-in-out infinite;
        }
        
        .animate-aurora-3 {
          animation: aurora-3 20s ease-in-out infinite;
        }
        
        /* Floating Animations */
        @keyframes float-slow {
          0%, 100% { 
            transform: translateY(0) translateX(0);
          }
          25% { 
            transform: translateY(-30px) translateX(20px);
          }
          50% { 
            transform: translateY(-15px) translateX(-15px);
          }
          75% { 
            transform: translateY(-40px) translateX(10px);
          }
        }
        
        @keyframes float-slower {
          0%, 100% { 
            transform: translateY(0) translateX(0) scale(1);
          }
          33% { 
            transform: translateY(-40px) translateX(-30px) scale(1.1);
          }
          66% { 
            transform: translateY(-20px) translateX(20px) scale(0.95);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% { 
            opacity: 0.2;
            transform: translate(-50%, -50%) scale(1);
          }
          50% { 
            opacity: 0.35;
            transform: translate(-50%, -50%) scale(1.15);
          }
        }
        
        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }
        
        .animate-float-slower {
          animation: float-slower 18s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        
        /* Shooting Stars */
        @keyframes shooting-star {
          0% {
            transform: translateX(0) translateY(0) rotate(45deg);
            opacity: 1;
            width: 4px;
            height: 4px;
            box-shadow: 0 0 10px 2px white, -100px 0 50px 10px rgba(255,255,255,0.3);
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translateX(500px) translateY(500px) rotate(45deg);
            opacity: 0;
            width: 2px;
            height: 2px;
            box-shadow: 0 0 5px 1px white, -200px 0 100px 20px transparent;
          }
        }
        
        .animate-shooting-star {
          animation: shooting-star 3s ease-out infinite;
        }
        
        /* Twinkle Stars */
        @keyframes twinkle {
          0%, 100% { 
            opacity: 0.2;
            transform: scale(1);
          }
          50% { 
            opacity: 0.8;
            transform: scale(1.5);
            box-shadow: 0 0 10px 2px rgba(214,197,220,0.5);
          }
        }
        
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        
        /* Floating Rotate */
        @keyframes float-rotate {
          0% { 
            transform: translateY(0) rotate(0deg);
            opacity: 0.15;
          }
          25% { 
            transform: translateY(-20px) rotate(90deg);
            opacity: 0.25;
          }
          50% { 
            transform: translateY(-10px) rotate(180deg);
            opacity: 0.15;
          }
          75% { 
            transform: translateY(-30px) rotate(270deg);
            opacity: 0.2;
          }
          100% { 
            transform: translateY(0) rotate(360deg);
            opacity: 0.15;
          }
        }
        
        .animate-float-rotate {
          animation: float-rotate 20s ease-in-out infinite;
        }
        
        /* Grid Movement */
        @keyframes grid-move {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(60px);
          }
        }
        
        /* Gradient Conic for Aurora */
        .bg-gradient-conic {
          background: conic-gradient(var(--tw-gradient-stops));
        }
      `}</style>
    </>
  );
}
