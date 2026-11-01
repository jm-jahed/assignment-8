"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { EventCard, EventCardSkeleton, EventData } from "@/components/shared/event-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  HeartHandshake,
  Calendar,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Send,
  RefreshCw,
  FolderTree,
} from "lucide-react";

export default function HomePage() {
  const [recentEvents, setRecentEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);

  const fetchRecentEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const res = await fetch(`${apiUrl}/events/recent`);

      if (!res.ok) {
        throw new Error(`Failed to load upcoming initiatives (${res.status})`);
      }

      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setRecentEvents(json.data);
      } else {
        setRecentEvents([]);
      }
    } catch (err: any) {
      console.warn("Could not load events from Express API:", err.message);
      setError(err.message || "Failed to connect to backend");
      // Fallback empty state so page renders gracefully
      setRecentEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentEvents();
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setNewsletterSubmitting(true);
    setTimeout(() => {
      toast.success("Thank you for subscribing to CommunityConnect updates!");
      setNewsletterEmail("");
      setNewsletterSubmitting(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* SECTION 1: HERO & CALL TO ACTION                                          */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-emerald-50/50 via-background to-background dark:from-emerald-950/20 dark:via-background dark:to-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Headlines & CTAs */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <Badge variant="secondary" className="px-3.5 py-1.5 gap-2 text-sm font-semibold rounded-full shadow-sm">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Grassroots Social Development Platform
                </Badge>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
                  Unite for Social Impact.{" "}
                  <span className="text-emerald-600 dark:text-emerald-400">
                    Empower Communities.
                  </span>
                </h1>

                <p className="text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Join thousands of local citizens taking tangible action. Volunteer for environmental cleanups, tree plantations, literacy camps, and emergency health drives right in your neighborhood.
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link href="/events">
                    <Button size="lg" className="gap-2 px-6 h-12 text-base font-semibold shadow-lg shadow-emerald-600/20">
                      <Calendar className="w-5 h-5" />
                      Explore Upcoming Events
                    </Button>
                  </Link>
                  <Link href="/create-event">
                    <Button variant="outline" size="lg" className="gap-2 px-6 h-12 text-base font-semibold">
                      <HeartHandshake className="w-5 h-5 text-emerald-600" />
                      Organize an Event
                    </Button>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-muted-foreground font-medium">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified Organizers
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Free Participation
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-600" /> Active Volunteer Community
                  </span>
                </div>
              </div>

              {/* Right Column: Hero Visual Showcase */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl overflow-hidden shadow-2xl border border-border group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=80"
                    alt="Volunteers planting trees and planting seeds"
                    className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                    <Badge variant="secondary" className="w-fit mb-2">Featured Movement</Badge>
                    <h3 className="font-bold text-lg">Urban Reforestation & Green Canopy 2026</h3>
                    <p className="text-xs text-slate-300">Over 500 volunteers planting 2,000 saplings across community parks.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: IMPACT METRICS & PLATFORM FEATURES                             */}
        {/* ========================================================================= */}
        <section className="py-16 bg-muted/30 border-y border-border">
          <div className="container mx-auto px-4">
            {/* Impact Counters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
                <p className="text-3xl md:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">1,850+</p>
                <p className="text-xs md:text-sm font-medium text-muted-foreground mt-1">Registered Volunteers</p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
                <p className="text-3xl md:text-4xl font-extrabold text-amber-500">120+</p>
                <p className="text-xs md:text-sm font-medium text-muted-foreground mt-1">Initiatives Hosted</p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
                <p className="text-3xl md:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">15,000+</p>
                <p className="text-xs md:text-sm font-medium text-muted-foreground mt-1">Trees & Care Packs Distributed</p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
                <p className="text-3xl md:text-4xl font-extrabold text-blue-500">24</p>
                <p className="text-xs md:text-sm font-medium text-muted-foreground mt-1">Neighborhood Communities</p>
              </div>
            </div>

            {/* Core Feature Pillars */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-foreground">Verified Local Initiatives</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Discover community cleanups, health camps, and literacy drives organized by verified community advocates.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-foreground">Instant, Duplicate-Safe RSVP</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Register with a single click. Our database-backed concurrency guards prevent oversubscription and duplicate RSVPs.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card border border-border space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600">
                  <FolderTree className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-foreground">Volunteer & Organizer Hub</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Easily manage created initiatives, track attendee capacity in real-time, or cancel an RSVP with one tap.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: DYNAMIC RECENT UPCOMING EVENTS (.limit(6))                      */}
        {/* ========================================================================= */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div className="space-y-2">
                <Badge variant="outline" className="text-emerald-600 border-emerald-500/30">
                  Upcoming Movements
                </Badge>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                  Latest Upcoming Initiatives
                </h2>
                <p className="text-muted-foreground text-sm max-w-xl">
                  Real-time grassroots events scheduled in the coming days. Pick a cause and participate.
                </p>
              </div>

              <Link href="/events" className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                <span>View All Upcoming Events</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Loading State: Skeletons */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <EventCardSkeleton key={idx} />
                ))}
              </div>
            )}

            {/* Error State with Retry Button */}
            {!loading && error && (
              <div className="p-8 text-center rounded-2xl border border-border bg-card space-y-4 max-w-md mx-auto">
                <p className="text-sm text-muted-foreground">
                  Unable to connect to the events API server. Please verify the Express backend is running on port 5000.
                </p>
                <Button onClick={fetchRecentEvents} variant="outline" size="sm" className="gap-2">
                  <RefreshCw className="w-4 h-4" /> Retry
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && recentEvents.length === 0 && (
              <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card/50 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-foreground">No upcoming events yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Be the community leader who sparks the first initiative! Create an event to gather local volunteers.
                </p>
                <Link href="/create-event">
                  <Button size="sm">Create First Event</Button>
                </Link>
              </div>
            )}

            {/* Events Grid (Max 6) */}
            {!loading && !error && recentEvents.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentEvents.slice(0, 6).map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: COMMUNITY ACTION IMAGE GALLERY                                 */}
        {/* ========================================================================= */}
        <section className="py-16 bg-muted/20 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
              <Badge variant="outline" className="text-emerald-600 border-emerald-500/30">
                Community in Action
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                Moments of Grassroots Transformation
              </h2>
              <p className="text-sm text-muted-foreground">
                Witness real volunteers planting hope, restoring coastal ecosystems, and providing healthcare.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-md group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"
                  alt="Tree plantation drive volunteers"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                  <span className="text-white text-xs font-semibold">Tree Planting & Reforestation Drive</span>
                </div>
              </div>

              <div className="relative aspect-video rounded-xl overflow-hidden shadow-md group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80"
                  alt="Beach cleanup initiative"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                  <span className="text-white text-xs font-semibold">Coastal Marine & Beach Cleanup</span>
                </div>
              </div>

              <div className="relative aspect-video rounded-xl overflow-hidden shadow-md group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80"
                  alt="Community healthcare camp"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                  <span className="text-white text-xs font-semibold">Free Neighborhood Health & Eye Checkup</span>
                </div>
              </div>

              <div className="relative aspect-video rounded-xl overflow-hidden shadow-md group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80"
                  alt="Youth reading literacy circle"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                  <span className="text-white text-xs font-semibold">Youth Literacy & Book Donation Circle</span>
                </div>
              </div>

              <div className="relative aspect-video rounded-xl overflow-hidden shadow-md group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=800&q=80"
                  alt="Emergency food relief distribution"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                  <span className="text-white text-xs font-semibold">Emergency Food & Care Pack Drive</span>
                </div>
              </div>

              <div className="relative aspect-video rounded-xl overflow-hidden shadow-md group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80"
                  alt="Community volunteering workshop"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                  <span className="text-white text-xs font-semibold">Leadership & Volunteer Skills Workshop</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: NEWSLETTER SUBSCRIPTION (FRONTEND ONLY)                        */}
        {/* ========================================================================= */}
        <section className="py-20 bg-card border-t border-border">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="rounded-3xl p-8 md:p-14 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-xl text-center space-y-6">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto text-white backdrop-blur-sm">
                <Mail className="w-6 h-6" />
              </div>

              <div className="space-y-2 max-w-xl mx-auto">
                <h2 className="text-3xl font-extrabold tracking-tight">
                  Stay Informed on Local Causes
                </h2>
                <p className="text-sm text-emerald-100 leading-relaxed">
                  Get weekly alerts on environmental drives, blood camps, and volunteer opportunities happening in your city.
                </p>
              </div>

              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  disabled={newsletterSubmitting}
                  className="bg-white/10 text-white placeholder:text-emerald-200 border-white/20 h-11 focus-visible:ring-white"
                />
                <Button
                  type="submit"
                  disabled={newsletterSubmitting}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold h-11 px-6 shrink-0 gap-2 cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Subscribe</span>
                </Button>
              </form>

              <p className="text-[11px] text-emerald-200">
                Zero spam. Unsubscribe anytime with a single click.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
