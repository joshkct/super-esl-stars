import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const NAV_LINKS = [
  { href: '#how-it-works', key: 'howItWorks' },
  { href: '#about', key: 'about' },
  { href: '#pricing', key: 'pricing' },
  { href: '#contact', key: 'contact' },
] as const;

/**
 * Site footer: wordmark + tagline and social icons on the left, navigation
 * and legal link columns on the right, with a copyright bar carrying the
 * current year.
 */
export async function Footer() {
  const tNav = await getTranslations('nav');
  const tFooter = await getTranslations('footer');
  const year = new Date().getFullYear();

  const socials = [
    { Icon: Instagram, label: tFooter('social.instagram') },
    { Icon: Facebook, label: tFooter('social.facebook') },
    { Icon: Linkedin, label: tFooter('social.linkedin') },
    { Icon: Twitter, label: tFooter('social.twitter') },
  ];

  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Left */}
          <div>
            <span className="font-serif text-2xl font-bold text-cream">
              Verbjective
            </span>
            <p className="mt-3 max-w-sm text-sm text-cream/70">
              {tFooter('tagline')}
            </p>
            <ul className="mt-6 flex gap-3">
              {socials.map(({ Icon, label }) => (
                <li key={label}>
                  <a
                    href="#"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/25 text-cream transition-colors hover:border-gold hover:text-gold"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: link columns */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gold">
                {tFooter('navTitle')}
              </h3>
              <ul className="mt-4 space-y-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.key}>
                    <a
                      href={link.href}
                      className="text-sm text-cream/80 transition-colors hover:text-gold"
                    >
                      {tNav(link.key)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gold">
                {tFooter('legalTitle')}
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-cream/80 transition-colors hover:text-gold"
                  >
                    {tFooter('privacy')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-cream/80 transition-colors hover:text-gold"
                  >
                    {tFooter('terms')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-cream/15 pt-8 text-sm text-cream/60">
          &copy; {year} Verbjective. {tFooter('rights')}
        </div>
      </div>
    </footer>
  );
}
