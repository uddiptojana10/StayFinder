import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, MapPin, Users, DollarSign } from "lucide-react"

interface BookingCardProps {
  booking: {
    _id: string
    listingId: string
    checkIn: string
    checkOut: string
    guests: number
    totalPrice: number
    status: string
    listing?: {
      title: string
      location: string
      images: string[]
    }
  }
}

export function BookingCard({ booking }: BookingCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex gap-6">
          <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={booking.listing?.images?.[0] || "/placeholder.svg?height=96&width=128"}
              alt={booking.listing?.title || "Property"}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg truncate">{booking.listing?.title || "Property"}</h3>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{booking.listing?.location || "Location"}</span>
                </div>
              </div>
              <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Check-in</p>
                  <p className="text-muted-foreground">{formatDate(booking.checkIn)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Check-out</p>
                  <p className="text-muted-foreground">{formatDate(booking.checkOut)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Guests</p>
                  <p className="text-muted-foreground">{booking.guests}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Total</p>
                  <p className="text-muted-foreground">₹{booking.totalPrice}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm">
                View Details
              </Button>
              {booking.status === "confirmed" && (
                <Button variant="outline" size="sm">
                  Cancel Booking
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
