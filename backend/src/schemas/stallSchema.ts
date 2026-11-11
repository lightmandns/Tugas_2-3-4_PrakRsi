import { z } from 'zod';

const stallIdParam = z.object({
  id: z.coerce.number().int().positive('id harus berupa angka lebih dari 0'),
});

export const getStallsQuerySchema = z.object({
  query: z.object({
    search: z.string().trim().max(100, 'search maksimal 100 karakter').optional(),
    category: z.string().trim().max(50, 'category maksimal 50 karakter').optional(),
    page: z.coerce.number().int().min(1, 'page minimal 1').default(1),
    limit: z.coerce.number().int().min(1, 'limit minimal 1').max(100, 'limit maksimal 100').default(10),
  }),
});

export const getStallByIdSchema = z.object({
  params: stallIdParam,
});

export const createStallSchema = z.object({
  body: z.object({
    name: z.string().trim().min(3, 'name minimal 3 karakter').max(100, 'name maksimal 100 karakter'),
    category: z.string().trim().max(50, 'category maksimal 50 karakter').optional(),
    location: z.string().max(100, 'location maksimal 100 karakter').optional(),
    description: z.string().max(1000, 'description maksimal 1000 karakter').optional(),
  }),
});

export const updateStallSchema = z.object({
  params: stallIdParam,
  // .partial() membuat semua atribut di dalamnya menjadi opsional
  body: createStallSchema.shape.body.partial(), 
});

export const deleteStallSchema = z.object({
  params: stallIdParam,
});

export const createReviewSchema = z.object({
  params: stallIdParam,
  body: z.object({
    rating: z.number().int().min(1, 'rating minimal 1').max(5, 'rating maksimal 5'),
    comment: z.string().trim().max(1000, 'comment maksimal 1000 karakter').optional(),
  }),
});