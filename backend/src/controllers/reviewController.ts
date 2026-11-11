import type { Request, Response } from 'express';
import { getIdParam, respond } from './controllerUtils.ts';
import { ReviewService } from '../services/reviewService.ts';

export class ReviewController {
  constructor(private readonly service: ReviewService = new ReviewService()) {}

  getReviews = (_req: Request, res: Response) => respond(res, () => this.service.getReviews());
  createReview = (req: Request, res: Response) =>
    respond(res, () => this.service.createReview(req.body), 201);
  deleteReview = (req: Request, res: Response) =>
    respond(res, () => this.service.deleteReview(getIdParam(req)));
}
