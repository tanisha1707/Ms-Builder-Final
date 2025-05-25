// src/components/blogs/blog-card.tsx
import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, User, ArrowRight, Eye, Heart } from "lucide-react"
import { Card, CardContent} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import type { Blog } from "@/types"

interface BlogCardProps {
  blog: Blog
}

export default function BlogCard({ blog }: BlogCardProps) {
  return (
    <Link href={`/blogs/${blog._id}`} className="group">
      <Card className="h-full overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group-hover:scale-105 border-gray-200">
        {/* Featured Image */}
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={blog.image || "/images/placeholder-blog.jpg"}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Overlay with badges */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <Badge className="bg-yellow-500 text-black hover:bg-yellow-600 shadow-sm">
              {blog.category}
            </Badge>
            {blog.featured && (
              <Badge variant="secondary" className="bg-green-500 text-white shadow-sm">
                <Heart className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>

          {/* Read time badge */}
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="bg-white/90 text-gray-700 backdrop-blur-sm">
              <Clock className="h-3 w-3 mr-1" />
              {blog.readTime} min
            </Badge>
          </div>

          {/* Read more overlay on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-yellow-500 text-black px-4 py-2 rounded-full font-medium shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              Read Article
              <ArrowRight className="h-4 w-4 ml-2 inline" />
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-6 bg-white">
          {/* Title */}
          <h3 className="font-bold text-lg line-clamp-2 leading-tight mb-3 text-gray-900 group-hover:text-yellow-600 transition-colors">
            {blog.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
            {blog.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4">
            <div className="flex items-center">
              <User className="h-3 w-3 mr-1" />
              <span className="font-medium">{blog.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formatDate(blog.createdAt)}</span>
            </div>
            <div className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              <span>{blog.views || 0} views</span>
            </div>
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {blog.tags.slice(0, 3).map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs py-0 px-2 h-6 hover:bg-yellow-50 hover:border-yellow-500 transition-colors"
                >
                  {tag}
                </Badge>
              ))}
              {blog.tags.length > 3 && (
                <Badge variant="outline" className="text-xs py-0 px-2 h-6 text-gray-400">
                  +{blog.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Read More Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center text-yellow-600 hover:text-yellow-700 transition-colors text-sm font-medium">
              <span>Read More</span>
              <ArrowRight className="h-3 w-3 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </div>
            
            <div className="text-xs text-gray-400">
              {blog.published ? 'Published' : 'Draft'}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}