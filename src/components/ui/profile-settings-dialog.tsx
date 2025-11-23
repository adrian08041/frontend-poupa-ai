"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Lock, Loader2, MessageCircle, Copy, CheckCircle2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
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
  profileSchema,
  changePasswordSchema,
  whatsappSchema,
  type ProfileFormData,
  type ChangePasswordFormData,
  type WhatsAppFormData,
} from "@/lib/validator/profile";
import { updateProfile, changePassword, generateWhatsAppLinkCode, getWhatsAppStatus, linkWhatsApp, unlinkWhatsApp } from "@/lib/api/profile";

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
  const [isLoading, setIsLoading] = useState(false);
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

  const whatsappForm = useForm<WhatsAppFormData>({
    resolver: zodResolver(whatsappSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  // WhatsApp states
  const [whatsappLinkCode, setWhatsappLinkCode] = useState<string>("");
  const [whatsappStatus, setWhatsappStatus] = useState<{
    isLinked: boolean;
    phoneNumber?: string;
    linkedAt?: string;
  }>({ isLinked: false });
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [codeExpiresAt, setCodeExpiresAt] = useState<string>("");

  // Load WhatsApp status on mount
  const loadWhatsAppStatus = async () => {
    try {
      const status = await getWhatsAppStatus();
      setWhatsappStatus({
        isLinked: status.isLinked || false,
        phoneNumber: status.phoneNumber,
        linkedAt: status.linkedAt,
      });
      if (status.phoneNumber) {
        whatsappForm.setValue("phoneNumber", status.phoneNumber);
      }
    } catch (error) {
      console.error("Erro ao carregar status do WhatsApp:", error);
    }
  };

  const handleProfileSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await updateProfile(data);
      onProfileUpdate(data);
      setSuccessMessage("Perfil atualizado com sucesso!");

      toast.success("Perfil atualizado com sucesso!");

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        toast.error("Erro", {
          description: error.message
        });
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

      toast.success("Senha alterada com sucesso!");
      passwordForm.reset();

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        toast.error("Erro", {
          description: error.message
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateLinkCode = async () => {
    const phoneNumber = whatsappForm.getValues("phoneNumber");
    
    // Valida se o campo está preenchido antes de enviar
    const isValid = await whatsappForm.trigger("phoneNumber");
    if (!isValid || !phoneNumber) {
      return;
    }

    setIsGeneratingCode(true);
    setErrorMessage("");

    try {
      const response = await generateWhatsAppLinkCode(phoneNumber);
      setWhatsappLinkCode(response.linkCode);
      setCodeExpiresAt(response.expiresAt);
      
      toast.success("Código gerado com sucesso!", {
        description: "Use o código para vincular seu WhatsApp"
      });
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        toast.error("Erro ao gerar código", {
          description: error.message
        });
      }
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const handleUnlinkWhatsApp = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      await unlinkWhatsApp();
      setWhatsappStatus({ isLinked: false });
      setWhatsappLinkCode("");
      whatsappForm.reset();
      
      toast.success("WhatsApp desvinculado com sucesso!");
      await loadWhatsAppStatus();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        toast.error("Erro ao desvincular", {
          description: error.message
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (whatsappLinkCode) {
      navigator.clipboard.writeText(whatsappLinkCode);
      toast.success("Código copiado!", {
        description: "Cole no WhatsApp para vincular"
      });
    }
  };

  const handleOpenWhatsApp = async () => {
    console.log('[handleOpenWhatsApp] Iniciando vinculação');
    console.log('[handleOpenWhatsApp] Código:', whatsappLinkCode);

    if (!whatsappLinkCode) {
      console.warn('[handleOpenWhatsApp] Sem código de vinculação');
      return;
    }

    const phoneNumber = whatsappForm.getValues("phoneNumber");
    console.log('[handleOpenWhatsApp] Número do formulário:', phoneNumber);

    setIsLoading(true);
    setErrorMessage("");

    try {
      // Primeiro vincula o WhatsApp
      console.log('[handleOpenWhatsApp] Chamando linkWhatsApp...');
      await linkWhatsApp(phoneNumber);
      console.log('[handleOpenWhatsApp] Vinculação concluída com sucesso');

      // Se a vinculação foi bem-sucedida, abre o WhatsApp
      const botNumber = "553891298970"; // Número do bot
      const message = `Olá! Acabei de vincular minha conta ao PoupaAi!`;
      const whatsappUrl = `https://wa.me/${botNumber}?text=${encodeURIComponent(message)}`;

      window.open(whatsappUrl, "_blank");

      toast.success("WhatsApp vinculado com sucesso!", {
        description: "Você já pode usar o bot"
      });

      // Atualiza o status
      await loadWhatsAppStatus();

      // Limpa o código
      setWhatsappLinkCode("");

    } catch (error) {
      console.error('[handleOpenWhatsApp] Erro:', error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
        toast.error("Erro ao vincular", {
          description: error.message
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load WhatsApp status when dialog opens
  if (open && !whatsappStatus.isLinked && !whatsappStatus.phoneNumber) {
    loadWhatsAppStatus();
  }

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
            <TabsList className="grid w-full grid-cols-3 h-auto gap-0.5 p-0.5 sm:gap-1 sm:p-1">
              <TabsTrigger value="profile" className="flex-col gap-0.5 px-1.5 py-1.5 text-[10px] sm:flex-row sm:gap-2 sm:px-3 sm:py-2 sm:text-sm">
                <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-0" />
                <span className="leading-tight">Perfil</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex-col gap-0.5 px-1.5 py-1.5 text-[10px] sm:flex-row sm:gap-2 sm:px-3 sm:py-2 sm:text-sm">
                <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-0" />
                <span className="leading-tight">Segurança</span>
              </TabsTrigger>
              <TabsTrigger value="whatsapp" className="flex-col gap-0.5 px-1.5 py-1.5 text-[10px] sm:flex-row sm:gap-2 sm:px-3 sm:py-2 sm:text-sm">
                <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-0" />
                <span className="leading-tight">WhatsApp</span>
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

            {/* Aba de WhatsApp */}
            <TabsContent value="whatsapp" className="space-y-4">
              <div className="space-y-4">
                {/* Status Badge */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-background-01 rounded-lg border border-light-gray dark:border-dark-gray">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-green" />
                    <span className="font-semibold text-gray-900 dark:text-white">Status:</span>
                  </div>
                  {whatsappStatus.isLinked ? (
                    <div className="flex items-center gap-2 text-green">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="font-semibold">Vinculado</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-600 dark:text-gray-400">Não vinculado</span>
                  )}
                </div>

                {whatsappStatus.isLinked ? (
                  /* Quando já está vinculado */
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-green-900 dark:text-green-400 mb-1">
                            WhatsApp Vinculado com Sucesso!
                          </h4>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            Número: {whatsappStatus.phoneNumber || "Não disponível"}
                          </p>
                          {whatsappStatus.linkedAt && (
                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                              Vinculado em: {new Date(whatsappStatus.linkedAt).toLocaleDateString("pt-BR")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Ações</Label>
                      <Button
                        variant="destructive"
                        onClick={handleUnlinkWhatsApp}
                        disabled={isLoading}
                        className="w-full"
                      >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Desvincular WhatsApp
                      </Button>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Ao desvincular, você precisará gerar um novo código para usar o bot novamente.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Quando não está vinculado */
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="whatsappPhone">Número do WhatsApp</Label>
                      <Input
                        id="whatsappPhone"
                        {...whatsappForm.register("phoneNumber")}
                        placeholder="+55 (34) 99999-9999"
                        disabled={!!whatsappLinkCode}
                      />
                      {whatsappForm.formState.errors.phoneNumber && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {whatsappForm.formState.errors.phoneNumber.message}
                        </p>
                      )}
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Digite o número que você usará para conversar com o bot
                      </p>
                    </div>

                    <Button
                      onClick={handleGenerateLinkCode}
                      disabled={isGeneratingCode || !!whatsappLinkCode}
                      className="w-full"
                    >
                      {isGeneratingCode && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Gerar Código de Vinculação
                    </Button>

                    {whatsappLinkCode && (
                      <div className="space-y-4">
                        <Separator />
                        
                        {/* Código gerado */}
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-500 dark:border-green-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-green-900 dark:text-green-400 flex items-center gap-2">
                              🔑 Seu Código de Vinculação
                            </h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleCopyCode}
                              className="h-8"
                            >
                              <Copy className="h-4 w-4 mr-1" />
                              Copiar
                            </Button>
                          </div>
                          
                          <div className="bg-white dark:bg-background-02 p-3 rounded border border-green-300 dark:border-green-800 mb-2">
                            <p className="text-2xl font-mono font-bold text-center text-green-700 dark:text-green-400">
                              {whatsappLinkCode}
                            </p>
                          </div>
                          
                          {codeExpiresAt && (
                            <p className="text-xs text-green-700 dark:text-green-300 flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Válido por 10 minutos
                            </p>
                          )}
                        </div>

                        {/* Instruções */}
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                          <h4 className="font-semibold text-blue-900 dark:text-blue-400 mb-3 flex items-center gap-2">
                            📋 Como vincular:
                          </h4>
                          <ol className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                            <li className="flex items-start gap-2">
                              <span className="font-bold">1.</span>
                              <span>Clique no botão abaixo para abrir o WhatsApp</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="font-bold">2.</span>
                              <span>Envie a mensagem automática com o código</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="font-bold">3.</span>
                              <span>Aguarde a confirmação do bot</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="font-bold">4.</span>
                              <span>Pronto! Seu WhatsApp estará vinculado</span>
                            </li>
                          </ol>
                        </div>

                        <Button
                          onClick={handleOpenWhatsApp}
                          className="w-full bg-green hover:bg-green/90"
                        >
                          <MessageCircle className="mr-2 h-5 w-5" />
                          Abrir WhatsApp e Vincular
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>

                        <p className="text-xs text-center text-gray-600 dark:text-gray-400">
                          Após enviar a mensagem, volte aqui para verificar o status
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
