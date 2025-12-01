import Link from 'next/link';
import Image from 'next/image';

const footerLinks = {
  shop: [
    { name: 'New Arrivals', href: '/products?sort=newest' },
    { name: 'Best Sellers', href: '/products?sort=best-selling' },
    { name: 'Men', href: '/products?category=men' },
    { name: 'Women', href: '/products?category=women' },
    { name: 'Sale', href: '/products?sale=true' },
  ],
  help: [
    { name: 'Track Order', href: '/track-order' },
    { name: 'Shipping & Delivery', href: '/shipping' },
    { name: 'Returns & Exchanges', href: '/returns' },
    { name: 'Size Guide', href: '/size-guide' },
    { name: 'Contact Us', href: '/contact' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Store Locator', href: '/stores' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-black border-t border-deep-purple/30">
      {/* Newsletter Section */}
      <div className="bg-linear-to-r from-deep-purple/20 via-burnt-lilac/10 to-deep-purple/20 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-xl sm:text-2xl font-serif text-mist-lilac mb-1 sm:mb-2">
                Join the Dark Side
              </h3>
              <p className="text-mist-lilac/60 text-sm sm:text-base">
                Subscribe for exclusive offers, new arrivals & gothic inspiration.
              </p>
            </div>
            <form className="flex w-full lg:w-auto max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 sm:px-5 py-3 sm:py-3.5 bg-black/50 border border-deep-purple/50 rounded-l-lg text-mist-lilac placeholder-mist-lilac/40 focus:outline-none focus:border-burnt-lilac transition-colors text-sm sm:text-base"
              />
              <button
                type="submit"
                className="btn-gothic rounded-l-none rounded-r-lg whitespace-nowrap px-4 sm:px-6 text-sm sm:text-base touch-manipulation"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column - Full width on mobile */}
          <div className="col-span-2 sm:col-span-2 md:col-span-4 lg:col-span-2 mb-4 lg:mb-0">
            <Link href="/" className="inline-block mb-4 sm:mb-6">
              <span className="text-2xl sm:text-3xl font-serif font-bold gradient-text tracking-wider">
                LUMINIX
              </span>
            </Link>
            <p className="text-mist-lilac/60 mb-4 sm:mb-6 max-w-sm leading-relaxed text-sm sm:text-base">
              Embrace the darkness with our curated collection of gothic-inspired 
              fashion. Where shadows meet elegance.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-2 sm:space-x-3 mb-6 lg:mb-8">
              <SocialLink href="#" label="Instagram">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </SocialLink>
              <SocialLink href="#" label="Facebook">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </SocialLink>
              <SocialLink href="#" label="Twitter">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </SocialLink>
              <SocialLink href="#" label="YouTube">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </SocialLink>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-mist-lilac font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4">Shop</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-mist-lilac/60 hover:text-burnt-lilac transition-colors text-xs sm:text-sm touch-manipulation inline-block py-1">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="text-mist-lilac font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4">Help</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-mist-lilac/60 hover:text-burnt-lilac transition-colors text-xs sm:text-sm touch-manipulation inline-block py-1">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links - Hidden on mobile, shown on larger screens */}
          <div className="hidden md:block">
            <h3 className="text-mist-lilac font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4">Company</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-mist-lilac/60 hover:text-burnt-lilac transition-colors text-xs sm:text-sm touch-manipulation inline-block py-1">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-deep-purple/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-mist-lilac/50 text-xs sm:text-sm text-center sm:text-left">
              © {new Date().getFullYear()} Luminix. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-mist-lilac/50 text-xs sm:text-sm">
              {footerLinks.legal.map((link) => (
                <Link key={link.name} href={link.href} className="hover:text-mist-lilac transition-colors touch-manipulation">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-deep-purple/30 border border-deep-purple/50 flex items-center justify-center text-mist-lilac/70 hover:text-mist-lilac hover:border-burnt-lilac hover:bg-burnt-lilac/20 transition-all touch-manipulation"
    >
      {children}
    </a>
  );
}
