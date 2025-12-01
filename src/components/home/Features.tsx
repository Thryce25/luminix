'use client';

import { useState } from 'react';

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
    title: 'Free Shipping',
    description: 'Free delivery on orders over $100',
    detail: 'We offer complimentary standard shipping on all orders over $100. Express shipping options available at checkout.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Secure Payment',
    description: 'Protected transactions',
    detail: 'All payments are processed through secure, encrypted connections. We accept all major credit cards and PayPal.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: 'Easy Returns',
    description: '30-day return policy',
    detail: 'Not satisfied? Return any unused item within 30 days for a full refund. Free returns on all orders.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: '24/7 Support',
    description: 'Always here to help',
    detail: 'Our dedicated support team is available 24/7 via chat, email, or phone to assist with any questions.',
  },
];

export default function Features() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  return (
    <section className="py-12 lg:py-16 bg-deep-purple/5 border-y border-mist-lilac/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative group cursor-pointer"
              onMouseEnter={() => setActiveFeature(index)}
              onMouseLeave={() => setActiveFeature(null)}
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 p-4 rounded-xl hover:bg-black/30 transition-colors">
                <div className="w-12 h-12 shrink-0 rounded-full bg-burnt-lilac/10 flex items-center justify-center text-burnt-lilac group-hover:bg-burnt-lilac/20 transition-colors">
                  {feature.icon}
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-mist-lilac font-medium text-sm lg:text-base">
                    {feature.title}
                  </h3>
                  <p className="text-mist-lilac/50 text-xs lg:text-sm mt-0.5">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* Tooltip */}
              {activeFeature === index && (
                <div className="hidden lg:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-4 bg-black border border-mist-lilac/20 rounded-lg shadow-xl z-10 animate-fade-in">
                  <p className="text-mist-lilac/80 text-sm leading-relaxed">
                    {feature.detail}
                  </p>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black border-r border-b border-mist-lilac/20 rotate-45" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Newsletter Banner */}
        <div className="mt-12 p-6 lg:p-8 bg-linear-to-r from-deep-purple/20 via-burnt-lilac/10 to-deep-purple/20 rounded-2xl border border-mist-lilac/10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-xl lg:text-2xl font-serif text-mist-lilac mb-2">
                Join the Dark Side
              </h3>
              <p className="text-mist-lilac/60 text-sm lg:text-base">
                Subscribe for exclusive offers, early access to new collections, and 10% off your first order.
              </p>
            </div>
            <form className="flex w-full lg:w-auto gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 lg:w-64 px-4 py-3 bg-black/50 border border-mist-lilac/20 rounded-lg text-mist-lilac placeholder:text-mist-lilac/40 focus:outline-none focus:border-burnt-lilac transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-burnt-lilac hover:bg-burnt-lilac/80 text-white rounded-lg font-medium transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
