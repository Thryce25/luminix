import { Metadata } from 'next';
import CartPageContent from '@/components/cart/CartPageContent';

export const metadata: Metadata = {
  title: 'Shopping Cart',
  description: 'View your shopping cart and proceed to checkout.',
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-black gothic-texture">
      {/* Hero Section */}
      <section className="relative py-16 bg-linear-to-b from-deep-purple/20 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif text-mist-lilac mb-4">
              Shopping Cart
            </h1>
            <p className="text-mist-lilac/70">
              Review your selections before proceeding to checkout.
            </p>
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CartPageContent />
        </div>
      </section>
    </div>
  );
}
