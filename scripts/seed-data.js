require("dotenv").config()
const { MongoClient } = require("mongodb")

// Sample data
const sampleListings = [
{
  title: "Cozy Mountain Cabin",
  description: "Escape to this cozy mountain cabin in Aspen. Perfect for a peaceful retreat with stunning mountain views and access to world-class skiing.",
  location: "Aspen, Colorado, United States",
  pricePerNight: 7225,
  maxGuests: 6,
  images: [
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1464822759844-d150baec48c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  ],
  amenities: ["WiFi", "Free parking", "Kitchen"],
  hostId: "sample-host-id",
  createdAt: new Date()
}
,
  {
  title: "Modern Downtown Loft",
  description: "Modern downtown loft in the heart of Seattle. Walking distance to Pike Place Market, restaurants, and nightlife.",
  location: "Seattle, Washington, United States",
  pricePerNight: 9100,
  maxGuests: 4,
  images: [
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  ],
  amenities: ["WiFi", "Kitchen"],
  hostId: "sample-host-id",
  createdAt: new Date()
}
,
  {
  title: "Desert Oasis Retreat",
  description: "Beautiful desert retreat in Scottsdale. Features a private pool and stunning desert views.",
  location: "Scottsdale, Arizona, United States",
  pricePerNight: 2795,
  maxGuests: 6,
  images: [
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1523755231516-e43fd2e8dca5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  ],
  amenities: ["WiFi", "Free parking", "Kitchen"],
  hostId: "sample-host-id",
  createdAt: new Date()
}
,
  {
  title: "Lakeside Cottage",
  description: "Charming lakeside cottage with stunning views of Lake Tahoe. Perfect for a peaceful retreat with access to water activities.",
  location: "Lake Tahoe, Nevada, United States",
  pricePerNight: 19500,
  maxGuests: 4,
  images: [
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1486304873000-235643847519?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  ],
  amenities: ["WiFi", "Free parking", "Kitchen", "Lake access"],
  hostId: "sample-host-id",
  createdAt: new Date()
}
,
  {
  title: "Vineyard Estate",
  description: "Luxury vineyard estate in the heart of Napa Valley. Perfect for wine lovers with private tastings and vineyard tours.",
  location: "Napa Valley, California, United States",
  pricePerNight: 5550,
  maxGuests: 10,
  images: [
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  ],
  amenities: ["WiFi", "Free parking", "Kitchen", "Security cameras"],
  hostId: "sample-host-id",
  createdAt: new Date()
}
,
  {
  title: "Historic City Apartment",
  description: "Historic apartment in the heart of Savannah's historic district. Walking distance to all major attractions.",
  location: "Savannah, Georgia, United States",
  pricePerNight: 1450,
  maxGuests: 2,
  images: [
    "https://images.unsplash.com/photo-1578774296842-c45e472b3028?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1556909114-4431e5b46ba3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  ],
  amenities: ["WiFi", "Kitchen"],
  hostId: "sample-host-id",
  createdAt: new Date()
}
,
  {
  title: "Stunning Ocean View Villa",
  description: "A luxurious oceanfront villa in Malibu offering breathtaking sunset views, private beach access, and modern interiors. Perfect for romantic getaways or family retreats.",
  location: "Malibu, California, United States",
  pricePerNight: 3500,
  maxGuests: 6,
  images: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  ],
  amenities: [
    "WiFi",
    "Private Beach",
    "Pool",
    "Ocean View",
    "Air Conditioning",
    "Outdoor Grill",
    "Smart TV"
  ],
  type: "Entire villa",
  hostId: "sample-host-id",
  createdAt: new Date()
}
,
{
  title: "Beachfront Bungalow",
  description: "Spectacular beachfront bungalow in Maui with direct beach access and stunning ocean views.",
  location: "Maui, Hawaii, United States",
  pricePerNight: 4200,
  maxGuests: 6,
  images: [
    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
  ],
  amenities: ["WiFi", "Free parking", "Kitchen", "Beach access"],
  hostId: "sample-host-id",
  createdAt: new Date()
}

];

async function seedDatabase() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("stayfinder")

    // Clear existing data
    await db.collection("listings").deleteMany({})
    console.log("Cleared existing listings")

    // Insert sample listings
    const result = await db.collection("listings").insertMany(sampleListings)
    console.log(`Inserted ${result.insertedCount} listings`)

    console.log("Database seeded successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.close()
  }
}

seedDatabase()
