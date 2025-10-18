"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Transaction } from "@/types/transaction";
import { CreateTransactionData } from "@/lib/validator/transaction";

import { TransactionTable } from "./components/transaction-table";
import { Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TransactionForm } from "./components/TransactionForm";
import {
  createTransaction,
  deleteTransaction,
  listTransactions,
  updateTransaction,
} from "@/lib/api/transaction";

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar autenticação
  useEffect(() => {
    // Verifica se tem token no localStorage
    const token =
      typeof window !== "undefined" && localStorage.getItem("access_token");

    if (!token) {
      console.warn("⚠️ Usuário não autenticado, redirecionando para login...");
      router.push("/login");
      return;
    }

    loadTransactions();
  }, [router]);

  async function loadTransactions() {
    try {
      setIsLoading(true);
      setError(null);
      const response = await listTransactions();
      setTransactions(response.transactions);
    } catch (error: any) {
      console.error("Erro ao carregar transações:", error);
      setError(error.message || "Erro ao carregar transações");

      // Se erro de autenticação, redireciona para login
      if (
        error.message?.includes("autenticado") ||
        error.message?.includes("401")
      ) {
        router.push("/login");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRefresh() {
    try {
      setIsRefreshing(true);
      setError(null);
      await loadTransactions();
    } finally {
      setIsRefreshing(false);
    }
  }

  async function handleCreate(data: CreateTransactionData) {
    await createTransaction(data);
    console.log("✅ Transação criada com sucesso");
  }

  async function handleUpdate(id: string, data: CreateTransactionData) {
    await updateTransaction(id, data);
    console.log("✅ Transação atualizada com sucesso");
  }

  async function handleDelete(id: string) {
    await deleteTransaction(id);
    console.log("✅ Transação excluída com sucesso");
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-green mx-auto" />
          <p className="text-gray dark:text-light-gray">Carregando transações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Transações</h1>
          <p className="text-gray">
            Gerencie suas entradas, saídas e investimentos
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="border-gray-200 dark:border-dark-gray hover:bg-gray-50 dark:hover:bg-dark-gray"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Atualizar
          </Button>

          <TransactionForm
            onSuccess={loadTransactions}
            onSubmit={handleCreate}
          />
        </div>
      </div>

      {/* Erro */}
      {error && (
        <Alert className="mb-6 border-red bg-red/10">
          <AlertCircle className="h-4 w-4 text-red" />
          <AlertTitle className="text-red">Erro</AlertTitle>
          <AlertDescription className="text-red">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Tabela de Transações */}
      <TransactionTable
        transactions={transactions}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onRefresh={loadTransactions}
      />

      {/* Contador de transações */}
      {transactions.length > 0 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray">
            Total de {transactions.length}{" "}
            {transactions.length === 1 ? "transação" : "transações"}
          </p>
        </div>
      )}
    </div>
  );
}

