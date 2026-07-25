"use client";

import React from 'react';

// A dynamic banner that injects high-ticket SaaS affiliate links
// In a real scenario, this could rotate based on the article category
export default function SaaSBanner() {

  // Let's create a generic high-ticket offer that works for almost any niche
  // (e.g. AI website builder, AI video generator, premium hosting, etc.)
  return (
    <div className="my-12 relative overflow-hidden rounded-3xl shadow-2xl border border-indigo-500/30 group not-prose">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-900 z-0"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[80px] z-0 group-hover:bg-indigo-500/30 transition-all duration-700"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-fuchsia-500/10 rounded-full blur-[60px] z-0 group-hover:bg-fuchsia-500/20 transition-all duration-700"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-10 gap-8">
        
        <div className="text-center md:text-left flex-1">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-200 px-3 py-1 rounded-full text-xs uppercase tracking-wider font-bold mb-4 border border-indigo-500/30">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            Sponsored Partner
          </div>
          
          <h3 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">
            Stop waiting. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Build your own AI SaaS.</span>
          </h3>
          
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl mx-auto md:mx-0">
            Want to launch profitable websites like this one? Join 50,000+ founders using our favorite No-Code AI Platform. Launch in minutes, not months.
          </p>
        </div>

        <div className="shrink-0 w-full md:w-auto">
          {/* Note: In a live environment, this would be your affiliate link */}
          <a 
            href="#" 
            className="block w-full text-center bg-white text-slate-900 hover:bg-indigo-50 font-black text-lg py-4 px-8 rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all hover:scale-105 active:scale-95 border border-white"
          >
            Start Free Trial
          </a>
          <p className="text-center text-xs text-slate-400 mt-3 font-medium">No credit card required.</p>
        </div>
      </div>
    </div>
  );
}
