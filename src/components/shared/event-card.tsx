import React from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";

export interface EventData {
  _id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  location: string;
  date: string | Date;
  time: string;
  capacity: number;
  joinedCount: number;
  status: "Upcoming" | "Completed" | "Cancelled";
  organizerName: string;
}

/**
 * Concept: Reusable Event Card Component
 * Why:
 * Used across the Homepage (6 upcoming initiatives), the All Events directory,
 * and the Organizer Manage Events view. Consistent presentation builds product familiarity.
 *
 * How:
 * Renders an image, category pill, date/time, location, capacity progress bar,
 * and a direct "View Details" CTA button.
 */
export function EventCard({ event }: { event: EventData }) {
  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const spotsLeft = Math.max(0, event.capacity - event.joinedCount);
  const isFull = spotsLeft === 0;

  return (
    <Card className="overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300 border-border bg-card">
      {/* Event Banner Image with Hover Scale */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.image || "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80"}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="default" className="shadow-sm font-medium">
            {event.category}
          </Badge>
          {isFull ? (
            <Badge variant="destructive" className="shadow-sm">
              Full
            </Badge>
          ) : spotsLeft <= 5 ? (
            <Badge variant="secondary" className="shadow-sm">
              {spotsLeft} spots left
            </Badge>
          ) : null}
        </div>
      </div>

      <CardHeader className="p-5 pb-2 space-y-1.5 flex-1">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            {formattedDate} • {event.time}
          </span>
        </div>

        <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-emerald-600 transition-colors">
          {event.title}
        </h3>

        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {event.description}
        </p>
      </CardHeader>

      <CardContent className="px-5 py-2 space-y-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>

        {/* Capacity / Attendance Indicator */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground font-medium">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3 text-emerald-600" />
              <span>{event.joinedCount} joined</span>
            </span>
            <span>{event.capacity} capacity</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFull ? "bg-red-500" : "bg-emerald-600"
              }`}
              style={{
                width: `${Math.min(100, Math.round((event.joinedCount / event.capacity) * 100))}%`,
              }}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-3 border-t border-border/50 flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">
          By <strong className="text-foreground">{event.organizerName}</strong>
        </span>

        <Link href={`/events/${event._id}`}>
          <Button size="sm" variant="outline" className="gap-1.5 group/btn hover:border-emerald-600 hover:text-emerald-600">
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

/**
 * Loading skeleton matching EventCard's geometry exactly.
 */
export function EventCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden space-y-4 p-0">
      <div className="aspect-video w-full bg-muted animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
        <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
        <div className="h-3 w-full bg-muted rounded animate-pulse" />
        <div className="h-3 w-2/3 bg-muted rounded animate-pulse" />
        <div className="h-2 w-full bg-muted rounded-full animate-pulse mt-4" />
      </div>
    </div>
  );
}
