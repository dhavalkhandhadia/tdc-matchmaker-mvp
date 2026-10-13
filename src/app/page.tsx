"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/storage";
import Loading from './loading';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (session) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return <Loading />;
}
