import { Router } from 'express';
import { SimulatorController } from '../controllers/simulatorController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();
router.use(authenticateToken);

// Simulador de Investimentos & Metas Atuariais
router.post('/simulate', SimulatorController.simulate);

export default router;
