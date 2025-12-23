'use client';

export default function AnnouncementBar() {
  return (
    <div className="fixed top-0 left-0 right-0 bg-deep-purple border-b border-burnt-lilac/30 z-[60]">
      <div className="max-w-7xl mx-auto px-4 py-2.5">
        <p className="text-center text-sm font-medium text-mist-lilac tracking-wide">
          Special Offer: Use code{' '}
          <span className="font-bold text-burnt-lilac bg-mist-lilac/10 px-2 py-0.5 rounded">
            FIRST20
          </span>{' '}
          for 20% off your order
        </p>
      </div>
    </div>
  );
}
