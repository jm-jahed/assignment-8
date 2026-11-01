"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { EventCard, EventCardSkeleton, EventData } from "@/components/shared/event-card";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Calendar,
  Filter,
  RefreshCw,
  X,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  "All",
  "Environment",
  "Healthcare",
  "Education",
  "Disaster Relief",
  "Community Cleanliness",
  "Animal Welfare",
];

export default function UpcomingEventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 300ms Debounced search keyword
  const debouncedSearch = useDebounce(searchTerm, 300);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const params = new URLSearchParams();

      if (debouncedSearch.trim()) {
        params.set("search", debouncedSearch.trim());
      }
      if (selectedCategory && selectedCategory !== "All") {
        params.set("category", selectedCategory);
      }
      params.set("status", "Upcoming");

      const res = await fetch(`${apiUrl}/events?${params.toString()}`);

      if (!res.ok) {
        throw new Error(`Failed to load upcoming events (${res.status})`);
      }

      const json = await res.json();
      if (json.success && json.data?.events) {
        setEvents(json.data.events);
      } else {
        setEvents([]);
      }
    } catch (err: any) {
      console.warn("Could not fetch events from Express API:", err.message);
      setError(err.message || "Failed to load events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedCategory]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
  };

  const isFiltered = searchTerm !== "" || selectedCategory !== "All";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 py-10 md:py-16">
        <div className="container mx-auto px-4 space-y-10">
          {/* Header Title & Breadcrumb */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
            <div className="space-y-2">
              <Badge variant="outline" className="text-emerald-600 border-emerald-500/30 gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Community Calendar
              </Badge>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                Upcoming Social Initiatives
              </h1>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
                Discover grassroots volunteer opportunities in your area. Every action helps build a stronger community.
              </p>
            </div>

            <Link href="/create-event">
              <Button className="gap-2 shrink-0">
                <PlusCircle className="w-4 h-4" />
                Organize an Event
              </Button>
            </Link>
          </div>

          {/* Search Bar & Multi-Criteria Category Filter Controls */}
          <div className="space-y-4">
            <div className="relative max-w-xl">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by initiative title, neighborhood, or cause (e.g. 'tree', 'park', 'blood')..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 h-11 bg-card border-border shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <Filter className="w-4 h-4 text-muted-foreground shrink-0 mr-1" />
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-muted text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {cat}
                </button>
              ))}

              {isFiltered && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-red-500 font-semibold hover:underline ml-2 flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" /> Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Event Cards Grid / Skeletons / Empty State */}
          <div>
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <EventCardSkeleton key={idx} />
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="p-12 text-center rounded-2xl border border-border bg-card space-y-4 max-w-md mx-auto">
                <p className="text-sm text-muted-foreground">
                  Unable to connect to the events API server. Please ensure the Express backend is running.
                </p>
                <Button onClick={fetchEvents} variant="outline" size="sm" className="gap-2">
                  <RefreshCw className="w-4 h-4" /> Try Again
                </Button>
              </div>
            )}

            {!loading && !error && events.length === 0 && (
              <div className="p-16 text-center rounded-2xl border border-dashed border-border bg-card/40 space-y-4 max-w-lg mx-auto">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-foreground">No events found</h3>
                <p className="text-sm text-muted-foreground">
                  {isFiltered
                    ? "No upcoming initiatives matched your search or category filter. Try clearing your filters."
                    : "No community events scheduled at the moment. Be the leader who organizes the next one!"}
                </p>
                {isFiltered ? (
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Reset Search & Filters
                  </Button>
                ) : (
                  <Link href="/create-event">
                    <Button size="sm">Create an Event</Button>
                  </Link>
                )}
              </div>
            )}

            {!loading && !error && events.length > 0 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center text-xs text-muted-foreground font-medium">
                  <span>
                    Showing <strong className="text-foreground">{events.length}</strong> upcoming initiative{events.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
