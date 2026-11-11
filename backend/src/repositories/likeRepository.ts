import { eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { likes } from '../db/schema.ts';

export interface CreateLikeInput {
  reviewId: number;
  userId: number;
}

export class LikeRepository {
  async create(input: CreateLikeInput) {
    const db = await getDb();
    const rows = await db
      .insert(likes)
      .output()
      .values({ reviewId: input.reviewId, userId: input.userId });
    return rows[0];
  }

  async remove(id: number) {
    const db = await getDb();
    const rows = await db.delete(likes).where(eq(likes.id, id)).output();
    return rows[0];
  }
}
