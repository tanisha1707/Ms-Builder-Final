import Image from "next/image"
import Link from "next/link"
import { Check, Award, Users, Building, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutSection() {
  const features = [
    "Expert team with 15+ years of industry experience",
    "Personalized service tailored to your unique needs",
    "Extensive portfolio of premium properties",
    "Transparent and hassle-free process",
    "24/7 customer support and assistance",
    "Proven track record of successful transactions"
  ]

  const stats = [
    { icon: Building, value: "500+", label: "Properties Sold" },
    { icon: Users, value: "1000+", label: "Happy Clients" },
    { icon: Award, value: "15+", label: "Years Experience" },
    { icon: Star, value: "4.9", label: "Customer Rating" }
  ]

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <div className="relative">
            <div className="relative h-[500px] lg:h-[600px] w-full rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/about-us.jpeg"
                alt="MSBUILDER'S Office"
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {/* Floating Stats Card */}
            <div className="absolute -bottom-6 -right-6 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 transform transition-transform duration-300 hover:scale-105">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500 mb-1">15+</div>
                <div className="text-sm text-gray-300">Years of Excellence</div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 tracking-tight">
              About <span className="text-yellow-500">MSBUILDER&apos;S</span>
            </h2>
            
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              MSBUILDER&apos;S is a premier real estate company with over 15 years of
              experience in the industry. We specialize in helping clients find the perfect
              properties—whether it&apos;s a new home, investment opportunity, or commercial space.
            </p>
            
            <p className="text-gray-300 mb-8 leading-relaxed">
              Our team of expert real estate professionals is committed to providing
              outstanding service and guidance throughout every step of your real estate journey.
              We believe in building lasting relationships based on trust, integrity, and results.
            </p>

            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-gray-300">{feature}</p>
                </div>
              ))}
            </div>

            <Button
              asChild
              size="lg"
              className="px-8 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold transform transition-transform duration-300 hover:scale-105"
            >
              <Link href="/contact">
                Learn More About Us
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="text-center bg-white/10 backdrop-blur-sm border-gray-200 transform transition-transform duration-300 hover:scale-105"
            >
              <CardContent className="p-6">
                <stat.icon className="h-8 w-8 text-yellow-500 mx-auto mb-4" />
                <div className="text-3xl font-bold text-yellow-500 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}