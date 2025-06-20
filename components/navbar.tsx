import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"
import { getCurrentUser } from "@/lib/auth"

export async function Navbar() {
  const user = await getCurrentUser()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-800 to-black rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-bold text-gray-900">StayFinder</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <UserNav user={user} />
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-black hover:bg-gray-800 text-white">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}