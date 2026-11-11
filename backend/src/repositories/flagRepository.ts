import { desc, eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { flags } from '../db/schema.ts';

export class FlagRepository {
  async findAll() {
    const db = await getDb();
    return db.select().from(flags).orderBy(desc(flags.createdAt), desc(flags.id));
  }

  async updateStatus(id: number, status: string) {
    const db = await getDb();
    const rows = await db
      .update(flags)
      .set({ status })
      .where(eq(flags.id, id))
      .output();
    return rows[0];
  }
}
