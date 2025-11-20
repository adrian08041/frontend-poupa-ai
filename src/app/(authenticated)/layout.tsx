"use client";

import { Header } from "@/components/layout/Header";
import { useAuth } from "@/hooks/useAuth";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";

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
      <WhatsAppButton phoneNumber="553496688345" message="Olá, preciso de ajuda!"></WhatsAppButton>
    </div>
  );
}

