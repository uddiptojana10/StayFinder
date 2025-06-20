"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface BookingFormProps {
  listingId: string;
  pricePerNight: number;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function BookingForm({ listingId, pricePerNight }: BookingFormProps) {
  // State management
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Refs for date inputs
  const checkInRef = useRef<HTMLInputElement>(null);
  const checkOutRef = useRef<HTMLInputElement>(null);

  // Functions to open date pickers
  const openCheckInPicker = () => {
    if (checkInRef.current) {
      checkInRef.current.focus();
      checkInRef.current.showPicker?.();
    }
  };

  const openCheckOutPicker = () => {
    if (checkOutRef.current) {
      checkOutRef.current.focus();
      checkOutRef.current.showPicker?.();
    }
  };

  // Calculation functions
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    return nights > 0 ? nights : 0;
  };

  const calculateSubtotal = () => {
    const nights = calculateNights();
    return nights * pricePerNight;
  };

  const calculateServiceFee = () => {
    const subtotal = calculateSubtotal();
    return Math.round(subtotal * 0.14); // 14% service fee
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateServiceFee();
  };

  // Razorpay script loader
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Payment handler
  const handlePayment = async () => {
    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      setMessage("Failed to load payment gateway");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Create order on backend
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: calculateTotal(),
          currency: "INR",
          listingId,
          checkIn,
          checkOut,
          guests,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.error || "Failed to create order");
      }

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "StayFinder",
        description: "Property Booking",
        order_id: orderData.id,
        handler: async (response: any) => {
          try {
            // Verify payment on backend
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingData: {
                  listingId,
                  checkIn,
                  checkOut,
                  guests,
                  totalPrice: calculateTotal(),
                },
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok) {
              setMessage("Payment successful! Booking confirmed.");
              // Reset form
              setCheckIn("");
              setCheckOut("");
              setGuests(1);
            } else {
              setMessage(verifyData.error || "Payment verification failed");
            }
          } catch (error) {
            setMessage("Payment verification failed");
          }
        },
        prefill: {
          name: "Guest Name",
          email: "guest@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3B82F6",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setMessage("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkIn || !checkOut) {
      setMessage("Please select check-in and check-out dates");
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      setMessage("Check-out date must be after check-in date");
      return;
    }

    await handlePayment();
  };

  // Calculated values
  const nights = calculateNights();
  const subtotal = calculateSubtotal();
  const serviceFee = calculateServiceFee();
  const total = calculateTotal();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Alert Messages */}
      {message && (
        <Alert
          className={message.includes("successful") ? "border-green-500" : ""}
        >
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Enhanced Date Inputs - Fully Clickable */}
      <div className="grid grid-cols-2 gap-4">
        {/* Check-in - Clickable entire area */}
        <div>
          <Label
            htmlFor="checkIn"
            className="cursor-pointer"
            onClick={openCheckInPicker}
          >
            Check-in
          </Label>
          <div onClick={openCheckInPicker} className="cursor-pointer">
            <Input
              ref={checkInRef}
              id="checkIn"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
              className="cursor-pointer"
            />
          </div>
        </div>

        {/* Check-out - Clickable entire area */}
        <div>
          <Label
            htmlFor="checkOut"
            className="cursor-pointer"
            onClick={openCheckOutPicker}
          >
            Check-out
          </Label>
          <div onClick={openCheckOutPicker} className="cursor-pointer">
            <Input
              ref={checkOutRef}
              id="checkOut"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().split("T")[0]}
              required
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Guests Input */}
      <div>
        <Label htmlFor="guests">Guests</Label>
        <Input
          id="guests"
          type="number"
          min="1"
          value={guests}
          onChange={(e) => setGuests(Number.parseInt(e.target.value))}
          required
        />
      </div>

      {/* Price Breakdown Card */}
      {nights > 0 && (
        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between">
              <span>
                ₹{pricePerNight} × {nights} nights
              </span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Service fee</span>
              <span>₹{serviceFee}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={loading || nights === 0}
      >
        {loading ? "Processing..." : `Reserve - ₹${total}`}
      </Button>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center">
        You won't be charged yet
      </p>
    </form>
  );
}