import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Eid Mubarak',
  description: 'Share your Eid wishes and greetings',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col transition-colors duration-300">
        {children}
      </body>
    </html>
  )
}
