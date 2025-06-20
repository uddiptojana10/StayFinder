import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import clientPromise from "@/lib/mongodb"
import type { Booking } from "@/lib/models"

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingData } = await request.json()

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex")

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
    }

    // Get user from token (optional - for guest bookings)
    let userId = "guest"
    const token = request.cookies.get("token")?.value
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any
        userId = decoded.userId
      } catch (error) {
        // Continue with guest booking
      }
    }

    // Save booking to database
    const client = await clientPromise
    const db = client.db("stayfinder")
    const bookings = db.collection<Booking>("bookings")

    const booking: Booking = {
      listingId: bookingData.listingId,
      userId,
      checkIn: new Date(bookingData.checkIn),
      checkOut: new Date(bookingData.checkOut),
      guests: bookingData.guests,
      totalPrice: bookingData.totalPrice,
      status: "confirmed",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      createdAt: new Date(),
    }

    const result = await bookings.insertOne(booking)

    return NextResponse.json({
      message: "Payment verified and booking confirmed",
      bookingId: result.insertedId,
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 })
  }
}
