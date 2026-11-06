import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddleware';
import { AuditService } from '../services/auditService';

/**
 * Middleware que intercepta requisições de mutação e gera o rastro de auditoria
 */
export const auditAction = (resource: string, actionName?: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Captura o IP do cliente (considerando proxies reversos se houver)
    const clientIp = (
      req.headers['x-forwarded-for'] as string ||
      req.socket.remoteAddress ||
      '127.0.0.1'
    ).split(',')[0].trim();

    const originalJson = res.json.bind(res);

    res.json = (body: any) => {
      // Executa apenas se a resposta teve status de sucesso (2xx)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const computedAction = actionName || `${req.method}_${resource.toUpperCase()}`;
        const recordId = req.params.id || body?.id || body?.data?.id;

        // Registra de forma assíncrona para não onerar o tempo de resposta
        AuditService.log({
          userId: req.user?.id,
          userEmail: req.user?.email,
          userRole: req.user?.role,
          action: computedAction,
          resource,
          recordId: recordId ? String(recordId) : undefined,
          ipAddress: clientIp,
          userAgent: req.headers['user-agent'],
          oldData: (req as any).oldStateSnapshot || null,
          newData: req.body || null,
        }).catch(err => console.error('[AUDIT MIDDLEWARE ERROR]', err));
      }

      return originalJson(body);
    };

    next();
  };
};
