const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("access_token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Se token expirado ou inválido, redireciona para login
    if (response.status === 401) {
      console.error("❌ Token inválido ou expirado");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      // Redireciona para login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      throw new ApiError("Credenciais inválidas. Faça o login novamente", 401);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `Erro na requisição: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    // Se for DELETE sem conteúdo, retorna objeto vazio
    if (response.status === 204 || options.method === "DELETE") {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      error instanceof Error ? error.message : "Erro desconhecido",
      500
    );
  }
}
