'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const orderStatuses = [
  { id: 1, status: 'Order Placed', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
  { id: 2, status: 'Processing', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  { id: 3, status: 'Shipped', icon: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0' },
  { id: 4, status: 'Out for Delivery', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
  { id: 5, status: 'Delivered', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
];

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    // Simulate search - in production, this would call Shopify API
    setTimeout(() => setIsSearching(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-500" style={{ opacity: isLoaded ? 1 : 0 }}>
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-[100px] transition-transform duration-1000"
          style={{
            background: 'radial-gradient(circle, rgba(111,78,124,0.15) 0%, transparent 70%)',
            left: mousePosition.x - 300,
            top: mousePosition.y - 300,
          }}
        />
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[80px]" style={{ background: 'radial-gradient(circle, rgba(214,197,220,0.1) 0%, transparent 70%)', right: '10%', top: '20%' }} />
        <div className="absolute w-[300px] h-[300px] rounded-full blur-[60px] animate-pulse" style={{ background: 'radial-gradient(circle, rgba(111,78,124,0.2) 0%, transparent 70%)', left: '5%', bottom: '30%' }} />
      </div>

      {/* Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-5" style={{ backgroundImage: `linear-gradient(rgba(214,197,220,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(214,197,220,0.1) 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-16 overflow-hidden">
        <div ref={heroRef} className="absolute inset-0 z-0">
          <div className="absolute top-20 left-[10%] w-20 h-20 border border-blue-500/20 rounded-full animate-float" />
          <div className="absolute top-40 right-[15%] w-32 h-32 border border-mist-lilac/10 rounded-full animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 left-[20%] w-16 h-16 bg-blue-500/5 rounded-lg rotate-45 animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <nav className={`flex items-center justify-center gap-2 text-sm text-mist-lilac/60 mb-8 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Link href="/" className="hover:text-burnt-lilac transition-colors">Home</Link>
              <span>/</span>
              <span className="text-mist-lilac">Track Order</span>
            </nav>

            <div className={`relative mx-auto w-24 h-24 mb-8 transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-burnt-lilac/20 rounded-2xl rotate-6 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-br from-deep-purple/80 to-blue-900/50 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>

            <h1 className={`text-4xl sm:text-5xl md:text-6xl font-serif mb-4 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <span className="bg-gradient-to-r from-white via-blue-200 to-burnt-lilac bg-clip-text text-transparent">
                Track Your Order
              </span>
            </h1>
            <p className={`text-mist-lilac/70 max-w-2xl mx-auto text-base sm:text-lg transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Enter your order details to see the current status
            </p>
          </div>
        </div>
      </section>

      {/* Track Order Form */}
      <section className="relative z-10 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sm:p-8 transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="orderNumber" className="block text-sm text-mist-lilac mb-2">Order Number</label>
                <input
                  type="text"
                  id="orderNumber"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g., #LUMINIX-1234"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-mist-lilac placeholder-mist-lilac/40 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm text-mist-lilac mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-mist-lilac placeholder-mist-lilac/40 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-burnt-lilac rounded-xl text-white font-medium hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSearching ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Track Order
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Order Status Timeline */}
      <section className="relative z-10 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-2xl sm:text-3xl font-serif text-center mb-12 transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="bg-gradient-to-r from-mist-lilac to-burnt-lilac bg-clip-text text-transparent">
              Order Status Timeline
            </span>
          </h2>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-burnt-lilac/50 to-mist-lilac/20" />

            {orderStatuses.map((item, index) => (
              <div
                key={item.id}
                className={`relative flex items-center mb-8 sm:mb-12 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-20px]'}`}
                style={{ transitionDelay: `${600 + index * 100}ms` }}
              >
                {/* Timeline Dot */}
                <div className="absolute left-8 sm:left-1/2 w-4 h-4 -ml-2 bg-gradient-to-r from-blue-500 to-burnt-lilac rounded-full shadow-lg shadow-blue-500/30" />

                {/* Content Card */}
                <div className={`ml-20 sm:ml-0 ${index % 2 === 0 ? 'sm:mr-[calc(50%+2rem)] sm:text-right' : 'sm:ml-[calc(50%+2rem)]'} flex-1`}>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 sm:p-6 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group">
                    <div className={`flex items-center gap-3 ${index % 2 === 0 ? 'sm:justify-end' : ''}`}>
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-burnt-lilac/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-mist-lilac">{item.status}</h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="relative z-10 py-12 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`bg-gradient-to-br from-blue-900/20 to-burnt-lilac/10 rounded-2xl border border-white/10 p-8 text-center transition-all duration-700 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h3 className="text-xl sm:text-2xl font-serif text-mist-lilac mb-4">Need Help?</h3>
            <p className="text-mist-lilac/70 mb-6">
              If you have any questions about your order, our support team is here to help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="px-6 py-3 bg-gradient-to-r from-blue-500 to-burnt-lilac rounded-xl text-white font-medium hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300">
                Contact Support
              </Link>
              <Link href="/shipping" className="px-6 py-3 bg-white/5 backdrop-blur-sm rounded-xl text-mist-lilac border border-white/10 hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300">
                Shipping Info
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-0" />
    </div>
  );
}
