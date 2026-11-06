import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { AuditService } from '../services/auditService';

export class AuditController {
  /**
   * Consulta os logs de auditoria imutáveis
   * Acesso liberado para AUDITORIA_CONSELHO_FISCAL e DIRETORIA_EXECUTIVA
   */
  public static async list(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { resource, action, userId, startDate, endDate, limit, offset } = req.query;

    try {
      const logs = await AuditService.getLogs({
        resource: resource as string,
        action: action as string,
        userId: userId as string,
        startDate: startDate as string,
        endDate: endDate as string,
        limit: limit ? parseInt(limit as string, 10) : 50,
        offset: offset ? parseInt(offset as string, 10) : 0
      });

      res.json(logs);
    } catch (error: any) {
      console.error('[AUDIT CONTROLLER ERROR]', error);
      res.status(500).json({ error: 'FALHA_CONSULTA_AUDITORIA', message: error.message });
    }
  }
}
