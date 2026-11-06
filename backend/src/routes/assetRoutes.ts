import { Router } from 'express';
import { AssetController } from '../controllers/assetController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { requireRoles, blockReadOnlyAudit } from '../middlewares/rbacMiddleware';
import { auditAction } from '../middlewares/auditMiddleware';

const router = Router();

// Aplica autenticação em todas as rotas
router.use(authenticateToken);
router.use(blockReadOnlyAudit);

// Rotas de Leitura (Acesso livre a todos os 3 perfis do RPPS)
router.get('/', AssetController.list);
router.get('/:id', AssetController.getById);
router.get('/:id/report', AssetController.exportOnePageReport);

// Cadastro de Ativos (Comitê de Investimentos ou Diretoria Executiva)
router.post(
  '/',
  requireRoles(['DIRETORIA_EXECUTIVA', 'COMITE_INVESTIMENTOS']),
  auditAction('assets', 'CREATE_ASSET'),
  AssetController.create
);

// Avaliação / Aprovação de Ativo (EXCLUSIVO DIRETORIA EXECUTIVA)
router.patch(
  '/:id/evaluate',
  requireRoles(['DIRETORIA_EXECUTIVA']),
  auditAction('assets', 'EVALUATE_ASSET'),
  AssetController.evaluateAsset
);

export default router;
