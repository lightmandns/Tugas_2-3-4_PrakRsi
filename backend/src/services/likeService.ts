import { LikeRepository, type CreateLikeInput } from '../repositories/likeRepository.ts';
import { assertResourceExists, isPositiveId } from './validation.ts';

export class LikeService {
  constructor(private readonly repository: LikeRepository = new LikeRepository()) {}

  async createLike(input: CreateLikeInput) {
    if (!isPositiveId(input?.reviewId) || !isPositiveId(input?.userId)) {
      throw new Error('INVALID_INPUT');
    }
    return assertResourceExists(await this.repository.create(input));
  }

  async deleteLike(id: number) {
    if (!isPositiveId(id)) throw new Error('INVALID_INPUT');
    return assertResourceExists(await this.repository.remove(id));
  }
}
