import { Router } from 'express';
import { UserController } from '../controllers/userController.ts';

const userRouter = Router();
const controller = new UserController();

userRouter.get('/', (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.responses[200] = { description: 'Daftar user tanpa password hash' }
  return controller.getUsers(req, res);
});

userRouter.post('/', (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/UserInput' } }
  // #swagger.responses[201] = { description: 'User dibuat' }
  return controller.createUser(req, res);
});

export { userRouter };
