import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { CvmIngestionService } from '../services/cvmIngestionService';
import { db } from '../database/connection';

export class CvmController {
  /**
   * Disparo manual da sincronização CVM (Geralmente via Comitê ou Diretoria)
   */
  public static async triggerSync(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { targetDate } = req.body;
    try {
      const result = await CvmIngestionService.executeDailySync(targetDate);
      res.json({
        message: 'Execução do serviço CVM finalizada.',
        result
      });
    } catch (error: any) {
      res.status(500).json({ error: 'FALHA_EXECUCAO_CVM', message: error.message });
    }
  }

  /**
   * Lista o histórico de execuções do serviço de automação CVM
   */
  public static async getLogs(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await db.query(
        `SELECT * FROM cvm_ingestion_logs ORDER BY executed_at DESC LIMIT 30`
      );
      res.json(result.rows);
    } catch (error: any) {
      res.status(500).json({ error: 'FALHA_LOGS_CVM', message: error.message });
    }
  }
}
