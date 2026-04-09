// components/NewsletterForm.tsx
// ──────────────────────────────────────────────────────────────
// Client component: handles newsletter subscription form state.
// Keeps app/page.tsx a pure Server Component.
// ──────────────────────────────────────────────────────────────
"use client";

import { useState, useRef, type FormEvent } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = inputRef.current?.value?.trim();

    if (!email) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      // Replace with your real API endpoint (Mailchimp, ConvertKit, etc.)
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message ?? "Subscription failed. Try again.");
      }

      setStatus("success");
      if (inputRef.current) inputRef.current.value = "";
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message ?? "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="max-w-md mx-auto bg-green-500/20 border border-green-400/30 rounded-xl py-4 px-6 text-green-300 font-semibold text-sm"
      >
        ✓ You're subscribed! Welcome to Kebbi Daily News.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="max-w-md mx-auto"
      aria-label="Newsletter subscription"
    >
      <div className="flex flex-col sm:flex-row gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          ref={inputRef}
          id="newsletter-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="your@email.com"
          disabled={status === "loading"}
          className="flex-1 px-4 py-3 rounded-lg text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-60 text-sm"
          aria-label="Your email address"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-yellow-400 text-gray-950 font-black px-6 py-3 rounded-lg hover:bg-yellow-300 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm whitespace-nowrap"
          aria-label="Subscribe to newsletter"
        >
          {status === "loading" ? "Subscribing…" : "Subscribe Free"}
        </button>
      </div>

      {status === "error" && (
        <p
          role="alert"
          aria-live="assertive"
          className="mt-2 text-red-400 text-xs text-left"
        >
          {errorMsg}
        </p>
      )}
    </form>
  );
}