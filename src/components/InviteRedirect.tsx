"use client";

import { useEffect } from "react";

export default function InviteRedirect() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash.includes("invite_token=")) {
      const hash = window.location.hash;
      window.location.href = `/admin/${hash}`;
    }
  }, []);

  return null;
}
