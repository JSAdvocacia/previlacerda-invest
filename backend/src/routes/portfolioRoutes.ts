import { Router } from 'express';
import { PortfolioController } from '../controllers/portfolioController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();
router.use(authenticateToken);

// Dashboard Gerencial da Carteira do PREVI-LACERDA
router.get('/dashboard', PortfolioController.getDashboardOverview);

export default router;
