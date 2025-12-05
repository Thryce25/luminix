import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Returns & Exchanges',
};

export default function ReturnsPage() {
    return (
        <div className="min-h-screen bg-black gothic-texture">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="text-4xl font-serif text-mist-lilac mb-8">Returns & Exchanges</h1>

                <div className="space-y-8 text-mist-lilac/70">
                    <section>
                        <h2 className="text-2xl font-serif text-mist-lilac mb-4">30-Day Return Policy</h2>
                        <p>We want you to love your purchase! If you're not completely satisfied, you can return items within 30 days of delivery for a full refund.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-mist-lilac mb-4">How to Return</h2>
                        <ol className="list-decimal list-inside space-y-2">
                            <li>Contact us to initiate a return</li>
                            <li>Pack items securely in original packaging</li>
                            <li>Print and attach the return label we send</li>
                            <li>Drop off at any authorized carrier location</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-mist-lilac mb-4">Refund Timeline</h2>
                        <p>Once we receive your return, please allow 5-7 business days for processing. Refunds will be issued to original payment method.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
