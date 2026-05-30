import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

/**
 * Global route protection.
 *
 *  - Refreshes the Supabase session on every matched request.
 *  - Redirects unauthenticated users away from `/dashboard/*` to `/sign-in`.
 *  - Role-gates `/dashboard/tutor`: non-tutors are sent to the student area.
 *  - Sends already-authenticated users away from the auth pages.
 */
export async function middleware(request: NextRequest) {
  const { supabase, supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isDashboard = pathname.startsWith('/dashboard');
  const isAuthPage = pathname === '/sign-in' || pathname === '/sign-up';

  if (isDashboard && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/sign-in';
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  if (user && (isDashboard || isAuthPage)) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single<{ role: 'student' | 'tutor' }>();

    const role = profile?.role ?? 'student';

    // Bounce authenticated users off auth pages to their dashboard.
    if (isAuthPage) {
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
