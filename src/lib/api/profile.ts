import { ProfileFormData, ChangePasswordFormData } from "../validator/profile";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export class ProfileError extends Error {
  constructor(public message: string, public status?: number) {
    super(message);
    this.name = "ProfileError";
  }
}

const AUTH_HEADERS: HeadersInit = { "Content-Type": "application/json" };
const AUTH_OPTIONS: RequestInit = { credentials: "include" };

export async function getProfile() {
  const response = await fetch(`${API_BASE_URL}/users/profile`, {
    method: "GET",
    headers: AUTH_HEADERS,
    ...AUTH_OPTIONS,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new ProfileError(error.message || "Erro ao buscar perfil", response.status);
  }

  return response.json();
}

export async function updateProfile(profileData: ProfileFormData) {
  const response = await fetch(`${API_BASE_URL}/users/profile`, {
    method: "PUT",
    headers: AUTH_HEADERS,
    ...AUTH_OPTIONS,
    body: JSON.stringify({ name: profileData.name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new ProfileError(error.message || "Erro ao atualizar perfil", response.status);
  }

  return response.json();
}

export async function changePassword(passwordData: ChangePasswordFormData) {
  const response = await fetch(`${API_BASE_URL}/users/change-password`, {
    method: "PUT",
    headers: AUTH_HEADERS,
    ...AUTH_OPTIONS,
    body: JSON.stringify({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    if (response.status === 401) {
      throw new ProfileError("Senha atual incorreta", response.status);
    }
    throw new ProfileError(error.message || "Erro ao alterar senha", response.status);
  }

  return response.json();
}

export async function deleteAccount() {
  const response = await fetch(`${API_BASE_URL}/users/account`, {
    method: "DELETE",
    headers: AUTH_HEADERS,
    ...AUTH_OPTIONS,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new ProfileError(error.message || "Erro ao excluir conta", response.status);
  }

  return true;
}

export async function generateWhatsAppLinkCode(phoneNumber: string) {
  const cleanPhone = phoneNumber.replace(/\D/g, "");
  const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone : `+${cleanPhone}`;
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  return {
    linkCode: code,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    phoneNumber: formattedPhone
  };
}

export async function linkWhatsApp(phoneNumber: string) {
  const cleanPhone = phoneNumber.replace(/\D/g, "");
  const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone : `+${cleanPhone}`;

  const response = await fetch(`${API_BASE_URL}/users/me/whatsapp`, {
    method: "PUT",
    headers: AUTH_HEADERS,
    ...AUTH_OPTIONS,
    body: JSON.stringify({ whatsappNumber: formattedPhone }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new ProfileError(error.message || "Erro ao vincular WhatsApp", response.status);
  }

  return response.json();
}

export async function unlinkWhatsApp() {
  const response = await fetch(`${API_BASE_URL}/users/me/whatsapp`, {
    method: "DELETE",
    headers: AUTH_HEADERS,
    ...AUTH_OPTIONS,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new ProfileError(error.message || "Erro ao desvincular WhatsApp", response.status);
  }

  return response.json();
}

export async function getWhatsAppStatus() {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    method: "GET",
    headers: AUTH_HEADERS,
    ...AUTH_OPTIONS,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new ProfileError(error.message || "Erro ao buscar status do WhatsApp", response.status);
  }

  const data = await response.json();

  return {
    isLinked: !!data.whatsapp,
    phoneNumber: data.whatsapp,
    linkedAt: data.whatsappLinkedAt
  };
}
