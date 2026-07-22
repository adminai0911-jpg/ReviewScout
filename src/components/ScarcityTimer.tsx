"use client";

import React, { useState, useEffect } from 'react';

export default function ScarcityTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 3, minutes: 14, seconds: 59 });
  const [region, setRegion] = useState('your region');

  useEffect(() => {
    // Try to grab user's timezone for geo-personalization
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) {
        const city = tz.split('/')[1]?.replace('_', ' ');
        if (city) setRegion(city);
      }
    } catch (e) {}

    // Randomize initial timer between 2 and 5 hours
    const h = Math.floor(Math.random() * 3) + 2;
    const m = Math.floor(Math.random() * 59);
    const s = Math.floor(Math.random() * 59);
    setTimeLeft({ hours: h, minutes: m, seconds: s });

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  return (
    <div className="bg-rose-50 border-y sm:border border-rose-200 sm:rounded-2xl p-4 md:p-6 my-8 relative overflow-hidden group shadow-sm">
      {/* Background Pulse */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 rounded-full blur-[40px] animate-pulse"></div>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0 border border-red-200">
            <span className="text-2xl animate-bounce">🔥</span>
          </div>
          <div>
            <h3 className="font-black text-rose-900 text-lg flex items-center gap-2 tracking-tight">
              Flash Sale Alert 
              <span className="bg-red-500 text-white text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold animate-pulse">Live</span>
            </h3>
            <p className="text-rose-700 text-sm mt-1 font-medium">
              Amazon prices fluctuate based on demand. These deals are trending heavily in <span className="font-bold underline decoration-rose-300 underline-offset-2">{region}</span>. Lock in your price now.
            </p>
          </div>
        </div>

        {/* Ticking Clock */}
        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-rose-100 shadow-inner shrink-0">
          <div className="flex flex-col items-center justify-center bg-slate-900 text-white w-14 h-14 rounded-lg shadow-md">
            <span className="text-xl font-mono font-bold leading-none">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="text-[9px] uppercase tracking-widest text-slate-400 mt-1">HRS</span>
          </div>
          <span className="text-2xl font-black text-slate-300 animate-pulse">:</span>
          <div className="flex flex-col items-center justify-center bg-slate-900 text-white w-14 h-14 rounded-lg shadow-md">
            <span className="text-xl font-mono font-bold leading-none">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="text-[9px] uppercase tracking-widest text-slate-400 mt-1">MIN</span>
          </div>
          <span className="text-2xl font-black text-slate-300 animate-pulse">:</span>
          <div className="flex flex-col items-center justify-center bg-rose-600 text-white w-14 h-14 rounded-lg shadow-md">
            <span className="text-xl font-mono font-bold leading-none">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="text-[9px] uppercase tracking-widest text-rose-200 mt-1">SEC</span>
          </div>
        </div>

      </div>
    </div>
  );
}
