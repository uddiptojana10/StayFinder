import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import type { Booking } from "@/lib/models"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("stayfinder")
    const bookings = db.collection<Booking>("bookings")
    const listings = db.collection("listings")

    // Get user's bookings
    const userBookings = await bookings.find({ userId: params.userId }).sort({ createdAt: -1 }).toArray()

    // Populate listing details
    const bookingsWithListings = await Promise.all(
      userBookings.map(async (booking) => {
        const listing = await listings.findOne({ _id: new ObjectId(booking.listingId) })
        return {
          ...booking,
          listing: listing
            ? {
                title: listing.title,
                location: listing.location,
                images: listing.images,
              }
            : null,
        }
      }),
    )

    return NextResponse.json(bookingsWithListings)
  } catch (error) {
    console.error("Error fetching user bookings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
