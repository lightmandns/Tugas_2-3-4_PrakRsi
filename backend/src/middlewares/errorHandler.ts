// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { ValidationError } from '../errors/ValidationError';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Menangani error operasional yang sudah kita definisikan (AppError dan turunannya)
  if (err instanceof AppError) {
    const responsePayload: any = {
      status: err.status,
      message: err.message,
    };

    // Jika error spesifik dari Zod, tambahkan detail letak kolom yang salah
    if (err instanceof ValidationError) {
      responsePayload.errors = err.errors;
    }

    return res.status(err.statusCode).json(responsePayload);
  }

  // Menangani error tak terduga (Programming error / Internal Server Error)
  console.error('ERROR 💥:', err);
  return res.status(500).json({
    status: 'error',
    message: 'Terjadi kesalahan internal pada server',
  });
};