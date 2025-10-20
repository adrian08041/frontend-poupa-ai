import {
  TransactionType,
  Category,
  PaymentMethod,
} from "@/lib/validator/transaction";

export interface Transaction {
  id: string;
  type: TransactionType;
  category: Category | null;
  paymentMethod: PaymentMethod;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
  updatedAt?: string;
  userId: string;
}
export interface ListTransactionsResponse {
  transactions: Transaction[];
}

export interface SummaryResponse {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  totalInvestment: number;
}

export interface CategoryExpense {
  category: Category;
  amount: number;
  percentage: number;
  count: number;
}

export interface ExpensesByCategoryResponse {
  categories: CategoryExpense[];
}

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  INCOME: "Entrada",
  EXPENSE: "Saída",
  INVESTMENT: "Investimento",
};

export const CATEGORY_LABELS: Record<Category, string> = {
  ALIMENTACAO: "Alimentação",
  TRANSPORTE: "Transporte",
  MORADIA: "Moradia",
  LAZER: "Lazer",
  SAUDE: "Saúde",
  EDUCACAO: "Educação",
  VESTUARIO: "Vestuário",
  SALARIO: "Salário",
  FREELANCE: "Freelance",
  INVESTIMENTO: "Investimento",
  PRESENTE: "Presente",
  OUTROS: "Outros",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  PIX: "Pix",
  BOLETO: "Boleto",
  CARTAO: "Cartão",
  TRANSFERENCIA: "Transferência",
  DINHEIRO: "Dinheiro",
};

