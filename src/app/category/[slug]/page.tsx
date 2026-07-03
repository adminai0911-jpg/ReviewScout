import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Read and filter articles by category
const getArticlesByCategory = (categorySlug: string) => {
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
        category: data.category || 'uncategorized',
      };
    })
    .filter(article => article.category.toLowerCase() === categorySlug.toLowerCase());

  return articles;
};

// Next.js requires generateStaticParams for dynamic routes in static export
export async function generateStaticParams() {
  const contentDir = path.join(process.cwd(), 'src', 'content', 'articles');
  if (!fs.existsSync(contentDir)) return [];

  const files = fs.readdirSync(contentDir);
  const categories = new Set<string>();

  files.forEach(file => {
    if (file.endsWith('.md')) {
      const filePath = path.join(contentDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(fileContent);
      if (data.category) {
        categories.add(data.category.toLowerCase());
      }
    }
  });

  return Array.from(categories).map((category) => ({
    slug: category,
  }));
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const articles = getArticlesByCategory(params.slug);

  if (articles.length === 0) {
    notFound();
  }

  // Format category name for display (e.g. "home-office" -> "Home Office")
  const categoryName = params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

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
              <li className="text-indigo-600 font-bold">{categoryName}</li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center py-16 mb-12 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl shadow-2xl text-white">
          <div className="text-sm font-bold tracking-widest uppercase mb-4 text-indigo-200">Category Hub</div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Top Gear for <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">{categoryName}</span>
          </h1>
          <p className="text-xl md:text-2xl font-light text-indigo-100 max-w-2xl mx-auto px-4">
            Browse our expertly curated buyer's guides specifically for {categoryName.toLowerCase()} enthusiasts.
          </p>
        </div>

        <div className="mb-8 flex justify-between items-end">
          <h2 className="text-2xl font-bold text-slate-800">All {categoryName} Guides</h2>
          <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
            {articles.length} guides available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link href={`/article/${article.slug}`} key={article.slug} className="group flex flex-col h-full bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden transform hover:-translate-y-1">
              <div className="h-48 bg-slate-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 group-hover:scale-105 transition-transform duration-500"></div>
                <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="text-xs font-bold text-indigo-500 tracking-wider uppercase mb-3 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
                  {categoryName}
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
