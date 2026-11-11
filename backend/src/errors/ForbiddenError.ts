import { AppError } from './AppError';

export class ForbiddenError extends AppError {
  constructor(message: string = 'Sudah login, tidak punya akses') {
    super(message, 403);
  }
}