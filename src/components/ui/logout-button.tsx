"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);

    try {
      
      const accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");

      // Se tiver refresh_token, faz logout no backend
      if (refreshToken) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        }).catch((error) => {
          
          console.warn("Erro ao fazer logout no backend:", error);
        });
      }

      // Limpar tokens do localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      console.log("✅ Logout realizado com sucesso");

      
      router.push("/login");
    } catch (error) {
      console.error("❌ Erro no logout:", error);
      
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoading}
      variant="ghost"
      className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saindo...
        </>
      ) : (
        <>
          <LogOut className="mr-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}

