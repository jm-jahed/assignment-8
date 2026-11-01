import React from "react";
import Link from "next/link";
import { HeartHandshake, Mail, MapPin, Phone } from "lucide-react";

/**
 * Concept: Site Footer
 * Why:
 * Provides essential navigation redundancy, community mission messaging,
 * contact details, and updated social media links (including modern X logo).
 */
export function Footer() {
  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-foreground">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="tracking-tight">
                Community<span className="text-emerald-600 dark:text-emerald-400">Connect</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering grassroots communities to organize, volunteer, and create lasting social development impact across education, healthcare, and the environment.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-foreground uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-emerald-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-emerald-600 transition-colors">
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link href="/create-event" className="hover:text-emerald-600 transition-colors">
                  Organize an Event
                </Link>
              </li>
              <li>
                <Link href="/manage-events" className="hover:text-emerald-600 transition-colors">
                  Manage Events
                </Link>
              </li>
              <li>
                <Link href="/joined-events" className="hover:text-emerald-600 transition-colors">
                  Volunteer Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Focus Categories */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-foreground uppercase tracking-wider">Cause Categories</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/events?category=Environment" className="hover:text-emerald-600 transition-colors">
                  Environmental Protection
                </Link>
              </li>
              <li>
                <Link href="/events?category=Education" className="hover:text-emerald-600 transition-colors">
                  Youth & Literacy Drives
                </Link>
              </li>
              <li>
                <Link href="/events?category=Healthcare" className="hover:text-emerald-600 transition-colors">
                  Free Health & Blood Camps
                </Link>
              </li>
              <li>
                <Link href="/events?category=Community Cleanliness" className="hover:text-emerald-600 transition-colors">
                  City & Beach Cleanups
                </Link>
              </li>
              <li>
                <Link href="/events?category=Disaster Relief" className="hover:text-emerald-600 transition-colors">
                  Disaster & Food Relief
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-foreground uppercase tracking-wider">Connect With Us</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>120 Community Plaza, City Center</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>support@communityconnect.org</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>+1 (800) 555-COMM</span>
              </li>
            </ul>

            {/* Social Media Links with Updated X Logo (NO Old Twitter Bird) */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-accent text-accent-foreground flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"
                aria-label="X (formerly Twitter)"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://github.com/jm-jahed/assignment-8"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-accent text-accent-foreground flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-accent text-accent-foreground flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.761-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 CommunityConnect Platform. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/" className="hover:underline">Privacy Policy</Link>
            <Link href="/" className="hover:underline">Terms of Service</Link>
            <Link href="/" className="hover:underline">Community Guidelines</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
