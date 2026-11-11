// Base URL untuk komunikasi dengan backend (menggunakan Fetch API sesuai instruksi Tugas 4)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

// Helper untuk mendapatkan token dari localStorage
export function getToken(): string | null {
  return localStorage.getItem('token');
}

// Helper untuk menyimpan token ke localStorage
export function setToken(token: string): void {
  localStorage.setItem('token', token);
}

// Helper untuk menghapus token dari localStorage
export function removeToken(): void {
  localStorage.removeItem('token');
}

// Interface untuk respons standar API
export interface ApiResponse<T = unknown> {
  status: 'success' | 'fail' | 'error';
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

// Fungsi utama untuk melakukan fetch ke backend secara konsisten
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    let json: any = {};
    const text = await response.text();
    if (text) {
      try {
        json = JSON.parse(text);
      } catch {
        json = { message: text };
      }
    }

    if (!response.ok) {
      // Tangani status code 400, 401, 403, 404, 500
      const errorPayload: ApiResponse<T> & { statusCode: number } = {
        status: json.status || 'error',
        message: json.message || `Request gagal dengan kode HTTP ${response.status}`,
        errors: json.errors,
        statusCode: response.status,
      };
      throw errorPayload;
    }

    return json as ApiResponse<T>;
  } catch (error: any) {
    if (error && error.statusCode) {
      throw error;
    }
    // Tangani error jaringan (network error / backend mati)
    throw {
      status: 'error',
      message: 'Gagal terhubung ke server backend. Pastikan server backend sedang berjalan di http://localhost:3000',
      statusCode: 0,
    };
  }
}

export default BASE_URL;
