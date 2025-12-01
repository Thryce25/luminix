export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-2 border-burnt-lilac border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-mist-lilac/70 animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
