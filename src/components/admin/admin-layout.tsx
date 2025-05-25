// src/components/admin/admin-layout.tsx (Updated with Categories)
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Building, 
  FileText, 
  MessageSquare, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  User,
  Tag
} from "lucide-react"
import { Button } from "@/components/ui/button"
import LoadingSpinner from "@/components/ui/loading-spinner"

interface AdminLayoutProps {
  children: React.ReactNode
}

interface AdminUser {
  id?: string
  name?: string
  email?: string
  role?: string
  [key: string]: unknown
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Properties", href: "/admin/properties", icon: Building },
    { name: "Categories", href: "/admin/categories", icon: Tag },
    { name: "Blogs", href: "/admin/blogs", icon: FileText },
    { name: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth-token")
        console.log("Checking auth, token exists:", !!token)
        
        if (!token) {
          console.log("No token found, redirecting to login")
          router.push("/admin/login")
          return
        }

        const response = await fetch("/api/auth/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        console.log("Auth verify response:", response.status, response.ok)

        if (response.ok) {
          const userData = await response.json()
          console.log("Auth successful, user data:", userData.user)
          
          if (userData.user && userData.user.role === 'admin') {
            setUser(userData.user)
          } else {
            console.log("User is not admin, redirecting to login")
            localStorage.removeItem("auth-token")
            router.push("/admin/login")
          }
        } else {
          console.log("Auth failed, removing token and redirecting")
          localStorage.removeItem("auth-token")
          router.push("/admin/login")
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        localStorage.removeItem("auth-token")
        router.push("/admin/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleSignOut = () => {
    console.log("Signing out, removing token")
    localStorage.removeItem("auth-token")
    setUser(null)
    router.push("/admin/login")
  }

  const isActiveRoute = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin"
    }
    return pathname.startsWith(href)
  }

  const getPageTitle = () => {
    const activeItem = navItems.find(item => isActiveRoute(item.href))
    return activeItem?.name || "Dashboard"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-yellow-400">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <p className="text-yellow-400">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
          <Link href="/admin" className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">MS</span>
              </div>
              <span className="text-xl font-bold text-yellow-400">MSBUILDER&apos;S</span>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-yellow-400 hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          {navItems.map((item) => {
            const isActive = isActiveRoute(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-3 mb-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? "bg-yellow-500 text-black shadow-lg" 
                    : "text-gray-300 hover:bg-gray-800 hover:text-yellow-400"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center space-x-3 mb-3">
              <div className="h-10 w-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.name || "Admin User"}
                </p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="w-full bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-yellow-400 hover:border-yellow-400"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-yellow-600 hover:bg-yellow-50"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="hidden md:block">
              <h1 className="text-xl font-semibold text-gray-900">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 hover:text-yellow-600 hover:bg-yellow-50"
            >
              <Bell className="h-5 w-5" />
            </Button>
            
            <Button asChild variant="outline" size="sm" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50">
              <Link href="/" target="_blank">
                View Site
              </Link>
            </Button>
            
            <div className="text-sm text-gray-600">
              Welcome, <span className="font-medium text-yellow-600">{user.name || user.email}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
          <div className="text-black">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}