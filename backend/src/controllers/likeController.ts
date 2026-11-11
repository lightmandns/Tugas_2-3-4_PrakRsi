import type { Request, Response } from 'express';
import { getIdParam, respond } from './controllerUtils.ts';
import { LikeService } from '../services/likeService.ts';

export class LikeController {
  constructor(private readonly service: LikeService = new LikeService()) {}

  createLike = (req: Request, res: Response) =>
    respond(res, () => this.service.createLike(req.body), 201);
  deleteLike = (req: Request, res: Response) =>
    respond(res, () => this.service.deleteLike(getIdParam(req)));
}
