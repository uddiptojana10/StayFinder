"use client";

import type React from "react";
import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Calendar, Users } from "lucide-react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchData, setSearchData] = useState({
    location: searchParams.get("location") || "",
    checkIn: searchParams.get("checkIn") || "",
    checkOut: searchParams.get("checkOut") || "",
    guests: searchParams.get("guests") || "1",
  });

  // Refs for date inputs
  const checkInRef = useRef<HTMLInputElement>(null);
  const checkOutRef = useRef<HTMLInputElement>(null);
  const checkInMobileRef = useRef<HTMLInputElement>(null);
  const checkOutMobileRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: string, value: string) => {
    setSearchData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (searchData.location) params.set("location", searchData.location);
    if (searchData.checkIn) params.set("checkIn", searchData.checkIn);
    if (searchData.checkOut) params.set("checkOut", searchData.checkOut);
    if (searchData.guests) params.set("guests", searchData.guests);

    router.push(`/search?${params.toString()}`);
  };

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

  const openCheckInMobilePicker = () => {
    if (checkInMobileRef.current) {
      checkInMobileRef.current.focus();
      checkInMobileRef.current.showPicker?.();
    }
  };

  const openCheckOutMobilePicker = () => {
    if (checkOutMobileRef.current) {
      checkOutMobileRef.current.focus();
      checkOutMobileRef.current.showPicker?.();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Desktop Version */}
      <div className="hidden md:block">
        <div className="bg-white rounded-full shadow-xl border border-gray-200 p-1 hover:shadow-2xl transition-shadow duration-300">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-4 gap-0">
              {/* Location */}
              <div className="relative group">
                <div className="flex items-center px-6 py-4 rounded-full hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                      Where
                    </label>
                    <Input
                      id="location"
                      type="text"
                      placeholder="Search destinations"
                      value={searchData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      className="border-0 p-0 text-sm font-medium placeholder:text-gray-400 focus-visible:ring-0 bg-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Check-in - Clickable entire area */}
              <div className="relative group border-l border-gray-200">
                <div 
                  className="flex items-center px-6 py-4 rounded-full hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                  onClick={openCheckInPicker}
                >
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide cursor-pointer">
                      Check in
                    </label>
                    <Input
                      ref={checkInRef}
                      id="checkIn"
                      type="date"
                      value={searchData.checkIn}
                      onChange={(e) => handleChange("checkIn", e.target.value)}
                      placeholder="Add dates"
                      className="border-0 p-0 text-sm font-medium focus-visible:ring-0 bg-transparent placeholder:text-gray-400 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Check-out - Clickable entire area */}
              <div className="relative group border-l border-gray-200">
                <div 
                  className="flex items-center px-6 py-4 rounded-full hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                  onClick={openCheckOutPicker}
                >
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide cursor-pointer">
                      Check out
                    </label>
                    <Input
                      ref={checkOutRef}
                      id="checkOut"
                      type="date"
                      value={searchData.checkOut}
                      onChange={(e) => handleChange("checkOut", e.target.value)}
                      placeholder="Add dates"
                      className="border-0 p-0 text-sm font-medium focus-visible:ring-0 bg-transparent placeholder:text-gray-400 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Guests & Search */}
              <div className="relative group border-l border-gray-200">
                <div className="flex items-center justify-between px-6 py-4">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                      Who
                    </label>
                    <select
                      id="guests"
                      value={searchData.guests}
                      onChange={(e) => handleChange("guests", e.target.value)}
                      className="border-0 p-0 text-sm font-medium bg-transparent focus:outline-none cursor-pointer text-gray-600"
                    >
                      <option value="1">1 guest</option>
                      <option value="2">2 guests</option>
                      <option value="3">3 guests</option>
                      <option value="4">4 guests</option>
                      <option value="5">5+ guests</option>
                    </select>
                  </div>
                  <Button
                    type="submit"
                    size="sm"
                    className="rounded-full w-12 h-12 bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-gray-800 ml-3 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Version */}
      <div className="md:hidden">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 space-y-4">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Location */}
            <div className="space-y-2">
              <Label 
                htmlFor="location-mobile" 
                className="block text-xs font-semibold text-gray-700 uppercase tracking-wide"
              >
                Where
              </Label>
              <Input
                id="location-mobile"
                type="text"
                placeholder="Search destinations"
                value={searchData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm font-medium placeholder:text-gray-400 focus:border-gray-400 focus:ring-0"
              />
            </div>

            {/* Date Range - Clickable areas */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label 
                  htmlFor="checkIn-mobile" 
                  className="block text-xs font-semibold text-gray-700 uppercase tracking-wide cursor-pointer"
                  onClick={openCheckInMobilePicker}
                >
                  Check in
                </Label>
                <div onClick={openCheckInMobilePicker} className="cursor-pointer">
                  <Input
                    ref={checkInMobileRef}
                    id="checkIn-mobile"
                    type="date"
                    value={searchData.checkIn}
                    onChange={(e) => handleChange("checkIn", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm font-medium focus:border-gray-400 focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label 
                  htmlFor="checkOut-mobile" 
                  className="block text-xs font-semibold text-gray-700 uppercase tracking-wide cursor-pointer"
                  onClick={openCheckOutMobilePicker}
                >
                  Check out
                </Label>
                <div onClick={openCheckOutMobilePicker} className="cursor-pointer">
                  <Input
                    ref={checkOutMobileRef}
                    id="checkOut-mobile"
                    type="date"
                    value={searchData.checkOut}
                    onChange={(e) => handleChange("checkOut", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm font-medium focus:border-gray-400 focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Guests */}
            <div className="space-y-2">
              <Label 
                htmlFor="guests-mobile" 
                className="block text-xs font-semibold text-gray-700 uppercase tracking-wide"
              >
                Who
              </Label>
              <select
                id="guests-mobile"
                value={searchData.guests}
                onChange={(e) => handleChange("guests", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm font-medium bg-white focus:border-gray-400 focus:ring-0"
              >
                <option value="1">1 guest</option>
                <option value="2">2 guests</option>
                <option value="3">3 guests</option>
                <option value="4">4 guests</option>
                <option value="5">5+ guests</option>
                <option value="6">6 guests</option>
                <option value="7">7 guests</option>
                <option value="8">8 guests</option>
                <option value="9">9 guests</option>
                <option value="10">10 guests</option>
                <option value="11">11 guests</option>
                <option value="12">12 guests</option>
                <option value="13">13 guests</option>
                <option value="14">14 guests</option>
                <option value="15">15 guests</option>
                <option value="16">16+ guests</option>
              </select>
            </div>

            {/* Search Button */}
            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-gray-800 text-white py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
            >
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}