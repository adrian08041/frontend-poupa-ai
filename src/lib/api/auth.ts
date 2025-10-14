import { LoginFormData, RegisterFormData } from "../validator/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export class AuthError extends Error {
  constructor(public message: string, public status?: number) {
    super(message);
    this.name = "AuthError";
  }
}


export async function signIn(credentials: LoginFormData) {
  
}


export async function signUp(
  userData: Omit<RegisterFormData, "confirmPassword" | "acceptTerms">
) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();

      // Tratar erros específicos
      if (response.status === 409) {
        throw new AuthError("Este e-mail já está cadastrado", response.status);
      }

      throw new AuthError(
        error.message || "Erro ao criar conta",
        response.status
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError("Erro de conexão. Tente novamente.");
  }
}

// Verificar se email existe
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/check-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    return data.exists;
  } catch (error) {
    console.error("Erro ao verificar e-mail:", error);
    return false;
  }
}

export async function signOut() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Erro ao fazer logout");
    }

    localStorage.removeItem("token");
    sessionStorage.clear();
  } catch (error) {
    console.error("Erro no logout:", error);
  }
}

