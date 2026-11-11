import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { getDb } from '../db';
import { users } from '../db/schema';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { AppError } from '../errors/AppError';

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_negara';

export const authService = {
  async register(data: any) {
    const db = await getDb();
    
    // Hapus .limit(1)
    const existingUser = await db.select().from(users).where(eq(users.email, data.email));
    if (existingUser.length > 0) {
      throw new AppError('Email sudah terdaftar', 400);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    // Ubah password_hash menjadi passwordHash
    await db.insert(users).values({
      name: data.name,
      email: data.email,
      passwordHash: passwordHash, 
      role: 'customer',
    });

    // Hapus .limit(1)
    const newUser = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role
    }).from(users).where(eq(users.email, data.email));

    return newUser[0];
  },

  async login(data: any) {
    const db = await getDb();

    // Hapus .limit(1)
    const user = await db.select().from(users).where(eq(users.email, data.email));
    if (user.length === 0) {
      throw new UnauthorizedError('Email atau password salah');
    }

    // Pastikan propertinya menggunakan passwordHash sesuai schema
    const isPasswordValid = await bcrypt.compare(data.password, user[0].passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Email atau password salah');
    }

    const token = jwt.sign(
      { id: user[0].id, role: user[0].role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { token };
  },

  async getMe(userId: number) {
    const db = await getDb();

    // Hapus .limit(1)
    const user = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt 
    }).from(users).where(eq(users.id, userId));

    if (user.length === 0) throw new UnauthorizedError('User tidak ditemukan');
    
    return user[0];
  }
};