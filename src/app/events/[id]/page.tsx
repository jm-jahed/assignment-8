"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { useAuth } from "@/context/auth-context";
import { fetchWithAuth } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Share2,
} from "lucide-react";

interface EventDetail {
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
  organizer: string;
  organizerName: string;
  organizerEmail: string;
}

function EventDetailsContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;

  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

        const res = await fetch(`${apiUrl}/events/${eventId}`);
        if (!res.ok) {
          throw new Error("Event not found or failed to load");
        }

        const json = await res.json();
        if (json.success && json.data) {
          setEvent(json.data);
        } else {
          throw new Error("Event details unavailable");
        }

        // If user is authenticated, check if they have already joined
        if (isAuthenticated && user) {
          const joinStatus = await fetchWithAuth<{ isJoined: boolean }>(`/events/${eventId}/is-joined`);
          if (joinStatus.success && joinStatus.data) {
            setIsJoined(joinStatus.data.isJoined);
          }
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while loading event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId, isAuthenticated, user]);

  // Live countdown timer calculation
  useEffect(() => {
    if (!event?.date) return;

    const targetDate = new Date(event.date).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [event?.date]);

  const handleJoinEvent = async () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to join community initiatives");
      router.push(`/login?callbackUrl=/events/${eventId}`);
      return;
    }

    try {
      setActionLoading(true);
      const res = await fetchWithAuth(`/events/${eventId}/join`, {
        method: "POST",
      });

      if (!res.success) {
        toast.error(res.message || "Could not register for this event");
        return;
      }

      setIsJoined(true);
      setEvent((prev) => (prev ? { ...prev, joinedCount: prev.joinedCount + 1 } : null));
      toast.success("Successfully registered! Thank you for volunteering.");
    } catch (err: any) {
      toast.error(err.message || "Failed to join event");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveEvent = async () => {
    if (!confirm("Are you sure you want to cancel your registration for this event?")) {
      return;
    }

    try {
      setActionLoading(true);
      const res = await fetchWithAuth(`/events/${eventId}/leave`, {
        method: "DELETE",
      });

      if (!res.success) {
        toast.error(res.message || "Failed to cancel attendance");
        return;
      }

      setIsJoined(false);
      setEvent((prev) => (prev ? { ...prev, joinedCount: Math.max(0, prev.joinedCount - 1) } : null));
      toast.success("Registration cancelled. Your spot has been returned.");
    } catch (err: any) {
      toast.error(err.message || "Failed to leave event");
    } finally {
      setActionLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: event?.title,
          text: `Join this social development initiative: ${event?.title}`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Event link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <p className="text-sm font-medium">Loading event details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold">Event Not Found</h2>
            <p className="text-sm text-muted-foreground">{error || "The requested event does not exist."}</p>
            <Link href="/events">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Upcoming Events
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const spotsLeft = Math.max(0, event.capacity - event.joinedCount);
  const isFull = spotsLeft === 0;
  const isOrganizer = user?.id === event.organizer;
  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 py-10 md:py-16">
        <div className="container mx-auto px-4 max-w-5xl space-y-8">
          {/* Back Navigation Bar */}
          <div className="flex items-center justify-between">
            <Link href="/events">
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                Back to All Events
              </Button>
            </Link>

            <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
              <Share2 className="w-4 h-4" />
              Share Event
            </Button>
          </div>

          {/* Event Banner Image with Floating Category & Status */}
          <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden border border-border shadow-lg bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.image || "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80"}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className="bg-emerald-600 text-white shadow-md text-sm py-1 px-3">
                {event.category}
              </Badge>
              <Badge variant="secondary" className="shadow-md text-sm py-1 px-3">
                {event.status}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Event Core Info & Description */}
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                  {event.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    {formattedDate}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    {event.time}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    {event.location}
                  </span>
                </div>
              </div>

              {/* Countdown Timer Widget */}
              <div className="p-6 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-500/20 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  Countdown to Initiative Kickoff
                </h3>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-3 bg-card rounded-xl border border-border shadow-sm">
                    <p className="text-2xl font-black text-emerald-600">{timeLeft.days}</p>
                    <p className="text-[11px] text-muted-foreground uppercase font-semibold">Days</p>
                  </div>
                  <div className="p-3 bg-card rounded-xl border border-border shadow-sm">
                    <p className="text-2xl font-black text-emerald-600">{timeLeft.hours}</p>
                    <p className="text-[11px] text-muted-foreground uppercase font-semibold">Hours</p>
                  </div>
                  <div className="p-3 bg-card rounded-xl border border-border shadow-sm">
                    <p className="text-2xl font-black text-emerald-600">{timeLeft.minutes}</p>
                    <p className="text-[11px] text-muted-foreground uppercase font-semibold">Mins</p>
                  </div>
                  <div className="p-3 bg-card rounded-xl border border-border shadow-sm">
                    <p className="text-2xl font-black text-emerald-600">{timeLeft.seconds}</p>
                    <p className="text-[11px] text-muted-foreground uppercase font-semibold">Secs</p>
                  </div>
                </div>
              </div>

              {/* Event Description */}
              <div className="space-y-4 pt-4">
                <h2 className="text-xl font-bold text-foreground">About This Initiative</h2>
                <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line text-sm md:text-base">
                  {event.description}
                </div>
              </div>

              {/* Organizer Information Badge */}
              <div className="border-t border-border pt-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Initiative Organized By</p>
                  <p className="font-bold text-base text-foreground">{event.organizerName}</p>
                  <p className="text-xs text-muted-foreground">{event.organizerEmail}</p>
                </div>
                {isOrganizer && (
                  <Badge variant="secondary" className="px-3 py-1">
                    Your Event
                  </Badge>
                )}
              </div>
            </div>

            {/* Right Column: RSVP Participation Card */}
            <div className="lg:col-span-4 sticky top-24">
              <Card className="shadow-xl border-border bg-card">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-xl font-bold">Event Registration</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Free community participation with verified attendance tracking.
                  </p>
                </CardHeader>

                <CardContent className="space-y-5">
                  {/* Attendance & Capacity Meter */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="flex items-center gap-1.5 text-foreground">
                        <Users className="w-4 h-4 text-emerald-600" />
                        {event.joinedCount} Registered
                      </span>
                      <span className="text-muted-foreground">
                        {isFull ? (
                          <strong className="text-red-500">Event Full</strong>
                        ) : (
                          `${spotsLeft} spots remaining`
                        )}
                      </span>
                    </div>

                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
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

                  {/* Dynamic Action Button */}
                  {isOrganizer ? (
                    <div className="p-3 text-center bg-muted/60 rounded-xl text-xs text-muted-foreground space-y-2">
                      <p className="font-medium text-foreground">You are organizing this event</p>
                      <Link href="/manage-events">
                        <Button variant="outline" size="sm" className="w-full">
                          Manage in Organizer Dashboard
                        </Button>
                      </Link>
                    </div>
                  ) : isJoined ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-xl text-sm font-semibold border border-emerald-500/30">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>You are registered for this event!</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLeaveEvent}
                        disabled={actionLoading}
                        className="w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-500"
                      >
                        {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Cancel Registration"}
                      </Button>
                    </div>
                  ) : isFull ? (
                    <Button disabled className="w-full" size="lg">
                      Capacity Reached
                    </Button>
                  ) : (
                    <Button
                      onClick={handleJoinEvent}
                      disabled={actionLoading}
                      className="w-full h-11 text-base font-semibold shadow-md shadow-emerald-600/20"
                      size="lg"
                    >
                      {actionLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Registering...
                        </>
                      ) : (
                        "Join This Event (RSVP)"
                      )}
                    </Button>
                  )}

                  {/* Extra Assurance Info */}
                  <div className="border-t border-border/60 pt-4 space-y-2 text-xs text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      Free admission & volunteer materials provided.
                    </p>
                    <p className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      Instant confirmation added to your Joined Events hub.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-8 bg-background">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <p className="text-sm font-medium">Loading event details...</p>
          </div>
        </div>
      }
    >
      <EventDetailsContent params={params} />
    </React.Suspense>
  );
}
