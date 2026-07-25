"use client";

import React, { useState } from 'react';

interface CouponRevealerProps {
  productName: string;
}

export default function CouponRevealer({ productName }: CouponRevealerProps) {
  const [revealed, setRevealed] = useState(false);
  
  const affiliateId = "inamazon0f2-21";
  const rawAmazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(productName || "best products")}&tag=${affiliateId}`;
  const affiliateUrl = `/api/go?url=${encodeURIComponent(rawAmazonUrl)}`;

  const handleReveal = () => {
    // Drop the affiliate cookie in a new tab
    window.open(affiliateUrl, '_blank');
    setRevealed(true);
  };

  return (
    <div className="fixed bottom-0 sm:bottom-6 sm:right-6 w-full sm:w-96 bg-white border border-slate-200 shadow-2xl rounded-t-2xl sm:rounded-2xl z-[90] overflow-hidden transform transition-all duration-500 hover:-translate-y-1">
      <div className="bg-gradient-to-r from-rose-500 to-orange-500 p-3 flex justify-between items-center">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
          ACTIVE PROMO CODE DETECTED
        </div>
      </div>
      <div className="p-5 text-center">
        <p className="text-slate-600 text-sm mb-3">We found a potential 10-15% discount for <strong>{productName}</strong>.</p>
        
        {!revealed ? (
          <button 
            onClick={handleReveal}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 group transition-all active:scale-95"
          >
            Click to Reveal Code
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        ) : (
          <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-lg tracking-widest">
            SAVE10DEAL
            <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        )}
        
        {revealed && (
          <p className="text-xs text-slate-400 mt-3">Code copied! Apply at checkout.</p>
        )}
      </div>
    </div>
  );
}
