"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/logout`, {
        method: "POST",
        credentials: "include",
      });

      toast.info("Logout realizado com sucesso", {
        description: "Até logo!"
      });

      router.push("/login");
    } catch {
      toast.warning("Erro ao fazer logout no servidor", {
        description: "Você será desconectado localmente"
      });
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

