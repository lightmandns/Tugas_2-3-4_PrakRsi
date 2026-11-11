import { apiFetch, setToken, removeToken, type ApiResponse } from './config';

// ===================== TYPES =====================

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'owner' | 'customer';
  createdAt?: string;
}

export interface LoginResponse {
  token: string;
}

// ===================== API CALLS =====================

// POST /auth/register - Registrasi user baru
export async function registerUser(data: RegisterInput): Promise<ApiResponse<User>> {
  return apiFetch<User>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// POST /auth/login - Login user
export async function loginUser(data: LoginInput): Promise<ApiResponse<LoginResponse>> {
  const result = await apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  // Simpan token ke localStorage
  if (result.data?.token) {
    setToken(result.data.token);
  }

  return result;
}

// GET /auth/me - Informasi pengguna yang sedang login
export async function getMe(): Promise<ApiResponse<User>> {
  return apiFetch<User>('/auth/me');
}

// Logout - Hapus token dari localStorage
export function logoutUser(): void {
  removeToken();
}
