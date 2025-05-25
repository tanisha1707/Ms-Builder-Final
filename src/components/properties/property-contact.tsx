// src/components/properties/property-contact.tsx
"use client"

import { useState } from "react"
import { Phone, Mail, MessageSquare, Send, MessageCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Property } from "@/types"

interface PropertyContactProps {
  property: Property
}

// Format price in INR
const formatPriceINR = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export default function PropertyContact({ property }: PropertyContactProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `I'm interested in this property: ${property.title}`,
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          propertyId: property._id,
          propertyTitle: property.title,
          type: "property",
        }),
      })

      if (response.ok) {
        setSuccess(true)
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: `I'm interested in this property: ${property.title}`,
        })
        setTimeout(() => setSuccess(false), 5000)
      } else {
        throw new Error("Failed to submit inquiry")
      }
    } catch (error) {
      console.error("Error submitting inquiry:", error)
      setError("An error occurred while submitting your inquiry. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const openWhatsApp = () => {
    const phoneNumber = "+919876543210" // Your business WhatsApp number
    const message = `Hi! I'm interested in this property:

*${property.title}*
📍 ${property.location}
💰 ${formatPriceINR(property.price)}

Can you provide more details and arrange a viewing?`
    
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="space-y-6">
      {/* Price Card */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-600 mb-2">
              {formatPriceINR(property.price)}
            </p>
            <p className="text-gray-600">
              Listed on {new Date(property.createdAt).toLocaleDateString('en-IN')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Contact Options */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Quick Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={openWhatsApp}
            className="w-full justify-start bg-green-500 hover:bg-green-600 text-white font-medium"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat on WhatsApp
          </Button>
          
          <Button asChild variant="outline" className="w-full justify-start bg-yellow-50 border-yellow-500 text-black">
            <a href="tel:+919876543210">
              <Phone className="h-4 w-4 mr-2" />
              Call: +91 9876543210
            </a>
          </Button>
          
          <Button asChild variant="outline" className="w-full justify-start bg-yellow-50 border-yellow-500 text-black">
            <a href="mailto:admin@msbuilders.com">
              <Mail className="h-4 w-4 mr-2" />
              Email: admin@msbuilders.com
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Contact Form */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900">
            <MessageSquare className="h-5 w-5 mr-2" />
            Send Inquiry
          </CardTitle>
        </CardHeader>
        <CardContent>
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4 mb-6">
              Thank you for your inquiry! We will contact you shortly.
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 bg-white text-gray-900 placeholder-gray-500"
            />

            <Input
              name="email"
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 bg-white text-gray-900 placeholder-gray-500"
            />

            <Input
              name="phone"
              type="tel"
              placeholder="Your Phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 bg-white text-gray-900 placeholder-gray-500"
            />

            <Textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              className="border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 bg-white text-gray-900 placeholder-gray-500"
            />

            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
            >
              {loading ? (
                "Sending..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Inquiry
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}