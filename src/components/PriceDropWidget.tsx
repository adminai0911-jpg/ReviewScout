"use client";

import { useState } from 'react';

export default function PriceDropWidget({ articleSlug, productName }: { articleSlug: string, productName: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    try {
      const res = await fetch('/api/subscribe-price-drop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, article_slug: articleSlug, product_name: productName })
      });

      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-6 text-center shadow-lg backdrop-blur-md">
        <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-3 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h4 className="text-emerald-400 font-bold text-lg mb-1">Alert Set!</h4>
        <p className="text-emerald-200/70 text-sm">We'll email you the moment the price drops on Amazon.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 shadow-xl my-12 relative overflow-hidden backdrop-blur-md">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[64px] opacity-20 -mr-10 -mt-10"></div>
      
      <div className="flex items-start gap-4 mb-4 relative z-10">
        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.3)] border border-indigo-500/30">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        </div>
        <div>
          <h4 className="text-white font-bold text-lg tracking-tight">Track Amazon Price Drops</h4>
          <p className="text-slate-400 text-sm">Prices fluctuate daily. Enter your email to get alerted when this product hits its lowest price.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email..."
          required
          className="flex-grow px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-70 flex items-center gap-2 whitespace-nowrap"
        >
          {status === 'loading' ? 'Setting...' : 'Set Alert'}
        </button>
      </form>
      {status === 'error' && <p className="text-red-500 text-xs mt-2">Oops, something went wrong. Try again.</p>}
    </div>
  );
}
