"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Mock deals for the storefront - in a real production environment these would be 
// fetched dynamically from Supabase or the Amazon Product API.
const MOCK_DEALS = [
  { id: 1, name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones", price: "$298.00", oldPrice: "$399.99", discount: "25% OFF", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=400&q=80", rating: "4.8" },
  { id: 2, name: "Ninja AF101 Air Fryer, 4 Qt, Black/Grey", price: "$89.95", oldPrice: "$129.99", discount: "31% OFF", image: "https://images.unsplash.com/photo-1626808642875-0aa545482dfb?auto=format&fit=crop&w=400&q=80", rating: "4.9" },
  { id: 3, name: "Apple AirPods Pro (2nd Generation)", price: "$189.99", oldPrice: "$249.00", discount: "24% OFF", image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=400&q=80", rating: "4.7" },
  { id: 4, name: "Bose SoundLink Flex Bluetooth Portable Speaker", price: "$119.00", oldPrice: "$149.00", discount: "20% OFF", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=400&q=80", rating: "4.8" },
];

export default function FlashDealsStorefront() {
  const [mounted, setMounted] = useState(false);
  const [region, setRegion] = useState('your region');
  
  useEffect(() => {
    setMounted(true);
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) {
        const city = tz.split('/')[1]?.replace('_', ' ');
        if (city) setRegion(city);
      }
    } catch (e) {}
  }, []);

  if (!mounted) return null;

  return (
    <section className="bg-slate-50 border-b border-slate-200 py-16 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 rounded-full blur-[80px]"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[80px]"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 pb-4 border-b border-slate-200 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase tracking-widest mb-3 border border-red-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Live Storefront
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Today's Flash Deals</h2>
            <p className="text-slate-500 mt-2 font-medium">Aggressive price drops trending right now in <span className="text-slate-800 font-bold underline decoration-slate-300 underline-offset-2">{region}</span>.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 text-sm font-bold text-slate-600">
            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            Updates every 15 mins
          </div>
        </div>

        {/* E-Commerce Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_DEALS.map((deal) => (
            <div key={deal.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-rose-500/10 transition-all duration-300 border border-slate-100 overflow-hidden group flex flex-col relative">
              
              {/* Discount Badge */}
              <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-black px-2 py-1 rounded shadow-md z-10 animate-bounce">
                {deal.discount}
              </div>

              {/* Product Image */}
              <div className="h-48 bg-slate-100 relative overflow-hidden">
                <img src={deal.image} alt={deal.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
              </div>

              {/* Details */}
              <div className="p-5 flex flex-col flex-grow">
                
                {/* Rating */}
                <div className="flex items-center gap-1 text-yellow-400 text-xs mb-2">
                  {'★'.repeat(5)} <span className="text-slate-400 ml-1">({deal.rating})</span>
                </div>

                <h3 className="font-bold text-slate-800 text-sm leading-snug mb-4 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                  {deal.name}
                </h3>
                
                <div className="mt-auto flex items-end justify-between">
                  <div>
                    <p className="text-xs text-slate-400 line-through mb-0.5">{deal.oldPrice}</p>
                    <p className="text-2xl font-black text-rose-600">{deal.price}</p>
                  </div>
                  
                  {/* Dynamic Amazon Affiliate Routing Link */}
                  <a 
                    href={`/api/go?url=${encodeURIComponent(`https://www.amazon.com/s?k=${encodeURIComponent(deal.name)}&tag=reviewscout-20`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-rose-600 hover:scale-110 transition-all shadow-md"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
