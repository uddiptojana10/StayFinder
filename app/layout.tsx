import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'StayFinder',
  description: 'Test1',
  generator: 'test.dev',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="app/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
