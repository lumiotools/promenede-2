import type React from "react"
import type { Metadata } from "next"
import { Geist as GeistSans, Geist_Mono as GeistMono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

// Configure Geist Sans with all weights and styles
const geistSans = GeistSans({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

// Configure Geist Mono with all weights and styles
const geistMono = GeistMono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "Company Intelligence Platform",
  description: "Comprehensive business intelligence and market analysis platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'