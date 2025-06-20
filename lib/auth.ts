import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

export interface User {
  id: string
  name: string
  email: string
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any

    return {
      id: decoded.userId,
      name: decoded.name,
      email: decoded.email,
    }
  } catch (error) {
    return null
  }
}
