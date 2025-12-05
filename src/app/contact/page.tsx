'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email Us',
      content: 'hello@luminix.com',
      link: 'mailto:hello@luminix.com',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Call Us',
      content: '+91 98765 43210',
      link: 'tel:+919876543210',
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
            transform: `translateY(${scrollY * 0.1}px)`,
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
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
            <span className="text-burnt-lilac text-sm font-medium tracking-wider uppercase">Get in Touch</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-white via-mist-lilac to-burnt-lilac/50 mb-6 leading-tight">
            Contact
            <br />
            <span className="italic">Us</span>
          </h1>

          <p className="text-mist-lilac/60 max-w-xl mx-auto text-lg">
            Have a question or just want to say hello? We would love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="relative z-10 py-12 border-y border-mist-lilac/10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="group relative p-6 rounded-2xl bg-gradient-to-br from-deep-purple/20 to-transparent border border-mist-lilac/10 hover:border-burnt-lilac/30 transition-all duration-500 text-center"
                style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
              >
                <div className="absolute inset-0 rounded-2xl bg-burnt-lilac/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                <div className="relative z-10">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-burnt-lilac/10 border border-burnt-lilac/20 flex items-center justify-center text-burnt-lilac mb-4 group-hover:scale-110 transition-transform">
                    {info.icon}
                  </div>
                  <h3 className="text-mist-lilac font-semibold mb-2">{info.title}</h3>
                  {info.link ? (
                    <a href={info.link} className="text-burnt-lilac hover:text-white transition-colors">
                      {info.content}
                    </a>
                  ) : (
                    <p className="text-mist-lilac/60">{info.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="relative z-10 py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left Side - Info */}
            <div className="space-y-8">
              <div>
                <span className="text-burnt-lilac text-sm font-medium tracking-wider uppercase">We are Here to Help</span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-mist-lilac mt-4 mb-6">
                  Let&apos;s Start a Conversation
                </h2>
                <p className="text-mist-lilac/60 text-lg leading-relaxed">
                  Whether you have questions about our products, need sizing advice, or want to share feedback, 
                  our team is ready to assist you.
                </p>
              </div>

              {/* FAQ Quick Links */}
              <div className="space-y-4">
                <h3 className="text-mist-lilac font-semibold">Quick Links</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Shipping Information', href: '/shipping' },
                    { label: 'Returns & Exchanges', href: '/returns' },
                    { label: 'Size Guide', href: '/size-guide' },
                  ].map((link, i) => (
                    <Link
                      key={i}
                      href={link.href}
                      className="flex items-center gap-3 p-4 rounded-xl bg-deep-purple/20 border border-mist-lilac/10 hover:border-burnt-lilac/30 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-full bg-burnt-lilac/10 flex items-center justify-center text-burnt-lilac group-hover:bg-burnt-lilac group-hover:text-white transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <span className="text-mist-lilac group-hover:text-white transition-colors">{link.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-deep-purple/30 to-black border border-mist-lilac/10">
              {/* Decorative */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-burnt-lilac/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-deep-purple/30 rounded-full blur-2xl" />

              {submitted ? (
                <div className="relative z-10 text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-burnt-lilac to-purple-600 flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-serif text-mist-lilac mb-4">Message Sent!</h3>
                  <p className="text-mist-lilac/60 mb-8">Thank you for reaching out. We will get back to you within 24 hours.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-3 bg-burnt-lilac text-white font-semibold rounded-full hover:bg-burnt-lilac/80 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-mist-lilac text-sm font-medium mb-2">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Your name"
                        className="w-full px-4 py-3 bg-black/50 border border-mist-lilac/20 rounded-xl text-mist-lilac placeholder-mist-lilac/30 focus:outline-none focus:border-burnt-lilac transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-mist-lilac text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 bg-black/50 border border-mist-lilac/20 rounded-xl text-mist-lilac placeholder-mist-lilac/30 focus:outline-none focus:border-burnt-lilac transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-mist-lilac text-sm font-medium mb-2">Subject</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-black/50 border border-mist-lilac/20 rounded-xl text-mist-lilac focus:outline-none focus:border-burnt-lilac transition-colors"
                    >
                      <option value="">Select a subject</option>
                      <option value="order">Order Inquiry</option>
                      <option value="product">Product Question</option>
                      <option value="returns">Returns & Exchanges</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-mist-lilac text-sm font-medium mb-2">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="How can we help you?"
                      className="w-full px-4 py-3 bg-black/50 border border-mist-lilac/20 rounded-xl text-mist-lilac placeholder-mist-lilac/30 focus:outline-none focus:border-burnt-lilac transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-burnt-lilac to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              )}
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
