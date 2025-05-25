// src/components/admin/admin-login.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const verifyTokenAndRedirect = async () => {
      try {
        const token = localStorage.getItem("auth-token")
        if (!token) {
          setIsCheckingAuth(false)
          return
        }

        const response = await fetch("/api/auth/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          console.log("Valid token found, redirecting to admin")
          router.push("/admin")
        } else {
          console.log("Invalid token, removing from storage")
          localStorage.removeItem("auth-token")
          setIsCheckingAuth(false)
        }
      } catch (error) {
        console.error("Token verification error:", error)
        localStorage.removeItem("auth-token")
        setIsCheckingAuth(false)
      }
    }

    verifyTokenAndRedirect()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      console.log("Attempting login with:", formData.email)
      
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log("Login response:", { success: data.success, status: response.status })

      if (response.ok && data.success) {
        console.log("Login successful, storing token and redirecting")
        localStorage.setItem("auth-token", data.token)
        
        await new Promise(resolve => setTimeout(resolve, 100))
        
        router.push("/admin")
      } else {
        console.log("Login failed:", data.message)
        setError(data.message || "Invalid credentials")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <div className="text-yellow-400 font-medium">Checking authentication...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-yellow-500/20 rounded-full blur-2xl"></div>
      </div>
      
      <Card className="w-full max-w-md relative z-10 bg-gray-800 border-gray-700 shadow-2xl">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="h-8 w-8 text-black" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-yellow-500 rounded-md flex items-center justify-center">
                <span className="text-black font-bold text-xs">MS</span>
              </div>
              <span className="text-2xl font-bold text-yellow-400">MSBUILDER&apos;S</span>
            </div>
            <CardTitle className="text-2xl font-bold text-white">Admin Portal</CardTitle>
            <p className="text-gray-400">
              Secure access to management dashboard
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-300 rounded-lg p-4 text-sm">
              <div className="font-medium">Authentication Failed</div>
              <div className="text-xs mt-1 opacity-90">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@msbuilders.com"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-yellow-500 pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-yellow-400 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                "Access Dashboard"
              )}
            </Button>
          </form>

          <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
            <div className="text-center">
              <p className="text-xs font-medium text-gray-400 mb-3">Development Credentials</p>
              <div className="space-y-2">
                <div className="bg-gray-600 rounded px-3 py-2 text-sm">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white ml-2 font-mono">admin@msbuilders.com</span>
                </div>
                <div className="bg-gray-600 rounded px-3 py-2 text-sm">
                  <span className="text-gray-400">Password:</span>
                  <span className="text-white ml-2 font-mono">admin123456</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}