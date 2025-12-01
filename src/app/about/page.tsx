import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Luminix - where gothic elegance meets modern fashion.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black gothic-texture">
      {/* Hero Section */}
      <section className="relative py-24 bg-linear-to-b from-deep-purple/20 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-burnt-lilac uppercase tracking-[0.3em] text-sm mb-4">
              Our Story
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-mist-lilac mb-6">
              About Luminix
            </h1>
            <p className="text-mist-lilac/70 text-lg">
              Where shadows meet elegance, and darkness becomes beauty.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-4/5 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-deep-purple/40 to-burnt-lilac/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <span className="text-9xl font-serif text-mist-lilac/20">L</span>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-serif text-mist-lilac">
                Born from the Shadows
              </h2>
              <p className="text-mist-lilac/70 leading-relaxed">
                Luminix was founded on the belief that true elegance lies in embracing 
                the darkness. Our journey began in the candlelit corners of vintage 
                boutiques, where we discovered the timeless allure of gothic fashion.
              </p>
              <p className="text-mist-lilac/70 leading-relaxed">
                We curate pieces that speak to those who find beauty in the mysterious, 
                the romantic, and the unconventional. Each item in our collection is 
                chosen for its ability to transform the wearer into something 
                extraordinary.
              </p>
              <p className="text-mist-lilac/70 leading-relaxed">
                From Victorian-inspired corsets to modern dark streetwear, we blend 
                historical elegance with contemporary edge. Our mission is to provide 
                a sanctuary for those who dare to be different.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-linear-to-b from-transparent via-deep-purple/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-mist-lilac mb-4">
              Our Values
            </h2>
            <div className="w-24 h-0.5 bg-linear-to-r from-transparent via-burnt-lilac to-transparent mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              }
              title="Authenticity"
              description="We believe in staying true to the gothic aesthetic while evolving with the times. Every piece we offer reflects our genuine passion for dark beauty."
            />
            <ValueCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              }
              title="Quality"
              description="From fabric to finish, we curate only the finest pieces. Our commitment to quality ensures each garment stands the test of time."
            />
            <ValueCard
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
              title="Community"
              description="We're more than a store – we're a gathering place for those who embrace the darkness. Join our community of like-minded souls."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-mist-lilac mb-6">
            Join the Darkness
          </h2>
          <p className="text-mist-lilac/70 mb-8 max-w-2xl mx-auto">
            Ready to embrace your dark side? Explore our collection and discover 
            pieces that speak to your soul.
          </p>
          <a href="/products" className="btn-gothic text-lg px-8 py-4">
            Shop Now
          </a>
        </div>
      </section>
    </div>
  );
}

function ValueCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center p-8 border border-deep-purple/30 rounded-lg hover:border-burnt-lilac/50 transition-colors group">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-burnt-lilac/30 text-burnt-lilac mb-6 group-hover:bg-burnt-lilac/10 transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-serif text-mist-lilac mb-4">{title}</h3>
      <p className="text-mist-lilac/60 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
