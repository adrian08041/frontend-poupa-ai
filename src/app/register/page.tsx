import { BarChart3, TrendingUp, Shield, Zap } from "lucide-react";
import type { Metadata } from "next";
import { RegisterForm } from "./register-form";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Criar Conta | Poupa.AI",
  description: "Crie sua conta na plataforma de gestão financeira Poupa.AI",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background-01 flex">
      {/* Lado Esquerdo - Formulário */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-8 overflow-y-auto">
        <div className="w-full max-w-[480px] space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo-pequena.png"
              alt="Poupa.AI"
              width={32}
              height={32}
            />
            <h1 className="text-3xl font-bold text-white">Poupa.AI</h1>
          </div>

          {/* Formulário de Registro */}
          <RegisterForm />
        </div>
      </div>

      {/* Lado Direito - Ilustração (Desktop) */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-background-01 from-[#0B0B0D] to-[#1a1a1d] relative overflow-hidden">
        <div className="relative w-full max-w-xl px-12">
          {/* Conteúdo Principal */}
          <div className="space-y-12">
            {/* Título */}
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-white">
                Gerencie suas finanças com{" "}
                <span className="text-[#39BE00]">Inteligência</span>
              </h2>
              <p className="text-gray-400 text-lg">
                Junte-se a milhares de usuários que já transformaram sua vida
                financeira
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6">
              {[
                {
                  icon: TrendingUp,
                  title: "Insights com IA",
                  description:
                    "Análises inteligentes do seu comportamento financeiro",
                },
                {
                  icon: Shield,
                  title: "Segurança Total",
                  description:
                    "Seus dados protegidos com criptografia de ponta",
                },
                {
                  icon: Zap,
                  title: "Automação",
                  description: "Economize tempo com controle automático",
                },
                {
                  icon: BarChart3,
                  title: "Relatórios",
                  description:
                    "Visualize seu progresso com gráficos detalhados",
                },
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-[#39BE00]/10 to-transparent p-6 rounded-xl border border-[#39BE00]/20 
                               backdrop-blur-sm hover:border-[#39BE00]/40 transition-all duration-300 group"
                    style={{
                      animation: `fadeInUp ${0.5 + index * 0.1}s ease-out`,
                    }}
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 bg-[#39BE00]/20 rounded-lg flex items-center justify-center group-hover:bg-[#39BE00]/30 transition-colors">
                        <Icon className="w-6 h-6 text-[#39BE00]" />
                      </div>
                      <h3 className="text-white font-semibold text-lg">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-800">
              {[
                { value: "10K+", label: "Usuários Ativos" },
                { value: "R$ 5M+", label: "Economizados" },
                { value: "4.9", label: "Avaliação" },
              ].map((stat, index) => (
                <div key={index} className="text-center space-y-1">
                  <p className="text-3xl font-bold text-[#39BE00]">
                    {stat.value}
                  </p>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Partículas decorativas */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-[#39BE00] rounded-full opacity-20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${
                    3 + Math.random() * 2
                  }s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>

          {/* Círculos decorativos */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-[#39BE00]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-40 h-40 bg-[#39BE00]/5 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
}

