// src/components/admin/admin-dashboard.tsx (Updated)
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Building, 
  FileText, 
  MessageSquare, 
  Users, 
  Eye,
  DollarSign,
  Plus,
  Tag
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import LoadingSpinner from "@/components/ui/loading-spinner"

interface DashboardStats {
  totalProperties: number
  totalBlogs: number
  totalInquiries: number
  newInquiries: number
  totalViews: number
  monthlyRevenue: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("auth-token")
      const response = await fetch("/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const dashboardCards = [
    {
      title: "Total Properties",
      value: stats?.totalProperties || 0,
      icon: Building,
      change: "+12%",
      changeType: "positive" as const,
      href: "/admin/properties"
    },
    {
      title: "Blog Articles",
      value: stats?.totalBlogs || 0,
      icon: FileText,
      change: "+8%",
      changeType: "positive" as const,
      href: "/admin/blogs"
    },
    {
      title: "Total Inquiries",
      value: stats?.totalInquiries || 0,
      icon: MessageSquare,
      change: "+23%",
      changeType: "positive" as const,
      href: "/admin/inquiries"
    },
    {
      title: "New Inquiries",
      value: stats?.newInquiries || 0,
      icon: Users,
      change: "+5%",
      changeType: "positive" as const,
      href: "/admin/inquiries"
    },
    {
      title: "Total Views",
      value: stats?.totalViews || 0,
      icon: Eye,
      change: "+18%",
      changeType: "positive" as const,
      href: "/admin/properties"
    },
    {
      title: "Monthly Revenue",
      value: `$${(stats?.monthlyRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      change: "+15%",
      changeType: "positive" as const,
      href: "/admin/properties"
    }
  ]

  const quickActions = [
    {
      title: "Add New Property",
      description: "List a new property for sale or rent",
      icon: Building,
      href: "/admin/properties/add",
      color: "bg-yellow-500"
    },
    {
      title: "Manage Categories",
      description: "Organize property categories and types",
      icon: Tag,
      href: "/admin/categories",
      color: "bg-yellow-600"
    },
    {
      title: "Write New Blog",
      description: "Create and publish a new blog article",
      icon: FileText,
      href: "/admin/blogs/add",
      color: "bg-yellow-500"
    },
    {
      title: "View Inquiries",
      description: "Check and respond to customer inquiries",
      icon: MessageSquare,
      href: "/admin/inquiries",
      color: "bg-yellow-600"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your properties.
          </p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <Button
            asChild
            variant="outline"
            className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
          >
            <Link href="/admin/categories">
              <Tag className="h-4 w-4 mr-2" />
              Manage Categories
            </Link>
          </Button>
          <Button
            asChild
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
          >
            <Link href="/admin/properties/add">
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card, index) => (
          <Card
            key={index}
            className="bg-white border-gray-200 hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">{card.value}</div>
              <div className="flex items-center text-xs text-gray-500">
                <span className={`mr-1 ${
                  card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {card.change}
                </span>
                from last month
              </div>
              <Link
                href={card.href}
                className="text-yellow-600 hover:text-yellow-700 hover:underline text-sm mt-2 inline-block transition-colors"
              >
                View details →
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              className="bg-white border-gray-200 hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <CardContent className="p-6">
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 shadow-sm`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {action.description}
                </p>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-yellow-500 hover:text-yellow-600 transition-colors"
                >
                  <Link href={action.href}>
                    Get Started
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Recent Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Luxury Villa in Downtown</p>
                  <p className="text-sm text-gray-500">Added 2 hours ago</p>
                </div>
                <span className="text-yellow-600 font-semibold">$750,000</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Modern Apartment</p>
                  <p className="text-sm text-gray-500">Added 1 day ago</p>
                </div>
                <span className="text-yellow-600 font-semibold">$425,000</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-900">Commercial Office Space</p>
                  <p className="text-sm text-gray-500">Added 3 days ago</p>
                </div>
                <span className="text-yellow-600 font-semibold">$1,200,000</span>
              </div>
            </div>
            <Button
              asChild
              variant="outline"
              className="w-full mt-4 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-yellow-500 hover:text-yellow-600"
            >
              <Link href="/admin/properties">
                View All Properties
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Recent Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 py-2 border-b border-gray-200">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black text-sm font-semibold">
                  JS
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">John Smith</p>
                  <p className="text-sm text-gray-600">Interested in Luxury Villa</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 py-2 border-b border-gray-200">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black text-sm font-semibold">
                  MD
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Maria Davis</p>
                  <p className="text-sm text-gray-600">General inquiry about services</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 py-2">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black text-sm font-semibold">
                  RW
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Robert Wilson</p>
                  <p className="text-sm text-gray-600">Wants to schedule viewing</p>
                  <p className="text-xs text-gray-500">3 hours ago</p>
                </div>
              </div>
            </div>
            <Button
              asChild
              variant="outline"
              className="w-full mt-4 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-yellow-500 hover:text-yellow-600"
            >
              <Link href="/admin/inquiries">
                View All Inquiries
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}