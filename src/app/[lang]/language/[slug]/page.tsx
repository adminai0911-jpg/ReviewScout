import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export const dynamic = 'force-dynamic'; // Zero ISR Data Cache Writes

// Read and filter articles by language
const getArticlesByLanguage = async (languageSlug: string) => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('id, slug, title, category, language, date, created_at')
        .ilike('language', languageSlug)
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

export async function generateStaticParams() {
  return [];
}

const getTopCategories = (articles: any[]) => {
  const counts: Record<string, number> = {};
  articles.forEach(a => {
    const cat = a.category.toLowerCase();
    counts[cat] = (counts[cat] || 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(x => x[0]);
};

export default async function LanguagePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const articles = await getArticlesByLanguage(resolvedParams.slug);

  if (articles.length === 0) {
    notFound();
  }

  // Get all articles for dynamic navbar
  let allArticles: any[] = [];
  if (supabase) {
    try {
      const { data } = await supabase.from('articles').select('category');
      if (data) allArticles = data;
    } catch (e) {}
  }
  const topCategories = getTopCategories(allArticles);

  // Format language name for display (e.g. "spanish" -> "Spanish")
  const languageName = resolvedParams.slug.charAt(0).toUpperCase() + resolvedParams.slug.slice(1).toLowerCase();

  const getLanguageFlag = (lang: string) => {
    const l = lang.toLowerCase();
    if (l === 'english') return '🇺🇸';
    if (l === 'spanish') return '🇪🇸';
    if (l === 'french') return '🇫🇷';
    if (l === 'german') return '🇩🇪';
    if (l === 'italian') return '🇮🇹';
    if (l === 'portuguese') return '🇧🇷';
    return '🌍';
  };

  const getLanguageGreeting = (lang: string) => {
    const l = lang.toLowerCase();
    if (l === 'english') return 'Top Gear for English Speakers';
    if (l === 'spanish') return 'Mejor Equipo para Hispanohablantes';
    if (l === 'french') return 'Meilleur Équipement pour Francophones';
    if (l === 'german') return 'Top-Ausrüstung für Deutschsprachige';
    if (l === 'italian') return 'Le Migliori Attrezzature per Italofoni';
    if (l === 'portuguese') return 'Os Melhores Equipamentos em Português';
    return `Top Gear for ${languageName} Speakers`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black text-indigo-600 tracking-tight">
            ReviewScout<span className="text-slate-800">.tech</span>
          </Link>
          <nav>
            <ul className="flex space-x-6 text-sm font-medium text-slate-600">
              <li><Link href="/" className="hover:text-indigo-600 transition">Home</Link></li>
              {topCategories.map((cat, idx) => (
                <li key={idx} className="capitalize hover:text-indigo-600 transition">
                  <Link href={`/category/${cat}`}>{cat.replace('-', ' ')}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center py-16 mb-12 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl shadow-2xl text-white">
          <div className="text-sm font-bold tracking-widest uppercase mb-4 text-indigo-200">{getLanguageFlag(languageName)} {languageName} Hub</div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            {getLanguageGreeting(languageName)}
          </h1>
          <p className="text-xl md:text-2xl font-light text-indigo-100 max-w-2xl mx-auto px-4">
            Browse our expertly curated buyer's guides written specifically in {languageName}.
          </p>
        </div>

        <div className="mb-8 flex justify-between items-end">
          <h2 className="text-2xl font-bold text-slate-800">All {languageName} Guides</h2>
          <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
            {articles.length} guides available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link href={`/article/${article.slug}`} key={article.slug} className="group flex flex-col h-full bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden transform hover:-translate-y-1">
              <div className="h-48 bg-slate-900 relative overflow-hidden">
                <img 
                  src={`https://image.pollinations.ai/prompt/${encodeURIComponent("Professional 4K product photography of " + article.title + ", studio lighting, highly detailed, photorealistic, clean background")}?width=600&height=400&nologo=true`}
                  alt={article.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-40 group-hover:opacity-20 transition-opacity duration-500"></div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="text-xs font-bold text-indigo-500 tracking-wider uppercase mb-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
                    {article.category ? article.category.replace('-', ' ') : 'Uncategorized'}
                  </div>
                  <div className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md text-[10px]">
                     {getLanguageFlag(article.language)} {article.language.substring(0, 2).toUpperCase()}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 leading-tight mb-4 group-hover:text-indigo-600 transition-colors">
                  {article.title}
                </h3>
                <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-100">
                  <span className="text-xs font-medium text-slate-400 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {article.date}
                  </span>
                  <span className="text-sm font-semibold text-indigo-600 flex items-center group-hover:translate-x-1 transition-transform">
                    Read Guide <span className="ml-1">→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 mt-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="font-semibold text-slate-300 mb-2">ReviewScout.tech</p>
          <p className="text-sm">© 2026 All rights reserved. As an Amazon Associate we earn from qualifying purchases.</p>
        </div>
      </footer>
    </div>
  );
}
