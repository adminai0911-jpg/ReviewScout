"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ArticleGrid({ initialArticles }: { initialArticles: any[] }) {
  const [sortedArticles, setSortedArticles] = useState(initialArticles);
  const [detectedLang, setDetectedLang] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(12);

  useEffect(() => {
    try {
      // 1. Detect language from browser (e.g. 'de-DE' -> 'de', 'pt-BR' -> 'pt')
      const navLang = navigator.language.split('-')[0].toLowerCase();
      
      const langMap: Record<string, string> = {
        'de': 'german',
        'es': 'spanish',
        'fr': 'french',
        'pt': 'portuguese',
        'it': 'italian',
        'en': 'english',
        'hi': 'hindi',
        'zh': 'chinese',
        'ja': 'japanese',
        'ru': 'russian',
        'ar': 'arabic',
        'ko': 'korean'
      };

      const nativeLangName = langMap[navLang];

      if (nativeLangName) {
        setDetectedLang(nativeLangName);
        
        // 2. Sort articles: push the user's native language to the top!
        const sorted = [...initialArticles].sort((a, b) => {
          const aMatch = (a.language || '').toLowerCase() === nativeLangName;
          const bMatch = (b.language || '').toLowerCase() === nativeLangName;
          
          if (aMatch && !bMatch) return -1;
          if (!aMatch && bMatch) return 1;
          return 0; // Keep original chronological order for the rest
        });
        
        setSortedArticles(sorted);
      }
    } catch (e) {
      console.error("Auto-localization failed", e);
    }
  }, [initialArticles]);

  // Infinite Scroll Logic
  useEffect(() => {
    const handleScroll = () => {
      // If user scrolls near the bottom of the page (within 1000px)
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
        setDisplayCount(prev => Math.min(prev + 12, sortedArticles.length));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sortedArticles.length]);

  if (sortedArticles.length === 0) {
    return (
      <div className="text-center py-32 bg-white/50 backdrop-blur-sm rounded-3xl border border-white border-dashed shadow-sm">
        <div className="w-20 h-20 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <svg className="w-10 h-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Synthesizing Data...</h3>
        <p className="text-slate-500">The AI Engine is currently drafting the first batch of articles.</p>
      </div>
    );
  }

  return (
    <div>
      {detectedLang && (
        <div className="mb-6 flex items-center gap-2 bg-[#0a0a0a]/50 text-indigo-400 px-4 py-3 rounded-xl text-sm font-bold border border-indigo-500/20 backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.15)]">
          <svg className="w-4 h-4 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Auto-Localized Algorithm for {detectedLang.charAt(0).toUpperCase() + detectedLang.slice(1)} Speakers
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedArticles.slice(0, displayCount).map((article) => {
          // Generate a highly specific but truncated prompt for the image to prevent URL limits
          const safeTitle = encodeURIComponent(article.title.split(' ').slice(0, 5).join(' ') + ' cinematic product shot studio lighting');
          // Use the article title's length and character codes to generate a highly unique, stable seed for this specific article
          const uniqueSeed = article.title.length * (article.title.charCodeAt(0) || 1) * 999;
          const imageUrl = `https://image.pollinations.ai/prompt/${safeTitle}?width=600&height=400&nologo=true&seed=${uniqueSeed}&model=flux`;
          
          return (
            <Link href={`/article/${article.slug}`} key={article.slug} className="group relative bg-[#0a0a0a] rounded-3xl shadow-xl hover:shadow-[0_0_30px_rgba(99,102,241,0.2)] transition-all duration-500 border border-white/5 hover:border-indigo-500/30 overflow-hidden flex flex-col h-full transform hover:-translate-y-2">
              
              {/* Image Header */}
              <div className="h-56 bg-slate-900 relative overflow-hidden">
                <img 
                  src={imageUrl}
                  alt={article.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-500"></div>
                
                <div className="absolute top-4 left-4 flex gap-2 z-10">
                  <div className="bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/10 shadow-lg">
                    {article.language}
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                  <div className="flex items-center text-xs font-bold text-indigo-300 mb-2 drop-shadow-md">
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {article.date}
                  </div>
                </div>
              </div>
              
              {/* Card Content */}
              <div className="p-8 flex flex-col flex-grow bg-[#0a0a0a] relative">
                <div className="absolute -top-6 right-8 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-indigo-400 group-hover:scale-110 group-hover:bg-fuchsia-600 group-hover:border-fuchsia-400 group-hover:shadow-[0_0_15px_rgba(217,70,239,0.5)] transition-all duration-300">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
                
                <h3 className="text-xl font-bold text-white leading-snug mb-4 group-hover:text-indigo-400 transition-colors drop-shadow-sm">
                  {article.title}
                </h3>
                
                <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 flex items-center justify-center text-[9px] font-black text-white shadow-md">RS</div>
                    <span className="text-xs font-semibold text-slate-400">Expert Team</span>
                  </div>
                  <span className="text-xs font-black text-indigo-400 uppercase tracking-wider group-hover:text-fuchsia-400 transition-colors">Read Full Guide</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {displayCount < sortedArticles.length && (
        <div className="mt-16 flex justify-center pb-20">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin"></div>
              <div className="absolute inset-1 rounded-full border-b-2 border-fuchsia-500 animate-spin animation-delay-500"></div>
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-wider text-xs animate-pulse">Loading More Content...</p>
          </div>
        </div>
      )}
    </div>
  );
}
