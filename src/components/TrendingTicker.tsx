"use client";

export default function TrendingTicker() {
  const trends = [
    "🔥 Trending: Best Tech Deals on Amazon India",
    "⚖️ Free Instant Legal & Flight Claim Auditor: ClaimPulse Engine",
    "📈 Amazon Great Deals: Electronics up to 60% Off",
    "⚡ Just Released: Apple M3 MacBook Air Review",
    "💎 Most Bought Today: Anker Fast Power Banks",
    "🚀 Flash Sale: Trending Home & Kitchen Bestsellers"
  ];

  return (
    <div className="w-full bg-[#030303] text-indigo-400 border-b border-white/5 py-1.5 overflow-hidden whitespace-nowrap relative z-[110]">
      <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-[#030303] to-transparent z-10"></div>
      <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-[#030303] to-transparent z-10"></div>
      
      <div className="inline-block animate-[ticker_30s_linear_infinite] hover:[animation-play-state:paused]">
        {/* Render twice for seamless loop */}
        {[...trends, ...trends].map((trend, i) => (
          <span key={i} className="inline-flex items-center mx-8 text-xs font-black uppercase tracking-wider font-mono">
            {trend}
            <span className="mx-8 text-slate-700">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
