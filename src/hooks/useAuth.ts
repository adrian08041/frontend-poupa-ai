"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        console.warn("⚠️ Token não encontrado, redirecionando para login...");
        router.push("/login");
        return false;
      }

      // Verifica se o token está expirado (se tiver formato JWT)
      try {
        const tokenParts = token.split(".");
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const expirationTime = payload.exp * 1000; // Convertendo para milissegundos

          if (Date.now() >= expirationTime) {
            console.warn("⚠️ Token expirado, redirecionando para login...");
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            router.push("/login");
            return false;
          }
        }
      } catch (error) {
        console.error("Erro ao verificar token:", error);
      }

      return true;
    };

    // Verifica imediatamente ao montar
    checkAuth();

    // Verifica a cada 1 minuto se o token ainda é válido
    const interval = setInterval(checkAuth, 60000);

    return () => clearInterval(interval);
  }, [router]);
}
