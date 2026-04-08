"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
          { credentials: "include" }
        );

        if (!response.ok) {
          router.push("/login");
        }
      } catch {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);
}
