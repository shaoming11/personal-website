import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Onest, Roboto_Mono } from 'next/font/google'
import './globals.css'
import { SmoothScroll } from '@/components/smooth-scroll'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const onest = Onest({ variable: '--font-onest', subsets: ['latin'] })
const robotoMono = Roboto_Mono({ variable: '--font-roboto-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Shaoming Wu',
  description: 'Incoming mechatronics engineering student at the University of Waterloo who likes to build things.',
  metadataBase: new URL('https://shaomingwu.com'),
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Shaoming Wu',
    description: 'Incoming mechatronics engineering student at the University of Waterloo who likes to build things.',
    url: '/',
    siteName: 'Shaoming Wu',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Shaoming Wu' }],
    // Next doesn't resolve video URLs against metadataBase, so these must be absolute.
    videos: [{ url: 'https://shaomingwu.com/og.mp4', secureUrl: 'https://shaomingwu.com/og.mp4', type: 'video/mp4', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og.png'],
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${onest.variable} ${robotoMono.variable} bg-background`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var saved = localStorage.getItem('theme');
            if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.add('light');
            }
          })();
        `}} />
      </head>
      <body className="antialiased" style={{ fontFamily: "var(--font-onest)" }}>
        <SmoothScroll />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
