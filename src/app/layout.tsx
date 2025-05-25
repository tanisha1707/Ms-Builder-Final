// src/app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import LayoutProvider from "@/components/layout/layout-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MSBUILDER'S - Premium Real Estate",
  description: "Discover premium properties with MSBUILDER'S real estate company. Find your perfect home, investment property, or commercial space.",
  keywords: "real estate, properties, homes, apartments, villas, commercial, MSBUILDER'S",
  authors: [{ name: "MSBUILDER'S" }],
  openGraph: {
    title: "MSBUILDER'S - Premium Real Estate",
    description: "Discover premium properties with MSBUILDER'S real estate company",
    type: "website",
    locale: "en_US",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LayoutProvider>
          {children}
        </LayoutProvider>
      </body>
    </html>
  )
}