import { Router } from 'express';
import authRoutes from './authRoutes';
import assetRoutes from './assetRoutes';
import comparatorRoutes from './comparatorRoutes';
import simulatorRoutes from './simulatorRoutes';
import portfolioRoutes from './portfolioRoutes';
import cvmRoutes from './cvmRoutes';
import auditRoutes from './auditRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/assets', assetRoutes);
router.use('/comparator', comparatorRoutes);
router.use('/simulator', simulatorRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/cvm', cvmRoutes);
router.use('/audit', auditRoutes);

export default router;
