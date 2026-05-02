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
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Subscription failed");
      }

      setStatus("success");

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      // Optional: auto reset after a few seconds
      setTimeout(() => {
        setStatus("idle");
      }, 4000);
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message || "Something went wrong. Try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full"
      aria-label="Newsletter subscription"
    >
      <div className="flex flex-col gap-2">
        {/* Email Input */}
        <input
          ref={inputRef}
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="Your email address"
          disabled={status === "loading"}
          className="w-full px-3 py-2 text-xs sm:text-sm bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-[#CC0000] disabled:opacity-60"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-[#CC0000] text-white font-bold text-[11px] sm:text-xs py-2 rounded hover:bg-[#A30000] transition-colors uppercase tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Subscribing..." : "Subscribe Now"}
        </button>
      </div>

      {/* Error Message */}
      {status === "error" && (
        <p className="mt-2 text-red-400 text-[10px]">
          {errorMsg}
        </p>
      )}

      {/* Success Message */}
      {status === "success" && (
        <p className="mt-2 text-green-400 text-[10px]">
          ✓ You’re subscribed! Welcome to Kebbi Daily News.
        </p>
      )}
    </form>
  );
}