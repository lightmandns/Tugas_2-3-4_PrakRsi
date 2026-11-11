import { AppError } from './AppError';

export class NotFoundError extends AppError {
  constructor(message: string = 'Data tidak ditemukan') {
    super(message, 404);
  }
}