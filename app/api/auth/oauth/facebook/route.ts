import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import clientPromise from "@/lib/mongodb"
import type { User } from "@/lib/models"
import { nanoid } from "nanoid"

export async function GET(req: NextRequest) {
  const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_ID
  const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_SECRET
  const REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/oauth/facebook`

  const url = new URL(req.url)
  const code = url.searchParams.get("code")

  if (!code) {
    // Step 1: Redirect to Facebook OAuth
    const fbAuthURL = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${FACEBOOK_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=email`
    return NextResponse.redirect(fbAuthURL)
  }

  try {
    // Step 2: Exchange code for access token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${FACEBOOK_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&client_secret=${FACEBOOK_CLIENT_SECRET}&code=${code}`
    )
    const tokenData = await tokenRes.json()
    const accessToken = tokenData.access_token

    if (!accessToken) throw new Error("Failed to obtain access token")

    // Step 3: Get user info
    const userRes = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`)
    const fbUser = await userRes.json()

    if (!fbUser.email) {
      return NextResponse.json({ error: "Facebook account missing email" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("stayfinder")
    const users = db.collection<User>("users")

    // Find or create user
    let user = await users.findOne({ email: fbUser.email })
    if (!user) {
      user = {
        name: fbUser.name,
        email: fbUser.email,
        password: nanoid(), // Fake password
        createdAt: new Date(),
      }
      const result = await users.insertOne(user)
      user._id = result.insertedId
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    )

    const res = NextResponse.redirect(process.env.NEXT_PUBLIC_BASE_URL || "/")
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
    })

    return res
  } catch (error) {
    console.error("Facebook OAuth error:", error)
    return NextResponse.json({ error: "OAuth failed" }, { status: 500 })
  }
}
