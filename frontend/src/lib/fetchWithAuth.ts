export async function fetchWithAuth(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem("access_token");
  const headers = new Headers(init.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const response = await fetch(input, { ...init, headers });
  if (response.status === 401) {
    localStorage.removeItem("access_token");
    window.location.reload();
  }
  return response;
} 