import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import Topbar from '@/components/shared/topbar'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'Hello friends',
  description: 'Welcome',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Topbar />
            {children}

          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}