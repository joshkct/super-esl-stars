import createNextIntlPlugin from 'next-intl/plugin';

// Points next-intl to the request configuration used for the
// "i18n without routing" setup (locale resolved from a cookie).
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        // Supabase Storage public assets (avatars, files, invoice PDFs).
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
