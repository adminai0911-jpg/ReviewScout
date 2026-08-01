'use client';

import React, { useState, useEffect } from 'react';

export default function PriceComparisonTable({ productName }: { productName: string }) {

  const affiliateIds = {
    aliexpress: "reviewscout_ai",
    ebay: "5339000000",
    awin: "3003527",
    digistore24: "adminai091181b6",
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

            {/* eBay (EPN) */}
            <tr className="hover:bg-white/5 transition-colors group border-b border-white/5">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 border border-blue-500/30 rounded flex items-center justify-center font-bold text-blue-400 text-xs shadow-[0_0_10px_rgba(59,130,246,0.2)]">EB</div>
                  <span className="font-bold text-slate-200">eBay</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-400">
                Best for Refurbished & Used Deals
              </td>
              <td className="px-6 py-4 text-right">
                <a 
                  href={`/api/go?url=${encodeURIComponent(`https://rover.ebay.com/rover/1/711-53200-19255-0/1?icep_id=114&ipn=icep&toolid=20004&campid=${affiliateIds.ebay}&mpre=${encodeURIComponent(`https://www.ebay.com/sch/i.html?_nkw=${encodedProduct}`)}`)}`}
                  target="_blank"
                  rel="nofollow noopener"
                  className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4 py-2 rounded-lg transition-all shadow-sm group-hover:shadow-md whitespace-nowrap"
                >
                  Check Price
                </a>
              </td>
            </tr>

            {/* Awin -> Etsy (Custom/Accessories) */}
            <tr className="hover:bg-white/5 transition-colors group border-b border-white/5">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-500/20 border border-orange-500/30 rounded flex items-center justify-center font-bold text-orange-400 text-xs shadow-[0_0_10px_rgba(249,115,22,0.2)]">ET</div>
                  <span className="font-bold text-slate-200">Etsy</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-400">
                Custom Accessories & Handmade
              </td>
              <td className="px-6 py-4 text-right">
                <a 
                  href={`/api/go?url=${encodeURIComponent(`https://www.awin1.com/cread.php?awinmid=6220&awinaffid=${affiliateIds.awin}&clickref=&p=${encodeURIComponent(`https://www.etsy.com/search?q=${encodedProduct}`)}`)}`}
                  target="_blank"
                  rel="nofollow noopener"
                  className="inline-flex items-center justify-center bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm px-4 py-2 rounded-lg transition-all shadow-sm group-hover:shadow-md whitespace-nowrap"
                >
                  Check Price
                </a>
              </td>
            </tr>

            {/* Digistore24 (Digital AI Alternative) */}
            <tr className="hover:bg-white/5 transition-colors group border-b border-white/5">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500/20 border border-purple-500/30 rounded flex items-center justify-center font-bold text-purple-400 text-xs shadow-[0_0_10px_rgba(168,85,247,0.2)]">DS</div>
                  <span className="font-bold text-slate-200">Digital Tools</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-400">
                Top AI & Software Alternative
              </td>
              <td className="px-6 py-4 text-right">
                <a 
                  href={`/api/go?url=${encodeURIComponent(`https://www.digistore24.com/redir/299134/${affiliateIds.digistore24}/REVIEW`)}`}
                  target="_blank"
                  rel="nofollow noopener"
                  className="inline-flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm px-4 py-2 rounded-lg transition-all shadow-sm group-hover:shadow-md whitespace-nowrap"
                >
                  Check Tools
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

            {/* Walmart */}
            <tr className="hover:bg-white/5 transition-colors group border-b border-white/5">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600/20 border border-blue-500/30 rounded flex items-center justify-center font-bold text-blue-400 text-xs shadow-[0_0_10px_rgba(37,99,235,0.2)]">WM</div>
                  <span className="font-bold text-slate-200">Walmart</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-400">
                Great Local Pickup & Deals
              </td>
              <td className="px-6 py-4 text-right">
                <a 
                  href={`/api/go?url=${encodeURIComponent(`https://walmart.com/search?q=${encodedProduct}&irgwc=1&sourceid=imp_${affiliateIds.walmart}`)}`}
                  target="_blank"
                  rel="nofollow noopener"
                  className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4 py-2 rounded-lg transition-all shadow-sm group-hover:shadow-md whitespace-nowrap"
                >
                  Check Price
                </a>
              </td>
            </tr>

            {/* BestBuy */}
            <tr className="hover:bg-white/5 transition-colors group border-b border-white/5">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-500/20 border border-yellow-500/30 rounded flex items-center justify-center font-bold text-yellow-400 text-xs shadow-[0_0_10px_rgba(234,179,8,0.2)]">BB</div>
                  <span className="font-bold text-slate-200">BestBuy</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-400">
                Premium Tech & Electronics
              </td>
              <td className="px-6 py-4 text-right">
                <a 
                  href={`/api/go?url=${encodeURIComponent(`https://www.bestbuy.com/site/searchpage.jsp?st=${encodedProduct}&irclickid=${affiliateIds.bestbuy}`)}`}
                  target="_blank"
                  rel="nofollow noopener"
                  className="inline-flex items-center justify-center bg-yellow-600 hover:bg-yellow-700 text-white font-bold text-sm px-4 py-2 rounded-lg transition-all shadow-sm group-hover:shadow-md whitespace-nowrap"
                >
                  Check Price
                </a>
              </td>
            </tr>

            {/* ShareASale */}
            <tr className="hover:bg-white/5 transition-colors group border-b border-white/5">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500/20 border border-emerald-500/30 rounded flex items-center justify-center font-bold text-emerald-400 text-xs shadow-[0_0_10px_rgba(16,185,129,0.2)]">SA</div>
                  <span className="font-bold text-slate-200">DHgate / B2B</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-400">
                Direct Wholesale & B2B Deals
              </td>
              <td className="px-6 py-4 text-right">
                <a 
                  href={`/api/go?url=${encodeURIComponent(`https://www.shareasale.com/r.cfm?b=1639527&u=${affiliateIds.shareasale}&m=42409&urllink=${encodeURIComponent(`https://www.dhgate.com/wholesale/search.do?searchkey=${encodedProduct}`)}`)}`}
                  target="_blank"
                  rel="nofollow noopener"
                  className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-4 py-2 rounded-lg transition-all shadow-sm group-hover:shadow-md whitespace-nowrap"
                >
                  Check Price
                </a>
              </td>
            </tr>

            {/* Flipkart */}
            <tr className="hover:bg-white/5 transition-colors group border-b border-white/5">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 border border-blue-500/30 rounded flex items-center justify-center font-bold text-yellow-400 text-xs shadow-[0_0_10px_rgba(59,130,246,0.2)]">FK</div>
                  <span className="font-bold text-slate-200">Flipkart</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-400">
                Best Deals in India
              </td>
              <td className="px-6 py-4 text-right">
                <a 
                  href={`/api/go?url=${encodeURIComponent(`https://www.flipkart.com/search?q=${encodedProduct}&affid=ekaro_${affiliateIds.earnkaro}`)}`}
                  target="_blank"
                  rel="nofollow noopener"
                  className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4 py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] group-hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] whitespace-nowrap"
                >
                  Check Price
                </a>
              </td>
            </tr>

            {/* Croma */}
            <tr className="hover:bg-white/5 transition-colors group border-b border-white/5">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-500/20 border border-teal-500/30 rounded flex items-center justify-center font-bold text-teal-400 text-xs shadow-[0_0_10px_rgba(20,184,166,0.2)]">CR</div>
                  <span className="font-bold text-slate-200">Croma</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-400">
                Trusted Electronics (India)
              </td>
              <td className="px-6 py-4 text-right">
                <a 
                  href={`/api/go?url=${encodeURIComponent(`https://www.croma.com/searchB?q=${encodedProduct}&affid=ekaro_${affiliateIds.earnkaro}`)}`}
                  target="_blank"
                  rel="nofollow noopener"
                  className="inline-flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm px-4 py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(13,148,136,0.3)] group-hover:shadow-[0_0_25px_rgba(13,148,136,0.5)] whitespace-nowrap"
                >
                  Check Price
                </a>
              </td>
            </tr>

          </tbody>
        </table>
      </div>
      <div className="bg-black/20 p-4 border-t border-white/10 text-center text-xs text-slate-500">
        Prices and availability fluctuate constantly. Click the links to verify live pricing.
      </div>
    </div>
  );
}
