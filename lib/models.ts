export interface User {
  _id?: string
  name: string
  email: string
  password: string
  createdAt: Date
}

export interface Listing {
  _id?: string
  title: string
  description: string
  location: string
  pricePerNight: number
  maxGuests: number
  images: string[]
  amenities: string[]
  hostId: string
  createdAt: Date
}

export interface Booking {
  _id?: string
  listingId: string
  userId: string
  checkIn: Date
  checkOut: Date
  guests: number
  totalPrice: number
  status: "pending" | "confirmed" | "cancelled"
  paymentId?: string
  orderId?: string
  createdAt: Date
}
