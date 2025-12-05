'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

export default function AboutPage() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
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

  const stats = [
    { number: '10K+', label: 'Happy Customers' },
    { number: '500+', label: 'Unique Designs' },
    { number: '50+', label: 'Countries Shipped' },
    { number: '4.9', label: 'Average Rating' },
  ];

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute w-[800px] h-[800px] rounded-full opacity-20 blur-3xl transition-transform duration-1000"
          style={{
            background: 'radial-gradient(circle, rgba(111,78,124,0.4) 0%, transparent 70%)',
            left: `${mousePosition.x * 0.02}px`,
            top: `${mousePosition.y * 0.02 - scrollY * 0.1}px`,
          }}
        />
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-15 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(214,197,220,0.3) 0%, transparent 70%)',
            right: '10%',
            bottom: '20%',
            transform: `translateY(${scrollY * 0.05}px)`,
          }}
        />
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(214,197,220,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(214,197,220,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: `translateY(${scrollY * 0.1}px)`,
          }}
        />
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full mix-blend-overlay"
              style={{
                width: `${Math.random() * 100 + 30}px`,
                height: `${Math.random() * 100 + 30}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: i % 2 === 0 
                  ? 'linear-gradient(135deg, rgba(111,78,124,0.3), transparent)'
                  : 'linear-gradient(135deg, rgba(214,197,220,0.2), transparent)',
                animation: `float ${10 + Math.random() * 10}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
                transform: `translateY(${scrollY * (0.1 + Math.random() * 0.2)}px)`,
              }}
            />
          ))}
        </div>

        <div 
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-burnt-lilac/10 border border-burnt-lilac/20 mb-6">
            <span className="w-2 h-2 bg-burnt-lilac rounded-full animate-pulse" />
            <span className="text-burnt-lilac text-sm font-medium tracking-wider uppercase">Our Story</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-white via-mist-lilac to-burnt-lilac/50 mb-6 leading-tight">
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
            <div className="w-px h-16 bg-gradient-to-b from-burnt-lilac/50 to-transparent relative overflow-hidden">
              <div className="absolute top-0 w-full h-1/2 bg-burnt-lilac animate-pulse" style={{ animation: 'scrollDown 1.5s ease-in-out infinite' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-16 border-y border-mist-lilac/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center"
                style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
              >
                <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-burnt-lilac to-mist-lilac mb-2">
                  {stat.number}
                </div>
                <div className="text-mist-lilac/50 text-sm uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="relative z-10 py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Visual Element */}
            <div className="relative aspect-square max-w-md mx-auto lg:mx-0">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-burnt-lilac/20 to-deep-purple/40 border border-mist-lilac/10" />
              <div className="absolute inset-4 rounded-2xl bg-gradient-to-br from-deep-purple/30 to-black border border-mist-lilac/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[200px] font-serif text-mist-lilac/10">L</span>
              </div>
              {/* Decorative rings */}
              <div className="absolute inset-0 border-2 border-burnt-lilac/20 rounded-3xl animate-pulse" style={{ animationDuration: '3s' }} />
              <div className="absolute -inset-4 border border-mist-lilac/10 rounded-[2rem]" />
            </div>

            {/* Content */}
            <div className="space-y-8">
              <div>
                <span className="text-burnt-lilac text-sm font-medium tracking-wider uppercase">Our Journey</span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-mist-lilac mt-4 mb-6">
                  Born from Passion
                </h2>
              </div>

              <div className="space-y-6 text-mist-lilac/70 text-lg leading-relaxed">
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

              <Link 
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-burnt-lilac text-white font-semibold rounded-full hover:bg-burnt-lilac/80 transition-all duration-300 group"
              >
                Explore Collection
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative z-10 py-24 bg-gradient-to-b from-deep-purple/10 via-transparent to-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-burnt-lilac text-sm font-medium tracking-wider uppercase">What Drives Us</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-mist-lilac mt-4">Our Values</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-gradient-to-br from-deep-purple/20 to-transparent border border-mist-lilac/10 hover:border-burnt-lilac/30 transition-all duration-500"
                style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both` }}
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-burnt-lilac/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-burnt-lilac/10 border border-burnt-lilac/20 flex items-center justify-center text-burnt-lilac mb-6 group-hover:scale-110 group-hover:bg-burnt-lilac/20 transition-all duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-mist-lilac mb-3">{value.title}</h3>
                  <p className="text-mist-lilac/60 leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="relative p-12 rounded-3xl bg-gradient-to-br from-burnt-lilac/20 to-deep-purple/30 border border-mist-lilac/10 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(214,197,220,0.3) 1px, transparent 0)',
                backgroundSize: '32px 32px',
              }} />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-mist-lilac mb-6">
                Ready to Stand Out?
              </h2>
              <p className="text-mist-lilac/60 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of customers who have discovered their unique style with Luminix.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/products"
                  className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-mist-lilac transition-colors"
                >
                  Shop Now
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-transparent border border-mist-lilac/30 text-mist-lilac font-semibold rounded-full hover:bg-mist-lilac/10 transition-colors"
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
      `}</style>
    </div>
  );
}
