'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const cookieTypes = [
  {
    id: 'essential',
    name: 'Essential Cookies',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    description: 'Required for the website to function properly. These cannot be disabled.',
    examples: ['Session management', 'Shopping cart', 'Security tokens', 'Login authentication'],
    required: true,
    color: 'green',
  },
  {
    id: 'analytics',
    name: 'Analytics Cookies',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    description: 'Help us understand how visitors interact with our website.',
    examples: ['Google Analytics', 'Page views', 'Traffic sources', 'User behavior'],
    required: false,
    color: 'blue',
  },
  {
    id: 'marketing',
    name: 'Marketing Cookies',
    icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z',
    description: 'Used to deliver personalized advertisements and track ad campaign performance.',
    examples: ['Facebook Pixel', 'Google Ads', 'Retargeting ads', 'Social media tracking'],
    required: false,
    color: 'orange',
  },
  {
    id: 'preferences',
    name: 'Preference Cookies',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    description: 'Remember your preferences and settings for a better experience.',
    examples: ['Language settings', 'Currency preference', 'Theme preferences', 'Recently viewed'],
    required: false,
    color: 'purple',
  },
];

const colorClasses: Record<string, { bg: string; text: string; border: string; shadow: string }> = {
  green: { bg: 'from-green-500/20 to-burnt-lilac/20', text: 'text-green-400', border: 'border-green-500/30', shadow: 'shadow-green-500/10' },
  blue: { bg: 'from-blue-500/20 to-burnt-lilac/20', text: 'text-blue-400', border: 'border-blue-500/30', shadow: 'shadow-blue-500/10' },
  orange: { bg: 'from-orange-500/20 to-burnt-lilac/20', text: 'text-orange-400', border: 'border-orange-500/30', shadow: 'shadow-orange-500/10' },
  purple: { bg: 'from-purple-500/20 to-burnt-lilac/20', text: 'text-purple-400', border: 'border-purple-500/30', shadow: 'shadow-purple-500/10' },
};

