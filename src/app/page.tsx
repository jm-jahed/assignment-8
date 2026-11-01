import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeartHandshake, Calendar, Users, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 text-center bg-gradient-to-b from-background via-accent/20 to-background">
      <div className="max-w-3xl space-y-6">
        <Badge variant="secondary" className="px-3 py-1 gap-1.5 text-sm">
          <Sparkles className="w-4 h-4 text-amber-500" />
          CommunityConnect Social Development Platform
        </Badge>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
          Empowering Communities Through{" "}
          <span className="text-emerald-600 dark:text-emerald-400">Action</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          Connect with grassroots initiatives, volunteer for clean water, education, and tree plantation drives, and build a lasting social impact together.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link href="/events">
            <Button size="lg" className="gap-2">
              <Calendar className="w-5 h-5" />
              Explore Upcoming Events
            </Button>
          </Link>
          <Link href="/create-event">
            <Button variant="outline" size="lg" className="gap-2">
              <HeartHandshake className="w-5 h-5" />
              Organize an Event
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 text-left">
          <Card>
            <CardHeader className="pb-2">
              <Users className="w-8 h-8 text-emerald-600 mb-2" />
              <CardTitle>Grassroots Action</CardTitle>
              <CardDescription>Join local volunteers making immediate community improvements.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <Calendar className="w-8 h-8 text-amber-500 mb-2" />
              <CardTitle>Verified Events</CardTitle>
              <CardDescription>Discover environmental, health, and literacy drives near you.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <HeartHandshake className="w-8 h-8 text-emerald-600 mb-2" />
              <CardTitle>Verified Impact</CardTitle>
              <CardDescription>Track your volunteer hours and community participation seamlessly.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </main>
  );
}
