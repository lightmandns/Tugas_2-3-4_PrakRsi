import { Router } from 'express';
import { FlagController } from '../controllers/flagController.ts';

const flagRouter = Router();
const controller = new FlagController();

flagRouter.get('/', (req, res) => {
  // #swagger.tags = ['Flags']
  // #swagger.responses[200] = { description: 'Daftar laporan' }
  return controller.getFlags(req, res);
});

flagRouter.put('/:id', (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/FlagStatusInput' } }
  return controller.updateFlagStatus(req, res);
});

export { flagRouter };
