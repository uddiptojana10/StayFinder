import { Suspense } from "react"
import { PropertyCard } from "@/components/property-card"
import { SearchBar } from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ClientNavbar } from "@/components/client-navbar"
import { Footer } from "@/components/footer"

async function getListings() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/listings`, {
      cache: "no-store",
    })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    console.error("Failed to fetch listings:", error)
    return []
  }
}

function PropertyGrid({ listings }: { listings: any[] }) {
  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No properties found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {listings.map((listing) => (
        <PropertyCard key={listing._id} listing={listing} />
      ))}
    </div>
  )
}

export default async function HomePage() {
  const listings = await getListings()

  return (
    <div className="min-h-screen">
      <ClientNavbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Find your perfect stay</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover unique places to stay around the world
          </p>
          <SearchBar />
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Properties</h2>
          <Suspense fallback={<div>Loading properties...</div>}>
            <PropertyGrid listings={listings} />
          </Suspense>
        </div>
      </section>
      {/* Footer Section */}
      <Footer />
    </div>
  )
}
