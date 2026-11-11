import { AppError } from './AppError';

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Belum/tidak terautentikasi') {
    super(message, 401);
  }
}