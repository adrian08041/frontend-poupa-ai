"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Pencil } from "lucide-react";
import {
  createTransactionSchema,
  CreateTransactionData,
} from "@/lib/validator/transaction";
import { Transaction } from "@/types/transaction";
import { getTodayISO } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getEnums } from "@/lib/api/metadata";

interface TransactionFormProps {
  transaction?: Transaction;
  onSuccess: () => void;
  onSubmit: (data: CreateTransactionData) => Promise<void>;
}

export function TransactionForm({
  transaction,
  onSuccess,
  onSubmit,
}: TransactionFormProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [displayValue, setDisplayValue] = useState("");
  const [enumData, setEnumData] = useState<{
    transactionTypes: string[];
    categories: string[];
    paymentMethods: string[];
  }>({
    transactionTypes: [],
    categories: [],
    paymentMethods: [],
  });

  const isEditing = !!transaction;

  const form = useForm<CreateTransactionData>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: transaction
      ? {
          type: transaction.type,
          category: transaction.category || undefined,
          paymentMethod: transaction.paymentMethod,
          amount: transaction.amount, // Já está em reais vindos do backend
          description: transaction.description,
          date: transaction.date.split("T")[0],
        }
      : {
          type: "EXPENSE",
          category: undefined,
          paymentMethod: "PIX",
          amount: 0,
          description: "",
          date: getTodayISO(),
        },
  });

  const selectedType = form.watch("type");

  const showCategory = selectedType === "EXPENSE";

  const getAvailableCategories = () => {
    if (selectedType === "EXPENSE") {
      return enumData.categories.filter((cat) =>
        [
          "ALIMENTACAO",
          "TRANSPORTE",
          "LAZER",
          "SAUDE",
          "EDUCACAO",
          "MORADIA",
          "VESTUARIO",
          "OUTROS",
        ].includes(cat)
      );
    } else if (selectedType === "INCOME") {
      return enumData.categories.filter((cat) =>
        ["SALARIO", "FREELANCE", "PRESENTE", "OUTROS"].includes(cat)
      );
    } else if (selectedType === "INVESTMENT") {
      return enumData.categories.filter((cat) =>
        ["INVESTIMENTO", "OUTROS"].includes(cat)
      );
    }
    return enumData.categories;
  };

  const availableCategories = getAvailableCategories();

  useEffect(() => {
    if (selectedType !== "EXPENSE") {
      form.setValue("category", undefined);
    }
  }, [selectedType, form]);

  // Inicializa displayValue quando editar uma transação
  useEffect(() => {
    if (transaction && transaction.amount > 0) {
      const formatted = transaction.amount.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      setDisplayValue(formatted);
    }
  }, [transaction]);

  useEffect(() => {
    if (open) {
      getEnums()
        .then((data) => {
          console.log("✅ Enums recebidos do backend:", data);

          const normalized = {
            transactionTypes: data.transactionTypes || [],
            categories: data.transactionCategories || [],
            paymentMethods: data.paymentMethods || [],
          };

          console.log("✅ Enums normalizados:", normalized);

          setEnumData(normalized);
        })
        .catch((err) => {
          console.error("❌ Erro ao carregar enums:", err);

          const fallback = {
            transactionTypes: ["INCOME", "EXPENSE", "INVESTMENT"],
            categories: [
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
            ],
            paymentMethods: [
              "PIX",
              "BOLETO",
              "CARTAO",
              "TRANSFERENCIA",
              "DINHEIRO",
            ],
          };

          console.log("⚠️ Usando valores fallback:", fallback);
          setEnumData(fallback);
        });
    }
  }, [open]);

  async function handleSubmit(data: CreateTransactionData) {
    setIsLoading(true);
    try {
      let category = data.category;

      if (data.type === "EXPENSE") {
        category = data.category || "OUTROS";
      } else if (data.type === "INCOME") {
        category = "SALARIO";
      } else if (data.type === "INVESTMENT") {
        category = "INVESTIMENTO";
      }

      const payload: CreateTransactionData = {
        type: data.type,
        category,
        paymentMethod: data.paymentMethod,
        amount: data.amount, // Já está em reais, o backend vai converter
        description: data.description,
        date: data.date,
      };

      console.log("📤 Dados do formulário:", data);
      console.log("📤 Payload final sendo enviado:", payload);

      await onSubmit(payload);
      setOpen(false);
      form.reset();
      setDisplayValue(''); // Limpa o valor formatado
      onSuccess();
    } catch (error) {
      console.error("❌ Erro ao salvar transação:", error);
      if (error instanceof Error) {
        console.error("❌ Mensagem completa:", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  const formatLabel = (value: string) => {
    const specialCases: Record<string, string> = {
      // Tipos de transação
      INCOME: "Receita",
      EXPENSE: "Despesa",
      INVESTMENT: "Investimento",
      // Métodos de pagamento
      CARTAO: "Cartão",
    };

    if (specialCases[value]) {
      return specialCases[value];
    }

    // Formatação padrão
    return value
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100 dark:hover:bg-dark-gray"
          >
            <Pencil className="h-4 w-4 text-gray dark:text-light-gray hover:text-green" />
          </Button>
        ) : (
          <Button className="bg-green hover:bg-green/90 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Nova Transação
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-background-02 border-gray-200 dark:border-dark-gray">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            {isEditing ? "Editar Transação" : "Nova Transação"}
          </DialogTitle>
          <DialogDescription className="text-gray">
            {isEditing
              ? "Atualize as informações da transação"
              : "Preencha os dados para adicionar uma nova transação"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Descrição */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-900 dark:text-light-gray">
                    Descrição
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Almoço, Salário, Investimento..."
                      disabled={isLoading}
                      className="h-12 bg-white dark:bg-background-01 border-gray-200 dark:border-dark-gray text-gray-900 dark:text-white placeholder:text-gray"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red text-sm" />
                </FormItem>
              )}
            />

            {/* Valor */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => {
                const formatCurrencyInput = (value: string) => {
                  // Remove tudo exceto números
                  const numbersOnly = value.replace(/\D/g, '');

                  if (numbersOnly === '') {
                    setDisplayValue('');
                    field.onChange(0);
                    return;
                  }

                  // Converte centavos para reais
                  const valueInReais = parseInt(numbersOnly) / 100;

                  // Formata para exibição (ex: "1.234,56")
                  const formatted = valueInReais.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  });

                  setDisplayValue(formatted);
                  field.onChange(valueInReais);
                };

                return (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-900 dark:text-light-gray">
                      Valor
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900 dark:text-white">
                          R$
                        </span>
                        <Input
                          type="text"
                          inputMode="numeric"
                          placeholder="0,00"
                          disabled={isLoading}
                          className="h-12 pl-12 bg-white dark:bg-background-01 border-gray dark:border-dark-gray text-gray dark:text-white placeholder:text-gray"
                          value={displayValue}
                          onChange={(e) => formatCurrencyInput(e.target.value)}
                          onBlur={field.onBlur}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red text-sm" />
                  </FormItem>
                );
              }}
            />

            {/* Tipo */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray dark:text-light-gray">
                    Tipo
                  </FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 bg-white dark:bg-background-01 border-gray dark:border-dark-gray text-gray dark:text-white">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {enumData.transactionTypes.length === 0 ? (
                        <SelectItem value="loading" disabled>
                          Carregando...
                        </SelectItem>
                      ) : (
                        enumData.transactionTypes.map((value) => (
                          <SelectItem key={value} value={value}>
                            {formatLabel(value)}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            {/* Categoria (só aparece se for despesa) */}
            {showCategory && (
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-900 dark:text-light-gray">
                      Categoria
                    </FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 bg-white dark:bg-background-01 border-gray-200 dark:border-dark-gray text-gray-900 dark:text-white">
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableCategories.length === 0 ? (
                          <SelectItem value="loading" disabled>
                            Carregando...
                          </SelectItem>
                        ) : (
                          availableCategories.map((value) => (
                            <SelectItem key={value} value={value}>
                              {formatLabel(value)}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red text-sm" />
                  </FormItem>
                )}
              />
            )}

            {/* Método de Pagamento */}
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-900 dark:text-light-gray">
                    Método de Pagamento
                  </FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 bg-white dark:bg-background-01 border-gray-200 dark:border-dark-gray text-gray-900 dark:text-white">
                        <SelectValue placeholder="Selecione o método" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {enumData.paymentMethods.length === 0 ? (
                        <SelectItem value="loading" disabled>
                          Carregando...
                        </SelectItem>
                      ) : (
                        enumData.paymentMethods.map((value) => (
                          <SelectItem key={value} value={value}>
                            {formatLabel(value)}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red text-sm" />
                </FormItem>
              )}
            />

            {/* Data */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-gray-900 dark:text-light-gray">
                    Data
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      disabled={isLoading}
                      className="h-12 bg-white dark:bg-background-01 border-gray-200 dark:border-dark-gray text-gray-900 dark:text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red text-sm" />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
                className="flex-1 h-12 border-gray-200 dark:border-dark-gray hover:bg-gray-50 dark:hover:bg-dark-gray"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 h-12 bg-green hover:bg-green/90 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : isEditing ? (
                  "Atualizar"
                ) : (
                  "Criar Transação"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

