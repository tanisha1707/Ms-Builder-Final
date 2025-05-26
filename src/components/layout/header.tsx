"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Properties", href: "/properties" },
    { name: "Categories", href: "/categories" },
    { name: "Blogs", href: "/blogs" },
    { name: "Contact", href: "/contact" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-white/95 backdrop-blur-sm py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
  <div className="relative h-14 w-14 rounded-full bg-white shadow-md p-1 transition-transform duration-300 hover:scale-110 group">
    <Image 
      src="/images/logo.jpeg" 
      alt="MSBUILDER'S Logo"
      layout="fill"
      className="object-cover rounded-full group-hover:opacity-90 transition-opacity duration-300"
      priority
      onError={(e) => {
        e.currentTarget.style.display = "none"
        const nextSibling = e.currentTarget.nextSibling
        if (nextSibling instanceof HTMLElement) {
          nextSibling.classList.remove("hidden")
        }
      }}
    />
    <span className="hidden absolute inset-0 flex items-center justify-center text-sm font-semibold text-yellow-500">
      MSBUILDERS
    </span>
  </div>
  <span className="ml-3 text-xl font-bold text-yellow-600 tracking-wide hidden md:inline-block">
    MSBUILDERS
  </span>
</Link>


          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative text-base font-medium transition duration-300 ease-in-out hover:text-yellow-500 ${
                  pathname === link.href ? "text-black" : "text-black"
                }`}
              >
                {link.name}
                {pathname === link.href && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-yellow-500"></span>
                )}
              </Link>
            ))}
            <Button
              asChild
              className="px-8 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold transform transition-transform duration-300 hover:scale-105"
            >
              <Link href="/contact">Get Started</Link>
            </Button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-black"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 mt-2 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-base font-medium transition duration-300 ease-in-out hover:text-yellow-500 ${
                    pathname === link.href ? "text-black" : "text-black"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Button
                asChild
                className="w-fit px-8 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold transform transition-transform duration-300 hover:scale-105"
              >
                <Link href="/contact">Get Started</Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
