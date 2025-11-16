import { z } from "zod";

// Enums do backend
export const transactionTypeEnum = z.enum(["INCOME", "EXPENSE", "INVESTMENT"]);

export const categoryEnum = z.enum([
  "ALIMENTACAO",
  "TRANSPORTE",
  "MORADIA",
  "LAZER",
  "SAUDE",
  "EDUCACAO",
  "VESTUARIO",
  "SALARIO",
  "FREELANCE",
  "INVESTIMENTO",
  "PRESENTE",
  "OUTROS",
]);

export const paymentMethodEnum = z.enum([
  "PIX",
  "BOLETO",
  "CARTAO",
  "TRANSFERENCIA",
  "DINHEIRO",
]);

// Schema base para criar transação
const baseCreateTransactionSchema = z.object({
  type: transactionTypeEnum,
  category: categoryEnum.optional().nullable(), // ✅ Opcional e pode ser null
  paymentMethod: paymentMethodEnum,
  amount: z
    .number()
    .positive("O valor deve ser maior que zero")
    .transform((val) => parseFloat(val.toFixed(2))), // Garante 2 casas decimais
  description: z
    .string()
    .min(1, "A descrição é obrigatória")
    .min(3, "A descrição deve ter no mínimo 3 caracteres")
    .max(200, "A descrição deve ter no máximo 200 caracteres")
    .trim(),
  date: z
    .string()
    .min(1, "A data é obrigatória")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),
});

// Schema de criação com categoria opcional
export const createTransactionSchema = baseCreateTransactionSchema;

// Schema para atualizar transação (todos os campos opcionais)
export const updateTransactionSchema = baseCreateTransactionSchema.partial();

// Types inferidos
export type TransactionType = z.infer<typeof transactionTypeEnum>;
export type Category = z.infer<typeof categoryEnum>;
export type PaymentMethod = z.infer<typeof paymentMethodEnum>;
export type CreateTransactionData = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionData = z.infer<typeof updateTransactionSchema>;

