// src/components/layout/footer.tsx
import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div>
            <Link href="/" className="inline-block mb-6">
              <div className="relative h-12 w-48">
                <Image 
                  src="/images/logo.jpeg" 
                  alt="MSBUILDER'S Logo" 
                  fill 
                  className="object-contain" 
                />
              </div>
            </Link>
            <p className="text-gray-400 mb-6">
              MSBUILDER&apos;S is a premium real estate company dedicated to finding the perfect property for you. 
              With years of experience, we help you make the best investment decisions.
            </p>
            <div className="flex space-x-4 justify-center">
              <Link href=" https://www.facebook.com/profile.php?id=61576939058032" className="text-gray-400 hover:text-primary transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/properties" className="text-gray-400 hover:text-primary transition-colors">
                  Properties
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-400 hover:text-primary transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="text-gray-400 hover:text-primary transition-colors">
                  Blogs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative inline-block">
              Property Categories
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/categories?category=Residential"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Residential
                </Link>
              </li>
              <li>
                <Link
                  href="/categories?category=Commercial"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Commercial
                </Link>
              </li>
              <li>
                <Link
                  href="/categories?category=Apartment"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Apartment
                </Link>
              </li>
              <li>
                <Link href="/categories?category=Villa" className="text-gray-400 hover:text-primary transition-colors">
                  Villa
                </Link>
              </li>
              <li>
                <Link href="/categories?category=Office" className="text-gray-400 hover:text-primary transition-colors">
                  Office Space
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative inline-block">
              Contact Us
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-400">123 Real Estate Avenue, Building District, City 10001</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                <span className="text-gray-400">info@msbuilders.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} MSBUILDER&apos;S. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}