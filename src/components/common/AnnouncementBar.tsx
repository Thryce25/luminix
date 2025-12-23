'use client';

export default function AnnouncementBar() {
  return (
    <div className="fixed top-0 left-0 right-0 bg-deep-purple border-b border-burnt-lilac/30 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-2 sm:py-2.5">
        <p className="text-center text-xs sm:text-sm font-medium text-mist-lilac tracking-wide">
          <span className="hidden sm:inline">Special Offer: Use code </span>
          <span className="sm:hidden">Use code </span>
          <span className="font-bold text-burnt-lilac px-1 sm:px-0">
            FIRST20
          </span>
          {' '}for 20% off
          <span className="hidden md:inline"> your order</span>
        </p>
      </div>
    </div>
  );
}
