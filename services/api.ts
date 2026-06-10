import { signOut } from "next-auth/react";

export const API_URL = process.env.NEXT_PUBLIC_API_BACK_URL;

export async function authenticatedFetch(
  path: string,
  options: RequestInit = {}
) {
  if (!API_URL) {
    throw new Error("API_URL no está definida en variables de entorno");
  }

  const url = path.startsWith("http")
    ? path
    : `${API_URL}${path}`;

  const response = await fetch(url, options);

  if (response.status === 401) {
    console.warn("Unauthorized access detected (401). Signing out...");

    if (typeof window !== "undefined") {
      await signOut({ redirect: false });
      window.location.href = "/login";
    }

    return response;
  }

  return response;
}