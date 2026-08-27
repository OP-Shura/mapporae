import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { sanitizeRedirectUrl, sanitizeText } from '@/lib/security/sanitize';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const rawNext = searchParams.get('next');
  const safeNext = sanitizeRedirectUrl(rawNext, '/saved');

  const rawCode = searchParams.get('code');
  const code = rawCode ? sanitizeText(rawCode, 256) : null;

  if (code && code.length >= 6) {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${safeNext}`);
      }
    }
  }

  // Return the user safely to saved places with error notification
  return NextResponse.redirect(`${origin}/saved?auth_status=error`);
}

