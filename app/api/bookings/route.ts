import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import clientPromise from "@/lib/mongodb"
import type { Booking } from "@/lib/models"

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any
    const userId = decoded.userId

    const { listingId, checkIn, checkOut, guests, totalPrice } = await request.json()

    const client = await clientPromise
    const db = client.db("stayfinder")
    const bookings = db.collection<Booking>("bookings")

    const booking: Booking = {
      listingId,
      userId,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      guests,
      totalPrice,
      status: "pending",
      createdAt: new Date(),
    }

    const result = await bookings.insertOne(booking)

    return NextResponse.json({ message: "Booking created successfully", bookingId: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Booking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
