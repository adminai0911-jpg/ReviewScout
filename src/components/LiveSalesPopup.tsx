"use client";

import React, { useState, useEffect } from 'react';

// Generates random data for social proof (FOMO)
const CITIES = ['New York', 'London', 'Toronto', 'Sydney', 'Austin', 'Miami', 'Berlin', 'Dubai', 'Singapore', 'Vancouver'];
const ACTIONS = ['purchased a Top Pick', 'is viewing this guide', 'subscribed to VIP Deals', 'saved $140 using our link'];
const NAMES = ['Alex', 'Sarah', 'James', 'Emily', 'Michael', 'Jessica', 'David', 'Lisa', 'Daniel', 'Emma'];

export default function LiveSalesPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState({ name: '', city: '', action: '', time: '' });

  useEffect(() => {
    // Start the first popup after 10 seconds
    const initialTimer = setTimeout(showPopup, 10000);
    return () => clearTimeout(initialTimer);
  }, []);

  const showPopup = () => {
    const randomName = NAMES[Math.floor(Math.random() * NAMES.length)];
    const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)];
    const randomAction = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
    const randomTime = Math.floor(Math.random() * 15) + 1; // 1 to 15 mins ago

    setData({ name: randomName, city: randomCity, action: randomAction, time: `${randomTime} min ago` });
    setIsVisible(true);

    // Hide after 5 seconds
    setTimeout(() => {
      setIsVisible(false);
      
      // Schedule next popup (randomly between 15s and 45s later)
      const nextDelay = Math.floor(Math.random() * 30000) + 15000;
      setTimeout(showPopup, nextDelay);
    }, 5000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 sm:bottom-6 left-4 sm:left-6 z-[90] animate-in slide-in-from-bottom-5 fade-in duration-500">
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] rounded-2xl p-4 pr-10 flex items-center gap-4 max-w-[320px] relative overflow-hidden group">
        
        {/* Verification Checkmark */}
        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 border border-emerald-200">
          <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
        </div>

        <div>
          <p className="text-sm text-slate-800 leading-tight">
            <span className="font-bold">{data.name}</span> in <span className="font-semibold">{data.city}</span>
          </p>
          <p className="text-xs text-slate-500 mt-0.5">{data.action}</p>
          <p className="text-[10px] text-slate-400 font-medium mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            Verified • {data.time}
          </p>
        </div>

        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 p-1"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
      </div>
    </div>
  );
}
