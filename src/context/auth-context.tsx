"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  createdAt?: Date;
}

interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  refetchSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchSession = async () => {
    try {
      setIsLoading(true);
      const session = await authClient.getSession();
      if (session?.data?.user) {
        setUser(session.data.user as UserSession);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const logout = async () => {
    try {
      await authClient.signOut();
      setUser(null);
      toast.success("Signed out successfully");
      router.push("/login");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to sign out");
    }
  };

  const signInWithGoogle = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: window.location.origin,
      });
    } catch (err: any) {
      toast.error(err.message || "Google sign-in failed");
    }
  };

  const signInWithGithub = async () => {
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: window.location.origin,
      });
    } catch (err: any) {
      toast.error(err.message || "GitHub sign-in failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        logout,
        signInWithGoogle,
        signInWithGithub,
        refetchSession: fetchSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
