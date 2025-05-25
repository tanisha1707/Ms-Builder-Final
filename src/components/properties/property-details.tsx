// src/components/properties/property-details.tsx
import { MapPin, Bed, Bath, Square, Calendar, Tag, Home, Car, Heart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import type { Property } from "@/types"

interface PropertyDetailsProps {
  property: Property
}

export default function PropertyDetails({ property }: PropertyDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Basic Info Card */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Property Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <Bed className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Bedrooms</p>
                <p className="font-medium text-gray-900">{property.bedrooms}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Bath className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Bathrooms</p>
                <p className="font-medium text-gray-900">{property.bathrooms}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Square className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Area</p>
                <p className="font-medium text-gray-900">{property.area} sqft</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Tag className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-medium text-gray-900">{property.category}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium text-gray-900">{property.location}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Listed On</p>
                <p className="font-medium text-gray-900">{formatDate(property.createdAt)}</p>
              </div>
            </div>

            {property.yearBuilt && (
              <div className="flex items-center space-x-3">
                <Home className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Year Built</p>
                  <p className="font-medium text-gray-900">{property.yearBuilt}</p>
                </div>
              </div>
            )}

            {property.parking && (
              <div className="flex items-center space-x-3">
                <Car className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Parking</p>
                  <p className="font-medium text-gray-900">{property.parking} spaces</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant={property.status === 'Available' ? 'default' : 'secondary'} 
                   className={property.status === 'Available' 
                     ? 'bg-green-100 text-green-800 border-green-200' 
                     : 'bg-gray-100 text-gray-700 border-gray-200'}>
              {property.status}
            </Badge>
            {property.furnished && (
              <Badge variant="outline" className="border-gray-300 text-gray-700">Furnished</Badge>
            )}
            {property.petFriendly && (
              <Badge variant="outline" className="border-gray-300 text-gray-700">Pet Friendly</Badge>
            )}
            {property.featured && (
              <Badge className="bg-yellow-500 text-black border-yellow-600">
                <Heart className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Description Card */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {property.description}
          </p>
        </CardContent>
      </Card>

      {/* Features Card */}
      {property.features && property.features.length > 0 && (
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {property.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="h-2 w-2 bg-yellow-500 rounded-full mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Amenities Card */}
      {property.amenities && property.amenities.length > 0 && (
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {property.amenities.map((amenity, index) => (
                <li key={index} className="flex items-center">
                  <span className="h-2 w-2 bg-yellow-500 rounded-full mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">{amenity}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}