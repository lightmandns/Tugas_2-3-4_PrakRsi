import type { Request, Response } from 'express';
import { getIdParam, respond } from './controllerUtils.ts';
import { MenuItemService } from '../services/menuItemService.ts';

export class MenuItemController {
  constructor(private readonly service: MenuItemService = new MenuItemService()) {}

  getMenuItems = (_req: Request, res: Response) =>
    respond(res, () => this.service.getMenuItems());
  getMenuItem = (req: Request, res: Response) =>
    respond(res, () => this.service.getMenuItem(getIdParam(req)));
  createMenuItem = (req: Request, res: Response) =>
    respond(res, () => this.service.createMenuItem(req.body), 201);
  updateMenuItem = (req: Request, res: Response) =>
    respond(res, () => this.service.updateMenuItem(getIdParam(req), req.body));
  deleteMenuItem = (req: Request, res: Response) =>
    respond(res, () => this.service.deleteMenuItem(getIdParam(req)));
}
