import { API_BASE_URL } from "./config";

export async function signOut() {
  await fetch(`${API_BASE_URL}/users/logout`, {
    method: "POST",
    credentials: "include",
  });
}
