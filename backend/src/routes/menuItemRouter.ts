import { Router } from 'express';
import { MenuItemController } from '../controllers/menuItemController.ts';

const menuItemRouter = Router();
const controller = new MenuItemController();

menuItemRouter.get('/', (req, res) => {
  // #swagger.tags = ['Menu Items']
  // #swagger.responses[200] = { description: 'Daftar menu beserta nama warung' }
  return controller.getMenuItems(req, res);
});

menuItemRouter.post('/', (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/MenuItemInput' } }
  // #swagger.responses[201] = { description: 'Menu dibuat' }
  return controller.createMenuItem(req, res);
});

menuItemRouter.get('/:id', (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  return controller.getMenuItem(req, res);
});

menuItemRouter.put('/:id', (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/MenuItemInput' } }
  return controller.updateMenuItem(req, res);
});

menuItemRouter.delete('/:id', (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  return controller.deleteMenuItem(req, res);
});

export { menuItemRouter };
