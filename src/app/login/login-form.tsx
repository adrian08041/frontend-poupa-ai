"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { loginSchema, type LoginFormData } from "@/lib/validator/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);
    setError(null);

    try {
      console.log("📤 Enviando login para o backend:", data.email);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      let result = null;
      try {
        result = await response.json();
      } catch {
        console.warn("⚠️ Resposta não era JSON. Usando texto.");
      }

      if (!response.ok) {
        const message =
          result?.message ||
          result?.error ||
          (typeof result === "string" ? result : null) ||
          "Credenciais inválidas.";
        throw new Error(message);
      }

      console.log("✅ Login bem-sucedido:", result);

      const accessToken = result?.accessToken || result?.authToken;
      const refreshToken = result?.refreshToken;

      if (accessToken) {
        localStorage.setItem("access_token", accessToken);
        console.log("🔑 Access token salvo no localStorage");
      }
      if (refreshToken) {
        localStorage.setItem("refresh_token", refreshToken);
        console.log("🔄 Refresh token salvo no localStorage");
      }

      router.push("/transactions");
    } catch (err) {
      console.error("❌ Erro no login:", err);
      const message =
        err instanceof Error ? err.message : "Erro inesperado ao fazer login. Tente novamente.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-white">Bem-vindo</h1>
        <p className="text-base text-gray-400 leading-relaxed">
          A Poupa.AI é uma plataforma de gestão financeira que utiliza IA para
          monitorar suas movimentações, e oferecer insights personalizados,
          facilitando o controle do seu orçamento.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-medium text-[#39BE00]">
          Faça o seu login
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Mensagem de erro */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray">E-mail</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Digite seu e-mail"
                      disabled={isLoading}
                      autoComplete="email"
                      className="h-14 bg-white border-gray text-gray placeholder:text-gray"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-400">Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Digite sua senha"
                        disabled={isLoading}
                        autoComplete="current-password"
                        className="h-14 bg-white border-gray text-gray placeholder:text-gray pr-12"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-[#39BE00] hover:bg-[#2da000] text-white text-base font-medium rounded transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </Form>

        <div className="space-y-4">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-[#39BE00] hover:underline inline-block"
          >
            Esqueceu sua senha?
          </Link>

          <p className="text-base text-gray-400">
            Não tem cadastro?{" "}
            <Link
              href="/register"
              className="font-medium text-[#39BE00] hover:underline"
            >
              Cadastre-se aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

