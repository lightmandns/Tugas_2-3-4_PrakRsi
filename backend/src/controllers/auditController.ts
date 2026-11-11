import type { Request, Response } from 'express';
import { respond } from './controllerUtils.ts';
import { AuditService } from '../services/auditService.ts';

export class AuditController {
  constructor(private readonly service: AuditService = new AuditService()) {}

  getAuditLogs = (_req: Request, res: Response) =>
    respond(res, () => this.service.getAuditLogs());
  createAuditLog = (req: Request, res: Response) =>
    respond(res, () => this.service.createAuditLog(req.body), 201);
}
