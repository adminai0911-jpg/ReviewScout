'use client';

import React from 'react';

export default function PriceComparisonTable({ productName }: { productName: string }) {
  const affiliateIds = {
    aliexpress: "reviewscout_ai",
    shareasale: "placeholder_sas_id",
    amazon: "inamazon0f2-21"
  };

  const encodedProduct = encodeURIComponent(productName);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden my-12" id="price-comparison">
      <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <h3 className="text-white font-bold text-lg m-0 flex items-center gap-2">
          <span className="text-2xl">💰</span> 
          Global Price Comparison
        </h3>
        <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Live Deals</span>
      </div>
      
      <div className="p-0 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Retailer</th>
              <th className="px-6 py-4 font-semibold">Why Buy Here?</th>
              <th className="px-6 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            
            {/* AliExpress (Global Reach) */}
            <tr className="hover:bg-slate-50 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center font-bold text-orange-600 text-xs">ALI</div>
                  <span className="font-bold text-slate-800">AliExpress</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1"><span className="text-emerald-500 font-bold">Lowest Price</span> (Cheap Global Shipping)</span>
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

            {/* Amazon (Fastest) */}
            <tr className="hover:bg-slate-50 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center font-bold text-white text-xs">AMZ</div>
                  <span className="font-bold text-slate-800">Amazon</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                Fastest Local Shipping & Returns
              </td>
              <td className="px-6 py-4 text-right">
                <a 
                  href={`/api/go?url=${encodeURIComponent(`https://www.amazon.com/s?k=${encodedProduct}&tag=${affiliateIds.amazon}`)}`}
                  target="_blank"
                  rel="nofollow noopener"
                  className="inline-flex items-center justify-center bg-slate-800 hover:bg-black text-white font-bold text-sm px-4 py-2 rounded-lg transition-all shadow-sm group-hover:shadow-md whitespace-nowrap"
                >
                  Check Price
                </a>
              </td>
            </tr>

          </tbody>
        </table>
      </div>
      <div className="bg-slate-50 p-4 border-t border-slate-100 text-center text-xs text-slate-400">
        Prices and availability fluctuate constantly. Click the links to verify live pricing.
      </div>
    </div>
  );
}
