"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
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

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);

    try {
      
      console.log("Login data:", data);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Login bem-sucedido!");

      // Redirecionamento para a página inicial
      router.push("/"); // '/' é a home
    } catch (error) {
      console.error("Erro no login:", error);
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
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-400">
                    E-mail
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Digite seu e-mail"
                      disabled={isLoading}
                      className="h-14 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
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
                        className="h-14 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 pr-12"
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
              {isLoading ? "Entrando..." : "Entrar"}
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

          <p className="text-base text-gray-400 ">
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

