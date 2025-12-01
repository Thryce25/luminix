'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-black gothic-texture flex items-center justify-center">
      <div className="text-center px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-burnt-lilac/30 text-burnt-lilac mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl md:text-3xl font-serif text-mist-lilac mb-4">
          Something Went Wrong
        </h2>
        <p className="text-mist-lilac/70 max-w-md mx-auto mb-8">
          The shadows have interfered with your request. 
          Please try again or return to safety.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={reset} className="btn-gothic">
            Try Again
          </button>
          <a href="/" className="btn-gothic-outline">
            Return Home
          </a>
        </div>
      </div>
    </div>
  );
}
