'use client';

import React, { useState, useEffect } from 'react';

export default function PriceComparisonTable({ productName }: { productName: string }) {
  const [isIndianUser, setIsIndianUser] = useState(false);

  useEffect(() => {
    try {
      // Free & instant way to detect Indian users without an external API
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timeZone === 'Asia/Kolkata' || timeZone === 'Asia/Calcutta') {
        setIsIndianUser(true);
      }
    } catch (e) {
      // Fallback
    }
  }, []);

  const affiliateIds = {
    aliexpress: "reviewscout_ai",
    shareasale: "3003527",
    earnkaro: "5476200",
    amazon: "inamazon0f2-21"
  };

  const encodedProduct = encodeURIComponent(productName);

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden my-12" id="price-comparison">
      <div className="bg-black/40 px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
          <h3 className="font-bold text-white text-lg tracking-tight">Live Price Comparison</h3>
        </div>
        <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.2)]">Live Data</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider border-b border-white/10">
              <th className="px-6 py-4 font-semibold">Retailer</th>
              <th className="px-6 py-4 font-semibold">Why Buy Here?</th>
              <th className="px-6 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            
            {/* AliExpress (Global Reach) */}
            <tr className="hover:bg-white/5 transition-colors group border-b border-white/5">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-500/20 border border-orange-500/30 rounded flex items-center justify-center font-bold text-orange-400 text-xs shadow-[0_0_10px_rgba(249,115,22,0.2)]">ALI</div>
                  <span className="font-bold text-slate-200">AliExpress</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-400">
                <span className="inline-flex items-center gap-1"><span className="text-emerald-400 font-bold">Lowest Price</span> (Cheap Global Shipping)</span>
              </td>
              <td className="px-6 py-4 text-right">
                <a 
                  href={`/api/go?url=${encodeURIComponent(`https://www.aliexpress.com/wholesale?SearchText=${encodedProduct}&aff_id=${affiliateIds.aliexpress}`)}`}
                  target="_blank"
                  rel="nofollow noopener"
                  className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-4 py-2 rounded-lg transition-all shadow-sm group-hover:shadow-md whitespace-nowrap"
                >
                  Check Price
                </a>
              </td>
            </tr>

            {/* ShareASale (Direct Manufacturer / B2B) */}
            <tr className="hover:bg-white/5 transition-colors group border-b border-white/5">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500/20 border border-purple-500/30 rounded flex items-center justify-center font-bold text-purple-400 text-xs shadow-[0_0_10px_rgba(168,85,247,0.2)]">SAS</div>
                  <span className="font-bold text-slate-200">Direct Deals</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-400">
                Direct from Manufacturer (B2B & Software)
              </td>
              <td className="px-6 py-4 text-right">
                <a 
                  href={`/api/go?url=${encodeURIComponent(`https://www.shareasale.com/r.cfm?b=12345&u=${affiliateIds.shareasale}&m=54321`)}`}
                  target="_blank"
                  rel="nofollow noopener"
                  className="inline-flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm px-4 py-2 rounded-lg transition-all shadow-sm group-hover:shadow-md whitespace-nowrap"
                >
                  Check Price
                </a>
              </td>
            </tr>

            {/* Amazon (Fastest) */}
            <tr className="hover:bg-white/5 transition-colors group border-b border-white/5">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center font-bold text-white text-xs">AMZ</div>
                  <span className="font-bold text-slate-200">Amazon</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-400">
                Fastest Local Shipping & Returns
              </td>
              <td className="px-6 py-4 text-right">
                <a 
                  href={`/api/go?url=${encodeURIComponent(`https://www.amazon.com/s?k=${encodedProduct}&tag=${affiliateIds.amazon}`)}`}
                  target="_blank"
                  rel="nofollow noopener"
                  className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-4 py-2 rounded-lg transition-all shadow-sm group-hover:shadow-md whitespace-nowrap border border-white/10"
                >
                  Check Price
                </a>
              </td>
            </tr>

            {/* GEO-TARGETED: Flipkart (Only shows in India) */}
            {isIndianUser && (
              <tr className="hover:bg-white/5 transition-colors group bg-blue-900/10 border-t-2 border-blue-500/30">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500/20 border border-blue-500/30 rounded flex items-center justify-center font-bold text-yellow-400 text-xs shadow-[0_0_10px_rgba(59,130,246,0.2)]">FK</div>
                    <span className="font-bold text-slate-200">Flipkart (India)</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">
                  <span className="inline-flex items-center gap-1"><span className="text-blue-400 font-bold">Local Deal</span> (Big Billion Days & Fast Delivery)</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <a 
                    href={`/api/go?url=${encodeURIComponent(`https://www.flipkart.com/search?q=${encodedProduct}&affid=ekaro_${affiliateIds.earnkaro}`)}`}
                    target="_blank"
                    rel="nofollow noopener"
                    className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4 py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] group-hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] whitespace-nowrap border border-white/10"
                  >
                    Check Price
                  </a>
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
      <div className="bg-black/20 p-4 border-t border-white/10 text-center text-xs text-slate-500">
        Prices and availability fluctuate constantly. Click the links to verify live pricing.
      </div>
    </div>
  );
}
