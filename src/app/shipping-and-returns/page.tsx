'use client';

import Link from 'next/link';
import FloatingBackground from '@/components/common/FloatingBackground';

export default function ShippingAndReturnsPage() {

  const shippingOptions = [
    {
      name: 'Tamil Nadu',
      time: '3-5 business days',
      price: 'FREE',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      name: 'Other States',
      time: '5-7 business days',
      price: 'Rs.89',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      name: 'International',
      time: '10-21 business days',
      price: 'Based on country',
      note: 'Customs may apply',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const returnSteps = [
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

  const returnPolicies = [
    { title: '4-Day Window', desc: 'Return within 4 days of delivery' },
    { title: 'Original Condition', desc: 'Items must be unworn with tags' },
    { title: 'Free Returns', desc: 'On all domestic orders' },
    { title: 'Easy Exchange', desc: 'Swap sizes hassle-free' },
  ];

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <FloatingBackground />

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="relative z-10 text-center px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-burnt-lilac/10 border border-burnt-lilac/20 mb-6">
            <span className="w-2 h-2 bg-burnt-lilac rounded-full animate-pulse" />
            <span className="text-burnt-lilac text-sm font-medium tracking-wider uppercase">Complete Policy</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-transparent bg-clip-text bg-linear-to-b from-white via-mist-lilac to-burnt-lilac/50 mb-6 leading-tight">
            Shipping
            <br />
            <span className="italic">& Returns</span>
          </h1>

          <p className="text-mist-lilac/60 max-w-xl mx-auto text-lg">
            Everything you need to know about delivery and returns
          </p>
        </div>
      </section>

      {/* Shipping Section */}
      <section className="relative z-10 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-burnt-lilac" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <span className="text-burnt-lilac text-sm font-medium tracking-wider uppercase">Delivery</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-mist-lilac">Shipping Options</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {shippingOptions.map((option, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-linear-to-br from-deep-purple/30 to-black border border-mist-lilac/10 hover:border-burnt-lilac/30 transition-all duration-500"
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
                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-burnt-lilac to-mist-lilac">
                      {option.price}
                    </span>
                  </div>
                  {option.note && (
                    <p className="text-sm text-burnt-lilac/70 mt-2">{option.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Shipping Features */}
          <div className="relative p-8 sm:p-12 rounded-3xl bg-linear-to-br from-deep-purple/30 to-black border border-mist-lilac/10 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-burnt-lilac/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-deep-purple/40 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h3 className="text-2xl font-serif text-mist-lilac mb-8 text-center">What's Included</h3>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-burnt-lilac/10 border border-burnt-lilac/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-burnt-lilac" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-mist-lilac font-semibold mb-2">Real-time Tracking</h4>
                  <p className="text-mist-lilac/60 text-sm">Track your order every step of the way</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-burnt-lilac/10 border border-burnt-lilac/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-burnt-lilac" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-mist-lilac font-semibold mb-2">Secure Packaging</h4>
                  <p className="text-mist-lilac/60 text-sm">Premium packaging to protect your items</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-burnt-lilac/10 border border-burnt-lilac/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-burnt-lilac" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-mist-lilac font-semibold mb-2">Support Available</h4>
                  <p className="text-mist-lilac/60 text-sm">Questions? We're here to help</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="relative z-10 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="h-px bg-linear-to-r from-transparent via-burnt-lilac/30 to-transparent" />
        </div>
      </div>

      {/* Returns Section */}
      <section className="relative z-10 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-burnt-lilac" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span className="text-burnt-lilac text-sm font-medium tracking-wider uppercase">Easy Returns</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-mist-lilac">Return Policy</h2>
          </div>

          {/* Policy Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {returnPolicies.map((policy, index) => (
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

          {/* How to Return */}
          <div className="mb-12">
            <h3 className="text-2xl font-serif text-mist-lilac text-center mb-8">How to Return</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {returnSteps.map((step, index) => (
                <div
                  key={index}
                  className="group relative p-6 rounded-2xl bg-linear-to-br from-deep-purple/30 to-black border border-mist-lilac/10 hover:border-burnt-lilac/30 transition-all duration-500"
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

                  {index < returnSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-linear-to-r from-burnt-lilac/30 to-transparent" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Refund & Exchange Info */}
          <div className="relative p-8 sm:p-12 rounded-3xl bg-linear-to-br from-deep-purple/30 to-black border border-mist-lilac/10 overflow-hidden">
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
          <h2 className="text-2xl sm:text-3xl font-serif text-mist-lilac mb-4">Have Questions?</h2>
          <p className="text-mist-lilac/60 mb-8 max-w-xl mx-auto">
            Our support team is here to help with any questions about shipping or returns.
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
              Start Shopping
            </Link>
          </div>
        </div>
      </section>

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
