import { Router } from 'express';
import { AuditController } from '../controllers/auditController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { requireRoles } from '../middlewares/rbacMiddleware';

const router = Router();
router.use(authenticateToken);

// Consulta à Trilha de Auditoria Imutável (Audit Trail)
// Exclusivo para Conselho Fiscal/Auditoria e Diretoria Executiva
router.get(
  '/logs',
  requireRoles(['AUDITORIA_CONSELHO_FISCAL', 'DIRETORIA_EXECUTIVA']),
  AuditController.list
);

export default router;
