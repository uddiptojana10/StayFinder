import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Listing } from "@/lib/models"

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("stayfinder")
    const listings = db.collection<Listing>("listings")

    const allListings = await listings.find({}).toArray()

    return NextResponse.json(allListings)
  } catch (error) {
    console.error("Error fetching listings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const listingData = await request.json()

    const client = await clientPromise
    const db = client.db("stayfinder")
    const listings = db.collection<Listing>("listings")

    const listing: Listing = {
      ...listingData,
      createdAt: new Date(),
    }

    const result = await listings.insertOne(listing)

    return NextResponse.json({ message: "Listing created successfully", listingId: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Error creating listing:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
