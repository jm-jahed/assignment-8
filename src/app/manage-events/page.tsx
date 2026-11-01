"use client";

/**
 * Concept: Organizer Dashboard for managing created events (Full CRUD operations).
 * Why: Allows community organizers to view, edit schedules/capacity, and cancel initiatives.
 * How: Fetches data from GET /api/v1/my-events, connects to PATCH /api/v1/events/:id for updates,
 *      and DELETE /api/v1/events/:id with confirmation to maintain clean records.
 * Example: An organizer checks how many volunteers registered and updates the meeting location.
 */

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { useAuth } from "@/context/auth-context";
import { fetchWithAuth } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Edit,
  Trash2,
  PlusCircle,
  Eye,
  AlertTriangle,
  Loader2,
  Lock,
  ArrowRight,
  X,
  CheckCircle,
} from "lucide-react";

interface ManagedEvent {
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
  createdAt: string;
}

export default function ManageEventsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [events, setEvents] = useState<ManagedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit Modal State
  const [editingEvent, setEditingEvent] = useState<ManagedEvent | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    capacity: 0,
    status: "Upcoming" as "Upcoming" | "Completed" | "Cancelled",
  });
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete Confirmation State
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const fetchMyEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchWithAuth<ManagedEvent[]>("/my-events");
      if (res.success && res.data) {
        setEvents(res.data);
      } else {
        throw new Error(res.message || "Failed to load your events");
      }
    } catch (err: any) {
      setError(err.message || "Could not retrieve your organized events.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyEvents();
    }
  }, [isAuthenticated, fetchMyEvents]);

  // Open edit modal with existing values
  const startEdit = (ev: ManagedEvent) => {
    setEditingEvent(ev);
    setEditFormData({
      title: ev.title,
      description: ev.description,
      location: ev.location,
      date: new Date(ev.date).toISOString().split("T")[0],
      time: ev.time,
      capacity: ev.capacity,
      status: ev.status,
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    try {
      setSavingEdit(true);
      const res = await fetchWithAuth<ManagedEvent>(`/events/${editingEvent._id}`, {
        method: "PATCH",
        body: JSON.stringify(editFormData),
      });

      if (!res.success || !res.data) {
        toast.error(res.message || "Failed to update event");
        return;
      }

      toast.success("Event details updated successfully!");
      setEvents((prev) =>
        prev.map((item) => (item._id === editingEvent._id ? { ...item, ...res.data } : item))
      );
      setEditingEvent(null);
    } catch (err: any) {
      toast.error(err.message || "An error occurred while saving updates.");
    } finally {
      setSavingEdit(false);
    }
  };

  // Execute deletion after user confirms
  const handleDelete = async (id: string) => {
    try {
      setConfirmingDelete(true);
      const res = await fetchWithAuth(`/events/${id}`, {
        method: "DELETE",
      });

      if (!res.success) {
        toast.error(res.message || "Failed to delete event");
        return;
      }

      toast.success("Event has been deleted.");
      setEvents((prev) => prev.filter((item) => item._id !== id));
      setDeletingId(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to remove event");
    } finally {
      setConfirmingDelete(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <p className="text-sm font-medium">Checking organizer status...</p>
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
              <CardTitle className="text-2xl font-bold">Sign In Required</CardTitle>
              <CardDescription className="text-sm">
                Please log in to manage your published community initiatives and view volunteer registrations.
              </CardDescription>
            </div>
            <Link href="/login?callbackUrl=/manage-events">
              <Button className="w-full gap-2">
                Sign In to Organizer Dashboard <ArrowRight className="w-4 h-4" />
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
          {/* Dashboard Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold tracking-tight">Manage Your Events</h1>
              <p className="text-muted-foreground text-sm">
                Track volunteer sign-ups, adjust capacities, and update details for initiatives you organize.
              </p>
            </div>
            <Link href="/create-event">
              <Button className="gap-2 shrink-0 shadow-md shadow-emerald-600/20">
                <PlusCircle className="w-4 h-4" />
                Create New Event
              </Button>
            </Link>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 border border-red-500/20 text-sm flex items-center justify-between">
              <span>{error}</span>
              <Button variant="ghost" size="sm" onClick={fetchMyEvents}>
                Retry
              </Button>
            </div>
          )}

          {/* Loading Skeletons */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && events.length === 0 && (
            <Card className="text-center p-12 border-dashed border-2 border-border bg-card/50">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto">
                  <Calendar className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">No Organized Events Yet</h3>
                <p className="text-muted-foreground text-sm">
                  You haven&apos;t created any social development events yet. Rally volunteers and spark change in your community!
                </p>
                <Link href="/create-event">
                  <Button className="gap-2">
                    <PlusCircle className="w-4 h-4" />
                    Publish Your First Initiative
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          {/* Events Table / Card List */}
          {!loading && events.length > 0 && (
            <div className="grid grid-cols-1 gap-4">
              {events.map((ev) => {
                const formattedDate = new Date(ev.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
                const percentage = Math.min(100, Math.round((ev.joinedCount / ev.capacity) * 100));

                return (
                  <Card key={ev._id} className="border-border shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-5">
                      {/* Left: Thumbnail & Core Details */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={ev.image || "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=300&q=80"}
                            alt={ev.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge className="bg-emerald-600 text-white text-[10px] py-0.5 px-2">
                              {ev.category}
                            </Badge>
                            <Badge
                              variant={
                                ev.status === "Upcoming"
                                  ? "secondary"
                                  : ev.status === "Completed"
                                  ? "outline"
                                  : "destructive"
                              }
                              className="text-[10px] py-0.5 px-2"
                            >
                              {ev.status}
                            </Badge>
                          </div>

                          <h3 className="font-bold text-base md:text-lg text-foreground truncate">
                            {ev.title}
                          </h3>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                              {formattedDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-emerald-600" />
                              {ev.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-amber-500" />
                              {ev.location}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Middle: Attendance Progress */}
                      <div className="w-full md:w-48 space-y-1.5 shrink-0">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="flex items-center gap-1 text-foreground">
                            <Users className="w-3.5 h-3.5 text-emerald-600" />
                            {ev.joinedCount} / {ev.capacity} Joined
                          </span>
                          <span className="text-muted-foreground">{percentage}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              percentage >= 100 ? "bg-amber-500" : "bg-emerald-600"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Right: Action Buttons */}
                      <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                        <Link href={`/events/${ev._id}`}>
                          <Button variant="outline" size="sm" className="gap-1.5" title="View Public Page">
                            <Eye className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                        </Link>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(ev)}
                          className="gap-1.5 text-emerald-600 hover:text-emerald-700"
                          title="Edit Initiative"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingId(ev._id)}
                          className="gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                          title="Delete Event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Edit className="w-5 h-5 text-emerald-600" />
                Edit Event
              </h2>
              <button
                onClick={() => setEditingEvent(null)}
                className="p-1 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Event Title</Label>
                <Input
                  id="edit-title"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-desc">Description</Label>
                <Textarea
                  id="edit-desc"
                  rows={3}
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Date</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={editFormData.date}
                    onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-time">Time</Label>
                  <Input
                    id="edit-time"
                    value={editFormData.time}
                    onChange={(e) => setEditFormData({ ...editFormData, time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="edit-capacity">Capacity</Label>
                  <Input
                    id="edit-capacity"
                    type="number"
                    min={editingEvent.joinedCount || 1}
                    value={editFormData.capacity}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, capacity: parseInt(e.target.value) || 0 })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <select
                    id="edit-status"
                    value={editFormData.status}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        status: e.target.value as "Upcoming" | "Completed" | "Cancelled",
                      })
                    }
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-location">Venue / Location</Label>
                <Input
                  id="edit-location"
                  value={editFormData.location}
                  onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingEvent(null)}
                  disabled={savingEdit}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={savingEdit} className="gap-2">
                  {savingEdit ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold">Delete This Initiative?</h3>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. All volunteer registrations and details associated with this event will be permanently removed.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <Button
                variant="outline"
                onClick={() => setDeletingId(null)}
                disabled={confirmingDelete}
              >
                Keep Event
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(deletingId)}
                disabled={confirmingDelete}
                className="gap-2"
              >
                {confirmingDelete ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Confirm Delete
                  </>
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
