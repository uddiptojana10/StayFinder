import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Listing } from "@/lib/models"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const location = searchParams.get("location")
    const checkIn = searchParams.get("checkIn")
    const checkOut = searchParams.get("checkOut")
    const guests = searchParams.get("guests")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const amenities = searchParams.get("amenities")

    const client = await clientPromise
    const db = client.db("stayfinder")
    const listings = db.collection<Listing>("listings")

    // Build search query
    const query: any = {}

    // Location search (case-insensitive)
    if (location) {
      query.location = { $regex: location, $options: "i" }
    }

    // Guest capacity
    if (guests) {
      query.maxGuests = { $gte: Number.parseInt(guests) }
    }

    // Price range
    if (minPrice || maxPrice) {
      query.pricePerNight = {}
      if (minPrice) query.pricePerNight.$gte = Number.parseInt(minPrice)
      if (maxPrice) query.pricePerNight.$lte = Number.parseInt(maxPrice)
    }

    // Amenities filter
    if (amenities) {
      const amenitiesList = amenities.split(",")
      query.amenities = { $in: amenitiesList }
    }

    // TODO: Add date availability check against bookings
    // For now, we'll just search listings without checking availability

    const results = await listings.find(query).toArray()

    return NextResponse.json(results)
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
