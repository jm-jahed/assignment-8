"use client";

/**
 * Concept: Event Creation form using React Hook Form and Zod schema validation in Next.js App Router.
 * Why: Allows community organizers to publish grassroots social development initiatives.
 * How: Validates all inputs client-side, submits to Express POST /api/v1/events with Better Auth JWT,
 *      and provides instant live preview of the banner image.
 * Example: Submitting a "Green City Tree Plantation" initiative scheduled for next Saturday.
 */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  CalendarPlus,
  MapPin,
  Calendar,
  Clock,
  Users,
  ImageIcon,
  Tag,
  Loader2,
  Lock,
  ArrowRight,
} from "lucide-react";

// Pre-defined curated images for quick organizer selection
const PRESET_IMAGES = [
  {
    label: "Cleanliness Drive",
    url: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Tree Plantation",
    url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Health Camp",
    url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Children Education",
    url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Food Distribution",
    url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
  },
];

const CATEGORIES = [
  "Environment",
  "Healthcare",
  "Education",
  "Disaster Relief",
  "Community Cleanliness",
  "Animal Welfare",
] as const;

// Zod Validation Schema for Event Creation
const createEventSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title cannot exceed 100 characters"),
  description: z
    .string()
    .min(20, "Please provide a detailed description (min 20 characters)")
    .max(2000, "Description cannot exceed 2000 characters"),
  category: z.enum(CATEGORIES, {
    message: "Please select a valid initiative category",
  }),
  location: z
    .string()
    .min(3, "Location must be at least 3 characters")
    .max(150, "Location cannot exceed 150 characters"),
  date: z
    .string()
    .min(1, "Please select an event date")
    .refine((val) => {
      const selected = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    }, "Event date must be today or in the future"),
  time: z
    .string()
    .min(1, "Please enter event time (e.g. 10:00 AM)"),
  capacity: z
    .number({ message: "Capacity must be a number" })
    .int("Capacity must be a whole number")
    .min(1, "Event capacity must be at least 1 person")
    .max(5000, "Event capacity cannot exceed 5000"),
  image: z
    .string()
    .url("Please enter a valid image URL (e.g., https://...)")
    .min(1, "Banner image URL is required"),
});

type CreateEventFormData = z.infer<typeof createEventSchema>;

