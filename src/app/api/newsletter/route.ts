import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const email = formData.get('email');

    if (!email || typeof email !== 'string') {
      return NextResponse.redirect(new URL('/?error=missing_email', req.url));
    }

    if (supabase) {
      try {
        await supabase
          .from('subscribers')
          .upsert({ email: email }, { onConflict: 'email' });
      } catch (e) {}
    }

    const referer = req.headers.get('referer') || req.url;
    const redirectUrl = new URL(referer);
    redirectUrl.searchParams.set('subscribed', 'true');
    
    return NextResponse.redirect(redirectUrl);
  } catch (err: any) {
    const referer = req.headers.get('referer') || req.url;
    const redirectUrl = new URL(referer);
    redirectUrl.searchParams.set('subscribed', 'true');
    return NextResponse.redirect(redirectUrl);
  }
}
