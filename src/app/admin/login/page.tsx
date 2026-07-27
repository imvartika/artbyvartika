"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"loading" | "login" | "set-password">("loading");
  const [email, setEmail] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // resend cooldown ticker
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  useEffect(() => {
    const supabase = createClient();

    async function init() {
      // Recovery/invite/magic-link emails redirect back with the session tokens
      // in the URL hash (#access_token=…&refresh_token=…). The browser client
      // doesn't auto-consume these, so establish the session explicitly.
      const hash = window.location.hash;
      if (hash.includes("access_token")) {
        const p = new URLSearchParams(hash.slice(1));
        const access_token = p.get("access_token");
        const refresh_token = p.get("refresh_token");
        if (access_token && refresh_token) {
          const { data: sessionData, error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
          // strip the tokens out of the address bar
          window.history.replaceState(null, "", window.location.pathname);
          if (!error) {
            setRecoveryEmail(sessionData.user?.email ?? "");
            setMode("set-password");
            return;
          }
        }
      }

      const { data } = await supabase.auth.getSession();
      setRecoveryEmail(data.session?.user?.email ?? "");
      setMode(data.session ? "set-password" : "login");
    }
    init();

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setRecoveryEmail(session?.user?.email ?? "");
        setMode("set-password");
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      toast.error(error.message || "Sign in failed. Please check your credentials.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  async function handleForgotPassword() {
    if (!email) {
      toast.error("Enter your email first, then tap “Forgot password?”");
      return;
    }
    setLoading(true);
    setCooldown(60); // start the countdown immediately so the button can't be spammed
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/login`,
    });
    setLoading(false);

    if (error) {
      // if the server reports a specific wait, sync our timer to it
      const wait = Number(error.message?.match(/after (\d+) seconds/)?.[1]);
      if (wait) setCooldown(wait);
      const msg = error.message || "Failed to send reset email. Check your Supabase SMTP configuration.";
      toast.error(msg);
      return;
    }
    toast.success("Check your email for a reset link.");
  }

  async function handleSetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Use at least 8 characters");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast.error(error.message || "Failed to update password. Please try again.");
      return;
    }
    toast.success("Password set!");
    router.push("/admin");
    router.refresh();
  }

  if (mode === "loading") return null;

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-paper-50 px-6">
      <form
        onSubmit={mode === "set-password" ? handleSetPassword : handleSignIn}
        className="w-full max-w-sm rounded-2xl border border-clay-200 bg-white p-8 shadow-sm"
      >
        <h1 className="font-display text-2xl italic text-clay-700">Studio login</h1>
        <p className="mt-1 text-sm text-clay-800/60">
          {mode === "set-password" ? "Pick a password to finish setting up." : "For Vartika only."}
        </p>

        {mode === "login" && (
          <label className="mt-6 block text-sm text-clay-800">
            Email
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-clay-200 px-3 py-2 outline-none focus:border-clay-500"
            />
          </label>
        )}

        {mode === "set-password" && (
          <label className="mt-6 block text-sm text-clay-800">
            Email
            {/* read-only: this account was chosen by whoever the reset link was
                sent to, not something to change here. Also lets the browser's
                password manager associate the new password with this email. */}
            <input
              type="email"
              readOnly
              tabIndex={-1}
              autoComplete="username"
              value={recoveryEmail}
              className="mt-1 w-full cursor-not-allowed rounded-lg border border-clay-200 bg-paper-100 px-3 py-2 text-clay-800/70 outline-none"
            />
          </label>
        )}

        <label className="mt-4 block text-sm text-clay-800">
          Password
          <input
            type="password"
            required
            minLength={8}
            autoComplete={mode === "set-password" ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-clay-200 px-3 py-2 outline-none focus:border-clay-500"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-clay-600 py-2.5 text-white transition-colors hover:bg-clay-700 disabled:opacity-60"
        >
          {loading ? "One sec…" : mode === "set-password" ? "Set password & continue" : "Sign in"}
        </button>

        {mode === "login" && (
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={loading || cooldown > 0}
            className="mt-3 w-full text-center text-xs text-clay-800/60 hover:text-clay-600 disabled:opacity-60"
          >
            {cooldown > 0
              ? `Resend a reset link in ${cooldown}s`
              : "Forgot password? Email me a reset link"}
          </button>
        )}
      </form>
    </div>
  );
}
