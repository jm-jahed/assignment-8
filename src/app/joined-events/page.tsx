"use client";

/**
 * Concept: Volunteer Participation Dashboard ("Joined Events").
 * Why: Allows users to track social development initiatives they have committed to attend as volunteers.
 * How: Queries Express GET /api/v1/participants/me via fetchWithAuth, renders event cards with RSVP
 *      confirmations, and allows volunteers to cancel their registration (DELETE /api/v1/events/:id/leave).
 * Example: A user reviews their upcoming Saturday beach cleanup and Sunday tree plantation schedules.
 */

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { useAuth } from "@/context/auth-context";
import { fetchWithAuth } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Lock,
  ArrowRight,
  Eye,
  LogOut,
  Sparkles,
} from "lucide-react";

interface JoinedEvent {
  _id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  location: string;
  date: string;
  time: string;
  capacity: number;
  joinedCount: number;
  status: "Upcoming" | "Completed" | "Cancelled";
  organizerName: string;
  organizerEmail: string;
}

export default function JoinedEventsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [joinedEvents, setJoinedEvents] = useState<JoinedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cancellation State
  const [leavingEvent, setLeavingEvent] = useState<JoinedEvent | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchJoined = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchWithAuth<JoinedEvent[]>("/participants/me");
      if (res.success && res.data) {
        setJoinedEvents(res.data);
      } else {
        throw new Error(res.message || "Failed to load your joined events");
      }
    } catch (err: any) {
      setError(err.message || "Unable to retrieve your participation records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchJoined();
    }
  }, [isAuthenticated, fetchJoined]);

  const handleLeaveEvent = async (eventId: string) => {
    try {
      setCancelling(true);
      const res = await fetchWithAuth(`/events/${eventId}/leave`, {
        method: "DELETE",
      });

      if (!res.success) {
        toast.error(res.message || "Failed to cancel event registration");
        return;
      }

      toast.success("Registration cancelled. Your volunteer spot has been released.");
      setJoinedEvents((prev) => prev.filter((ev) => ev._id !== eventId));
      setLeavingEvent(null);
    } catch (err: any) {
      toast.error(err.message || "An error occurred while cancelling your registration.");
    } finally {
      setCancelling(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <p className="text-sm font-medium">Checking volunteer profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6 text-center">
          <Card className="max-w-md w-full border-border shadow-lg p-6 space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Sign In Required</h2>
              <p className="text-sm text-muted-foreground">
                Sign in to view the community events and social initiatives you have volunteered to join.
              </p>
            </div>
            <Link href="/login?callbackUrl=/joined-events">
              <Button className="w-full gap-2">
                Sign In to View Schedule <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 py-10 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300">
                <Sparkles className="w-3.5 h-3.5" />
                Active Volunteer
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">Your Joined Initiatives</h1>
              <p className="text-muted-foreground text-sm">
                Community development events you have registered to attend. Thank you for making a difference!
              </p>
            </div>

            <Link href="/events">
              <Button variant="outline" className="gap-2 shrink-0">
                Explore More Events
              </Button>
            </Link>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 border border-red-500/20 text-sm flex items-center justify-between">
              <span>{error}</span>
              <Button variant="ghost" size="sm" onClick={fetchJoined}>
                Retry
              </Button>
            </div>
          )}

          {/* Loading Skeletons */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-44 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && joinedEvents.length === 0 && (
            <Card className="text-center p-12 border-dashed border-2 border-border bg-card/50">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto">
                  <Calendar className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">No Joined Events Yet</h3>
                <p className="text-muted-foreground text-sm">
                  You haven&apos;t joined any community events yet. Discover grassroots initiatives in your area and join fellow changemakers.
                </p>
                <Link href="/events">
                  <Button className="gap-2">
                    Browse Upcoming Events <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          {/* Joined Events Cards Grid */}
          {!loading && joinedEvents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {joinedEvents.map((ev) => {
                const formattedDate = new Date(ev.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <Card
                    key={ev._id}
                    className="overflow-hidden border-border shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Banner with Category & RSVP Status */}
                      <div className="relative aspect-[16/9] w-full bg-muted overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            ev.image ||
                            "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80"
                          }
                          alt={ev.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                          <Badge className="bg-emerald-600 text-white shadow-sm text-xs">
                            {ev.category}
                          </Badge>
                          <Badge variant="secondary" className="shadow-sm text-xs">
                            {ev.status}
                          </Badge>
                        </div>

                        <div className="absolute bottom-3 right-3">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-md">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Confirmed RSVP
                          </span>
                        </div>
                      </div>

                      <CardContent className="p-5 space-y-3">
                        <h3 className="font-bold text-lg text-foreground line-clamp-1">
                          {ev.title}
                        </h3>

                        <div className="space-y-1.5 text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="font-medium text-foreground">{formattedDate}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              {ev.time}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                            <span className="truncate">{ev.location}</span>
                          </div>

                          <div className="pt-1 text-xs">
                            Organized by: <strong className="text-foreground">{ev.organizerName}</strong>
                          </div>
                        </div>
                      </CardContent>
                    </div>

                    {/* Action Bar */}
                    <div className="p-5 pt-0 border-t border-border/60 flex items-center justify-between gap-3 mt-auto">
                      <Link href={`/events/${ev._id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full gap-1.5">
                          <Eye className="w-4 h-4" /> View Details
                        </Button>
                      </Link>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setLeavingEvent(ev)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 gap-1.5"
                      >
                        <LogOut className="w-4 h-4" /> Cancel RSVP
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Cancel RSVP Confirmation Dialog */}
      {leavingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold">Cancel Registration?</h3>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to cancel your attendance for &ldquo;{leavingEvent.title}&rdquo;? Your spot will be released for other community volunteers.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <Button
                variant="outline"
                onClick={() => setLeavingEvent(null)}
                disabled={cancelling}
              >
                Keep Registration
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleLeaveEvent(leavingEvent._id)}
                disabled={cancelling}
                className="gap-2"
              >
                {cancelling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Confirm Cancel"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
