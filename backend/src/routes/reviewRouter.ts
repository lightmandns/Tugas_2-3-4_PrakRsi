import { Router } from 'express';
import { ReviewController } from '../controllers/reviewController.ts';

const reviewRouter = Router();
const controller = new ReviewController();

reviewRouter.get('/', (req, res) => {
  // #swagger.tags = ['Reviews']
  // #swagger.responses[200] = { description: 'Daftar review beserta nama user' }
  return controller.getReviews(req, res);
});

reviewRouter.post('/', (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/ReviewInput' } }
  // #swagger.responses[201] = { description: 'Review dibuat' }
  return controller.createReview(req, res);
});

reviewRouter.delete('/:id', (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  return controller.deleteReview(req, res);
});

export { reviewRouter };
