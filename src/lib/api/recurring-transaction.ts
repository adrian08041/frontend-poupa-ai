import {
  RecurringTransaction,
  ListRecurringTransactionsResponse,
  CreateRecurringTransactionData,
} from '@/types/recurring-transaction';
import { reaisToCents } from '@/lib/utils/format';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Credenciais inválidas. Faça o login novamente');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || `Erro na requisição: ${response.status}`
    );
  }

  if (response.status === 204 || options.method === 'DELETE') {
    return { success: true };
  }

  return response.json();
}

export async function listRecurringTransactions(): Promise<ListRecurringTransactionsResponse> {
  return fetchWithAuth(`${API_BASE_URL}/recurring-transactions`);
}

export async function createRecurringTransaction(
  data: CreateRecurringTransactionData
): Promise<RecurringTransaction> {
  const payload = {
    ...data,
    amount: reaisToCents(data.amount),
  };

  return fetchWithAuth(`${API_BASE_URL}/recurring-transactions`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function toggleRecurringTransaction(
  id: string
): Promise<{ id: string; active: boolean }> {
  return fetchWithAuth(`${API_BASE_URL}/recurring-transactions/${id}/toggle`, {
    method: 'PUT',
  });
}

export async function deleteRecurringTransaction(
  id: string
): Promise<{ success: boolean }> {
  return fetchWithAuth(`${API_BASE_URL}/recurring-transactions/${id}`, {
    method: 'DELETE',
  });
}
