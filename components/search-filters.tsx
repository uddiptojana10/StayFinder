"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

export function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState({
    minPrice: searchParams.get("minPrice") || "0",
    maxPrice: searchParams.get("maxPrice") || "1000",
    amenities: searchParams.get("amenities")?.split(",") || [],
  })

  const amenitiesList = ["WiFi", "Kitchen", "Parking", "Pool", "Gym", "Pet Friendly", "Air Conditioning"]

  const handlePriceChange = (values: number[]) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: values[0].toString(),
      maxPrice: values[1].toString(),
    }))
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      amenities: checked ? [...prev.amenities, amenity] : prev.amenities.filter((a) => a !== amenity),
    }))
  }

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (filters.minPrice !== "0") params.set("minPrice", filters.minPrice)
    else params.delete("minPrice")

    if (filters.maxPrice !== "1000") params.set("maxPrice", filters.maxPrice)
    else params.delete("maxPrice")

    if (filters.amenities.length > 0) params.set("amenities", filters.amenities.join(","))
    else params.delete("amenities")

    router.push(`/search?${params.toString()}`)
  }

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("minPrice")
    params.delete("maxPrice")
    params.delete("amenities")

    setFilters({
      minPrice: "0",
      maxPrice: "1000",
      amenities: [],
    })

    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={[Number.parseInt(filters.minPrice), Number.parseInt(filters.maxPrice)]}
            onValueChange={handlePriceChange}
            max={1000}
            min={0}
            step={10}
            className="w-full"
          />
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="minPrice">Min</Label>
              <Input
                id="minPrice"
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: e.target.value }))}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="maxPrice">Max</Label>
              <Input
                id="maxPrice"
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Amenities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {amenitiesList.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={amenity}
                checked={filters.amenities.includes(amenity)}
                onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
              />
              <Label htmlFor={amenity}>{amenity}</Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button onClick={applyFilters} className="flex-1">
          Apply Filters
        </Button>
        <Button onClick={clearFilters} variant="outline" className="flex-1">
          Clear
        </Button>
      </div>
    </div>
  )
}
