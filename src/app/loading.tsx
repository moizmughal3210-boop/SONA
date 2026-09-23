export default function Loading() {
  return (
    <div className="flex flex-col flex-1 w-full h-full p-6 space-y-6">
      <div className="w-full h-24 bg-white/5 rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#7C3AED]/20 to-transparent animate-[shimmer_1.5s_infinite]" />
      </div>
      <div className="w-full h-64 bg-white/5 rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#7C3AED]/20 to-transparent animate-[shimmer_1.5s_infinite]" />
      </div>
      <div className="w-full h-64 bg-white/5 rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#7C3AED]/20 to-transparent animate-[shimmer_1.5s_infinite]" />
      </div>
    </div>
  );
}
