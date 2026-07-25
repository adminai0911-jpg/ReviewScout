"use client";

import React, { useEffect, useState } from 'react';

export default function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<{ level: number, text: string, slug: string }[]>([]);

  useEffect(() => {
    // Parse markdown string for H2 and H3
    const regex = /^(##|###)\s+(.+)$/gm;
    const foundHeadings = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      const level = match[1].length; // 2 for ##, 3 for ###
      const text = match[2].trim();
      const slug = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
      foundHeadings.push({ level, text, slug });
    }
    setHeadings(foundHeadings);
  }, [content]);

  if (headings.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 sticky top-4 z-10 hidden md:block max-h-[80vh] overflow-y-auto">
      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
        Table of Contents
      </h3>
      <ul className="space-y-2.5">
        {headings.map((h, i) => (
          <li key={i} className={`${h.level === 3 ? 'ml-4 border-l border-slate-200 pl-3' : ''}`}>
            <a 
              href={`#${h.slug}`}
              className="text-slate-600 hover:text-indigo-600 text-sm font-medium transition-colors hover:underline block leading-snug"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
