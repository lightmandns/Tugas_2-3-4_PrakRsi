import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { validate } from '../middlewares/validateMiddleware';
import { registerSchema, loginSchema } from '../schemas/authSchema';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// Endpoint Publik
router.post('/register', validate(registerSchema), (req, res, next) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/RegisterInput' } }
  return register(req, res, next);
});
router.post('/login', validate(loginSchema), (req, res, next) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/LoginInput' } }
  return login(req, res, next);
});

// Endpoint Terlindungi (Komentar dibuka setelah authMiddleware dibuat)
router.get('/me', authenticate, (req, res, next) => {
  // #swagger.responses[200] = { description: 'Data profil user' }
  return getMe(req, res, next);
});

export { router as authRouter };