import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

// Read all markdown files from the content directory
const getArticles = () => {
  const contentDir = path.join(process.cwd(), 'src', 'content', 'articles');
  
  if (!fs.existsSync(contentDir)) {
      return [];
  }

  const files = fs.readdirSync(contentDir);
  const articles = files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const filePath = path.join(contentDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(fileContent);
      return {
        slug: file.replace('.md', ''),
        title: data.title || file.replace('.md', '').split('-').join(' '),
        date: data.date || 'Recently Updated',
        language: data.language || 'English',
      };
    });

  return articles;
};

export default function Home() {
  const articles = getArticles();

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-500 selection:text-white font-sans text-slate-900">
      {/* Header - Glassmorphism */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black tracking-tighter flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">ReviewScout</span>
            <span className="text-indigo-600">.tech</span>
          </Link>
          <nav className="hidden md:block">
            <ul className="flex space-x-8 text-sm font-semibold text-slate-500">
              <li className="hover:text-indigo-600 cursor-pointer transition-colors relative group">
                <Link href="/category/tech">Tech</Link>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
              </li>
              <li className="hover:text-indigo-600 cursor-pointer transition-colors relative group">
                <Link href="/category/outdoors">Outdoors</Link>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
              </li>
              <li className="hover:text-indigo-600 cursor-pointer transition-colors relative group">
                <Link href="/category/home">Home</Link>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section - Dynamic & Immersive */}
      <main className="relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-violet-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000"></div>

        <div className="max-w-6xl mx-auto px-6 py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-8 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              AI-Powered Buyer's Guides
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] text-slate-900">
              Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500">Perfect Gear</span> Without the Guesswork.
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
              Expertly curated recommendations, deeply researched specs, and the absolute best prices on Amazon.
            </p>
          </div>

          {/* Article Grid Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Latest Intel</h2>
              <p className="text-slate-500 mt-1">Fresh guides updated hourly.</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-2 text-sm font-semibold text-slate-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
              <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              {articles.length} active guides
            </div>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-32 bg-white/50 backdrop-blur-sm rounded-3xl border border-white border-dashed shadow-sm">
              <div className="w-20 h-20 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <svg className="w-10 h-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Synthesizing Data...</h3>
              <p className="text-slate-500">The AI Engine is currently drafting the first batch of articles.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link href={`/article/${article.slug}`} key={article.slug} className="group relative bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 border border-slate-100 overflow-hidden flex flex-col h-full transform hover:-translate-y-2">
                  
                  {/* Image Header */}
                  <div className="h-56 bg-slate-900 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-800 to-violet-900 group-hover:scale-110 transition-transform duration-700 ease-out opacity-80"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                    
                    <div className="absolute top-4 left-4 flex gap-2">
                      <div className="bg-white/20 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/10 shadow-lg">
                        {article.language}
                      </div>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-center text-xs font-medium text-indigo-200 mb-2">
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
              ))}
            </div>
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
          
          <form className="flex flex-col sm:flex-row max-w-xl mx-auto relative z-10 gap-3" action="/api/subscribe" method="POST">
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
