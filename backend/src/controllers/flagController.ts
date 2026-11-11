import type { Request, Response } from 'express';
import { getIdParam, respond } from './controllerUtils.ts';
import { FlagService } from '../services/flagService.ts';

export class FlagController {
  constructor(private readonly service: FlagService = new FlagService()) {}

  getFlags = (_req: Request, res: Response) => respond(res, () => this.service.getFlags());
  updateFlagStatus = (req: Request, res: Response) =>
    respond(res, () => this.service.updateFlagStatus(getIdParam(req), req.body?.status));
}
