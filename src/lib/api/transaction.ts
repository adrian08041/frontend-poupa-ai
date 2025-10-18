import {
  Transaction,
  ListTransactionsResponse,
  SummaryResponse,
  ExpensesByCategoryResponse,
} from "@/types/transaction";
import {
  CreateTransactionData,
  UpdateTransactionData,
} from "@/lib/validator/transaction";
import { reaisToCents } from "@/lib/utils/format";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * Helper para obter o token de autenticação do localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("access_token");

  if (!token) {
    console.warn("⚠️ Token não encontrado no localStorage");
  }

  return token;
}

/**
 * Helper para fazer requisições autenticadas
 */
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getAuthToken();

  if (!token) {
    // Redireciona para login se não tiver token
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Usuário não autenticado");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  // Se token inválido ou expirado (401), redireciona para login
  if (response.status === 401) {
    console.error("❌ Token inválido ou expirado");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }

    throw new Error("Credenciais inválidas. Faça o login novamente");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || `Erro na requisição: ${response.status}`
    );
  }

  // Se for DELETE sem conteúdo
  if (response.status === 204 || options.method === "DELETE") {
    return { success: true };
  }

  return response.json();
}

/**
 * Listar todas as transações do usuário
 */
export async function listTransactions(): Promise<ListTransactionsResponse> {
  return fetchWithAuth(`${API_BASE_URL}/transactions`);
}

/**
 * Criar nova transação
 */
export async function createTransaction(
  data: CreateTransactionData
): Promise<Transaction> {
  // Converte o valor de reais para centavos antes de enviar
  const payload = {
    ...data,
    amount: data.amount, // Backend espera em reais (45.50), não em centavos
  };

  return fetchWithAuth(`${API_BASE_URL}/transactions`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Atualizar transação existente
 */
export async function updateTransaction(
  id: string,
  data: UpdateTransactionData
): Promise<Transaction> {
  const payload = {
    ...data,
    amount: data.amount, // Backend espera em reais
  };

  return fetchWithAuth(`${API_BASE_URL}/transactions/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/**
 * Deletar transação
 */
export async function deleteTransaction(
  id: string
): Promise<{ success: boolean }> {
  return fetchWithAuth(`${API_BASE_URL}/transactions/${id}`, {
    method: "DELETE",
  });
}

/**
 * Obter resumo financeiro (dashboard)
 */
export async function getSummary(): Promise<SummaryResponse> {
  return fetchWithAuth(`${API_BASE_URL}/transactions/summary`);
}

/**
 * Obter gastos agrupados por categoria
 */
export async function getExpensesByCategory(): Promise<ExpensesByCategoryResponse> {
  return fetchWithAuth(`${API_BASE_URL}/transactions/by-category`);
}