export default function CookiePolicyPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState<Record<string, boolean>>({
    essential: true,
    analytics: false,
    marketing: false,
    preferences: true,
  });
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

  const handleToggle = (id: string) => {
    if (id === 'essential') return; // Essential cookies can't be disabled
    setCookiePreferences((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const savePreferences = () => {
    // In production, this would save to localStorage and update consent
    console.log('Saving preferences:', cookiePreferences);
    alert('Your cookie preferences have been saved!');
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
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[80px]" style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.1) 0%, transparent 70%)', right: '10%', top: '20%' }} />
        <div className="absolute w-[300px] h-[300px] rounded-full blur-[60px] animate-pulse" style={{ background: 'radial-gradient(circle, rgba(111,78,124,0.2) 0%, transparent 70%)', left: '5%', bottom: '30%' }} />
      </div>

      {/* Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-5" style={{ backgroundImage: `linear-gradient(rgba(214,197,220,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(214,197,220,0.1) 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-16 overflow-hidden">
        <div ref={heroRef} className="absolute inset-0 z-0">
          <div className="absolute top-20 left-[10%] w-20 h-20 border border-amber-500/20 rounded-full animate-float" />
          <div className="absolute top-40 right-[15%] w-32 h-32 border border-mist-lilac/10 rounded-full animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 left-[20%] w-16 h-16 bg-amber-500/5 rounded-lg rotate-45 animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <nav className={`flex items-center justify-center gap-2 text-sm text-mist-lilac/60 mb-8 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Link href="/" className="hover:text-burnt-lilac transition-colors">Home</Link>
              <span>/</span>
              <span className="text-mist-lilac">Cookie Policy</span>
            </nav>

            <div className={`relative mx-auto w-24 h-24 mb-8 transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-burnt-lilac/20 rounded-2xl rotate-6 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-br from-deep-purple/80 to-amber-900/50 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                <span className="text-5xl">🍪</span>
              </div>
            </div>

            <h1 className={`text-4xl sm:text-5xl md:text-6xl font-serif mb-4 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <span className="bg-gradient-to-r from-white via-amber-200 to-burnt-lilac bg-clip-text text-transparent">
                Cookie Policy
              </span>
            </h1>
            <p className={`text-mist-lilac/70 max-w-2xl mx-auto text-base sm:text-lg transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              We use cookies to enhance your browsing experience. Learn more about the cookies we use and manage your preferences.
            </p>
            <p className={`text-mist-lilac/50 text-sm mt-4 transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
              Last updated: January 2025
            </p>
          </div>
        </div>
      </section>

      {/* What Are Cookies */}
      <section className="relative z-10 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sm:p-8 mb-8 transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-xl sm:text-2xl font-serif text-mist-lilac mb-4">What Are Cookies?</h2>
            <p className="text-mist-lilac/70 leading-relaxed">
              Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and give website owners useful information about how their site is being used.
            </p>
          </div>
        </div>
      </section>

      {/* Cookie Types */}
      <section className="relative z-10 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-2xl sm:text-3xl font-serif text-center mb-8 transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="bg-gradient-to-r from-mist-lilac to-burnt-lilac bg-clip-text text-transparent">
              Types of Cookies We Use
            </span>
          </h2>

          <div className="space-y-6">
            {cookieTypes.map((cookie, index) => {
              const colors = colorClasses[cookie.color];
              return (
                <div
                  key={cookie.id}
                  className={`bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 transition-all duration-700 hover:${colors.border} hover:shadow-lg hover:${colors.shadow} ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${500 + index * 100}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                      <svg className={`w-6 h-6 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={cookie.icon} />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-mist-lilac">{cookie.name}</h3>
                        <button
                          onClick={() => handleToggle(cookie.id)}
                          disabled={cookie.required}
                          className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                            cookiePreferences[cookie.id] 
                              ? cookie.color === 'green' ? 'bg-green-500' : cookie.color === 'blue' ? 'bg-blue-500' : cookie.color === 'orange' ? 'bg-orange-500' : 'bg-purple-500'
                              : 'bg-white/20'
                          } ${cookie.required ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                        >
                          <span
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                              cookiePreferences[cookie.id] ? 'translate-x-6' : ''
                            }`}
                          />
                        </button>
                      </div>
                      <p className="text-mist-lilac/70 text-sm mb-3">{cookie.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {cookie.examples.map((example, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-white/5 rounded-full text-xs text-mist-lilac/60"
                          >
                            {example}
                          </span>
                        ))}
                      </div>
                      {cookie.required && (
                        <p className="text-green-400/70 text-xs mt-2 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Always active - required for website functionality
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Save Preferences Button */}
          <div className={`mt-8 text-center transition-all duration-700 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <button
              onClick={savePreferences}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-burnt-lilac rounded-xl text-white font-medium hover:shadow-lg hover:shadow-amber-500/30 hover:scale-105 transition-all duration-300"
            >
              Save My Preferences
            </button>
          </div>
        </div>
      </section>

      {/* Managing Cookies */}
      <section className="relative z-10 py-12 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`bg-gradient-to-br from-amber-900/20 to-burnt-lilac/10 rounded-2xl border border-white/10 p-8 transition-all duration-700 delay-800 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h3 className="text-xl sm:text-2xl font-serif text-mist-lilac mb-4 text-center">Managing Cookies in Your Browser</h3>
            <p className="text-mist-lilac/70 mb-6 text-center">
              You can also control cookies through your browser settings. Most browsers allow you to:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-white/5 rounded-xl p-4 text-mist-lilac/70 text-sm">
                • View what cookies are stored
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-mist-lilac/70 text-sm">
                • Delete individual or all cookies
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-mist-lilac/70 text-sm">
                • Block third-party cookies
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-mist-lilac/70 text-sm">
                • Block all cookies
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/privacy" className="px-6 py-3 bg-gradient-to-r from-amber-500 to-burnt-lilac rounded-xl text-white font-medium hover:shadow-lg hover:shadow-amber-500/30 hover:scale-105 transition-all duration-300">
                Privacy Policy
              </Link>
              <Link href="/contact" className="px-6 py-3 bg-white/5 backdrop-blur-sm rounded-xl text-mist-lilac border border-white/10 hover:bg-white/10 hover:border-amber-500/30 transition-all duration-300">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-0" />
    </div>
  );
}
