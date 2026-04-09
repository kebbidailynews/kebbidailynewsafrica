// app/api/newsletter/subscribe/route.ts
// ──────────────────────────────────────────────────────────────
// POST /api/newsletter/subscribe
// Validates email and forwards to your ESP (Mailchimp example).
// Replace MAILCHIMP_* env vars with your actual provider.
// ──────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";

// ── Simple RFC-5322-ish email regex ──────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body.email !== "string") {
      return NextResponse.json(
        { message: "Invalid request body." },
        { status: 400 }
      );
    }

    const email = body.email.trim().toLowerCase();

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
        { status: 422 }
      );
    }

    // ── Mailchimp integration (swap for ConvertKit / Brevo / etc.) ──
    const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
    const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;
    const MAILCHIMP_DC = process.env.MAILCHIMP_DC; // e.g. "us21"

    if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID || !MAILCHIMP_DC) {
      // In development, succeed silently so the UI can be tested
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[newsletter] Mailchimp env vars not set — skipping real subscribe in dev."
        );
        return NextResponse.json({ success: true }, { status: 200 });
      }
      return NextResponse.json(
        { message: "Newsletter service is not configured." },
        { status: 503 }
      );
    }

    const mcRes = await fetch(
      `https://${MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${MAILCHIMP_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: email,
          status: "pending", // double opt-in — change to "subscribed" to skip
          tags: ["website-signup"],
        }),
      }
    );

    if (!mcRes.ok) {
      const mcData = await mcRes.json().catch(() => ({}));

      // "Member Exists" is not a real error — treat as success
      if (mcData?.title === "Member Exists") {
        return NextResponse.json({ success: true }, { status: 200 });
      }

      console.error("[newsletter] Mailchimp error:", mcData);
      return NextResponse.json(
        { message: "Could not subscribe. Please try again later." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[newsletter] Unexpected error:", err);
    return NextResponse.json(
      { message: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}

// Disable this route for all other methods
export function GET() {
  return NextResponse.json({ message: "Method not allowed." }, { status: 405 });
}