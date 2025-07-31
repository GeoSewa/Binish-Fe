// Utility to check if a JWT is expired
export function isTokenExpired(token: string): boolean {
  if (!token) return true;
  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    if (!decoded.exp) return true;
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

// Utility to refresh the access token using the refresh token API
export async function refreshAccessToken(refreshToken: string) {
  const response = await fetch("https://sujanadh.pythonanywhere.com/api/user/token/refresh/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
  });
  if (!response.ok) throw new Error("Failed to refresh token");
  return response.json();
} 