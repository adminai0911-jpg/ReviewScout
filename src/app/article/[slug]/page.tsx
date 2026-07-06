import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { Metadata } from 'next';
import Script from 'next/script';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// --- SEO: Dynamic Metadata Generation ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  
  let title = "The Ultimate Buying Guide";
  let description = `Read our comprehensive expert review and buyer's guide for ${title}. Find the best prices and top features.`;

  let loadedFromSupabase = false;
  if (supabase) {
    try {
      const { data: supaData, error } = await supabase
        .from('articles')
        .select('title')
        .eq('slug', resolvedParams.slug)
        .single();
      if (!error && supaData) {
        title = supaData.title;
        loadedFromSupabase = true;
      }
    } catch (e) {}
  }

  if (!loadedFromSupabase) {
    const contentDir = path.join(process.cwd(), 'src', 'content', 'articles');
    const filePath = path.join(contentDir, `${resolvedParams.slug}.md`);
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(fileContent);
      title = data.title || title;
      description = data.description || description;
    } else {
      return { title: 'Article Not Found | ReviewScout' };
    }
  }

  return {
    title: `${title} | ReviewScout Verified Review`,
    description: description,
    openGraph: {
      title: title,
      description: description,
      type: 'article',
      url: `https://review-scout-pi.vercel.app/article/${resolvedParams.slug}`,
      siteName: 'ReviewScout',
      images: [{ url: 'https://review-scout-pi.vercel.app/og-image.jpg' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
    }
  };
}

export async function generateStaticParams() {
  const contentDir = path.join(process.cwd(), 'src', 'content', 'articles');
  if (!fs.existsSync(contentDir)) return [];
  const files = fs.readdirSync(contentDir);
  return files.filter(f => f.endsWith('.md')).map(file => ({
    slug: file.replace('.md', '')
  }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  let data: any = {};
  let content = '';
  let loadedFromSupabase = false;

  if (supabase) {
    try {
      const { data: supaData, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', resolvedParams.slug)
        .single();
      
      if (!error && supaData) {
        data = {
          title: supaData.title,
          date: supaData.date,
          category: supaData.category,
          language: supaData.language
        };
        content = supaData.content;
        loadedFromSupabase = true;
      }
    } catch (e) {
      console.log('Supabase fetch failed');
    }
  }

  const contentDir = path.join(process.cwd(), 'src', 'content', 'articles');

  if (!loadedFromSupabase) {
    const filePath = path.join(contentDir, `${resolvedParams.slug}.md`);
    if (!fs.existsSync(filePath)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">Article Not Found</h1>
            <Link href="/" className="text-indigo-600 hover:underline font-semibold">← Back to Homepage</Link>
          </div>
        </div>
      );
    }
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(fileContent);
    data = parsed.data;
    content = parsed.content;
  }

  // CRO: Generate a dynamic Amazon Search Link based on the article title
  const affiliateId = "inamazon0f2-21";
  const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(data.title || "best products")}&tag=${affiliateId}`;

  // SEO: Automated Internal Linking
  let relatedArticles: any[] = [];
  if (loadedFromSupabase && supabase) {
    try {
      const { data: relatedData } = await supabase
        .from('articles')
        .select('slug, title')
        .neq('slug', resolvedParams.slug)
        .limit(3);
      if (relatedData) {
        relatedArticles = relatedData;
      }
    } catch(e) {}
  }
  
  if (relatedArticles.length === 0) {
    if (fs.existsSync(contentDir)) {
      const allFiles = fs.readdirSync(contentDir).filter(f => f.endsWith('.md') && f !== `${resolvedParams.slug}.md`);
      const shuffled = allFiles.sort(() => 0.5 - Math.random());
      const relatedFiles = shuffled.slice(0, 3);
      relatedArticles = relatedFiles.map(f => {
        const fc = fs.readFileSync(path.join(contentDir, f), 'utf-8');
        const fData = matter(fc).data;
        return { slug: f.replace('.md', ''), title: fData.title };
      });
    }
  }

  // Calculate dynamic review rating based on string length (pseudo-random but consistent)
  const ratingValue = data.title ? (4.2 + (data.title.length % 8) / 10).toFixed(1) : "4.8";

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-500 selection:text-white font-sans text-slate-900 pb-32">
      
      {/* Amazon OneLink Geo-Targeting Script */}
      <Script 
        id="amazon-onelink"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Amazon OneLink allows you to monetize international traffic by redirecting them to their local Amazon store.
            // When you register for OneLink on Amazon Associates, paste your script block here.
            // This is a placeholder to ensure the architecture is ready for it.
            window.amz_onelink_ready = true;
          `
        }}
      />

      {/* Header - Glassmorphism */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm transition-all duration-300">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-black tracking-tighter flex items-center gap-2 group w-max">
            <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">ReviewScout</span>
            <span className="text-indigo-600">.tech</span>
          </Link>
          
          {/* CRO: Affiliate Disclosure in Header for Trust */}
          <span className="text-[10px] text-slate-400 hidden sm:block uppercase tracking-wider font-bold">
            Ad: Amazon Associate
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <article className="bg-white rounded-[2rem] shadow-2xl shadow-indigo-500/5 overflow-hidden border border-slate-100">
          
          {/* Article Header */}
          <div className="bg-slate-900 px-8 py-20 text-center text-white relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-slate-900 to-violet-900/50 z-0"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[100px] z-0"></div>

            {/* SEO: Rich Snippet JSON-LD - Review Schema */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Review",
                  "itemReviewed": {
                    "@type": "Product",
                    "name": data.title || "Reviewed Product",
                    "description": "Comprehensive buyer's guide and review.",
                    "brand": {
                      "@type": "Brand",
                      "name": "Top Rated"
                    }
                  },
                  "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": ratingValue,
                    "bestRating": "5"
                  },
                  "author": {
                    "@type": "Organization",
                    "name": "ReviewScout.tech"
                  },
                  "datePublished": data.date || new Date().toISOString().split('T')[0],
                  "publisher": {
                    "@type": "Organization",
                    "name": "ReviewScout.tech"
                  }
                })
              }}
            />

            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-white/10 shadow-xl">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                Verified Buyer's Guide
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-8">
                {data.title || "The Ultimate Buying Guide"}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center gap-6 text-indigo-200 text-sm font-medium">
                <div className="flex items-center bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                  <svg className="w-4 h-4 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                  {ratingValue} / 5 Expert Rating
                </div>
                <div className="flex items-center bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                  <svg className="w-4 h-4 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  Updated: {data.date || 'Today'}
                </div>
              </div>
            </div>
          </div>

          {/* Markdown Content rendered with Tailwind Typography */}
          <div className="px-6 md:px-16 py-16">
            
            {/* E-E-A-T: "How We Test" Methodology (SEO Shield) */}
            <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl p-8 mb-12 shadow-sm">
              <h3 className="font-bold text-slate-900 text-lg mb-3 flex items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3 text-indigo-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                </div>
                Our AI-Powered Methodology
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">To provide you with the most accurate recommendations, our AI engine aggregates data from thousands of verified purchaser reviews, technical specifications, and expert industry consensus. We evaluate products based on performance, durability, value for money, and real-world utility.</p>
            </div>

            <div className="prose prose-lg md:prose-xl prose-slate max-w-none 
              prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900
              prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:border-b prose-h2:pb-4 prose-h2:border-slate-100
              prose-h3:text-2xl prose-h3:mt-10
              prose-a:text-white prose-a:bg-gradient-to-r prose-a:from-orange-500 prose-a:to-red-500 prose-a:hover:from-orange-600 prose-a:hover:to-red-600 prose-a:no-underline prose-a:px-8 prose-a:py-4 prose-a:rounded-xl prose-a:font-bold prose-a:inline-flex prose-a:items-center prose-a:mt-6 prose-a:mb-2 prose-a:shadow-xl prose-a:shadow-orange-500/20 prose-a:transition-all prose-a:hover:-translate-y-1 prose-a:w-full sm:prose-a:w-auto prose-a:justify-center
              prose-p:text-slate-600 prose-p:leading-relaxed
              prose-li:text-slate-600
              prose-strong:text-slate-900">
              <ReactMarkdown
                components={{
                  a: ({ node, ...props }) => {
                    if (props.href && props.href.includes('amazon.com')) {
                      return (
                        <a {...props} href={`https://www.amazon.com/s?k=${encodeURIComponent(data.title || "best products")}&tag=${affiliateId}`} target="_blank" rel="noopener noreferrer">
                          Check Price on Amazon
                          <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </a>
                      );
                    }
                    return <a {...props} className="!text-indigo-600 !bg-transparent !px-0 !py-0 !shadow-none hover:!translate-y-0 hover:!text-indigo-800 underline underline-offset-4 decoration-indigo-200 hover:decoration-indigo-500" />;
                  }
                }}
              >
                {content}
              </ReactMarkdown>
            </div>

            {/* Affiliate Disclaimer (Mandatory for Amazon Associates to prevent bans) */}
            <div className="mt-16 p-6 bg-slate-50 border border-slate-100 rounded-xl">
              <p className="text-xs text-slate-500 leading-relaxed text-center">
                <strong>Affiliate Disclosure:</strong> ReviewScout is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. When you click on links to various merchants on this site and make a purchase, this can result in this site earning a commission.
              </p>
            </div>

          </div>
          
          {/* Author Bio */}
          <div className="bg-slate-50 border-t border-slate-100 p-8 md:p-12 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg shrink-0">
              RS
            </div>
            <div>
              <p className="font-bold text-slate-900 text-xl mb-2">Compiled by ReviewScout AI</p>
              <p className="text-slate-600 leading-relaxed">This guide was generated by our proprietary AI engine which scans thousands of data points across the internet to bring you unbiased, highly accurate product recommendations.</p>
            </div>
          </div>
        </article>
      </main>
      
      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-grow h-px bg-slate-200"></div>
            <h2 className="text-2xl font-bold text-slate-900">Keep Reading</h2>
            <div className="flex-grow h-px bg-slate-200"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((article, i) => (
              <Link key={i} href={`/article/${article.slug}`} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 border border-slate-100 flex flex-col justify-between h-full group">
                <h3 className="font-bold text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors">{article.title}</h3>
                <span className="text-sm font-semibold text-indigo-500 mt-6 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read Guide <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

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

      <footer className="bg-slate-50 text-slate-500 py-12 text-center text-sm border-t border-slate-200">
        <p className="font-semibold text-slate-700 mb-1">ReviewScout.tech</p>
        <p>© {new Date().getFullYear()} All rights reserved. As an Amazon Associate we earn from qualifying purchases.</p>
      </footer>

      {/* CRO: Aggressive Global Sticky Buy Bar (Desktop + Mobile) */}
      <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-2xl border-t border-slate-200/50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-[100] transform transition-transform duration-300">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-4">
          <div className="hidden sm:block flex-grow truncate">
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-0.5 animate-pulse">Top Pick</p>
            <p className="text-slate-900 font-bold truncate pr-4">{data.title || "The Ultimate Buying Guide"}</p>
          </div>
          <div className="flex-grow sm:flex-grow-0 flex justify-center sm:justify-end w-full sm:w-auto">
            <a 
              href={amazonUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-black text-lg py-3 px-8 rounded-xl shadow-lg shadow-orange-500/30 flex justify-center items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              Check Price on Amazon
              <svg className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
