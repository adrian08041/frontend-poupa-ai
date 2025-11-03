import {
  RecurringTransaction,
  ListRecurringTransactionsResponse,
  CreateRecurringTransactionData,
} from '@/types/recurring-transaction';
import { reaisToCents } from '@/lib/utils/format';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getAuthToken();

  if (!token) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Usuário não autenticado');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (response.status === 401) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Credenciais inválidas. Faça o login novamente');
  }

  if (!response.ok) {
    let errorData = null;
    let errorText = '';

    try {
      const responseText = await response.text();
      errorText = responseText;
      if (responseText) {
        errorData = JSON.parse(responseText);
      }
    } catch (e) {
      console.error('Erro ao parsear resposta:', e);
    }

    console.error('❌ Erro na API:', {
      url,
      status: response.status,
      statusText: response.statusText,
      errorData,
      errorText,
    });

    throw new Error(
      errorData?.message || errorData?.error || `Erro na requisição: ${response.status} - ${response.statusText}`
    );
  }

  if (response.status === 204 || options.method === 'DELETE') {
    return { success: true };
  }

  return response.json();
}

export async function listRecurringTransactions(): Promise<ListRecurringTransactionsResponse> {
  console.log('🔍 Buscando transações em:', `${API_BASE_URL}/recurring-transactions`);
  return fetchWithAuth(`${API_BASE_URL}/recurring-transactions`);
}

export async function createRecurringTransaction(
  data: CreateRecurringTransactionData
): Promise<RecurringTransaction> {
  const payload = {
    ...data,
    amount: reaisToCents(data.amount), // Converter para centavos
  };

  console.log('📤 Enviando transação recorrente:', payload);

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
