// src/components/properties/property-card.tsx
import Link from "next/link"
import Image from "next/image"
import { MapPin, Bed, Bath, Square, Calendar, ArrowRight} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice, formatDate } from "@/lib/utils"
import type { Property } from "@/types"

interface PropertyCardProps {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl shadow-sm transition-shadow hover:shadow-md border border-muted bg-white">
      {/* Image with Hover Animation */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={property.images[0] || "/images/placeholder-property.jpg"}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <Badge variant="default" className="text-white bg-yellow-400/80">
            {property.category}
          </Badge>
        </div>

        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <Badge
            variant={property.status === "Available" ? "default" : "secondary"}
            className="text-white"
          >
            {property.status}
          </Badge>
        </div>

        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary" className="bg-yellow-300 text-black">
              Featured
            </Badge>
          </div>
        )}

        {/* Hover Arrow Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <Link
                href={`/properties/${property._id}`}
                className="absolute top-2/3 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-yellow-400/90 hover:bg-yellow-500 text-black p-2 rounded-full shadow-md"
              >
                <ArrowRight className="w-4 h-4" />
             </Link>
        </div>
        
      </div>

      {/* Card Content */}
      <CardContent className="p-4 space-y-2">
        <h3 className="font-bold text-lg line-clamp-1">{property.title}</h3>

        <div className="flex items-center text-muted-foreground text-sm">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">{property.location}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm pt-2">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span>{property.bathrooms}</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            <span>{property.area} sqft</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-3">
          <p className="font-bold text-primary text-lg">
            {formatPrice(property.price)}
          </p>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formatDate(property.createdAt)}</span>
          </div>
        </div>
      </CardContent>
    </div>
  )
}