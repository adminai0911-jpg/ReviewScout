"use client";

import React from 'react';

// A dynamic banner that injects a high-ticket Amazon Prime Bounty affiliate link.
// Amazon pays ~$3 per free trial signup, which converts incredibly well.
export default function SaaSBanner() {
  return (
    <div className="my-12 relative overflow-hidden rounded-3xl shadow-2xl border border-sky-500/30 group not-prose">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-sky-900 z-0"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-sky-500/20 rounded-full blur-[80px] z-0 group-hover:bg-sky-500/30 transition-all duration-700"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[60px] z-0 group-hover:bg-cyan-500/20 transition-all duration-700"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-10 gap-8">
        
        <div className="text-center md:text-left flex-1">
          <div className="inline-flex items-center gap-1.5 bg-sky-500/20 text-sky-200 px-3 py-1 rounded-full text-xs uppercase tracking-wider font-bold mb-4 border border-sky-500/30">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
            Sponsored Partner
          </div>
          
          <h3 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">
            Stop paying for shipping. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Get Amazon Prime Free.</span>
          </h3>
          
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl mx-auto md:mx-0">
            Enjoy unlimited FREE Two-Day Shipping, exclusive access to movies, TV shows, and ad-free music. Claim your 30-Day Free Trial today.
          </p>
        </div>

        <div className="shrink-0 w-full md:w-auto">
          {/* Real Amazon Affiliate Bounty Link */}
          <a 
            href="https://www.amazon.com/amazonprime?tag=inamazon0f2-21" 
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-white text-slate-900 hover:bg-sky-50 font-black text-lg py-4 px-8 rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all hover:scale-105 active:scale-95 border border-white"
          >
            Start 30-Day Free Trial
          </a>
          <p className="text-center text-xs text-slate-400 mt-3 font-medium">Cancel anytime. No commitment.</p>
        </div>
      </div>
    </div>
  );
}
