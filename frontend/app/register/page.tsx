"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api, getStoredSessionToken, setStoredSession } from "@/src/lib/api";
import { ProjectLogo } from "@/src/components/ProjectLogo";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // If already logged in, skip registration
  useEffect(() => {
    if (getStoredSessionToken()) {
      router.replace("/research");
    }
  }, [router]);