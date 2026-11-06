import { Router } from 'express';
import { CvmController } from '../controllers/cvmController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { requireRoles } from '../middlewares/rbacMiddleware';
import { auditAction } from '../middlewares/auditMiddleware';

const router = Router();
router.use(authenticateToken);

// Histórico de Execuções dos Jobs CVM (Leitura)
router.get('/logs', CvmController.getLogs);

// Gatilho Manual da Sincronização CVM (Comitê ou Diretoria)
router.post(
  '/sync',
  requireRoles(['DIRETORIA_EXECUTIVA', 'COMITE_INVESTIMENTOS']),
  auditAction('cvm_sync', 'TRIGGER_MANUAL_CVM_SYNC'),
  CvmController.triggerSync
);

export default router;
