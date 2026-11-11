import { Router } from 'express';
import { LikeController } from '../controllers/likeController.ts';

const likeRouter = Router();
const controller = new LikeController();

likeRouter.post('/', (req, res) => {
  // #swagger.tags = ['Likes']
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/LikeInput' } }
  // #swagger.responses[201] = { description: 'Like dibuat' }
  return controller.createLike(req, res);
});

likeRouter.delete('/:id', (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  return controller.deleteLike(req, res);
});

export { likeRouter };
