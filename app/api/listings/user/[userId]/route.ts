import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Listing } from "@/lib/models"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("stayfinder")
    const listings = db.collection<Listing>("listings")

    const userListings = await listings.find({ hostId: params.userId }).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(userListings)
  } catch (error) {
    console.error("Error fetching user listings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
