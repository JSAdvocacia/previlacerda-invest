import { Router } from 'express';
import { ComparatorController } from '../controllers/comparatorController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();
router.use(authenticateToken);

// Comparação Interativa de Ativos (Estilo Investidor10)
router.post('/compare', ComparatorController.compare);

export default router;
