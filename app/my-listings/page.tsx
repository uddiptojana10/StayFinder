import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { Navbar } from "@/components/navbar"
import { ListingCard } from "@/components/listing-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Home } from "lucide-react"
import Link from "next/link"

async function getUserListings(userId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/listings/user/${userId}`,
      {
        cache: "no-store",
      },
    )
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    console.error("Failed to fetch listings:", error)
    return []
  }
}

export default async function MyListingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  const listings = await getUserListings(user.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Listings</h1>
              <p className="text-muted-foreground">Manage your property listings and bookings</p>
            </div>
            <Button asChild>
              <Link href="/create-listing">
                <Plus className="w-4 h-4 mr-2" />
                Add New Listing
              </Link>
            </Button>
          </div>

          {listings.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Home className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
                <p className="text-muted-foreground mb-6">Start earning by hosting your space</p>
                <Button asChild>
                  <Link href="/create-listing">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Listing
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing: any) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
