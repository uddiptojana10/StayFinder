import { notFound } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookingForm } from "@/components/booking-form"
import { MapPin, Star, Wifi, Car, Users, Home } from "lucide-react"
import Link from "next/link"
import {Navbar} from "@/components/navbar"

async function getListing(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/listings/${id}`, {
      cache: "no-store",
    })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    console.error("Failed to fetch listing:", error)
    return null
  }
}

export default async function PropertyPage({ params }: { params: { id: string } }) {
  const listing = await getListing(params.id)

  if (!listing) {
    notFound()
  }

  const amenityIcons = {
    WiFi: Wifi,
    Parking: Car,
    Kitchen: Home,
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      {/* <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-primary">
            StayFinder
          </Link>
        </div>
      </header> */}
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Property Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="relative h-96 md:h-[500px]">
            <Image
              src={listing.images[0] || "/placeholder.svg?height=500&width=600"}
              alt={listing.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {listing.images.slice(1, 5).map((image: string, index: number) => (
              <div key={index} className="relative h-44 md:h-60">
                <Image
                  src={image || "/placeholder.svg?height=240&width=300"}
                  alt={`${listing.title} ${index + 2}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="w-4 h-4" />
                <span>{listing.location}</span>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">4.8</span>
                  <span className="text-muted-foreground">(24 reviews)</span>
                </div>
                <Badge variant="secondary">
                  <Users className="w-3 h-3 mr-1" />
                  {listing.maxGuests} guests
                </Badge>
              </div>
            </div>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">About this place</h3>
                <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {listing.amenities.map((amenity: string) => {
                    const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons] || Home
                    return (
                      <div key={amenity} className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        <span>{amenity}</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="text-2xl font-bold">
                    ₹{listing.pricePerNight}
                    <span className="text-base font-normal text-muted-foreground"> / night</span>
                  </div>
                </div>
                <BookingForm listingId={listing._id} pricePerNight={listing.pricePerNight} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
