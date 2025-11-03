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

  // Se tentar editar transação gerada automaticamente (403)
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

/**
 * Interface para dados extraídos de imagem
 */
export interface ExtractedTransactionData {
  description: string;
  amount: number; // Em reais
  type: 'INCOME' | 'EXPENSE' | 'INVESTMENT';
  category?: string;
  date?: string; // Formato: YYYY-MM-DD
  confidence: number; // 0-100
}

/**
 * Extrair transação a partir de imagem
 */
export async function extractTransactionFromImage(
  imageFile: File
): Promise<ExtractedTransactionData> {
  const token = getAuthToken();

  if (!token) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Usuário não autenticado");
  }

  // Cria FormData para enviar o arquivo
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(`${API_BASE_URL}/transactions/extract-from-image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // NÃO incluir Content-Type, o browser define automaticamente para multipart/form-data
    },
    body: formData,
  });

  // Tratamento de erros
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
      errorData?.message || `Erro ao extrair dados da imagem: ${response.status}`
    );
  }

  return response.json();
}

/**
 * Gera relatório mensal com insights de IA
 */
export async function generateReport(params: {
  month: number;
  year: number;
  includeComparison?: boolean;
}): Promise<ReportResponse> {
  const token = getAuthToken();

  if (!token) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Usuário não autenticado");
  }

  const queryParams = new URLSearchParams({
    month: params.month.toString(),
    year: params.year.toString(),
    includeComparison: (params.includeComparison ?? true).toString(),
  });

  const response = await fetch(
    `${API_BASE_URL}/transactions/report?${queryParams}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
    throw new Error("Credenciais inválidas. Faça o login novamente");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || `Erro ao gerar relatório: ${response.status}`
    );
  }

  return response.json();
}
