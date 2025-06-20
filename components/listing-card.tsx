import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Users, DollarSign, Edit, Eye, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ListingCardProps {
  listing: {
    _id: string
    title: string
    location: string
    pricePerNight: number
    maxGuests: number
    images: string[]
    status?: string
  }
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Card>
      <div className="relative h-48">
        <Image
          src={listing.images[0] || "/placeholder.svg?height=200&width=300"}
          alt={listing.title}
          fill
          className="object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/property/${listing._id}`} className="flex items-center">
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
          <MapPin className="w-3 h-3" />
          <span>{listing.location}</span>
        </div>

        <h3 className="font-semibold mb-3 line-clamp-2">{listing.title}</h3>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span>{listing.maxGuests} guests</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span>${listing.pricePerNight}/night</span>
            </div>
          </div>
          <Badge variant={listing.status === "active" ? "default" : "secondary"}>{listing.status || "active"}</Badge>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href={`/property/${listing._id}`}>View</Link>
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
