import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

/**
 * Global route protection (Next.js "proxy" convention, formerly `middleware`).
 *
 *  - Refreshes the Supabase session on every matched request.
 *  - Redirects unauthenticated users away from `/dashboard/*` to `/sign-in`.
 *  - Role-gates `/dashboard/tutor`: non-tutors are sent to the student area.
 *  - Sends already-authenticated users away from the auth pages.
 */
/** Routes that require any authenticated session. */
function isProtectedPath(pathname: string): boolean {
  return (
    pathname.startsWith('/dashboard') ||
    pathname === '/welcome' ||
    pathname === '/onboarding'
  );
}

export async function proxy(request: NextRequest) {
  const { supabase, supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isProtected = isProtectedPath(pathname);
  const isAuthPage = pathname === '/sign-in' || pathname === '/sign-up';

  // Unauthenticated access to a protected route: remember where they were
  // headed (cookie) and send them to sign in.
  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/sign-in';
    const response = NextResponse.redirect(url);
    response.cookies.set('verbjective_redirect', pathname, {
      path: '/',
      maxAge: 60 * 10,
      sameSite: 'lax',
    });
    return response;
  }

  if (user && (isProtected || isAuthPage)) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle<{ role: 'student' | 'tutor' }>();

    const role = profile?.role ?? 'student';

    if (isAuthPage) {
      // New users have a session but no profile yet — let them through so they
      // can finish at /sign-up?step=profile.
      if (!profile) return supabaseResponse;

      const url = request.nextUrl.clone();
      url.pathname = role === 'tutor' ? '/dashboard/tutor' : '/dashboard/student';
      return NextResponse.redirect(url);
    }

    // Role-gate the tutor dashboard.
    if (pathname.startsWith('/dashboard/tutor') && role !== 'tutor') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard/student';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all paths except static assets and Next internals so that the
     * Supabase session cookie is refreshed across the app.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
