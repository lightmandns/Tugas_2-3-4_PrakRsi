import { Router } from 'express';
import { AuditController } from '../controllers/auditController.ts';

const auditRouter = Router();
const controller = new AuditController();

auditRouter.get('/', (req, res) => {
  // #swagger.tags = ['Audit']
  // #swagger.responses[200] = { description: 'Daftar audit log' }
  return controller.getAuditLogs(req, res);
});

auditRouter.post('/', (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/AuditInput' } }
  // #swagger.responses[201] = { description: 'Audit log dibuat' }
  return controller.createAuditLog(req, res);
});

export { auditRouter };
