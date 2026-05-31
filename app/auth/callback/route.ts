import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Supabase auth callback (magic-link / PKCE fallback).
 *
 * Exchanges the `code` query param for a session, then routes the user based
 * on whether they already have a profile:
 *   - no profile  -> /sign-up?step=profile (finish onboarding)
 *   - tutor       -> /dashboard/tutor
 *   - student     -> /dashboard/student
 * Any failure sends the user back to /sign-in with an error flag.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  // Normalise the base URL (the configured site URL may carry a trailing slash).
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? origin).replace(/\/$/, '');
  const fail = `${base}/sign-in?error=auth_callback_failed`;

  if (!code) return NextResponse.redirect(fail);

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(fail);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(fail);

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle<{ role: 'student' | 'tutor' }>();

  if (!profile) {
    return NextResponse.redirect(`${base}/sign-up?step=profile`);
  }

  const destination =
    profile.role === 'tutor' ? '/dashboard/tutor' : '/dashboard/student';
  return NextResponse.redirect(`${base}${destination}`);
}
