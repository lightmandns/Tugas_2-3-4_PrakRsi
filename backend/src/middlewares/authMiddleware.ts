import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { getDb } from '../db';
import { stalls } from '../db/schema';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { ForbiddenError } from '../errors/ForbiddenError';
import { NotFoundError } from '../errors/NotFoundError';

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_negara';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    console.log("Header yang diterima server:", authHeader); 

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Belum/tidak terautentikasi'); 
    }
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // 401: Belum/tidak terautentikasi
      throw new UnauthorizedError('Belum/tidak terautentikasi'); 
    }

    const token = authHeader.split(' ')[1];
    
    // Verifikasi token dan simpan payload (id, role) ke request
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Token tidak valid atau sudah kedaluwarsa'));
    } else {
      next(error);
    }
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      // 403: Sudah login, tidak punya akses
      throw new ForbiddenError('Sudah login, tidak punya akses'); 
    }
    next();
  };
};

export const isOwnerOrAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    // Tambahkan "as string" agar TypeScript meyakini nilainya adalah string
    const stallId = parseInt(req.params.id as string);

    if (!user) throw new UnauthorizedError('Belum terautentikasi');
    if (user.role === 'admin') return next();

    if (user.role === 'owner') {
      const db = await getDb();
      const stall = await db.select().from(stalls).where(eq(stalls.id, stallId));
      
      if (stall.length === 0) throw new NotFoundError('Warung tidak ditemukan');
      
      // Ubah owner_id menjadi ownerId sesuai standar Drizzle ORM
      if (stall[0].ownerId !== user.id) {
        throw new ForbiddenError('Sudah login, tidak punya akses mengubah warung orang lain');
      }
      return next();
    }

    throw new ForbiddenError('Sudah login, tidak punya akses');
  } catch (error) {
    next(error);
  }
};