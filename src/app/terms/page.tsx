'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const termsSections = [
  {
    id: 'general',
    title: '1. General Terms',
    content: `By accessing and using the LUMINIX website, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.

These terms apply to all visitors, users, and customers of our website. We reserve the right to update these terms at any time, and we will notify you of any changes by posting the new Terms of Service on this page.`,
  },
  {
    id: 'account',
    title: '2. Account & Registration',
    content: `When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding your account credentials and for any activities or actions under your account.

You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account. We reserve the right to refuse service, terminate accounts, or cancel orders at our sole discretion.`,
  },
  {
    id: 'products',
    title: '3. Products & Pricing',
    content: `All products displayed on our website are subject to availability. We strive to display accurate colors and images, but we cannot guarantee that your device's display accurately reflects the actual product.

Prices for our products are subject to change without notice. We reserve the right to modify or discontinue any product at any time. We shall not be liable to you or any third party for any modification, price change, or discontinuance.`,
  },
  {
    id: 'orders',
    title: '4. Orders & Payment',
    content: `By placing an order, you warrant that you are legally capable of entering into binding contracts. All orders are subject to acceptance and availability.

We accept various payment methods processed securely through Shopify. You agree to provide current, complete, and accurate purchase information. We reserve the right to refuse or cancel any order for any reason.`,
  },
  {
    id: 'shipping',
    title: '5. Shipping & Delivery',
    content: `We offer shipping across India. Delivery times are estimates and not guaranteed. We are not responsible for delays caused by shipping carriers, customs, or events beyond our control.

Risk of loss and title for items pass to you upon delivery to the carrier. Please refer to our Shipping Policy for more detailed information about delivery options and timeframes.`,
  },
  {
    id: 'returns',
    title: '6. Returns & Refunds',
    content: `We want you to be completely satisfied with your purchase. If you are not satisfied, you may return eligible items within 7 days of delivery for a refund or exchange.

Items must be unworn, unwashed, and in their original condition with all tags attached. Certain items may be final sale and not eligible for return. Please see our Returns Policy for complete details.`,
  },
  {
    id: 'intellectual',
    title: '7. Intellectual Property',
    content: `All content on this website, including text, graphics, logos, images, and software, is the property of LUMINIX and is protected by copyright and other intellectual property laws.

You may not reproduce, distribute, modify, or create derivative works from any content without our express written permission. Unauthorized use may violate copyright, trademark, and other laws.`,
  },
  {
    id: 'liability',
    title: '8. Limitation of Liability',
    content: `LUMINIX shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services or products.

Our total liability for any claims arising from these terms or your use of our services shall not exceed the amount paid by you for the relevant product or service.`,
  },
  {
    id: 'contact',
    title: '9. Contact Information',
    content: `If you have any questions about these Terms of Service, please contact us at:

Email: support@luminixclothing.com
Website: luminixclothing.com

We will respond to your inquiry within 24-48 business hours.`,
  },
];

export default function TermsPage() {
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
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[80px]" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)', right: '10%', top: '20%' }} />
        <div className="absolute w-[300px] h-[300px] rounded-full blur-[60px] animate-pulse" style={{ background: 'radial-gradient(circle, rgba(111,78,124,0.2) 0%, transparent 70%)', left: '5%', bottom: '30%' }} />
      </div>

      {/* Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-5" style={{ backgroundImage: `linear-gradient(rgba(214,197,220,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(214,197,220,0.1) 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-16 overflow-hidden">
        <div ref={heroRef} className="absolute inset-0 z-0">
          <div className="absolute top-20 left-[10%] w-20 h-20 border border-purple-500/20 rounded-full animate-float" />
          <div className="absolute top-40 right-[15%] w-32 h-32 border border-mist-lilac/10 rounded-full animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 left-[20%] w-16 h-16 bg-purple-500/5 rounded-lg rotate-45 animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <nav className={`flex items-center justify-center gap-2 text-sm text-mist-lilac/60 mb-8 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Link href="/" className="hover:text-burnt-lilac transition-colors">Home</Link>
              <span>/</span>
              <span className="text-mist-lilac">Terms of Service</span>
            </nav>

            <div className={`relative mx-auto w-24 h-24 mb-8 transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-burnt-lilac/20 rounded-2xl rotate-6 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-br from-deep-purple/80 to-purple-900/50 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>

            <h1 className={`text-4xl sm:text-5xl md:text-6xl font-serif mb-4 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <span className="bg-gradient-to-r from-white via-purple-200 to-burnt-lilac bg-clip-text text-transparent">
                Terms of Service
              </span>
            </h1>
            <p className={`text-mist-lilac/70 max-w-2xl mx-auto text-base sm:text-lg transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Please read these terms carefully before using our services
            </p>
            <p className={`text-mist-lilac/50 text-sm mt-4 transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
              Last updated: January 2025
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="relative z-10 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Table of Contents */}
          <div className={`bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-8 transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-lg font-medium text-mist-lilac mb-4">Table of Contents</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {termsSections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-mist-lilac/70 hover:text-purple-400 text-sm transition-colors"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </div>

          {/* Terms Sections */}
          <div className="space-y-6">
            {termsSections.map((section, index) => (
              <div
                key={section.id}
                id={section.id}
                className={`bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sm:p-8 transition-all duration-700 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${500 + index * 50}ms` }}
              >
                <h2 className="text-xl sm:text-2xl font-serif text-mist-lilac mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-burnt-lilac/20 flex items-center justify-center text-purple-400 text-sm font-bold">
                    {index + 1}
                  </span>
                  {section.title.replace(/^\d+\.\s*/, '')}
                </h2>
                <div className="text-mist-lilac/70 whitespace-pre-line leading-relaxed">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agreement Section */}
      <section className="relative z-10 py-12 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`bg-gradient-to-br from-purple-900/20 to-burnt-lilac/10 rounded-2xl border border-white/10 p-8 text-center transition-all duration-700 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-burnt-lilac/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif text-mist-lilac mb-4">By Using Our Services</h3>
            <p className="text-mist-lilac/70 mb-6 max-w-2xl mx-auto">
              You acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you have any questions, please contact us.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="px-6 py-3 bg-gradient-to-r from-purple-500 to-burnt-lilac rounded-xl text-white font-medium hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300">
                Contact Us
              </Link>
              <Link href="/privacy" className="px-6 py-3 bg-white/5 backdrop-blur-sm rounded-xl text-mist-lilac border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-0" />
    </div>
  );
}
