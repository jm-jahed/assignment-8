"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import {
  HeartHandshake,
  PlusCircle,
  FolderKanban,
  CheckCircle2,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo / Brand Name */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg md:text-xl text-foreground group">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:bg-emerald-700 transition-colors">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <span className="tracking-tight">
            Community<span className="text-emerald-600 dark:text-emerald-400">Connect</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 font-medium text-sm text-muted-foreground">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg transition-colors hover:text-foreground ${
              isActive("/") ? "text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40" : ""
            }`}
          >
            Home
          </Link>
          <Link
            href="/events"
            className={`px-3 py-1.5 rounded-lg transition-colors hover:text-foreground ${
              isActive("/events") ? "text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40" : ""
            }`}
          >
            Upcoming Events
          </Link>
        </nav>

        {/* Right Section: Auth & Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {isAuthenticated && user ? (
            <div className="relative">
              {/* User Avatar with Hover Name Tooltip */}
              <div
                role="button"
                tabIndex={0}
                aria-label="User profile menu"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setDropdownOpen(!dropdownOpen);
                  }
                }}
                className="group relative flex items-center cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="w-9 h-9 rounded-full ring-2 ring-emerald-500/30 overflow-hidden bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-800 dark:text-emerald-200 font-semibold text-sm select-none">
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>

                {/* Show user name on profile hover */}
                <div className="absolute top-11 right-0 hidden group-hover:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-popover text-popover-foreground text-xs font-semibold shadow-md border border-border whitespace-nowrap z-50 pointer-events-none">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  {user.name}
                </div>
              </div>

              {/* User Dropdown Menu */}
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl z-50 text-sm animate-in fade-in-50 zoom-in-95">
                    <div className="px-3 py-2 border-b border-border/60 mb-1">
                      <p className="font-semibold text-foreground truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>

                    <Link
                      href="/create-event"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors font-medium text-xs"
                    >
                      <PlusCircle className="w-4 h-4 text-emerald-600" />
                      Create Event
                    </Link>

                    <Link
                      href="/manage-events"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors font-medium text-xs"
                    >
                      <FolderKanban className="w-4 h-4 text-amber-500" />
                      Manage Events
                    </Link>

                    <Link
                      href="/joined-events"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors font-medium text-xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                      Joined Events
                    </Link>

                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors font-medium text-xs"
                    >
                      <User className="w-4 h-4 text-indigo-500" />
                      Profile
                    </Link>

                    <div className="border-t border-border/60 my-1" />

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors font-medium text-xs cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg font-medium text-sm hover:bg-accent"
          >
            Home
          </Link>
          <Link
            href="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg font-medium text-sm hover:bg-accent"
          >
            Upcoming Events
          </Link>

          {isAuthenticated && user ? (
            <div className="border-t border-border pt-3 space-y-2">
              <div className="px-3 py-1 text-xs text-muted-foreground font-semibold">
                Signed in as <span className="text-foreground">{user.name}</span>
              </div>
              <Link
                href="/create-event"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent"
              >
                <PlusCircle className="w-4 h-4 text-emerald-600" />
                Create Event
              </Link>
              <Link
                href="/manage-events"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent"
              >
                <FolderKanban className="w-4 h-4 text-amber-500" />
                Manage Events
              </Link>
              <Link
                href="/joined-events"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent"
              >
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                Joined Events
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent"
              >
                <User className="w-4 h-4 text-indigo-500" />
                Profile
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="border-t border-border pt-4 flex gap-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
