'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ShippingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const shippingOptions = [
    {
      name: 'Standard Shipping',
      time: '5-7 business days',
      price: '₹99',
      freeAbove: '₹999',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      name: 'Express Shipping',
      time: '2-3 business days',
      price: '₹199',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      name: 'Next Day Delivery',
      time: '1 business day',
      price: '₹349',
      note: 'Order before 2 PM',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const features = [
    { title: 'Real-time Tracking', desc: 'Track your order every step of the way' },
    { title: 'Secure Packaging', desc: 'Premium packaging to protect your items' },
    { title: 'Insurance Included', desc: 'All shipments are fully insured' },
    { title: 'Easy Returns', desc: '30-day hassle-free return policy' },
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
            backgroundImage: `linear-gradient(rgba(214,197,220,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(214,197,220,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full mix-blend-overlay"
              style={{
                width: `${Math.random() * 80 + 20}px`,
                height: `${Math.random() * 80 + 20}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: i % 2 === 0 
                  ? 'linear-gradient(135deg, rgba(111,78,124,0.3), transparent)'
                  : 'linear-gradient(135deg, rgba(214,197,220,0.2), transparent)',
                animation: `float ${10 + Math.random() * 10}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center px-4" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-burnt-lilac/10 border border-burnt-lilac/20 mb-6">
            <span className="w-2 h-2 bg-burnt-lilac rounded-full animate-pulse" />
            <span className="text-burnt-lilac text-sm font-medium tracking-wider uppercase">Fast & Reliable</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-white via-mist-lilac to-burnt-lilac/50 mb-6 leading-tight">
            Shipping
            <br />
            <span className="italic">& Delivery</span>
          </h1>

          <p className="text-mist-lilac/60 max-w-xl mx-auto text-lg">
            We deliver your style with care. Fast, tracked, and secure shipping across India.
          </p>
        </div>
      </section>

      {/* Shipping Options */}
      <section className="relative z-10 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-burnt-lilac text-sm font-medium tracking-wider uppercase">Choose Your Speed</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-mist-lilac mt-4">Shipping Options</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shippingOptions.map((option, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-gradient-to-br from-deep-purple/30 to-black border border-mist-lilac/10 hover:border-burnt-lilac/30 transition-all duration-500"
                style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
              >
                <div className="absolute inset-0 rounded-2xl bg-burnt-lilac/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-burnt-lilac/10 border border-burnt-lilac/20 flex items-center justify-center text-burnt-lilac mb-6 group-hover:scale-110 group-hover:bg-burnt-lilac/20 transition-all duration-300">
                    {option.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-mist-lilac mb-2">{option.name}</h3>
                  <p className="text-mist-lilac/60 mb-4">{option.time}</p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-burnt-lilac to-mist-lilac">
                      {option.price}
                    </span>
                  </div>
                  {option.freeAbove && (
                    <p className="text-sm text-green-400">FREE above {option.freeAbove}</p>
                  )}
                  {option.note && (
                    <p className="text-sm text-burnt-lilac/70 mt-2">{option.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-16 border-y border-mist-lilac/10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-4" style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}>
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-burnt-lilac/10 border border-burnt-lilac/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-burnt-lilac" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-mist-lilac font-semibold mb-1">{feature.title}</h3>
                <p className="text-mist-lilac/50 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* International Shipping */}
      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-deep-purple/30 to-black border border-mist-lilac/10 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-burnt-lilac/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-deep-purple/40 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-burnt-lilac/10 border border-burnt-lilac/20 flex items-center justify-center text-burnt-lilac">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif text-mist-lilac">International Shipping</h2>
              </div>
              
              <div className="space-y-4 text-mist-lilac/70">
                <p className="text-lg">We ship worldwide! International shipping times and costs vary by location.</p>
                <div className="grid sm:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 rounded-xl bg-black/30 border border-mist-lilac/10">
                    <p className="text-mist-lilac font-medium mb-1">Delivery Time</p>
                    <p className="text-mist-lilac/60">10-21 business days</p>
                  </div>
                  <div className="p-4 rounded-xl bg-black/30 border border-mist-lilac/10">
                    <p className="text-mist-lilac font-medium mb-1">Customs & Duties</p>
                    <p className="text-mist-lilac/60">May apply based on destination</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Order Tracking */}
      <section className="relative z-10 py-16 pb-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-serif text-mist-lilac mb-4">Track Your Order</h2>
          <p className="text-mist-lilac/60 mb-8 max-w-xl mx-auto">
            After your order ships, you will receive a tracking number via email. Track your package anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="px-8 py-4 bg-burnt-lilac text-white font-semibold rounded-full hover:bg-burnt-lilac/80 transition-colors"
            >
              Start Shopping
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 bg-transparent border border-mist-lilac/30 text-mist-lilac font-semibold rounded-full hover:bg-mist-lilac/10 transition-colors"
            >
              Need Help?
            </Link>
          </div>
        </div>
      </section>

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
