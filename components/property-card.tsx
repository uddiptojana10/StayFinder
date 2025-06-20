import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star } from "lucide-react"

interface PropertyCardProps {
  listing: {
    _id: string
    title: string
    location: string
    pricePerNight: number
    images: string[]
    maxGuests: number
  }
}

export function PropertyCard({ listing }: PropertyCardProps) {
  return (
    <Link href={`/property/${listing._id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48">
          <Image
            src={listing.images[0] || "/placeholder.svg?height=200&width=300"}
            alt={listing.title}
            fill
            className="object-cover"
          />
          <Badge className="absolute top-2 right-2 bg-white/90 text-black">{listing.maxGuests} guests</Badge>
        </div>
        <CardContent className="p-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
            <MapPin className="w-3 h-3" />
            <span>{listing.location}</span>
          </div>
          <h3 className="font-semibold mb-2 line-clamp-2">{listing.title}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">4.8</span>
            </div>
            <div className="text-right">
              <div className="font-bold">₹{listing.pricePerNight}</div>
              <div className="text-sm text-muted-foreground">per night</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
