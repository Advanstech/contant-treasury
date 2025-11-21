"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";

export default function ChangePasswordPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Change Password</h1>
            <p className="text-sm text-muted-foreground">Update your account password</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Current Password</label>
              <input type="password" className="mt-1 w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter current password" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">New Password</label>
              <input type="password" className="mt-1 w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter new password" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Confirm New Password</label>
              <input type="password" className="mt-1 w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Re-enter new password" />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button disabled className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground disabled:opacity-60">Save Changes</button>
            <Link href="/settings" className="px-5 py-2.5 rounded-lg border border-border hover:bg-accent">Back to Settings</Link>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">Note: Backend endpoint not wired yet. This is a navigable placeholder page.</p>
        </div>
      </div>
    </div>
  );
}
