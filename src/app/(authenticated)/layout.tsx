// src/app/(authenticated)/layout.tsx
"use client";

import { Header } from "@/components/layout/Header";
import { useAuth } from "@/hooks/useAuth";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { usePathname } from "next/navigation"; // <-- NOVO IMPORT

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verifica autenticação
  useAuth();
  
  const pathname = usePathname(); // <-- PEGA A ROTA ATUAL
  
  // Condição: Se a rota for /whatsapp-ai, não mostra o botão flutuante.
  const showFloatingButton = pathname !== "/whatsapp-ai";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background-01">
      <Header />
      <main>{children}</main>
      
      {/* RENDERIZAÇÃO CONDICIONAL */}
      {showFloatingButton && (
        <WhatsAppButton 
          phoneNumber="553496688345" 
          message="Olá, preciso de ajuda com o PoupaAI!"
        />
      )}
      
    </div>
  );
}