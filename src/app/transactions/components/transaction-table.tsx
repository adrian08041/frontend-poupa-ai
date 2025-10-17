"use client";

import { Transaction } from "@/types/transaction";
import {
  TRANSACTION_TYPE_LABELS,
  CATEGORY_LABELS,
  PAYMENT_METHOD_LABELS,
} from "@/types/transaction";
import { formatCurrency, formatDateShort } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DeleteDialog } from "./delete-dialog";
import { CreateTransactionData } from "@/lib/validator/transaction";
import { TransactionForm } from "./TransactionForm";

interface TransactionTableProps {
  transactions: Transaction[];
  onUpdate: (id: string, data: CreateTransactionData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onRefresh: () => void;
}

export function TransactionTable({
  transactions,
  onUpdate,
  onDelete,
  onRefresh,
}: TransactionTableProps) {
  // Ordenar transações por data (mais recente primeiro)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  function getTypeVariant(type: Transaction["type"]) {
    switch (type) {
      case "INCOME":
        return "default"; // Verde
      case "EXPENSE":
        return "destructive"; // Vermelho
      case "INVESTMENT":
        return "secondary"; // Azul/Cinza
      default:
        return "outline";
    }
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0a0a0a] p-12 text-center">
        <p className="text-zinc-400 text-lg">
          Nenhuma transação encontrada.
          <br />
          <span className="text-sm">
            Comece adicionando sua primeira transação!
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0a0a0a] overflow-hidden">
      <Table>
        <TableHeader className="bg-[#141414]">
          <TableRow className="border-[rgba(255,255,255,0.08)] hover:bg-transparent">
            <TableHead className="text-zinc-300 font-bold text-sm">
              Descrição
            </TableHead>
            <TableHead className="text-zinc-300 font-bold text-sm">
              Tipo
            </TableHead>
            <TableHead className="text-zinc-300 font-bold text-sm">
              Categoria
            </TableHead>
            <TableHead className="text-zinc-300 font-bold text-sm">
              Método
            </TableHead>
            <TableHead className="text-zinc-300 font-bold text-sm">
              Data
            </TableHead>
            <TableHead className="text-zinc-300 font-bold text-sm text-right">
              Valor
            </TableHead>
            <TableHead className="text-zinc-300 font-bold text-sm text-right">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTransactions.map((transaction) => (
            <TableRow
              key={transaction.id}
              className="border-[rgba(255,255,255,0.08)] hover:bg-[#141414] transition-colors"
            >
              <TableCell className="font-medium text-white">
                {transaction.description}
              </TableCell>
              <TableCell>
                <Badge
                  variant={getTypeVariant(transaction.type)}
                  className="font-medium"
                >
                  {TRANSACTION_TYPE_LABELS[transaction.type]}
                </Badge>
              </TableCell>
              <TableCell className="text-zinc-300">
                {transaction.category
                  ? CATEGORY_LABELS[transaction.category]
                  : "-"}
              </TableCell>
              <TableCell className="text-zinc-300">
                {PAYMENT_METHOD_LABELS[transaction.paymentMethod]}
              </TableCell>
              <TableCell className="text-zinc-300">
                {formatDateShort(transaction.date)}
              </TableCell>
              <TableCell
                className={`text-right font-semibold text-base ${
                  transaction.type === "INCOME"
                    ? "text-green-500"
                    : transaction.type === "EXPENSE"
                    ? "text-red-500"
                    : "text-blue-500"
                }`}
              >
                {formatCurrency(transaction.amount)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <TransactionForm
                    transaction={transaction}
                    onSuccess={onRefresh}
                    onSubmit={(data) => onUpdate(transaction.id, data)}
                  />
                  <DeleteDialog
                    transactionId={transaction.id}
                    transactionDescription={transaction.description}
                    onDelete={onDelete}
                    onSuccess={onRefresh}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

