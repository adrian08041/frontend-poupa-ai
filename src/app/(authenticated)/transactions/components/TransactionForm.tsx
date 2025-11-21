"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Pencil, Upload, X, AlertCircle } from "lucide-react";
import {
  createTransactionSchema,
  CreateTransactionData,
} from "@/lib/validator/transaction";
import { Transaction } from "@/types/transaction";
import { getTodayISO } from "@/lib/utils/format";
import { extractTransactionFromImage } from "@/lib/api/transaction";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  externalOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TransactionForm({
  transaction,
  onSuccess,
  onSubmit,
  externalOpen,
  onOpenChange,
}: TransactionFormProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  // Usa controle externo se fornecido, senão usa o estado interno
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
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

  // Estados para upload de imagem
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractionSuccess, setExtractionSuccess] = useState(false);
  const [confidence, setConfidence] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Função para selecionar imagem
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setExtractionError('Formato de arquivo inválido. Envie uma imagem (JPG, PNG, GIF, WEBP) ou PDF.');
      return;
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setExtractionError('Arquivo muito grande. O tamanho máximo é 5MB.');
      return;
    }

    setSelectedImage(file);
    setExtractionError(null);

    // Criar preview da imagem
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null); // PDF não tem preview
    }
  };

  // Função para extrair dados da imagem
  const handleExtractFromImage = async () => {
    if (!selectedImage) return;

    setIsExtracting(true);
    setExtractionError(null);
    setExtractionSuccess(false);

    try {
      console.log('📤 Enviando imagem para extração...');
      const extractedData = await extractTransactionFromImage(selectedImage);

      console.log('✅ Dados extraídos:', extractedData);

      // Preencher formulário com dados extraídos
      form.setValue('description', extractedData.description);
      form.setValue('amount', extractedData.amount);
      form.setValue('type', extractedData.type);

      if (extractedData.category) {
        form.setValue('category', extractedData.category as CreateTransactionData['category']);
      }

      if (extractedData.date) {
        form.setValue('date', extractedData.date);
      }

      // Atualizar displayValue para o campo de valor
      const formatted = extractedData.amount.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      setDisplayValue(formatted);

      setConfidence(extractedData.confidence);
      setExtractionSuccess(true);

      // Limpar imagem após sucesso
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('❌ Erro ao extrair dados:', error);
      setExtractionError(
        error instanceof Error
          ? error.message
          : 'Erro ao processar imagem. Tente novamente.'
      );
    } finally {
      setIsExtracting(false);
    }
  };

  // Função para remover imagem selecionada
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setExtractionError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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

        {/* Upload de Imagem - Apenas quando criando nova transação */}
        {!isEditing && (
          <div className="space-y-3 pb-4 border-b border-gray-200 dark:border-dark-gray">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Extrair de Imagem
                </h3>
                <p className="text-xs text-gray">
                  Envie uma foto do extrato ou comprovante
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={handleImageSelect}
                className="hidden"
                disabled={isExtracting}
              />

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isExtracting}
                className="border-gray-200 dark:border-dark-gray"
              >
                <Upload className="h-4 w-4 mr-2" />
                Selecionar
              </Button>
            </div>

            {/* Preview da imagem */}
            {imagePreview && (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded border border-gray-200 dark:border-dark-gray"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-white/90 dark:bg-black/90 hover:bg-white dark:hover:bg-black"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Botão de extrair */}
            {selectedImage && !imagePreview && (
              <div className="p-3 bg-gray-50 dark:bg-background-01 rounded border border-gray-200 dark:border-dark-gray">
                <p className="text-sm text-gray mb-2">
                  {selectedImage.name}
                </p>
                <Button
                  type="button"
                  onClick={handleRemoveImage}
                  variant="ghost"
                  size="sm"
                  className="text-red hover:text-red"
                >
                  <X className="h-4 w-4 mr-1" />
                  Remover
                </Button>
              </div>
            )}

            {/* Botão extrair dados */}
            {selectedImage && (
              <Button
                type="button"
                onClick={handleExtractFromImage}
                disabled={isExtracting}
                className="w-full bg-green hover:bg-green/90 text-white"
              >
                {isExtracting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Extraindo dados...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Extrair Dados
                  </>
                )}
              </Button>
            )}

            {/* Mensagem de sucesso */}
            {extractionSuccess && confidence !== null && (
              <Alert className="border-green bg-green/10">
                <AlertCircle className="h-4 w-4 text-green" />
                <AlertDescription className="text-green text-sm">
                  Dados extraídos com sucesso! Confiança: {confidence}%
                  {confidence < 70 && " - Revise os dados antes de salvar"}
                </AlertDescription>
              </Alert>
            )}

            {/* Mensagem de erro */}
            {extractionError && (
              <Alert className="border-red bg-red/10">
                <AlertCircle className="h-4 w-4 text-red" />
                <AlertDescription className="text-red text-sm">
                  {extractionError}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

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

