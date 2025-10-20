"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Lock, Trash2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  profileSchema,
  changePasswordSchema,
  type ProfileFormData,
  type ChangePasswordFormData,
} from "@/lib/validator/profile";
import { updateProfile, changePassword, deleteAccount } from "@/lib/api/profile";
import { useRouter } from "next/navigation";

interface ProfileSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: {
    name: string;
    email: string;
  };
  onProfileUpdate: (data: { name: string }) => void;
}

export function ProfileSettingsDialog({
  open,
  onOpenChange,
  initialData,
  onProfileUpdate,
}: ProfileSettingsDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialData.name,
    },
  });

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleProfileSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await updateProfile(data);
      onProfileUpdate(data);
      setSuccessMessage("Perfil atualizado com sucesso!");

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (data: ChangePasswordFormData) => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await changePassword(data);
      setSuccessMessage("Senha alterada com sucesso!");
      passwordForm.reset();

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      await deleteAccount();
      router.push("/login");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Configurações de Perfil</DialogTitle>
            <DialogDescription>
              Gerencie suas informações pessoais e configurações de conta
            </DialogDescription>
          </DialogHeader>

          {successMessage && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 text-sm">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
              {errorMessage}
            </div>
          )}

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Perfil
              </TabsTrigger>
              <TabsTrigger value="security">
                <Lock className="h-4 w-4 mr-2" />
                Segurança
              </TabsTrigger>
              <TabsTrigger value="account">
                <Trash2 className="h-4 w-4 mr-2" />
                Conta
              </TabsTrigger>
            </TabsList>

            {/* Aba de Perfil */}
            <TabsContent value="profile" className="space-y-4">
              <form
                onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    {...profileForm.register("name")}
                    placeholder="Seu nome"
                  />
                  {profileForm.formState.errors.name && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {profileForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={initialData.email}
                    disabled
                    className="bg-gray-100 dark:bg-dark-gray cursor-not-allowed"
                  />
                  <p className="text-xs text-gray">
                    O e-mail não pode ser alterado
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar alterações
                </Button>
              </form>
            </TabsContent>

            {/* Aba de Segurança */}
            <TabsContent value="security" className="space-y-4">
              <form
                onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Senha atual</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    {...passwordForm.register("currentPassword")}
                    placeholder="Digite sua senha atual"
                  />
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {passwordForm.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...passwordForm.register("newPassword")}
                    placeholder="Digite sua nova senha"
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...passwordForm.register("confirmPassword")}
                    placeholder="Confirme sua nova senha"
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Alterar senha
                </Button>
              </form>
            </TabsContent>

            {/* Aba de Conta */}
            <TabsContent value="account" className="space-y-4">
              <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 p-4">
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-400 mb-2">
                  Zona de Perigo
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                  Ao excluir sua conta, todos os seus dados serão permanentemente removidos.
                  Esta ação não pode ser desfeita.
                </p>
                <Button
                  variant="destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="w-full"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir minha conta
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isto irá excluir permanentemente sua
              conta e remover todos os seus dados de nossos servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sim, excluir conta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
