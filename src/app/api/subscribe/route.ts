import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    
    // We get the referring URL to redirect back to the same article
    const referer = request.headers.get('referer') || '/';

    if (!email) {
      return NextResponse.redirect(new URL(referer, request.url));
    }

    // Insert email into Supabase
    const { error } = await supabase
      .from('subscribers')
      .insert([{ email: email }]);

    if (error) {
      console.error('Supabase Error:', error);
      // We still redirect back, but you could add an error query param like ?error=true
    }

    // Redirect back with a success parameter to show a "Thank You" message if desired
    // For now, we just redirect back to the article URL so the page reloads cleanly.
    return NextResponse.redirect(new URL(referer, request.url));
    
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
