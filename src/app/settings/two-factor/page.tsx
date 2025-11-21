"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

export default function TwoFactorPage() {
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
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Two-Factor Authentication</h1>
            <p className="text-sm text-muted-foreground">Add extra security to your account</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-5">
          <div>
            <p className="text-sm text-muted-foreground">
              Two-Factor Authentication (2FA) requires a one-time code in addition to your password when signing in.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm font-medium">Authenticator App</p>
              <p className="text-xs text-muted-foreground mt-1">Use Google Authenticator, Authy, or 1Password.</p>
              <button disabled className="mt-3 px-4 py-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-60">Set Up (coming soon)</button>
            </div>

            <div className="rounded-lg border border-border p-4">
              <p className="text-sm font-medium">Backup Codes</p>
              <p className="text-xs text-muted-foreground mt-1">Use one-time backup codes if you lose access to your device.</p>
              <button disabled className="mt-3 px-4 py-2 rounded-lg border border-border disabled:opacity-60">Generate (coming soon)</button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/settings" className="px-5 py-2.5 rounded-lg border border-border hover:bg-accent">Back to Settings</Link>
          </div>

          <p className="mt-2 text-xs text-muted-foreground">Note: UI and routing provided. Hook up backend when ready.</p>
        </div>
      </div>
    </div>
  );
}
