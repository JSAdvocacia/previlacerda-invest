import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, UserRole } from './authMiddleware';

/**
 * Middleware para restrição por papéis de usuário (RBAC)
 * O perfil MASTER_ADMIN possui acesso universal automático a qualquer recurso.
 */
export const requireRoles = (allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'ACESSO_NAO_AUTORIZADO',
        message: 'Usuário não autenticado.'
      });
      return;
    }

    // MASTER_ADMIN sempre possui acesso total
    if (req.user.role === 'MASTER_ADMIN') {
      next();
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: 'ACESSO_NEGADO',
        message: `O perfil [${req.user.role}] não possui permissão para executar esta ação.`,
        requiredRoles: allowedRoles
      });
      return;
    }

    next();
  };
};

/**
 * Middleware de Segurança Estrito: Impede mutação por usuários de auditoria (Read-Only)
 */
export const blockReadOnlyAudit = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role === 'AUDITORIA_CONSELHO_FISCAL' && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    res.status(403).json({
      error: 'OPERACAO_BLOQUEADA_AUDITORIA',
      message: 'O Conselho Fiscal / Auditoria possui perfil estritamente de LEITURA (Read-Only). Nenhuma alteração é permitida.'
    });
    return;
  }
  next();
};
