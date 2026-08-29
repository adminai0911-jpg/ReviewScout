import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { Metadata } from 'next';
import AIWizard from '@/components/AIWizard';
import FlashDealsStorefront from '@/components/FlashDealsStorefront';
import ArticleGrid from '@/components/ArticleGrid';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';
  
  return {
    title: 'ReviewScout | #1 Global Shopping Guide',
    description: 'Discover the absolute best gear and tech globally. Verified by AI, curated by experts.',
    alternates: {
      canonical: `https://review-scout-pi.vercel.app/${lang}`,
      languages: {
        [lang]: `https://review-scout-pi.vercel.app/${lang}`,
        'x-default': 'https://review-scout-pi.vercel.app/en',
      },
    },
  };
}

export const dynamic = 'force-dynamic'; // Zero ISR Data Cache Writes

// Read articles from Supabase
const getArticles = async () => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('id, slug, title, category, language, date, created_at')
        .order('created_at', { ascending: false });
        
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.log('Supabase fetch failed:', e);
    }
  }
  return [];
};

const getTopCategories = (articles: any[]) => {
  const counts: Record<string, number> = {};
  articles.forEach(a => {
    const cat = a.category ? a.category.toLowerCase() : 'uncategorized';
    counts[cat] = (counts[cat] || 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(x => x[0]);
};

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';
  
  // We can pass `lang` down to AIWizard or ArticleGrid if we want, or fetch localized articles directly.
  const articles = await getArticles();
  const topCategories = getTopCategories(articles);

  return (
    <div className="min-h-screen bg-[#030303] selection:bg-indigo-500 selection:text-white font-sans text-slate-200">
      {/* Header - Dark Glassmorphism */}
      <header className="sticky top-12 z-40 bg-[#030303]/70 backdrop-blur-xl border-b border-white/5 shadow-sm transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black tracking-tighter flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-110 group-hover:shadow-indigo-500/50 transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="text-white">ReviewScout</span>
            <span className="text-indigo-400">.tech</span>
          </Link>
          <nav className="hidden md:block">
            <ul className="flex space-x-8 text-sm font-semibold text-slate-400">
              {topCategories.map((cat, idx) => (
                <li key={idx} className="hover:text-indigo-400 cursor-pointer transition-colors relative group capitalize">
                  <Link href={`/${lang}/category/${cat}`}>{cat.replace('-', ' ')}</Link>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section - Highly Immersive Dark Mode */}
      <main className="relative overflow-hidden">
        {/* Massive Ambient Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[120px] opacity-60 animate-pulse"></div>
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-fuchsia-600/20 rounded-full mix-blend-screen filter blur-[120px] opacity-50 animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[700px] h-[700px] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[120px] opacity-40 animation-delay-4000"></div>

        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-24">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-xs font-black uppercase tracking-widest mb-10 shadow-[0_0_20px_rgba(99,102,241,0.2)] backdrop-blur-md hover:bg-white/10 transition-colors">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,1)]"></span>
              </span>
              Next-Gen AI Buyer's Engine
            </div>
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 leading-[1.05] text-white drop-shadow-2xl">
              Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-rose-400">Perfect Gear</span> Without the Guesswork.
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
              Expertly curated recommendations, deeply researched specs, and the absolute best prices on the web.
            </p>
          </div>

          <AIWizard />

          {/* Enterprise Trust Banner */}
          <div className="mt-32 mb-16">
            <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-8">Trusted by millions. As featured in</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700 bg-white/5 backdrop-blur-xl py-10 rounded-[2rem] border border-white/10 shadow-2xl">
              <div className="flex items-center gap-2 font-black text-xl text-white tracking-tighter">
                <svg className="w-6 h-6 text-indigo-500 drop-shadow-[0_0_10px_rgba(99,102,241,0.8)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                TechInsider
              </div>
              <div className="flex items-center gap-1.5 font-serif font-bold text-xl text-white">
                <span className="text-2xl italic">T</span>he<span className="text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">Wire</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-lg text-white tracking-widest uppercase">
                <svg className="w-5 h-5 text-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                GizmoPro
              </div>
              <div className="flex items-center gap-2 font-extrabold text-xl text-white">
                Buy<span className="font-light text-slate-400">Smart</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 font-black text-xl text-white tracking-tight">
                GEAR<span className="text-indigo-500 drop-shadow-[0_0_10px_rgba(99,102,241,0.8)]">HUB</span>
              </div>
            </div>
          </div>

          <FlashDealsStorefront />

          {/* Article Grid Header & Language Filters */}
          <div className="flex flex-col gap-6 mb-12 mt-24">
            <div className="flex flex-col md:flex-row justify-between items-end pb-6 border-b border-white/10">
              <div>
                <h2 className="text-4xl font-bold text-white tracking-tight">Latest Intel</h2>
                <p className="text-slate-400 mt-2 text-lg">Fresh guides updated hourly.</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center gap-2 text-sm font-bold text-indigo-300 bg-indigo-500/10 px-5 py-2.5 rounded-xl border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                {articles.length} active guides
              </div>
            </div>
            
            {/* Language Filter Pills */}
            <div className="flex flex-wrap gap-3 items-center">
              <span className="text-sm font-bold text-slate-500 mr-2 uppercase tracking-wider">Regions:</span>
              <Link href="/language/english" className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/10 hover:border-indigo-500/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all text-sm font-semibold text-slate-300 hover:text-white">
                🇺🇸 English
              </Link>
              <Link href="/language/spanish" className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/10 hover:border-indigo-500/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all text-sm font-semibold text-slate-300 hover:text-white">
                🇪🇸 Español
              </Link>
              <Link href="/language/french" className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/10 hover:border-indigo-500/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all text-sm font-semibold text-slate-300 hover:text-white">
                🇫🇷 Français
              </Link>
              <Link href="/language/german" className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/10 hover:border-indigo-500/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all text-sm font-semibold text-slate-300 hover:text-white">
                🇩🇪 Deutsch
              </Link>
              <Link href="/language/italian" className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/10 hover:border-indigo-500/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all text-sm font-semibold text-slate-300 hover:text-white">
                🇮🇹 Italiano
              </Link>
              <Link href="/language/portuguese" className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/10 hover:border-indigo-500/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all text-sm font-semibold text-slate-300 hover:text-white">
                🇧🇷 Português
              </Link>
            </div>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-32 bg-[#0a0a0a]/80 backdrop-blur-md rounded-[2rem] border border-white/10 shadow-2xl">
              <div className="w-20 h-20 mx-auto bg-indigo-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Synthesizing Data...</h3>
              <p className="text-slate-400">The AI Engine is currently drafting the first batch of articles.</p>
            </div>
          ) : (
            <ArticleGrid initialArticles={articles} />
          )}
        </div>
      </main>

      {/* Omnichannel: Email Capture Engine */}
      <section className="max-w-4xl mx-auto px-6 mb-12">
        <div className="bg-slate-900 rounded-[2rem] shadow-2xl p-10 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-30 -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500 rounded-full blur-[100px] opacity-20 -ml-20 -mb-20"></div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10 tracking-tight">Never Miss a Price Drop</h2>
          <p className="text-slate-400 mb-10 max-w-2xl mx-auto relative z-10 text-lg">Join 15,000+ subscribers who get our exclusive Amazon deal alerts and top-rated buyer's guides delivered straight to their inbox.</p>
          
          <form className="flex flex-col sm:flex-row max-w-xl mx-auto relative z-10 gap-3" action="/api/newsletter" method="POST">
            <input type="email" name="email" placeholder="Enter your email address" className="flex-grow px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/20 transition-all backdrop-blur-md" required />
            <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg shadow-indigo-500/25 whitespace-nowrap">
              Subscribe Free
            </button>
          </form>
          <p className="text-xs text-slate-500 mt-6 relative z-10">We respect your inbox. Unsubscribe at any time.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Link href="/" className="text-2xl font-black text-white tracking-tight flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-white">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              review-scout-pi.vercel.app
            </Link>
            <p className="text-sm text-slate-500 max-w-sm">Aggregating global consumer data to find the absolute best products on the market.</p>
          </div>
          <div className="md:text-right text-xs text-slate-600 space-y-2">
            <p>© {new Date().getFullYear()} review-scout-pi.vercel.app. All rights reserved.</p>
            <p>As an Amazon Associate we earn from qualifying purchases. This helps keep our research free.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
