import { Router } from 'express';
import { StallController } from '../controllers/stallController.ts';
import { ReviewController } from '../controllers/reviewController.ts'; 

// Import middleware dan schema
import { validate } from '../middlewares/validateMiddleware';
import { authenticate, authorize, isOwnerOrAdmin } from '../middlewares/authMiddleware';
import { 
  getStallsQuerySchema, 
  getStallByIdSchema, 
  createStallSchema, 
  updateStallSchema, 
  deleteStallSchema, 
  createReviewSchema 
} from '../schemas/stallSchema';

const stallRouter = Router();
const stallController = new StallController();
const reviewController = new ReviewController();

stallRouter.get('/', validate(getStallsQuerySchema), (req, res) => {
  // #swagger.parameters['search']   = { in: 'query', type: 'string' }
  // #swagger.parameters['category'] = { in: 'query', type: 'string' }
  // #swagger.parameters['page']     = { in: 'query', type: 'integer' }
  // #swagger.parameters['limit']    = { in: 'query', type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar warung' }
  return stallController.getStalls(req, res);
});

stallRouter.post('/', authenticate, authorize(['owner', 'admin']), validate(createStallSchema), (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/StallInput' } }
  // #swagger.responses[201] = { description: 'Warung dibuat' }
  return stallController.createStall(req, res);
});

stallRouter.get('/:id', validate(getStallByIdSchema), (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Detail warung' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return stallController.getStallById(req, res);
});

stallRouter.put('/:id', authenticate, isOwnerOrAdmin, validate(updateStallSchema), (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/StallInput' } }
  // #swagger.responses[200] = { description: 'Warung ter-update' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return stallController.updateStall(req, res);
});

stallRouter.delete('/:id', authenticate, authorize(['admin']), validate(deleteStallSchema), (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Warung terhapus' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return stallController.deleteStall(req, res);
});

// Endpoint bawaan dari Tugas 2 Anda
stallRouter.get('/:id/menus', validate(getStallByIdSchema), (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar menu' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return stallController.getStallMenus(req, res);
});

// Endpoint Baru untuk Tugas 3: POST /stalls/:id/reviews
stallRouter.post('/:id/reviews', authenticate, validate(createReviewSchema), (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/ReviewInput' } }
  // #swagger.responses[201] = { description: 'Review ditambahkan' }
  return reviewController.createReview(req, res); 
});

export { stallRouter };