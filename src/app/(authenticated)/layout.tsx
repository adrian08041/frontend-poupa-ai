"use client";

import { Header } from "@/components/layout/Header";
import { useAuth } from "@/hooks/useAuth";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verifica autenticação
  useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background-01">
      <Header />
      <main>{children}</main>
    </div>
  );
}

