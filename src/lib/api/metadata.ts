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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/meta/enums`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Cache por 5 minutos para evitar chamadas desnecessárias
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.error(`❌ Erro HTTP ${res.status}: ${res.statusText}`);
      throw new Error(`Erro ao buscar enums: ${res.status}`);
    }

    const data = await res.json();

    console.log("📦 Resposta da API /meta/enums:", data);

    return data;
  } catch (error) {
    console.error("❌ Erro ao buscar enums:", error);

    return {
      transactionTypes: [],
      transactionCategories: [],
      paymentMethods: [],
    };
  }
}

export function normalizeEnums(data: EnumsResponse) {
  console.log("🔧 Normalizando enums, dados recebidos:", data);

  const transactionTypes = data.transactionTypes || data.TransactionType || [];

  const categories =
    data.transactionCategories || // ✅ Nome correto!
    data.Category ||
    [];

  const paymentMethods = data.paymentMethods || data.PaymentMethod || [];

  console.log("🔧 Resultado da normalização:", {
    transactionTypes,
    categories,
    paymentMethods,
  });

  return {
    transactionTypes,
    categories,
    paymentMethods,
  };
}

