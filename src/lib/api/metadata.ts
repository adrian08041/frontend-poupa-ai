import { API_BASE_URL } from "./config";

interface EnumsResponse {
  // Formato correto do backend
  transactionTypes?: string[];
  transactionCategories?: string[];
  paymentMethods?: string[];

  TransactionType?: string[];
  Category?: string[];
  PaymentMethod?: string[];
}

export async function getEnums(): Promise<EnumsResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/meta/enums`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Cache por 5 minutos para evitar chamadas desnecessárias
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`Erro ao buscar enums: ${res.status}`);
    }

    return await res.json();
  } catch {
    return {
      transactionTypes: [],
      transactionCategories: [],
      paymentMethods: [],
    };
  }
}

export function normalizeEnums(data: EnumsResponse) {
  const transactionTypes = data.transactionTypes || data.TransactionType || [];
  const categories = data.transactionCategories || data.Category || [];
  const paymentMethods = data.paymentMethods || data.PaymentMethod || [];

  return { transactionTypes, categories, paymentMethods };
}

