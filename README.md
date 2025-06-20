#  Tech Stack – StayFinder

For **StayFinder**, we chose a modern and scalable tech stack that supports **rapid development**, **maintainability**, and **real-world deployment**. Here's what we used and why:

---

##  Frontend

- **Next.js (React)**  
  Chosen for its performance benefits (SSR, SSG), file-based routing, and production-readiness. It allows us to build fast, SEO-friendly UIs with ease.

- **Tailwind CSS**  
  A utility-first CSS framework that speeds up UI development with consistent and responsive design, while keeping the codebase clean.

- **Radix UI + Lucide Icons**  
  Provides accessible, customizable UI components and icons that integrate seamlessly with Tailwind.

---

##  Backend

- **Node.js + Express** *(via Next.js API routes or standalone)*  
  Fast, lightweight, and well-suited for handling asynchronous API requests such as authentication, listing CRUD, and bookings.

- **JWT + bcryptjs**  
  For secure and stateless authentication using JSON Web Tokens, with hashed passwords for user security.

---

##  Database

- **MongoDB**  
  A document-based NoSQL database that fits well with a flexible schema for listings, users, and bookings. Easy to scale and integrate with Node.js.

- **Mongoose or Native MongoDB Driver**  
  Enables schema validation, modeling, and seamless connection with the database.

---

##  Other Tools

- **Zod + React Hook Form**  
  For robust and type-safe form validation.

- **dotenv**  
  For secure environment variable management.

- **Razorpay** *(optional)*  
  To simulate or integrate payment flows for bookings.

- **date-fns + react-day-picker**  
  For date manipulation and calendar UI functionality.

---

This stack was chosen to balance **developer productivity**, **performance**, and **real-world readiness** — making it ideal for a modern booking platform like StayFinder.
