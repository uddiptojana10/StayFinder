import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.NODE_ENV === "production"
  ? "https://yourdomain.com/api/auth/oauth/google"
  : "http://localhost:3000/api/auth/oauth/google";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    // Step 1: Redirect user to Google OAuth consent screen
    const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=openid%20email%20profile`;
    return NextResponse.redirect(redirectUrl);
  }

  // Step 2: Exchange code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: REDIRECT_URI,
    }),
  });

  const tokenData = await tokenRes.json();
  const { access_token, id_token } = tokenData;

  // Step 3: Get user info
  const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  const profile = await userRes.json();

  const client = await clientPromise;
  const db = client.db("stayfinder");
  const users = db.collection("users");

  // Step 4: Create/find user
  const existingUser = await users.findOne({ email: profile.email });

  let userId;
  if (existingUser) {
    userId = existingUser._id;
  } else {
    const newUser = await users.insertOne({
      name: profile.name,
      email: profile.email,
      password: null,
      createdAt: new Date(),
      provider: "google",
    });
    userId = newUser.insertedId;
  }

  // Step 5: Create JWT and set cookie
  const token = jwt.sign(
    { userId, email: profile.email, name: profile.name },
    process.env.JWT_SECRET || "fallback-secret",
    { expiresIn: "7d" }
  );

  const res = NextResponse.redirect("http://localhost:3000"); // Redirect to homepage
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
