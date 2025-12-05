'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ReturnsPage() {
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

  const steps = [
    {
      number: '01',
      title: 'Contact Us',
      description: 'Reach out to our support team to initiate your return request.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      number: '02',
      title: 'Pack Your Items',
      description: 'Securely pack items in original packaging with all tags attached.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      number: '03',
      title: 'Ship It Back',
      description: 'Print and attach the return label we send, then drop off your package.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
    },
    {
      number: '04',
      title: 'Get Refunded',
      description: 'Once received, your refund will be processed within 5-7 business days.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const policies = [
    { title: '30-Day Window', desc: 'Return within 30 days of delivery' },
    { title: 'Original Condition', desc: 'Items must be unworn with tags' },
    { title: 'Free Returns', desc: 'On all domestic orders' },
    { title: 'Easy Exchange', desc: 'Swap sizes hassle-free' },
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
            <span className="text-burnt-lilac text-sm font-medium tracking-wider uppercase">Hassle-Free</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-white via-mist-lilac to-burnt-lilac/50 mb-6 leading-tight">
            Returns
            <br />
            <span className="italic">& Exchanges</span>
          </h1>

          <p className="text-mist-lilac/60 max-w-xl mx-auto text-lg">
            We want you to love your purchase. If not, we make returns easy.
          </p>
        </div>
      </section>

      {/* Policy Highlights */}
      <section className="relative z-10 py-12 border-y border-mist-lilac/10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {policies.map((policy, index) => (
              <div 
                key={index} 
                className="text-center p-4"
                style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-burnt-lilac/10 border border-burnt-lilac/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-burnt-lilac" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-mist-lilac font-semibold mb-1">{policy.title}</h3>
                <p className="text-mist-lilac/50 text-sm">{policy.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-burnt-lilac text-sm font-medium tracking-wider uppercase">Simple Process</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-mist-lilac mt-4">How to Return</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="group relative p-6 rounded-2xl bg-gradient-to-br from-deep-purple/30 to-black border border-mist-lilac/10 hover:border-burnt-lilac/30 transition-all duration-500"
                style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both` }}
              >
                <div className="absolute inset-0 rounded-2xl bg-burnt-lilac/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-bold text-burnt-lilac/20">{step.number}</span>
                    <div className="w-12 h-12 rounded-xl bg-burnt-lilac/10 border border-burnt-lilac/20 flex items-center justify-center text-burnt-lilac group-hover:scale-110 transition-transform">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-mist-lilac mb-2">{step.title}</h3>
                  <p className="text-mist-lilac/60 text-sm leading-relaxed">{step.description}</p>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-burnt-lilac/30 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Refund Info */}
      <section className="relative z-10 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-deep-purple/30 to-black border border-mist-lilac/10 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-burnt-lilac/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-deep-purple/40 rounded-full blur-3xl" />
            
            <div className="relative z-10 grid sm:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-mist-lilac mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-burnt-lilac" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Refund Timeline
                </h3>
                <p className="text-mist-lilac/60 leading-relaxed">
                  Once we receive your return, please allow 5-7 business days for processing. 
                  Refunds will be issued to your original payment method.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-mist-lilac mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-burnt-lilac" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  Exchanges
                </h3>
                <p className="text-mist-lilac/60 leading-relaxed">
                  Need a different size? We offer free exchanges on all orders. 
                  Simply contact us and we will arrange the swap.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-16 pb-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-serif text-mist-lilac mb-4">Questions About Returns?</h2>
          <p className="text-mist-lilac/60 mb-8 max-w-xl mx-auto">
            Our support team is here to help you with any questions about our return policy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 bg-burnt-lilac text-white font-semibold rounded-full hover:bg-burnt-lilac/80 transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/products"
              className="px-8 py-4 bg-transparent border border-mist-lilac/30 text-mist-lilac font-semibold rounded-full hover:bg-mist-lilac/10 transition-colors"
            >
              Continue Shopping
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
