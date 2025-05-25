// src/components/ui/whatsapp-chat.tsx
"use client"

import { useState } from "react"
import { MessageCircle, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface WhatsAppChatProps {
  phoneNumber: string // Format: +919876543210 (with country code)
  businessName?: string
  defaultMessage?: string
}

export default function WhatsAppChat({ 
  phoneNumber, 
  businessName = "MSBUILDER'S",
  defaultMessage = "Hi! I'm interested in your property listings. Can you help me?"
}: WhatsAppChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState(defaultMessage)

  const openWhatsApp = (customMessage?: string) => {
    const textToSend = customMessage || message
    const encodedMessage = encodeURIComponent(textToSend)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
    setIsOpen(false)
  }

  const quickMessages = [
    "I'm interested in property listings",
    "I want to schedule a property viewing",
    "Can you share property details?",
    "What's the price range for properties?",
    "I need help with property investment"
  ]

  return (
    <>
      {/* WhatsApp Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-w-[calc(100vw-3rem)]">
          <Card className="shadow-2xl border-gray-200">
            <CardHeader className="bg-green-500 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">{businessName}</CardTitle>
                    <p className="text-green-100 text-sm">Chat with us on WhatsApp</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-green-600"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-4 space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  Send us a message and we&apos;ll respond as soon as possible!
                </p>
                
                {/* Quick Messages */}
                <div className="space-y-2 mb-4">
                  <p className="text-xs font-medium text-gray-500 uppercase">Quick Messages:</p>
                  {quickMessages.map((quickMsg, index) => (
                    <button
                      key={index}
                      onClick={() => openWhatsApp(quickMsg)}
                      className="block w-full text-left text-sm p-2 rounded bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700"
                    >
                      {quickMsg}
                    </button>
                  ))}
                </div>

                {/* Custom Message */}
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase mb-2">Custom Message:</p>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    rows={3}
                    className="mb-3 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                  
                  <Button
                    onClick={() => openWhatsApp()}
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          size="icon"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <MessageCircle className="h-6 w-6 text-white" />
          )}
        </Button>
        
        {/* Notification Badge (optional) */}
        <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-bold">1</span>
        </div>
      </div>

      {/* Pulse Animation Ring */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <div className="h-14 w-14 rounded-full bg-green-500 opacity-20 animate-ping"></div>
        </div>
      )}
    </>
  )
}

// Optional: Property-specific WhatsApp component
type Property = {
  title: string
  price?: number
}

export function PropertyWhatsApp({ property }: { property: Property }) {
  const phoneNumber = "+919876543210" // Your business WhatsApp number
  const message = `Hi! I'm interested in the property: ${property.title} (₹${property.price?.toLocaleString('en-IN')}). Can you provide more details?`
  
  return (
    <WhatsAppChat
      phoneNumber={phoneNumber}
      defaultMessage={message}
      businessName="MSBUILDER'S Properties"
    />
  )
}