import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black gothic-texture flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-8xl md:text-9xl font-serif gradient-text mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-serif text-mist-lilac mb-6">
          Lost in the Shadows
        </h2>
        <p className="text-mist-lilac/70 max-w-md mx-auto mb-8">
          The page you&apos;re looking for seems to have vanished into the darkness. 
          Perhaps it never existed, or maybe it&apos;s hiding somewhere else.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-gothic">
            Return Home
          </Link>
          <Link href="/products" className="btn-gothic-outline">
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