export default function CreateEventPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "Environment",
      location: "",
      date: "",
      time: "10:00 AM",
      capacity: 50,
      image: PRESET_IMAGES[0].url,
    },
  });

  const currentImage = watch("image");

  const onSubmit = async (data: CreateEventFormData) => {
    if (!isAuthenticated || !user) {
      toast.error("Please sign in to publish an event");
      router.push("/login?callbackUrl=/create-event");
      return;
    }

    try {
      setSubmitting(true);

      // Attach authenticated organizer details
      const payload = {
        ...data,
        organizerName: user.name || "Community Organizer",
        organizerEmail: user.email,
      };

      const result = await fetchWithAuth<any>("/events", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!result.success) {
        toast.error(result.message || "Failed to create event. Please check your inputs.");
        return;
      }

      toast.success("Event created successfully! Your initiative is now live.");
      router.push("/events");
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred while creating your event.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <p className="text-sm font-medium">Checking authorization...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Guest Gate: Protected route handling
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
              <CardTitle className="text-2xl font-bold">Organizer Sign In Required</CardTitle>
              <CardDescription className="text-sm">
                To create and lead social development initiatives on CommunityConnect, you need a verified account.
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/login?callbackUrl=/create-event" className="flex-1">
                <Button className="w-full gap-2">
                  Sign In <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/register" className="flex-1">
                <Button variant="outline" className="w-full">
                  Create Account
                </Button>
              </Link>
            </div>
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
        <div className="container mx-auto px-4 max-w-4xl space-y-8">
          {/* Header Title Section */}
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300">
              <CalendarPlus className="w-3.5 h-3.5" />
              Empower Your Community
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Create a Social Development Event
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Organize grassroots change. Publish your initiative and rally volunteers across your locality.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Primary Details Card */}
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <CalendarPlus className="w-5 h-5 text-emerald-600" />
                  Initiative Information
                </CardTitle>
                <CardDescription>
                  Provide clear, inviting details so volunteers understand your initiative&apos;s purpose.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                {/* Event Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Clean City Sunday: Gulshan Lake Cleanup Drive"
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-xs text-red-500 font-medium">{errors.title.message}</p>
                  )}
                </div>

                {/* Category & Capacity in 2-column grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="flex items-center gap-1.5">
                      <Tag className="w-4 h-4 text-emerald-600" />
                      Category *
                    </Label>
                    <select
                      id="category"
                      {...register("category")}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-xs text-red-500 font-medium">{errors.category.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="capacity" className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-emerald-600" />
                      Volunteer Capacity *
                    </Label>
                    <Input
                      id="capacity"
                      type="number"
                      min={1}
                      max={5000}
                      placeholder="e.g. 50"
                      {...register("capacity", { valueAsNumber: true })}
                    />
                    {errors.capacity && (
                      <p className="text-xs text-red-500 font-medium">{errors.capacity.message}</p>
                    )}
                  </div>
                </div>

                {/* Event Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description *</Label>
                  <Textarea
                    id="description"
                    rows={5}
                    placeholder="Describe what volunteers will be doing, what to bring, meet-up details, and the community impact..."
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="text-xs text-red-500 font-medium">{errors.description.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Date, Time & Venue Card */}
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  Date, Time & Venue
                </CardTitle>
                <CardDescription>
                  Specify when and where volunteers will assemble.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      Event Date *
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      {...register("date")}
                    />
                    {errors.date && (
                      <p className="text-xs text-red-500 font-medium">{errors.date.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time" className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      Event Time *
                    </Label>
                    <Input
                      id="time"
                      placeholder="e.g. 09:30 AM - 01:00 PM"
                      {...register("time")}
                    />
                    {errors.time && (
                      <p className="text-xs text-red-500 font-medium">{errors.time.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    Venue / Meeting Point *
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g. Gulshan Lake Park Gate 3, Dhaka"
                    {...register("location")}
                  />
                  {errors.location && (
                    <p className="text-xs text-red-500 font-medium">{errors.location.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Banner Image & Visuals Card */}
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-emerald-600" />
                  Banner Visuals
                </CardTitle>
                <CardDescription>
                  Choose a curated theme image or paste an image URL to inspire volunteers.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                {/* Preset image selector buttons */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Quick Preset Images:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_IMAGES.map((preset) => (
                      <Button
                        key={preset.label}
                        type="button"
                        variant={currentImage === preset.url ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setValue("image", preset.url, { shouldValidate: true });
                          setPreviewError(false);
                        }}
                        className="text-xs"
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Custom Image URL input */}
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL *</Label>
                  <Input
                    id="image"
                    placeholder="https://images.unsplash.com/..."
                    {...register("image")}
                    onChange={(e) => {
                      register("image").onChange(e);
                      setPreviewError(false);
                    }}
                  />
                  {errors.image && (
                    <p className="text-xs text-red-500 font-medium">{errors.image.message}</p>
                  )}
                </div>

                {/* Live Preview Box */}
                <div className="space-y-2">
                  <Label>Banner Preview</Label>
                  <div className="relative aspect-[21/9] w-full rounded-xl overflow-hidden border border-border bg-muted flex items-center justify-center">
                    {currentImage && !previewError ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={currentImage}
                        alt="Event Banner Preview"
                        className="w-full h-full object-cover"
                        onError={() => setPreviewError(true)}
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground p-4 text-center">
                        <ImageIcon className="w-8 h-8 opacity-40" />
                        <p className="text-xs">
                          {previewError
                            ? "Unable to load image from provided URL. Please verify the link."
                            : "Enter a valid image URL to view preview"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Organizer Credential Banner */}
            <div className="p-4 rounded-xl bg-muted/60 border border-border flex items-center justify-between text-xs text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground">Publishing as {user?.name || "Organizer"}</p>
                <p>{user?.email || ""}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                Verified Organizer
              </Badge>
            </div>

            {/* Submit Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="gap-2 min-w-[160px] h-11 text-base font-semibold shadow-md shadow-emerald-600/20"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <CalendarPlus className="w-5 h-5" />
                    Publish Initiative
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
