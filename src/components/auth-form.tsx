"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (!error) setSent(true);
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  if (sent) {
    return (
      <div className="text-center space-y-4">
        <p className="text-foreground">Check your email for the magic link.</p>
        <p className="text-muted text-sm">It may take a moment to arrive.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleMagicLink} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent hover:bg-accent-dim disabled:opacity-50 transition-colors text-white font-medium py-3 rounded-lg"
        >
          {loading ? "Sending..." : "Send Magic Link"}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-4 text-muted">or</span>
        </div>
      </div>

      <button
        onClick={handleGoogleLogin}
        className="w-full bg-surface hover:bg-surface-hover border border-white/10 transition-colors text-foreground font-medium py-3 rounded-lg"
      >
        Sign in with Google
      </button>
    </div>
  );
}
