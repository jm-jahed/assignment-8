"use client";

/**
 * Concept: User Profile & Community Impact Dashboard.
 * Why: Provides members with an overview of their social contributions, volunteer statistics,
 *      and direct shortcuts to manage initiatives or explore upcoming drives.
 * How: Combines Better Auth session data from AuthContext with concurrent API queries to
 *      GET /api/v1/my-events and GET /api/v1/participants/me using Promise.all().
 * Example: A user reviews their volunteer level, 5 completed drives, and 2 organized events.
 */

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { useAuth } from "@/context/auth-context";
import { fetchWithAuth } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  User,
  Mail,
  CalendarCheck,
  CalendarPlus,
  Award,
  ShieldCheck,
  LogOut,
  ArrowRight,
  Loader2,
  Lock,
  Sparkles,
  HeartHandshake,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();

  const [stats, setStats] = useState({
    organizedCount: 0,
    joinedCount: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchUserImpact = async () => {
      if (!isAuthenticated) return;

      try {
        const [myEventsRes, joinedRes] = await Promise.all([
          fetchWithAuth<any[]>("/my-events"),
          fetchWithAuth<any[]>("/participants/me"),
        ]);

        setStats({
          organizedCount: myEventsRes.success && myEventsRes.data ? myEventsRes.data.length : 0,
          joinedCount: joinedRes.success && joinedRes.data ? joinedRes.data.length : 0,
          loading: false,
        });
      } catch {
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchUserImpact();
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Successfully logged out. See you next time!");
      router.push("/");
    } catch {
      toast.error("Failed to sign out");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <p className="text-sm font-medium">Loading profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
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
                Sign in to view your community profile, impact score, and organized initiatives.
              </p>
            </div>
            <Link href="/login?callbackUrl=/profile">
              <Button className="w-full gap-2">
                Sign In to Your Account <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate Impact Tier
  const totalInvolvement = stats.organizedCount + stats.joinedCount;
  let tierTitle = "New Changemaker";
  let tierColor = "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300";

  if (totalInvolvement >= 5) {
    tierTitle = "Community Champion";
    tierColor = "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300";
  } else if (totalInvolvement >= 2) {
    tierTitle = "Active Volunteer";
    tierColor = "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300";
  }

  // Initials for avatar fallback
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "CC";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 py-10 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">
          {/* Header Card with User Overview */}
          <Card className="border-border shadow-sm overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800" />
            <CardContent className="px-6 pb-6 pt-0 relative">
              <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-14 mb-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                  {/* Avatar Circle */}
                  <div className="w-24 h-24 rounded-2xl bg-background border-4 border-background shadow-lg overflow-hidden flex items-center justify-center text-2xl font-black text-emerald-600 bg-muted">
                    {user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{initials}</span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h1 className="text-2xl font-extrabold text-foreground">{user.name}</h1>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${tierColor}`}>
                        {tierTitle}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Social Impact Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-border shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs uppercase font-semibold text-muted-foreground">Joined Drives</p>
                  <p className="text-2xl font-black text-foreground">
                    {stats.loading ? "..." : stats.joinedCount}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Active RSVPs</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950/50 text-teal-600 flex items-center justify-center shrink-0">
                  <CalendarPlus className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs uppercase font-semibold text-muted-foreground">Organized Drives</p>
                  <p className="text-2xl font-black text-foreground">
                    {stats.loading ? "..." : stats.organizedCount}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Community Initiatives</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs uppercase font-semibold text-muted-foreground">Impact Tier</p>
                  <p className="text-base font-bold text-foreground truncate">{tierTitle}</p>
                  <p className="text-[11px] text-muted-foreground">Based on turnout</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Management Shortcuts */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight">Quick Shortcuts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/create-event">
                <Card className="border-border shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
                        <CalendarPlus className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground">Publish Initiative</p>
                        <p className="text-xs text-muted-foreground">Host a volunteer event</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>

              <Link href="/manage-events">
                <Card className="border-border shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-950/50 text-teal-600 flex items-center justify-center">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground">Organizer Dashboard</p>
                        <p className="text-xs text-muted-foreground">View turnout & edit drives</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>

              <Link href="/joined-events">
                <Card className="border-border shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
                        <CalendarCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground">Joined Events</p>
                        <p className="text-xs text-muted-foreground">Check your volunteer schedule</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>

              <Link href="/events">
                <Card className="border-border shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
                        <HeartHandshake className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground">Explore All Events</p>
                        <p className="text-xs text-muted-foreground">Discover causes near you</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Account Security & Authentication Info */}
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Security & Authentication Status
              </CardTitle>
              <CardDescription className="text-xs">
                Your account is secured with Better Auth JWT cryptography and MongoDB storage.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-muted-foreground">
              <div className="flex justify-between py-1 border-b border-border/50">
                <span>Account ID</span>
                <span className="font-mono text-foreground">{user.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span>Session Type</span>
                <span className="font-medium text-foreground">Better Auth Secure JWT</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Account Status</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Active & Verified
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
