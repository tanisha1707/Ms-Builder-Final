// src/components/layout/layout-provider.tsx
"use client"

import { usePathname } from "next/navigation"
import MainLayout from "./main-layout"
import WhatsappChatButton from "@/components/WhatsappChat"

interface LayoutProviderProps {
  children: React.ReactNode
}

export default function LayoutProvider({ children }: LayoutProviderProps) {
  const pathname = usePathname()
  
  // Check if current route is admin-related
  const isAdminRoute = pathname.startsWith('/admin')
  
  // For admin routes, render children directly (no main layout)
  if (isAdminRoute) {
    return <>{children}</>
  }
  
  // For all other routes, use the main layout with header and footer
  return (
    <MainLayout>
      {children}
      <WhatsappChatButton />
    </MainLayout>
  )
}