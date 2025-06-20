import { Suspense } from "react"
import { PropertyCard } from "@/components/property-card"
import { SearchBar } from "@/components/search-bar"
import { SearchFilters } from "@/components/search-filters"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

async function searchListings(searchParams: any) {
  try {
    const params = new URLSearchParams()
    if (searchParams.location) params.set("location", searchParams.location)
    if (searchParams.checkIn) params.set("checkIn", searchParams.checkIn)
    if (searchParams.checkOut) params.set("checkOut", searchParams.checkOut)
    if (searchParams.guests) params.set("guests", searchParams.guests)
    if (searchParams.minPrice) params.set("minPrice", searchParams.minPrice)
    if (searchParams.maxPrice) params.set("maxPrice", searchParams.maxPrice)

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/search?${params.toString()}`,
      {
        cache: "no-store",
      },
    )
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    console.error("Failed to search listings:", error)
    return []
  }
}

function SearchResults({ listings, searchParams }: { listings: any[]; searchParams: any }) {
  const resultCount = listings.length
  const location = searchParams.location || "all locations"

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">
          {resultCount} {resultCount === 1 ? "stay" : "stays"} in {location}
        </h2>
        {searchParams.checkIn && searchParams.checkOut && (
          <p className="text-muted-foreground">
            {searchParams.checkIn} - {searchParams.checkOut} • {searchParams.guests || 1} guests
          </p>
        )}
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No properties found matching your criteria</p>
          <Link href="/">
            <Button variant="outline">Browse all properties</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <PropertyCard key={listing._id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  )
}

export default async function SearchPage({ searchParams }: { searchParams: any }) {
  const listings = await searchListings(searchParams)

  return (
    <div className="min-h-screen">
      {/* Header */}
      {/* <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            StayFinder
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header> */}
      <Navbar />

      {/* Search Bar */}
      <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <SearchBar />
        </div>
      </section>

      {/* Results */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <SearchFilters />
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              <Suspense fallback={<div>Loading search results...</div>}>
                <SearchResults listings={listings} searchParams={searchParams} />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
