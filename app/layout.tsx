import type { Metadata } from 'next'
import { ThemeProvider } from '../components/theme-provider'
import { Toaster } from '../components/ui/toaster'
import './globals.css'

export const metadata: Metadata = {
  title: 'Law Student Amicus Brief',
  description: 'Sign the Law Student Amicus Brief in support of Susman Godfrey\'s Motion for Summary Judgment',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
