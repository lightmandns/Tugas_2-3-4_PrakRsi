import { AppError } from './AppError';

export class ValidationError extends AppError {
  public errors: { field: string; message: string }[];

  constructor(errors: { field: string; message: string }[]) {
    super('Validasi gagal', 400);
    this.errors = errors;
  }
}