'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import FloatingBackground from '@/components/common/FloatingBackground';

export default function AboutPage() {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const values = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: 'Authenticity',
      description: 'Every piece reflects our genuine passion for unique streetwear and quality fashion.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      title: 'Quality',
      description: 'From fabric to finish, we curate only the finest pieces that stand the test of time.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: 'Community',
      description: 'More than a store - a gathering place for those who dare to express themselves.',
    },
  ];



  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Dark Gen Z Animated Background */}
      <FloatingBackground />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-burnt-lilac/10 border border-burnt-lilac/20 mb-6">
            <span className="w-2 h-2 bg-burnt-lilac rounded-full animate-pulse" />
            <span className="text-burnt-lilac text-sm font-medium tracking-wider uppercase">Our Story</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-transparent bg-clip-text bg-linear-to-b from-white via-mist-lilac to-burnt-lilac/50 mb-6 leading-tight">
            About
            <br />
            <span className="italic">Luminix</span>
          </h1>

          <p className="text-mist-lilac/60 max-w-2xl mx-auto text-lg sm:text-xl mb-8">
            Where passion meets fashion. We curate premium streetwear for those who dare to stand out.
          </p>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-mist-lilac/40 text-xs uppercase tracking-widest">Discover</span>
            <div className="w-px h-16 bg-linear-to-b from-burnt-lilac/50 to-transparent relative overflow-hidden">
              <div className="absolute top-0 w-full h-1/2 bg-burnt-lilac animate-pulse" style={{ animation: 'scrollDown 1.5s ease-in-out infinite' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="relative z-10 py-12 sm:py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Visual Element */}
            <div className="relative aspect-square max-w-md mx-auto lg:mx-0">
              <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-burnt-lilac/20 to-deep-purple/40 border border-mist-lilac/10" />
              <div className="absolute inset-4 rounded-2xl bg-linear-to-br from-deep-purple/30 to-black border border-mist-lilac/10" />
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <img 
                  src="/images/White logo.png" 
                  alt="Luminix Logo" 
                  className="w-full h-full object-contain opacity-80"
                />
              </div>
              {/* Decorative rings */}
              <div className="absolute inset-0 border-2 border-burnt-lilac/20 rounded-3xl animate-pulse" style={{ animationDuration: '3s' }} />
              <div className="absolute -inset-4 border border-mist-lilac/10 rounded-4xl" />
            </div>

            {/* Content */}
            <div className="space-y-6 sm:space-y-8">
              <div className="text-center lg:text-left">
                <span className="text-burnt-lilac text-xs sm:text-sm font-medium tracking-wider uppercase">Our Journey</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-mist-lilac mt-3 sm:mt-4 mb-4 sm:mb-6">
                  Born from Passion
                </h2>
              </div>

              <div className="space-y-4 sm:space-y-6 text-mist-lilac/70 text-base sm:text-lg leading-relaxed text-center lg:text-left">
                <p>
                  Luminix was founded on a simple belief: fashion should be an expression of who you are. 
                  Our journey began with a passion for unique streetwear that makes a statement.
                </p>
                <p>
                  We curate pieces that speak to those who find beauty in standing out, in being different. 
                  Each item in our collection is chosen for its quality, design, and ability to transform.
                </p>
                <p>
                  From anime-inspired hoodies to premium streetwear essentials, we blend creativity with 
                  comfort. Our mission is to provide a destination for self-expression through fashion.
                </p>
              </div>

              <div className="flex justify-center lg:justify-start">
                <Link 
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-burnt-lilac text-white font-semibold rounded-full hover:bg-burnt-lilac/80 transition-all duration-300 group text-sm sm:text-base"
                >
                  Explore Collection
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative z-10 py-12 sm:py-16 lg:py-24 bg-linear-to-b from-deep-purple/10 via-transparent to-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <span className="text-burnt-lilac text-xs sm:text-sm font-medium tracking-wider uppercase">What Drives Us</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-mist-lilac mt-3 sm:mt-4">Our Values</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group relative p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-linear-to-br from-deep-purple/20 to-transparent border border-mist-lilac/10 hover:border-burnt-lilac/30 transition-all duration-500"
                style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both` }}
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-burnt-lilac/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                
                <div className="relative z-10">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-burnt-lilac/10 border border-burnt-lilac/20 flex items-center justify-center text-burnt-lilac mb-4 sm:mb-6 group-hover:scale-110 group-hover:bg-burnt-lilac/20 transition-all duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-mist-lilac mb-2 sm:mb-3">{value.title}</h3>
                  <p className="text-sm sm:text-base text-mist-lilac/60 leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-12 sm:py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="relative p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl bg-linear-to-br from-burnt-lilac/20 to-deep-purple/30 border border-mist-lilac/10 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(214,197,220,0.3) 1px, transparent 0)',
                backgroundSize: '32px 32px',
              }} />
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-mist-lilac mb-4 sm:mb-6">
                Ready to Stand Out?
              </h2>
              <p className="text-mist-lilac/60 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
                Join thousands of customers who have discovered their unique style with Luminix.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link
                  href="/products"
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-black font-semibold rounded-full hover:bg-mist-lilac transition-colors text-sm sm:text-base"
                >
                  Shop Now
                </Link>
                <Link
                  href="/contact"
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-transparent border border-mist-lilac/30 text-mist-lilac font-semibold rounded-full hover:bg-mist-lilac/10 transition-colors text-sm sm:text-base"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes scrollDown {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
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
    </div>
  );
}
