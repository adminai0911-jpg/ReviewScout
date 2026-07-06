import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function GET(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    // Simple full-text or ILIKE search fallback
    // Since we are matching raw user input (e.g. "cheap vlogging camera"), 
    // we split by spaces and search for keywords in the title or content.
    
    // Convert "cheap vlogging camera" to "%cheap%vlogging%camera%" for a basic ILIKE match
    // OR we can just use the built in textSearch if configured
    
    // Using ilike on title for a quick and fuzzy match.
    // In production, pgvector embeddings would be ideal here.
    const searchTerms = query.split(' ').filter(t => t.length > 2);
    
    let queryBuilder = supabase.from('articles').select('slug, title, category, language').limit(3);
    
    // If they typed something, search for it
    if (searchTerms.length > 0) {
        // Just use the first substantive keyword to find the best match
        queryBuilder = queryBuilder.ilike('title', `%${searchTerms[0]}%`);
    }

    const { data, error } = await queryBuilder;

    if (error) throw error;

    return NextResponse.json({ results: data });
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 });
  }
}
