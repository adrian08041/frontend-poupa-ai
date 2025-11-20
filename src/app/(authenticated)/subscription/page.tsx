import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SubscriptionPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Assinatura</h1>
        <p className="text-gray mt-2">
          Escolha o plano ideal para você
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Plano Gratuito */}
        <div className="bg-white dark:bg-background-02 rounded-lg shadow-lg dark:shadow-none p-8 border-2 border-gray-200 dark:border-dark-gray">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gratuito</h2>
          <p className="text-gray mt-2 mb-6">
            Para quem está começando
          </p>

          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">R$ 0</span>
            <span className="text-gray">/mês</span>
          </div>

          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green mt-0.5" />
              <span className="text-gray-900 dark:text-light-gray">Até 50 transações/mês</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green mt-0.5" />
              <span className="text-gray-900 dark:text-light-gray">Relatórios básicos</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green mt-0.5" />
              <span className="text-gray-900 dark:text-light-gray">Categorização automática</span>
            </li>
          </ul>

          <Button
            variant="outline"
            className="w-full h-12 border-gray dark:border-dark-gray"
            disabled
          >
            Plano Atual
          </Button>
        </div>

        {/* Plano Premium */}
        <div className="bg-white dark:bg-background-02 rounded-lg shadow-lg dark:shadow-none p-8 border-2 border-green">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Premium</h2>
            <span className="bg-green text-white text-xs font-semibold px-3 py-1 rounded-full">
              Popular
            </span>
          </div>
          <p className="text-gray mt-2 mb-6">
            Para controle financeiro completo
          </p>

          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">R$ 9,90</span>
            <span className="text-gray">/mês</span>
          </div>

          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green mt-0.5" />
              <span className="text-gray-900 dark:text-light-gray">Transações ilimitadas</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green mt-0.5" />
              <span className="text-gray-900 dark:text-light-gray">Relatórios avançados</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green mt-0.5" />
              <span className="text-gray-900 dark:text-light-gray">Exportação de dados</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green mt-0.5" />
              <span className="text-gray-900 dark:text-light-gray">Metas financeiras</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green mt-0.5" />
              <span className="text-gray-900 dark:text-light-gray">Suporte prioritário</span>
            </li>
          </ul>

          <Button className="w-full h-12 bg-green hover:bg-green/90 text-white cursor-pointer">
            Assinar Agora
          </Button>
        </div>
      </div>
    </div>
  );
}
