"use client";

import { useState } from "react";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteDialogProps {
  transactionId: string;
  transactionDescription: string;
  onDelete: (id: string) => Promise<void>;
  onSuccess: () => void;
}

export function DeleteDialog({
  transactionId,
  transactionDescription,
  onDelete,
  onSuccess,
}: DeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    setIsLoading(true);

    try {
      await onDelete(transactionId);
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error("Erro ao excluir transação:", error);
      // Aqui você pode adicionar um toast de erro
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-red hover:text-red hover:bg-red/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-white dark:bg-background-02 border-gray-200 dark:border-dark-gray">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red/10">
              <AlertTriangle className="h-5 w-5 text-red" />
            </div>
            <AlertDialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Excluir Transação
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-gray pt-2">
            Tem certeza que deseja excluir a transação{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              "{transactionDescription}"
            </span>
            ?
            <br />
            <br />
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isLoading}
            className="h-12 border-gray-200 dark:border-dark-gray hover:bg-gray-50 dark:hover:bg-dark-gray"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="h-12 bg-red hover:bg-red/90 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

