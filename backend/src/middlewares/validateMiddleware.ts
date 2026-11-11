import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '../errors/ValidationError';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Mengeksekusi validasi pada req.body, req.query, dan req.params
      const validData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // HANYA menimpa req.body (karena req.query & req.params bersifat read-only di Express)
      if (validData.body) {
        req.body = validData.body;
      }
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Memformat error Zod menjadi [{ field: '...', message: '...' }]
        const formattedErrors = error.errors.map((err) => ({
          field: err.path[err.path.length - 1].toString(),
          message: err.message,
        }));
        
        // Melempar error ke errorHandler.ts
        next(new ValidationError(formattedErrors));
      } else {
        next(error);
      }
    }
  };
};