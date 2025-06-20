import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any
    const userId = decoded.userId

    const { name, email, phone, bio, location } = await request.json()

    const client = await clientPromise
    const db = client.db("stayfinder")
    const users = db.collection("users")

    // Check if email is already taken by another user
    if (email !== decoded.email) {
      const existingUser = await users.findOne({ email, _id: { $ne: new ObjectId(userId) } })
      if (existingUser) {
        return NextResponse.json({ error: "Email already in use" }, { status: 400 })
      }
    }

    const updateData = {
      name,
      email,
      phone,
      bio,
      location,
      updatedAt: new Date(),
    }

    await users.updateOne({ _id: new ObjectId(userId) }, { $set: updateData })

    return NextResponse.json({ message: "Profile updated successfully" })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
