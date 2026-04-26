import type { Metadata } from 'next'
import { DM_Sans, DM_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Tabless — daily standup for solo workers',
  description:
    'A focused async check-in ritual for freelancers and indie hackers. Three questions, once a day. No team required.',
  openGraph: {
    title: 'Tabless',
    description: 'Your daily standup, just for you.',
    url: 'https://tabless.app',
    siteName: 'Tabless',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Tabless',
    description: 'Your daily standup, just for you.',
  },
  metadataBase: new URL('https://tabless.app'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
