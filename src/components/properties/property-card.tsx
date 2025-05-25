// src/components/properties/property-card.tsx
import Link from "next/link"
import Image from "next/image"
import { MapPin, Bed, Bath, Square, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice, formatDate } from "@/lib/utils"
import type { Property } from "@/types"

interface PropertyCardProps {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/properties/${property._id}`}>
      <Card className="property-card overflow-hidden">
        <div className="relative h-48 w-full">
          <Image
            src={property.images[0] || "/images/placeholder-property.jpg"}
            alt={property.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 left-2">
            <Badge variant="default">
              {property.category}
            </Badge>
          </div>
          <div className="absolute top-2 right-2">
            <Badge variant={property.status === 'Available' ? 'default' : 'secondary'}>
              {property.status}
            </Badge>
          </div>
          {property.featured && (
            <div className="absolute bottom-2 left-2">
              <Badge variant="secondary" className="bg-yellow-500 text-black">
                Featured
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-1">{property.title}</h3>

          <div className="flex items-center text-muted-foreground text-sm mb-3">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{property.location}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
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

          <div className="flex justify-between items-center">
            <p className="font-bold text-lg text-primary">
              {formatPrice(property.price)}
            </p>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formatDate(property.createdAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
