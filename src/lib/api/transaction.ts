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
import { ReportResponse } from "@/types/report";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Credenciais inválidas. Faça o login novamente");
  }

  if (response.status === 403) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message ||
      "Esta transação foi gerada automaticamente a partir de uma transação fixa e não pode ser editada. Edite a transação fixa original."
    );
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || `Erro na requisição: ${response.status}`
    );
  }

  if (response.status === 204 || options.method === "DELETE") {
    return { success: true };
  }

  return response.json();
}

export async function listTransactions(): Promise<ListTransactionsResponse> {
  return fetchWithAuth(`${API_BASE_URL}/transactions`);
}

export async function createTransaction(
  data: CreateTransactionData
): Promise<Transaction> {
  const payload = {
    ...data,
    amount: data.amount,
  };

  return fetchWithAuth(`${API_BASE_URL}/transactions`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateTransaction(
  id: string,
  data: UpdateTransactionData
): Promise<Transaction> {
  const payload = {
    ...data,
    amount: data.amount,
  };

  return fetchWithAuth(`${API_BASE_URL}/transactions/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteTransaction(
  id: string
): Promise<{ success: boolean }> {
  return fetchWithAuth(`${API_BASE_URL}/transactions/${id}`, {
    method: "DELETE",
  });
}

export async function getSummary(): Promise<SummaryResponse> {
  return fetchWithAuth(`${API_BASE_URL}/transactions/summary`);
}

export async function getExpensesByCategory(): Promise<ExpensesByCategoryResponse> {
  return fetchWithAuth(`${API_BASE_URL}/transactions/by-category`);
}

export interface ExtractedTransactionData {
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE' | 'INVESTMENT';
  category?: string;
  date?: string;
  confidence: number;
}

export async function extractTransactionFromImage(
  imageFile: File
): Promise<ExtractedTransactionData> {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(`${API_BASE_URL}/transactions/extract-from-image`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Credenciais inválidas. Faça o login novamente");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || `Erro ao extrair dados da imagem: ${response.status}`
    );
  }

  return response.json();
}

export async function generateReport(params: {
  month: number;
  year: number;
  includeComparison?: boolean;
}): Promise<ReportResponse> {
  const queryParams = new URLSearchParams({
    month: params.month.toString(),
    year: params.year.toString(),
    includeComparison: (params.includeComparison ?? true).toString(),
  });

  return fetchWithAuth(
    `${API_BASE_URL}/transactions/report?${queryParams}`,
    { method: "GET" }
  );
}
