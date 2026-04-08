const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export async function signOut() {
  await fetch(`${API_BASE_URL}/users/logout`, {
    method: "POST",
    credentials: "include",
  });
}
