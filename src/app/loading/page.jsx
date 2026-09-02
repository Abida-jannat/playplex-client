export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center gap-4">
    
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-800 border-t-lime-400" />

        {/* Loading Text */}
        <p className="text-sm font-semibold tracking-wider text-lime-400 uppercase">
          Loading PlayPlex...
        </p>
      </div>
    </div>
  );
}