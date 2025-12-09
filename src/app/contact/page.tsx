'use client';

import Link from 'next/link';
import FloatingBackground from '@/components/common/FloatingBackground';

export default function ContactPage() {
  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email Us',
      content: 'luminixclothing@gmail.com',
      link: 'mailto:luminixclothing@gmail.com',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Call Us',
      content: '+91 86107 26382',
      link: 'tel:+918610726382',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Business Hours',
      content: 'Mon - Sat: 10AM - 8PM',
    },
  ];

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Jaw-dropping Animated Background */}
      <FloatingBackground variant="minimal" />

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="relative z-10 text-center px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-burnt-lilac/10 border border-burnt-lilac/20 mb-6">
            <span className="w-2 h-2 bg-burnt-lilac rounded-full animate-pulse" />
            <span className="text-burnt-lilac text-sm font-medium tracking-wider uppercase">Get in Touch</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-transparent bg-clip-text bg-linear-to-b from-white via-mist-lilac to-burnt-lilac/50 mb-6 leading-tight">
            Contact
            <br />
            <span className="italic">Us</span>
          </h1>

          <p className="text-mist-lilac/60 max-w-xl mx-auto text-lg">
            Have a question or just want to say hello? We would love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="relative z-10 py-24">
        <div className="max-w-5xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-burnt-lilac text-sm font-medium tracking-wider uppercase">We are Here to Help</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-mist-lilac mt-4 mb-6">
              Get In Touch
            </h2>
            <p className="text-mist-lilac/60 max-w-xl mx-auto text-lg leading-relaxed">
              Have questions about our products, need sizing advice, or want to share feedback? 
              Reach out through any of the channels below.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-linear-to-br from-deep-purple/20 to-transparent border border-mist-lilac/10 hover:border-burnt-lilac/30 transition-all duration-500 text-center"
                style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
              >
                <div className="absolute inset-0 rounded-2xl bg-burnt-lilac/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-burnt-lilac/10 border border-burnt-lilac/20 flex items-center justify-center text-burnt-lilac mb-5 group-hover:scale-110 transition-transform">
                    {info.icon}
                  </div>
                  <h3 className="text-mist-lilac font-semibold text-lg mb-3">{info.title}</h3>
                  {info.link ? (
                    <a href={info.link} className="text-burnt-lilac hover:text-white transition-colors text-lg">
                      {info.content}
                    </a>
                  ) : (
                    <p className="text-mist-lilac/60 text-lg">{info.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div className="max-w-2xl mx-auto">
            <h3 className="text-mist-lilac font-semibold text-center mb-6">Helpful Resources</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Shipping Info', href: '/shipping' },
                { label: 'Returns', href: '/returns' },
                { label: 'Size Guide', href: '/size-guide' },
              ].map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="flex items-center justify-center gap-2 p-4 rounded-xl bg-deep-purple/20 border border-mist-lilac/10 hover:border-burnt-lilac/30 hover:bg-deep-purple/30 transition-all group"
                >
                  <span className="text-mist-lilac group-hover:text-white transition-colors">{link.label}</span>
                  <svg className="w-4 h-4 text-burnt-lilac group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
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
