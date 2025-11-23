import { ProfileFormData, ChangePasswordFormData } from "../validator/profile";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export class ProfileError extends Error {
  constructor(public message: string, public status?: number) {
    super(message);
    this.name = "ProfileError";
  }
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getProfile() {
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ProfileError(
        error.message || "Erro ao buscar perfil",
        response.status
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ProfileError) {
      throw error;
    }
    throw new ProfileError("Erro de conexão. Tente novamente.");
  }
}

export async function updateProfile(profileData: ProfileFormData) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        name: profileData.name,
      }),
    });

    if (!response.ok) {
      const error = await response.json();

      throw new ProfileError(
        error.message || "Erro ao atualizar perfil",
        response.status
      );
    }

    const data = await response.json();

    if (data.access_token) {
      localStorage.setItem("access_token", data.access_token);
    }

    return data;
  } catch (error) {
    if (error instanceof ProfileError) {
      throw error;
    }
    throw new ProfileError("Erro de conexão. Tente novamente.");
  }
}

export async function changePassword(passwordData: ChangePasswordFormData) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/change-password`, {
      method: "PUT",
      headers: getAuthHeaders(),
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

      throw new ProfileError(
        error.message || "Erro ao alterar senha",
        response.status
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ProfileError) {
      throw error;
    }
    throw new ProfileError("Erro de conexão. Tente novamente.");
  }
}

export async function deleteAccount() {
  try {
    const response = await fetch(`${API_BASE_URL}/users/account`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ProfileError(
        error.message || "Erro ao excluir conta",
        response.status
      );
    }

    // Limpar tokens
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    return true;
  } catch (error) {
    if (error instanceof ProfileError) {
      throw error;
    }
    throw new ProfileError("Erro de conexão. Tente novamente.");
  }
}

// ====================================================================
// WHATSAPP LINKING FUNCTIONS
// ====================================================================

export async function generateWhatsAppLinkCode(phoneNumber: string) {
  // Esta função agora apenas valida e formata o número
  // A vinculação real é feita pela função linkWhatsApp
  const cleanPhone = phoneNumber.replace(/\D/g, "");

  // Adiciona o código do país se não tiver
  const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone : `+${cleanPhone}`;

  // Gera um código aleatório de 6 dígitos para exibição
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  return {
    linkCode: code,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutos
    phoneNumber: formattedPhone
  };
}

export async function linkWhatsApp(phoneNumber: string) {
  try {
    // Limpa e formata o número
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone : `+${cleanPhone}`;

    console.log('[linkWhatsApp] Número original:', phoneNumber);
    console.log('[linkWhatsApp] Número limpo:', cleanPhone);
    console.log('[linkWhatsApp] Número formatado:', formattedPhone);
    console.log('[linkWhatsApp] URL:', `${API_BASE_URL}/users/me/whatsapp`);

    // Endpoint correto: PUT /users/me/whatsapp
    const response = await fetch(`${API_BASE_URL}/users/me/whatsapp`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        whatsappNumber: formattedPhone, // Campo correto esperado pelo backend
      }),
    });

    console.log('[linkWhatsApp] Status da resposta:', response.status);

    if (!response.ok) {
      const error = await response.json();
      console.error('[linkWhatsApp] Erro da API:', error);
      throw new ProfileError(
        error.message || "Erro ao vincular WhatsApp",
        response.status
      );
    }

    const data = await response.json();
    console.log('[linkWhatsApp] Sucesso:', data);
    return data;
  } catch (error) {
    console.error('[linkWhatsApp] Erro capturado:', error);
    if (error instanceof ProfileError) {
      throw error;
    }
    throw new ProfileError("Erro de conexão. Tente novamente.");
  }
}

export async function unlinkWhatsApp() {
  try {
    // Ajustado para o endpoint correto: DELETE /users/me/whatsapp
    const response = await fetch(`${API_BASE_URL}/users/me/whatsapp`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ProfileError(
        error.message || "Erro ao desvincular WhatsApp",
        response.status
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ProfileError) {
      throw error;
    }
    throw new ProfileError("Erro de conexão. Tente novamente.");
  }
}

export async function getWhatsAppStatus() {
  try {
    // Usando GET /users/me para verificar o status
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ProfileError(
        error.message || "Erro ao buscar status do WhatsApp",
        response.status
      );
    }

    const data = await response.json();
    
    // Mapeando a resposta do usuário para o status do WhatsApp
    return {
      isLinked: !!data.whatsapp, // Assumindo que o campo é 'whatsapp' ou 'whatsappNumber'
      phoneNumber: data.whatsapp,
      linkedAt: data.whatsappLinkedAt // Se existir
    };
  } catch (error) {
    if (error instanceof ProfileError) {
      throw error;
    }
    throw new ProfileError("Erro de conexão. Tente novamente.");
  }
}

