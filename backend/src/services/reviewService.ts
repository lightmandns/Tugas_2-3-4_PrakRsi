import { ReviewRepository, type CreateReviewInput } from '../repositories/reviewRepository.ts';
import { assertResourceExists, isPositiveId } from './validation.ts';

export class ReviewService {
  constructor(private readonly repository: ReviewRepository = new ReviewRepository()) {}

  async getReviews() {
    return this.repository.findAll();
  }

  async createReview(input: CreateReviewInput) {
    if (
      !isPositiveId(input?.stallId) ||
      !isPositiveId(input?.userId) ||
      !Number.isInteger(input?.rating) ||
      input.rating < 1 ||
      input.rating > 5 ||
      (input.comment !== undefined && input.comment !== null && typeof input.comment !== 'string')
    ) {
      throw new Error('INVALID_INPUT');
    }
    return assertResourceExists(await this.repository.create(input));
  }

  async deleteReview(id: number) {
    if (!isPositiveId(id)) throw new Error('INVALID_INPUT');
    return assertResourceExists(await this.repository.remove(id));
  }
}
