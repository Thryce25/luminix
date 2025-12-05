'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const privacySections = [
  {
    id: 'collection',
    title: 'Information We Collect',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    content: [
      'Personal information (name, email, phone number, shipping address)',
      'Payment information processed securely through Shopify',
      'Order history and preferences',
      'Device and browser information for analytics',
      'Cookies and tracking data for improved experience',
    ],
  },
  {
    id: 'usage',
    title: 'How We Use Your Information',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    content: [
      'Process and fulfill your orders',
      'Send order confirmations and shipping updates',
      'Improve our products and services',
      'Personalize your shopping experience',
      'Send marketing communications (with your consent)',
    ],
  },
  {
    id: 'protection',
    title: 'Data Protection',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    content: [
      'SSL encryption for all data transmission',
      'Secure payment processing through Shopify',
      'Regular security audits and updates',
      'Limited access to personal information',
      'Data stored on secure, encrypted servers',
    ],
  },
  {
    id: 'rights',
    title: 'Your Rights',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    content: [
      'Access your personal information at any time',
      'Request correction of inaccurate data',
      'Request deletion of your data',
      'Opt-out of marketing communications',
      'Data portability upon request',
    ],
  },
  {
    id: 'cookies',
    title: 'Cookies & Tracking',
    icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
    content: [
      'Essential cookies for site functionality',
      'Analytics cookies to improve our service',
      'Marketing cookies (with your consent)',
      'You can manage cookie preferences in your browser',
      'See our Cookie Policy for more details',
    ],
  },
];

export default function PrivacyPolicyPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
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
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[80px]" style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)', right: '10%', top: '20%' }} />
        <div className="absolute w-[300px] h-[300px] rounded-full blur-[60px] animate-pulse" style={{ background: 'radial-gradient(circle, rgba(111,78,124,0.2) 0%, transparent 70%)', left: '5%', bottom: '30%' }} />
      </div>

      {/* Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-5" style={{ backgroundImage: `linear-gradient(rgba(214,197,220,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(214,197,220,0.1) 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-16 overflow-hidden">
        <div ref={heroRef} className="absolute inset-0 z-0">
          <div className="absolute top-20 left-[10%] w-20 h-20 border border-green-500/20 rounded-full animate-float" />
          <div className="absolute top-40 right-[15%] w-32 h-32 border border-mist-lilac/10 rounded-full animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 left-[20%] w-16 h-16 bg-green-500/5 rounded-lg rotate-45 animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <nav className={`flex items-center justify-center gap-2 text-sm text-mist-lilac/60 mb-8 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Link href="/" className="hover:text-burnt-lilac transition-colors">Home</Link>
              <span>/</span>
              <span className="text-mist-lilac">Privacy Policy</span>
            </nav>

            <div className={`relative mx-auto w-24 h-24 mb-8 transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-burnt-lilac/20 rounded-2xl rotate-6 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-br from-deep-purple/80 to-green-900/50 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>

            <h1 className={`text-4xl sm:text-5xl md:text-6xl font-serif mb-4 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <span className="bg-gradient-to-r from-white via-green-200 to-burnt-lilac bg-clip-text text-transparent">
                Privacy Policy
              </span>
            </h1>
            <p className={`text-mist-lilac/70 max-w-2xl mx-auto text-base sm:text-lg transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Your privacy matters to us. Learn how we collect, use, and protect your information.
            </p>
            <p className={`text-mist-lilac/50 text-sm mt-4 transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
              Last updated: January 2025
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Sections */}
      <section className="relative z-10 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {privacySections.map((section, index) => (
              <div
                key={section.id}
                className={`bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden transition-all duration-700 hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/10 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${400 + index * 100}ms` }}
              >
                <button
                  onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                  className="w-full p-6 flex items-center gap-4 text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-burnt-lilac/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={section.icon} />
                    </svg>
                  </div>
                  <h2 className="flex-1 text-lg sm:text-xl font-medium text-mist-lilac">{section.title}</h2>
                  <svg
                    className={`w-5 h-5 text-mist-lilac/50 transition-transform duration-300 ${activeSection === section.id ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${activeSection === section.id ? 'max-h-96' : 'max-h-0'}`}>
                  <ul className="px-6 pb-6 space-y-3">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-mist-lilac/70">
                        <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative z-10 py-12 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`bg-gradient-to-br from-green-900/20 to-burnt-lilac/10 rounded-2xl border border-white/10 p-8 text-center transition-all duration-700 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h3 className="text-xl sm:text-2xl font-serif text-mist-lilac mb-4">Questions About Privacy?</h3>
            <p className="text-mist-lilac/70 mb-6">
              If you have any questions about our privacy practices, please don't hesitate to reach out.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="px-6 py-3 bg-gradient-to-r from-green-500 to-burnt-lilac rounded-xl text-white font-medium hover:shadow-lg hover:shadow-green-500/30 hover:scale-105 transition-all duration-300">
                Contact Us
              </Link>
              <Link href="/cookies" className="px-6 py-3 bg-white/5 backdrop-blur-sm rounded-xl text-mist-lilac border border-white/10 hover:bg-white/10 hover:border-green-500/30 transition-all duration-300">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-0" />
    </div>
  );
}
