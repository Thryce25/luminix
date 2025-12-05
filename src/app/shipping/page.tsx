import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Shipping Information',
    description: 'Learn about our shipping options, delivery times, and international shipping.',
};

export default function ShippingPage() {
    return (
        <div className="min-h-screen bg-black gothic-texture">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="text-4xl font-serif text-mist-lilac mb-8">Shipping & Delivery</h1>

                <div className="space-y-8 text-mist-lilac/ 70">
                    <section>
                        <h2 className="text-2xl font-serif text-mist-lilac mb-4">Shipping Options</h2>
                        <div className="space-y-4">
                            <div className="p-4 border border-deep-purple/30 rounded-lg">
                                <h3 className="text-lg font-medium text-mist-lilac mb-2">Standard Shipping</h3>
                                <p>5-7 business days | $5.99</p>
                                <p className="mt-2 text-sm">FREE on orders over $50</p>
                            </div>
                            <div className="p-4 border border-deep-purple/30 rounded-lg">
                                <h3 className="text-lg font-medium text-mist-lilac mb-2">Express Shipping</h3>
                                <p>2-3 business days | $14.99</p>
                            </div>
                            <div className="p-4 border border-deep-purple/30 rounded-lg">
                                <h3 className="text-lg font-medium text-mist-lilac mb-2">Next Day Delivery</h3>
                                <p>1 business day | $24.99</p>
                                <p className="mt-2 text-sm">Order before 2 PM for next day delivery</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-mist-lilac mb-4">International Shipping</h2>
                        <p>We ship worldwide! International shipping times and costs vary by location.</p>
                        <p className="mt-4">Average delivery times: 10-21 business days</p>
                        <p className="mt-2">Note: International orders may be subject to customs duties and import taxes.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-mist-lilac mb-4">Order Tracking</h2>
                        <p>After your order ships, you'll receive a tracking number via email. Track your package anytime.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
