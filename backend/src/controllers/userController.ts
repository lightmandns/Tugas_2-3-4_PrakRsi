import type { Request, Response } from 'express';
import { respond } from './controllerUtils.ts';
import { UserService } from '../services/userService.ts';

export class UserController {
  constructor(private readonly service: UserService = new UserService()) {}

  getUsers = (_req: Request, res: Response) => respond(res, () => this.service.getUsers());
  createUser = (req: Request, res: Response) =>
    respond(res, () => this.service.createUser(req.body), 201);
}
