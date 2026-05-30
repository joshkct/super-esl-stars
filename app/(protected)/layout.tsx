import { requireUser } from '@/lib/auth';

/**
 * Protected segment layout. Acts as a server-side guard in addition to the
 * edge middleware: any unauthenticated request is redirected to /sign-in.
 */
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();
  return <>{children}</>;
}
