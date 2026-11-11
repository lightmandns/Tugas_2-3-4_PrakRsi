import { apiFetch, type ApiResponse } from './config';

// ===================== TYPES =====================

export interface Stall {
  id: number;
  ownerId: number;
  name: string;
  category: string | null;
  location: string | null;
  description: string | null;
  avgRating: number;
  reviewCount: number;
  isPopular: boolean;
}

export interface StallListResponse {
  data: Stall[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface CreateStallInput {
  name: string;
  category?: string;
  location?: string;
  description?: string;
}

export interface UpdateStallInput {
  name?: string;
  category?: string;
  location?: string;
  description?: string;
}

export interface StallQueryParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

// ===================== API CALLS =====================

// GET /stalls - Daftar warung dengan search, filter, pagination
export async function getStalls(params: StallQueryParams = {}): Promise<ApiResponse<Stall[]>> {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.category) query.set('category', params.category);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));

  const qs = query.toString();
  return apiFetch<Stall[]>(`/stalls${qs ? `?${qs}` : ''}`);
}

// GET /stalls/:id - Detail warung
export async function getStallById(id: number): Promise<ApiResponse<Stall>> {
  return apiFetch<Stall>(`/stalls/${id}`);
}

// POST /stalls - Buat warung baru (owner/admin)
export async function createStall(data: CreateStallInput): Promise<ApiResponse<Stall>> {
  return apiFetch<Stall>('/stalls', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// PUT /stalls/:id - Update warung (owner/admin)
export async function updateStall(id: number, data: UpdateStallInput): Promise<ApiResponse<Stall>> {
  return apiFetch<Stall>(`/stalls/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// DELETE /stalls/:id - Hapus warung (admin only)
export async function deleteStall(id: number): Promise<ApiResponse<Stall>> {
  return apiFetch<Stall>(`/stalls/${id}`, {
    method: 'DELETE',
  });
}
