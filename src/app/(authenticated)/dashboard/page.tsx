"use client";

import { useEffect, useState } from "react";
import { listTransactions, createTransaction } from "@/lib/api/transaction";
import type {
  SummaryResponse,
  Transaction,
  CategoryExpense,
} from "@/types/transaction";
import { CATEGORY_LABELS } from "@/types/transaction";
import { formatCurrency, formatDateShort } from "@/lib/utils/format";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  CircleDollarSign,
  MoreHorizontal,
  CreditCard,
  Camera,
  Eye,
  EyeOff,
} from "lucide-react";
import { TransactionForm } from "@/app/(authenticated)/transactions/components/TransactionForm";
import type { CreateTransactionData } from "@/lib/validator/transaction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );
  const [categoryExpenses, setCategoryExpenses] = useState<CategoryExpense[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBalance, setShowBalance] = useState(false); // Saldo oculto por padrão
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);

  // Estado para o mês/ano selecionado
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  ); // 1-12
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  // Gerar lista de meses para o select
  const months = [
    { value: 1, label: "Janeiro" },
    { value: 2, label: "Fevereiro" },
    { value: 3, label: "Março" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Maio" },
    { value: 6, label: "Junho" },
    { value: 7, label: "Julho" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Setembro" },
    { value: 10, label: "Outubro" },
    { value: 11, label: "Novembro" },
    { value: 12, label: "Dezembro" },
  ];

  // Função para retornar o ícone baseado no método de pagamento
  const getPaymentIcon = (paymentMethod: string) => {
    const iconClass = "w-5 h-5";

    // Mapeamento de métodos de pagamento para ícones
    const iconMap: Record<string, JSX.Element> = {
      PIX: <CircleDollarSign className={iconClass} />,
      BOLETO: <CreditCard className={iconClass} />,
      CARTAO: <CreditCard className={iconClass} />,
      TRANSFERENCIA: <TrendingUp className={iconClass} />,
      DINHEIRO: <Wallet className={iconClass} />,
    };

    return iconMap[paymentMethod] || <MoreHorizontal className={iconClass} />;
  };

  // Função para retornar a cor do ícone baseado no tipo (sem fundo)
  const getIconColor = (type: string) => {
    switch (type) {
      case "INCOME":
        return "text-green";
      case "EXPENSE":
        return "text-red";
      case "INVESTMENT":
        return "text-gray";
      default:
        return "text-gray";
    }
  };

  // Recarregar dados quando o mês mudar
  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, selectedYear]);

  // Função para filtrar transações por mês/ano
  const filterTransactionsByMonth = (transactions: Transaction[]) => {
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() + 1 === selectedMonth &&
        transactionDate.getFullYear() === selectedYear
      );
    });
  };

  // Função para calcular o resumo baseado nas transações filtradas
  const calculateSummaryFromTransactions = (transactions: Transaction[]) => {
    const totalIncome = transactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalInvestment = transactions
      .filter((t) => t.type === "INVESTMENT")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      balance: totalIncome - totalExpense - totalInvestment,
      totalIncome,
      totalExpense,
      totalInvestment,
    };
  };

  // Função para calcular gastos por categoria
  const calculateExpensesByCategory = (transactions: Transaction[]) => {
    const expenses = transactions.filter((t) => t.type === "EXPENSE");
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

    const categoryMap = new Map<string, { amount: number; count: number }>();

    expenses.forEach((transaction) => {
      if (transaction.category) {
        const existing = categoryMap.get(transaction.category) || {
          amount: 0,
          count: 0,
        };
        categoryMap.set(transaction.category, {
          amount: existing.amount + transaction.amount,
          count: existing.count + 1,
        });
      }
    });

    return Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        amount: data.amount,
        percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0,
        count: data.count,
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  async function loadDashboardData() {
    try {
      setIsLoading(true);
      setError(null);

      // Carregar todas as transações
      const transactionsData = await listTransactions();

      // Filtrar transações pelo mês/ano selecionado
      const filteredTransactions = filterTransactionsByMonth(
        transactionsData.transactions
      );

      // Calcular resumo baseado nas transações filtradas
      const calculatedSummary =
        calculateSummaryFromTransactions(filteredTransactions);
      setSummary(calculatedSummary);

      // Obter as 5 transações mais recentes do mês
      const sortedTransactions = [...filteredTransactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setRecentTransactions(sortedTransactions.slice(0, 5));

      // Calcular gastos por categoria
      const expenses = calculateExpensesByCategory(filteredTransactions);
      setCategoryExpenses(expenses);
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Erro ao carregar dados do dashboard"
      );
    } finally {
      setIsLoading(false);
    }
  }

  // Função para criar nova transação
  async function handleCreateTransaction(data: CreateTransactionData) {
    await createTransaction(data);
  }

  // Função para formatar saldo com opção de ocultar
  const formatBalanceDisplay = (value: number) => {
    if (!showBalance) {
      return "R$ •••••";
    }
    return formatCurrency(value);
  };

  // Função para alternar visibilidade do saldo
  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray mt-2">Visão geral das suas finanças</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray mt-2">Visão geral das suas finanças</p>
        </div>
        <div className="bg-red/10 border border-red rounded-lg p-4">
          <p className="text-red">{error}</p>
          <button
            onClick={loadDashboardData}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray dark:text-white">
          Dashboard
        </h1>
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="flex items-center gap-2 px-3 sm:px-4 py-2 cursor-pointer text-sm text-gray dark:text-white hover:bg-gray-100 dark:hover:bg-dark-gray rounded-lg transition-colors">
            <span className="hidden sm:inline">Relatório IA</span>
            <span className="sm:hidden">IA</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </button>
          <select
            className="px-3 sm:px-4 py-2 text-sm bg-white dark:bg-background-01 text-gray dark:text-white border border-gray-200 dark:border-dark-gray rounded-lg cursor-pointer"
            value={`${selectedYear}-${selectedMonth}`}
            onChange={(e) => {
              const [year, month] = e.target.value.split("-");
              setSelectedYear(parseInt(year));
              setSelectedMonth(parseInt(month));
            }}
          >
            {months.map((month) => (
              <option
                key={`${selectedYear}-${month.value}`}
                value={`${selectedYear}-${month.value}`}
              >
                {month.label} {selectedYear}
              </option>
            ))}
            {months.map((month) => (
              <option
                key={`${selectedYear - 1}-${month.value}`}
                value={`${selectedYear - 1}-${month.value}`}
              >
                {month.label} {selectedYear - 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid principal: Esquerda (Saldo + Cards) | Direita (Transações) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Coluna esquerda - 3 colunas */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="w-5 h-5 text-gray" />
                  <h3 className="text-sm font-medium text-gray">Saldo</h3>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray dark:text-white">
                    {summary
                      ? formatBalanceDisplay(summary.balance)
                      : "R$ •••••"}
                  </p>
                  <button
                    onClick={toggleBalanceVisibility}
                    className="text-gray hover:text-gray dark:hover:text-white transition-colors flex-shrink-0"
                  >
                    {showBalance ? (
                      <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <EyeOff className="w-5 h-5 sm:w-6 sm:h-6" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <TransactionForm
                  onSuccess={loadDashboardData}
                  onSubmit={handleCreateTransaction}
                  externalOpen={isTransactionFormOpen}
                  onOpenChange={setIsTransactionFormOpen}
                />
              </div>
            </div>
          </Card>

          {/* Cards Receitas, Despesas e Investimentos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card Investimentos */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw className="w-4 h-4 text-gray" />
                  <h3 className="text-sm font-medium text-gray">Investido</h3>
                </div>
                <p className="text-2xl font-bold text-gray dark:text-white">
                  {summary
                    ? formatCurrency(summary.totalInvestment)
                    : "R$ 0,00"}
                </p>
              </CardContent>
            </Card>

            {/* Card Receitas */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-gray" />
                  <h3 className="text-sm font-medium text-gray">Receita</h3>
                </div>
                <p className="text-2xl font-bold text-green">
                  {summary ? formatCurrency(summary.totalIncome) : "R$ 0,00"}
                </p>
              </CardContent>
            </Card>

            {/* Card Despesas */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-4 h-4 text-gray" />
                  <h3 className="text-sm font-medium text-gray">Despesas</h3>
                </div>
                <p className="text-2xl font-bold text-red">
                  {summary ? formatCurrency(summary.totalExpense) : "R$ 0,00"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Grid com 2 colunas: Gráfico e Gastos por Categoria */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gráfico de Pizza - Ganhos/Gastos/Investimentos */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-48 h-48">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      {/* Círculo verde  */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="20"
                        strokeDasharray="150.8 251.2"
                        strokeDashoffset="0"
                      />
                      {/* Círculo vermelho  */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="20"
                        strokeDasharray="55.3 251.2"
                        strokeDashoffset="-150.8"
                      />
                      {/* Círculo cinza  */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#6b7280"
                        strokeWidth="20"
                        strokeDasharray="45.2 251.2"
                        strokeDashoffset="-206.1"
                      />
                    </svg>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green" />
                      <span className="text-sm text-gray">Ganhos</span>
                    </div>
                    <span className="text-sm font-medium text-gray dark:text-white">
                      {summary
                        ? Math.round(
                            (summary.totalIncome /
                              (summary.totalIncome +
                                summary.totalExpense +
                                summary.totalInvestment)) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-red" />
                      <span className="text-sm text-gray">Gastos</span>
                    </div>
                    <span className="text-sm font-medium text-gray dark:text-white">
                      {summary
                        ? Math.round(
                            (summary.totalExpense /
                              (summary.totalIncome +
                                summary.totalExpense +
                                summary.totalInvestment)) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-gray" />
                      <span className="text-sm text-gray">Investimentos</span>
                    </div>
                    <span className="text-sm font-medium text-gray dark:text-white">
                      {summary
                        ? Math.round(
                            (summary.totalInvestment /
                              (summary.totalIncome +
                                summary.totalExpense +
                                summary.totalInvestment)) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gastos por Categoria */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Gastos por categoria</CardTitle>
              </CardHeader>
              <CardContent>
                {categoryExpenses.length === 0 ? (
                  <p className="text-gray text-sm">
                    Nenhuma despesa encontrada
                  </p>
                ) : (
                  <div className="space-y-4">
                    {categoryExpenses.map((categoryExpense) => (
                      <div key={categoryExpense.category} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray dark:text-white">
                            {CATEGORY_LABELS[categoryExpense.category]}
                          </span>
                          <span className="text-sm font-medium text-gray dark:text-white">
                            {Math.round(categoryExpense.percentage)}%
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-gray-200 dark:bg-dark-gray rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gray-500 dark:bg-gray-400 rounded-full transition-all"
                              style={{
                                width: `${categoryExpense.percentage}%`,
                              }}
                            />
                          </div>
                        </div>
                        <p className="text-sm text-gray">
                          {formatCurrency(categoryExpense.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Transações Recentes - Coluna direita */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Transações</CardTitle>
                <button className="text-sm text-gray hover:text-gray-900 dark:hover:text-white transition-colors">
                  Ver mais
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {recentTransactions.length === 0 ? (
                <p className="text-gray text-sm">
                  Nenhuma transação encontrada
                </p>
              ) : (
                <div className="space-y-4 overflow-y-auto max-h-[600px]">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-dark-gray last:border-0 last:pb-0"
                    >
                      {/* Ícone do método de pagamento */}
                      <div className={getIconColor(transaction.type)}>
                        {getPaymentIcon(transaction.paymentMethod)}
                      </div>

                      {/* Descrição e data */}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {transaction.description}
                        </p>
                        <p className="text-sm text-gray">
                          {formatDateShort(transaction.date)}
                        </p>
                      </div>

                      {/* Valor */}
                      <p
                        className={`font-semibold ${
                          transaction.type === "INCOME"
                            ? "text-green"
                            : transaction.type === "EXPENSE"
                            ? "text-red"
                            : "text-blue-500"
                        }`}
                      >
                        {transaction.type === "EXPENSE" ? "-" : "+"}
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

