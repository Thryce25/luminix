'use client';

import { useState } from 'react';
import Link from 'next/link';
import FloatingBackground from '@/components/common/FloatingBackground';

export default function SizeGuidePage() {
  const [activeTab, setActiveTab] = useState<'men' | 'women'>('men');

  const menSizes = [
    { size: 'S', chest: '34-36', waist: '28-30', sleeve: '32-33' },
    { size: 'M', chest: '38-40', waist: '32-34', sleeve: '33-34' },
    { size: 'L', chest: '42-44', waist: '36-38', sleeve: '34-35' },
    { size: 'XL', chest: '46-48', waist: '40-42', sleeve: '35-36' },
    { size: 'XXL', chest: '50-52', waist: '44-46', sleeve: '36-37' },
  ];

  const womenSizes = [
    { size: 'XS', bust: '31-32', waist: '24-25', hips: '34-35' },
    { size: 'S', bust: '33-34', waist: '26-27', hips: '36-37' },
    { size: 'M', bust: '35-36', waist: '28-29', hips: '38-39' },
    { size: 'L', bust: '37-39', waist: '30-32', hips: '40-42' },
    { size: 'XL', bust: '40-42', waist: '33-35', hips: '43-45' },
  ];

  const measurementTips = [
    { area: 'Chest/Bust', tip: 'Measure around the fullest part of your chest, keeping the tape horizontal.' },
    { area: 'Waist', tip: 'Measure around your natural waistline, keeping the tape comfortably loose.' },
    { area: 'Hips', tip: 'Measure around the fullest part of your hips, about 8 inches below your waist.' },
    { area: 'Sleeve', tip: 'Measure from the center back of your neck, over your shoulder, down to your wrist.' },
  ];

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Jaw-dropping Animated Background */}
      <FloatingBackground />

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

        <div className="relative z-10 text-center px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-burnt-lilac/10 border border-burnt-lilac/20 mb-6">
            <span className="w-2 h-2 bg-burnt-lilac rounded-full animate-pulse" />
            <span className="text-burnt-lilac text-sm font-medium tracking-wider uppercase">Perfect Fit</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-transparent bg-clip-text bg-linear-to-b from-white via-mist-lilac to-burnt-lilac/50 mb-6 leading-tight">
            Size
            <br />
            <span className="italic">Guide</span>
          </h1>

          <p className="text-mist-lilac/60 max-w-xl mx-auto text-lg">
            Find your perfect fit with our comprehensive size charts and measuring tips.
          </p>
        </div>
      </section>

      {/* Size Charts */}
      <section className="relative z-10 py-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Tab Buttons */}
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => setActiveTab('men')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'men'
                  ? 'bg-burnt-lilac text-white'
                  : 'bg-deep-purple/30 text-mist-lilac/70 hover:bg-deep-purple/50'
              }`}
            >
              Men&apos;s Sizes
            </button>
            <button
              onClick={() => setActiveTab('women')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'women'
                  ? 'bg-burnt-lilac text-white'
                  : 'bg-deep-purple/30 text-mist-lilac/70 hover:bg-deep-purple/50'
              }`}
            >
              Women&apos;s Sizes
            </button>
          </div>

          {/* Size Table */}
          <div className="relative rounded-2xl overflow-hidden border border-mist-lilac/10 bg-linear-to-br from-deep-purple/20 to-black">
            <div className="absolute inset-0 bg-linear-to-br from-burnt-lilac/5 to-transparent" />
            
            <div className="relative overflow-x-auto">
              {activeTab === 'men' ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-mist-lilac/10">
                      <th className="px-6 py-4 text-left text-mist-lilac font-semibold">Size</th>
                      <th className="px-6 py-4 text-left text-mist-lilac font-semibold">Chest (in)</th>
                      <th className="px-6 py-4 text-left text-mist-lilac font-semibold">Waist (in)</th>
                      <th className="px-6 py-4 text-left text-mist-lilac font-semibold">Sleeve (in)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menSizes.map((row, index) => (
                      <tr 
                        key={row.size}
                        className="border-b border-mist-lilac/5 hover:bg-burnt-lilac/5 transition-colors"
                        style={{ animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both` }}
                      >
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-burnt-lilac/20 text-burnt-lilac font-bold">
                            {row.size}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-mist-lilac/70">{row.chest}</td>
                        <td className="px-6 py-4 text-mist-lilac/70">{row.waist}</td>
                        <td className="px-6 py-4 text-mist-lilac/70">{row.sleeve}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-mist-lilac/10">
                      <th className="px-6 py-4 text-left text-mist-lilac font-semibold">Size</th>
                      <th className="px-6 py-4 text-left text-mist-lilac font-semibold">Bust (in)</th>
                      <th className="px-6 py-4 text-left text-mist-lilac font-semibold">Waist (in)</th>
                      <th className="px-6 py-4 text-left text-mist-lilac font-semibold">Hips (in)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {womenSizes.map((row, index) => (
                      <tr 
                        key={row.size}
                        className="border-b border-mist-lilac/5 hover:bg-burnt-lilac/5 transition-colors"
                        style={{ animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both` }}
                      >
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-burnt-lilac/20 text-burnt-lilac font-bold">
                            {row.size}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-mist-lilac/70">{row.bust}</td>
                        <td className="px-6 py-4 text-mist-lilac/70">{row.waist}</td>
                        <td className="px-6 py-4 text-mist-lilac/70">{row.hips}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Size Tip */}
          <div className="mt-6 p-4 rounded-xl bg-burnt-lilac/10 border border-burnt-lilac/20 flex items-center gap-3">
            <svg className="w-5 h-5 text-burnt-lilac shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-mist-lilac/70 text-sm">
              <span className="text-burnt-lilac font-medium">Tip:</span> If you&apos;re between sizes, we recommend sizing up for a more comfortable fit.
            </p>
          </div>
        </div>
      </section>

      {/* How to Measure */}
      <section className="relative z-10 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-burnt-lilac text-sm font-medium tracking-wider uppercase">Get It Right</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-mist-lilac mt-4">How to Measure</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {measurementTips.map((item, index) => (
              <div
                key={index}
                className="group relative p-6 rounded-2xl bg-linear-to-br from-deep-purple/30 to-black border border-mist-lilac/10 hover:border-burnt-lilac/30 transition-all duration-500"
                style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
              >
                <div className="absolute inset-0 rounded-2xl bg-burnt-lilac/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                
                <div className="relative z-10 flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-burnt-lilac/10 border border-burnt-lilac/20 flex items-center justify-center text-burnt-lilac shrink-0 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-mist-lilac mb-2">{item.area}</h3>
                    <p className="text-mist-lilac/60 text-sm leading-relaxed">{item.tip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-16 pb-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="relative p-8 sm:p-12 rounded-3xl bg-linear-to-br from-deep-purple/30 to-black border border-mist-lilac/10 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-burnt-lilac/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-deep-purple/40 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-serif text-mist-lilac mb-4">Still Not Sure?</h2>
              <p className="text-mist-lilac/60 mb-8 max-w-xl mx-auto">
                Our team is happy to help you find the perfect size. Contact us with your measurements and we will recommend the best fit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-burnt-lilac text-white font-semibold rounded-full hover:bg-burnt-lilac/80 transition-colors"
                >
                  Get Help
                </Link>
                <Link
                  href="/products"
                  className="px-8 py-4 bg-transparent border border-mist-lilac/30 text-mist-lilac font-semibold rounded-full hover:bg-mist-lilac/10 transition-colors"
                >
                  Start Shopping
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
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
