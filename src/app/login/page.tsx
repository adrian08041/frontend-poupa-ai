"use client";

import { LoginForm } from "./login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background-01 flex">
      {/* Lado Esquerdo - Formulário */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-8">
        <div className="w-full max-w-[480px] space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image src="/logo-pequena.png" alt="Logo" width={32} height={32} />
            <h1 className="text-3xl font-bold text-white">Poupa.AI</h1>
          </div>

          {/* Formulário de Login */}
          <LoginForm />
        </div>
      </div>

      {/* Lado Direito  */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-background-01 from-[#0B0B0D] to-[#1a1a1d] relative overflow-hidden">
        <Image
          src="/logo-grande.png"
          alt="Logo Grande"
          width={512}
          height={512}
        />
      </div>
    </div>
  );
}

