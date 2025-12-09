'use client';

import { useState, useEffect } from 'react';

export default function NewsletterPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        // Check if popup was already shown
        const wasShown = localStorage.getItem('newsletter_shown');
        const lastShownTime = localStorage.getItem('newsletter_last_shown');

        if (wasShown && lastShownTime) {
            const daysSinceShown = (Date.now() - parseInt(lastShownTime)) / (1000 * 60 * 60 * 24);
            if (daysSinceShown < 7) {
                return; // Don't show if shown within last 7 days
            }
        }

        // Show popup after 10 seconds or 50% scroll
        const timer = setTimeout(() => {
            setIsOpen(true);
            localStorage.setItem('newsletter_shown', 'true');
            localStorage.setItem('newsletter_last_shown', Date.now().toString());
        }, 10000);

        const handleScroll = () => {
            const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            if (scrollPercentage > 50 && !isOpen) {
                setIsOpen(true);
                localStorage.setItem('newsletter_shown', 'true');
                localStorage.setItem('newsletter_last_shown', Date.now().toString());
                clearTimeout(timer);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In production, send to newsletter service
        console.log('Newsletter signup:', email);
        setIsSubmitted(true);
        setTimeout(() => {
            setIsOpen(false);
        }, 2000);
    };

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('newsletter_last_shown', Date.now().toString());
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-linear-to-br from-black via-deep-purple/20 to-black border border-burnt-lilac/50 rounded-lg max-w-md w-full p-8 shadow-2xl animate-scale-in">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-mist-lilac/70 hover:text-mist-lilac transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {!isSubmitted ? (
                    <div className="text-center">
                        {/* Icon */}
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-burnt-lilac/20 flex items-center justify-center">
                            <svg className="w-8 h-8 text-burnt-lilac" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-serif text-mist-lilac mb-2">
                            Join the Darkness
                        </h3>
                        <p className="text-mist-lilac/70 mb-6">
                            Subscribe to our newsletter for exclusive offers, style tips, and early access to new collections.
                        </p>

                        {/* Offer Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-burnt-lilac/20 border border-burnt-lilac/30 rounded-full mb-6">
                            <svg className="w-5 h-5 text-burnt-lilac" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                            </svg>
                            <span className="text-sm font-medium text-burnt-lilac">Get 10% off your first order</span>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                className="w-full px-4 py-3 bg-black/50 border border-deep-purple/50 rounded-md text-mist-lilac placeholder-mist-lilac/40 focus:outline-none focus:border-burnt-lilac transition-colors"
                            />
                            <button
                                type="submit"
                                className="w-full btn-gothic py-3"
                            >
                                Subscribe Now
                            </button>
                        </form>

                        <p className="mt-4 text-xs text-mist-lilac/50">
                            Unsubscribe anytime. We respect your privacy.
                        </p>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-burnt-lilac/20 flex items-center justify-center">
                            <svg className="w-8 h-8 text-burnt-lilac" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-serif text-mist-lilac mb-2">
                            Welcome to the Family!
                        </h3>
                        <p className="text-mist-lilac/70">
                            Check your email for your exclusive 10% discount code.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
