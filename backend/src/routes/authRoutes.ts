import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { requireRoles } from '../middlewares/rbacMiddleware';
import { auditAction } from '../middlewares/auditMiddleware';

const router = Router();

// Rotas Públicas
router.post('/login', AuthController.login);
router.post('/verify-email', AuthController.verifyEmail);

// Rotas Autenticadas
router.use(authenticateToken);
router.get('/profile', AuthController.getProfile);
router.post('/change-password', AuthController.changePassword);

// Gestão de Usuários & Perfis (Exclusivo Master Admin / Diretoria)
router.get('/users', requireRoles(['MASTER_ADMIN', 'DIRETORIA_EXECUTIVA']), AuthController.listUsers);

// Criação de novos usuários pelo Master Admin
router.post(
  '/users',
  requireRoles(['MASTER_ADMIN']),
  auditAction('users', 'CREATE_USER'),
  AuthController.createUser
);

// Atribuição de Perfis RBAC (EXCLUSIVO MASTER ADMIN: prof.jan100@gmail.com)
router.patch(
  '/users/:id/role',
  requireRoles(['MASTER_ADMIN', 'Administrador']),
  auditAction('users', 'ASSIGN_USER_ROLE'),
  AuthController.assignUserRole
);

// Exclusão de Usuários (EXCLUSIVO MASTER ADMIN)
router.delete(
  '/users/:id',
  requireRoles(['MASTER_ADMIN', 'Administrador']),
  auditAction('users', 'DELETE_USER'),
  AuthController.deleteUser
);

export default router;
