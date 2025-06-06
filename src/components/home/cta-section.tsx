import Link from "next/link"
import { Phone, Mail, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CTASection() {
  return (
    <section className="py-20 text- craterbrown">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text- craterbrown mb-6 tracking-tight">
            Ready to Find Your Perfect Property?
          </h2>
          
          <p className="text-xl text- craterbrown-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Let our expert team help you discover the ideal property that matches 
            your lifestyle and investment goals. Get started today!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              asChild
              size="lg"
              className="px-8 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold transform transition-transform duration-300 hover:scale-105"
            >
              <Link href="/properties">
                Browse Properties
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 bg-transparent border-2 border-gray-300 text- craterbrown-300 hover:bg-gray-200 hover:text-black transition-all duration-300 transform hover:scale-105"
            >
              <Link href="/contact">
                Schedule Consultation
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-3">
              <Phone className="h-6 w-6 text-yellow-500" />
              <div>
                <div className="font-semibold text-craterbrown-300">Call Us</div>
                <div className="text-craterbrown-300">+1 (555) 123-4567</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3">
              <Mail className="h-6 w-6 text-yellow-500" />
              <div>
                <div className="font-semibold text-craterbrown-300">Email Us</div>
                <div className="text-craterbrown-300">info@msbuilders.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}