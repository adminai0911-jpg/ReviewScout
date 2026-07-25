"use client";

import React from 'react';

export default function TableOfContents({ content }: { content: string }) {
  const headings = React.useMemo(() => {
    const regex = /^(##|###)\s+(.+)$/gm;
    const foundHeadings = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const slug = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
      foundHeadings.push({ level, text, slug });
    }
    return foundHeadings;
  }, [content]);

  if (headings.length === 0) return null;

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/10 mb-10 sticky top-6 z-10 hidden md:block max-h-[80vh] overflow-y-auto">
      <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-300 mb-6 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
        Table of Contents
      </h3>
      <ul className="space-y-3">
        {headings.map((h, i) => (
          <li key={i} className={`${h.level === 3 ? 'ml-4 border-l border-white/10 pl-4' : ''}`}>
            <a 
              href={`#${h.slug}`}
              className="text-slate-400 hover:text-white text-sm font-medium transition-colors hover:underline block leading-snug"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
