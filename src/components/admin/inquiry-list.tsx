// src/components/admin/inquiry-list.tsx
"use client"

import { useState, useEffect } from "react"
import { Mail, Phone, MessageSquare, Calendar, Check, X, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { formatDate } from "@/lib/utils"
import type { Inquiry } from "@/types"

export default function InquiryList() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      const token = localStorage.getItem("auth-token")
      const response = await fetch("/api/inquiries", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setInquiries(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id)
    try {
      const token = localStorage.getItem("auth-token")
      const response = await fetch(`/api/inquiries/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        setInquiries(prev =>
          prev.map(inquiry =>
            inquiry._id === id ? { ...inquiry, status: status as Inquiry["status"] } : inquiry
          )
        )
      }
    } catch (error) {
      console.error("Error updating inquiry:", error)
    } finally {
      setUpdating(null)
    }
  }

  const deleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) {
      return
    }

    setDeleting(id)
    try {
      const token = localStorage.getItem("auth-token")
      const response = await fetch(`/api/inquiries/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setInquiries(prev => prev.filter(inquiry => inquiry._id !== id))
      }
    } catch (error) {
      console.error("Error deleting inquiry:", error)
    } finally {
      setDeleting(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "contacted":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {inquiries.length > 0 ? (
        inquiries.map((inquiry) => (
          <Card key={inquiry._id}>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-black font-semibold">
                    {inquiry.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{inquiry.name}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(inquiry.createdAt)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mt-2 md:mt-0">
                  <Badge className={getStatusColor(inquiry.status)}>
                    {inquiry.status}
                  </Badge>
                  <Badge variant="outline">
                    {inquiry.type}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${inquiry.email}`}
                    className="text-primary hover:underline"
                  >
                    {inquiry.email}
                  </a>
                </div>
                
                {inquiry.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`tel:${inquiry.phone}`}
                      className="text-primary hover:underline"
                    >
                      {inquiry.phone}
                    </a>
                  </div>
                )}
              </div>

              {inquiry.propertyTitle && (
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium">Property Interest:</p>
                  <p className="text-sm text-muted-foreground">{inquiry.propertyTitle}</p>
                </div>
              )}

              <div className="mb-4">
                <div className="flex items-start space-x-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm font-medium mb-1">Message:</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {inquiry.message}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {inquiry.status === "new" && (
                  <Button
                    size="sm"
                    onClick={() => updateStatus(inquiry._id!, "contacted")}
                    disabled={updating === inquiry._id}
                  >
                    {updating === inquiry._id ? (
                      <LoadingSpinner size="sm" className="mr-1" />
                    ) : (
                      <Check className="h-3 w-3 mr-1" />
                    )}
                    Mark as Contacted
                  </Button>
                )}
                
                {inquiry.status === "contacted" && (
                  <Button
                    size="sm"
                    onClick={() => updateStatus(inquiry._id!, "resolved")}
                    disabled={updating === inquiry._id}
                  >
                    {updating === inquiry._id ? (
                      <LoadingSpinner size="sm" className="mr-1" />
                    ) : (
                      <Check className="h-3 w-3 mr-1" />
                    )}
                    Mark as Resolved
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateStatus(inquiry._id!, "new")}
                  disabled={updating === inquiry._id}
                >
                  <X className="h-3 w-3 mr-1" />
                  Reset to New
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteInquiry(inquiry._id!)}
                  disabled={deleting === inquiry._id}
                >
                  {deleting === inquiry._id ? (
                    <LoadingSpinner size="sm" className="mr-1" />
                  ) : (
                    <Trash2 className="h-3 w-3 mr-1" />
                  )}
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries yet</h3>
            <p className="text-muted-foreground">
              When customers submit contact forms, they&apos;ll appear here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}