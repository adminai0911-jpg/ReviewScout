import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, article_slug, product_name } = body;

    if (!email || !article_slug || !product_name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (supabase) {
      try {
        await supabase
          .from('price_drop_alerts')
          .insert([
            { email, article_slug, product_name }
          ]);
      } catch (e) {}
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: true });
  }
}
