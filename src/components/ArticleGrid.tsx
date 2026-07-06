"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ArticleGrid({ initialArticles }: { initialArticles: any[] }) {
  const [sortedArticles, setSortedArticles] = useState(initialArticles);
  const [detectedLang, setDetectedLang] = useState<string | null>(null);

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

  // Map categories to beautiful, reliable Unsplash CDN image IDs
  const getUnsplashId = (category: string) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('software') || cat.includes('saas') || cat.includes('tech') || cat.includes('computing')) return '1550751827438-d5600e00a944'; // Tech setup
    if (cat.includes('health') || cat.includes('medical')) return '1576091160399-112ba8d25d1d'; // Medical tech
    if (cat.includes('photo') || cat.includes('optic') || cat.includes('astronomy')) return '1516035054174-a5d6a2f43db4'; // Camera lens
    if (cat.includes('business') || cat.includes('office')) return '1497215848148-31681283fb79'; // Professional desk
    if (cat.includes('garden') || cat.includes('outdoor')) return '1416879598555-82092243d467'; // Outdoor gear
    if (cat.includes('music') || cat.includes('audio')) return '1511379938547-c1f69419868d'; // Studio equipment
    if (cat.includes('pet')) return '1583337130417-3346a1be7dee'; // Pet accessories
    if (cat.includes('auto') || cat.includes('tool')) return '1517524008697-84bc678fdb9a'; // Tools/Engineering
    return '1498050108023-c5249f4df085'; // Default tech/code
  };

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
        <div className="mb-6 flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-bold border border-indigo-100">
          <svg className="w-4 h-4 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Auto-Localized for {detectedLang.charAt(0).toUpperCase() + detectedLang.slice(1)} Speakers
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedArticles.map((article) => {
          const unsplashId = getUnsplashId(article.category);
          
          return (
            <Link href={`/article/${article.slug}`} key={article.slug} className="group relative bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 border border-slate-100 overflow-hidden flex flex-col h-full transform hover:-translate-y-2">
              
              {/* Image Header */}
              <div className="h-56 bg-slate-900 relative overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/photo-${unsplashId}?w=600&h=400&fit=crop&q=80`}
                  alt={article.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500"></div>
                
                <div className="absolute top-4 left-4 flex gap-2 z-10">
                  <div className="bg-white/20 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/10 shadow-lg">
                    {article.language}
                  </div>
                </div>
                
                <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                  <div className="flex items-center text-xs font-medium text-white mb-2 drop-shadow-md">
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {article.date}
                  </div>
                </div>
              </div>
              
              {/* Card Content */}
              <div className="p-8 flex flex-col flex-grow bg-white relative">
                <div className="absolute -top-6 right-8 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 leading-snug mb-4 group-hover:text-indigo-600 transition-colors">
                  {article.title}
                </h3>
                
                <div className="mt-auto pt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-500">RS</div>
                    <span className="text-xs font-semibold text-slate-500">Expert Team</span>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Read Full Guide</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
