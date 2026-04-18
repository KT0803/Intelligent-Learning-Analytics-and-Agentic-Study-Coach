"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, clearStoredSession, getStoredSessionToken, getStoredUser } from "@/src/lib/api";
import { ProjectLogo } from "@/src/components/ProjectLogo";

function FeatureCard({
  title,
  body,
  badge,
  tone
}: {
  title: string;
  body: string;
  badge: string;
  tone: "yellow" | "blue" | "rose";
}) {
  return (
    <article className={`sketch-card ${tone}`}>
      <div className="card-badge">{badge}</div>
      <h3>{title}</h3>
      <p>{body}</p>
    </article>
  );
}

export default function HomePage() {
  // null = not yet determined (SSR / first render), string = logged-in name, false = logged out
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedUser = getStoredUser();
    const token = getStoredSessionToken();

    if (token && storedUser) {
      setUser(storedUser);
      // Silently validate the token is still alive; if expired/invalid, clear it
      api<{ user: { name: string; email: string } }>("/api/auth/me").catch(() => {
        clearStoredSession();
        setUser(null);
      });
    }

    setHydrated(true);
  }, []);

  