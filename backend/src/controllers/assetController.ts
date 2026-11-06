import { Response } from 'express';
import { db } from '../database/connection';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { FinancialMetricsService } from '../services/financialMetricsService';
import { PdfReportService } from '../services/pdfReportService';

export class AssetController {
  /**
   * Lista todos os ativos cadastrados
   */
  public static async list(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { status, assetClass, search } = req.query;

      let query = `
        SELECT a.*, r.article_code, r.description as cmn_desc, r.max_portfolio_limit_pct,
               u1.name as registered_by_name, u2.name as approved_by_name,
               (SELECT quota_value FROM asset_daily_quotes q WHERE q.asset_id = a.id ORDER BY reference_date DESC LIMIT 1) as latest_quota,
               (SELECT net_equity FROM asset_daily_quotes q WHERE q.asset_id = a.id ORDER BY reference_date DESC LIMIT 1) as latest_pl,
               (SELECT reference_date FROM asset_daily_quotes q WHERE q.asset_id = a.id ORDER BY reference_date DESC LIMIT 1) as latest_quote_date
        FROM assets a
        LEFT JOIN cmn_regulations r ON a.cmn_regulation_id = r.id
        LEFT JOIN users u1 ON a.registered_by = u1.id
        LEFT JOIN users u2 ON a.approved_by = u2.id
        WHERE 1=1
      `;
      const params: any[] = [];
      let pIdx = 1;

      if (status) {
        query += ` AND a.status = $${pIdx++}`;
        params.push(status);
      }
      if (assetClass) {
        query += ` AND a.asset_class = $${pIdx++}`;
        params.push(assetClass);
      }
      if (search) {
        query += ` AND (a.name ILIKE $${pIdx} OR a.trading_name ILIKE $${pIdx} OR a.cnpj ILIKE $${pIdx})`;
        params.push(`%${search}%`);
        pIdx++;
      }

      query += ` ORDER BY a.created_at DESC`;

      const result = await db.query(query, params);
      res.json(result.rows);
    } catch (error: any) {
      console.error('[ASSET LIST ERROR]', error);
      res.status(500).json({ error: 'FALHA_CONSULTA_ATIVOS', message: error.message });
    }
  }

  /**
   * Obtém detalhes e métricas fundamentalistas do ativo
   */
  public static async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const metrics = await FinancialMetricsService.getAssetMetrics(id);
      if (!metrics) {
        res.status(404).json({ error: 'ATIVO_NAO_ENCONTRADO' });
        return;
      }

      const assetDetails = (await db.query(`SELECT * FROM assets WHERE id = $1`, [id])).rows[0];

      // Busca série histórica recente de cotas para gráfico (últimos 90 dias)
      const chartPoints = (await db.query(
        `SELECT reference_date, quota_value, net_equity, daily_return_pct 
         FROM asset_daily_quotes 
         WHERE asset_id = $1 
         ORDER BY reference_date ASC 
         LIMIT 90`,
        [id]
      )).rows;

      res.json({
        asset: assetDetails,
        metrics,
        chartPoints
      });
    } catch (error: any) {
      res.status(500).json({ error: 'FALHA_DETALHES_ATIVO', message: error.message });
    }
  }

  /**
   * Cadastra novo ativo financeiro
   */
  public static async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    const {
      cnpj,
      cvmCode,
      name,
      tradingName,
      assetClass,
      cmnRegulationId,
      administrator,
      administratorCnpj,
      manager,
      custodian,
      benchmark,
      riskLevel,
      anbimaCategory,
      liquidityDays,
      adminFeePct,
      performanceFeePct,
      maturityDate
    } = req.body;

    if (!name || !assetClass || !administrator || !manager || !riskLevel) {
      res.status(400).json({
        error: 'CAMPOS_OBRIGATORIOS_AUSENTES',
        message: 'Nome, Classe, Administrador, Gestor e Nível de Risco são obrigatórios.'
      });
      return;
    }

    try {
      // Regra RBAC de Governança:
      // Se quem cadastrou for DIRETORIA_EXECUTIVA, pode já nascer aprovado ou pendente.
      // Se for COMITE_INVESTIMENTOS, nasce obrigatoriamente como 'PENDENTE_APROVACAO'.
      const initialStatus = req.user?.role === 'DIRETORIA_EXECUTIVA' ? 'APROVADO' : 'PENDENTE_APROVACAO';
      const approvedBy = initialStatus === 'APROVADO' ? req.user?.id : null;
      const approvedAt = initialStatus === 'APROVADO' ? new Date() : null;

      const query = `
        INSERT INTO assets (
          cnpj, cvm_code, name, trading_name, asset_class, cmn_regulation_id,
          administrator, administrator_cnpj, manager, custodian,
          benchmark, risk_level, anbima_category, liquidity_days,
          admin_fee_pct, performance_fee_pct, maturity_date,
          status, registered_by, approved_by, approved_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10,
          $11, $12, $13, $14,
          $15, $16, $17,
          $18, $19, $20, $21
        ) RETURNING *
      `;

      const values = [
        cnpj || null,
        cvmCode || null,
        name,
        tradingName || name,
        assetClass,
        cmnRegulationId || null,
        administrator,
        administratorCnpj || null,
        manager,
        custodian || null,
        benchmark || 'CDI',
        riskLevel,
        anbimaCategory || null,
        liquidityDays || 0,
        adminFeePct || 0.0,
        performanceFeePct || 0.0,
        maturityDate || null,
        initialStatus,
        req.user?.id,
        approvedBy,
        approvedAt
      ];

      const result = await db.query(query, values);
      res.status(201).json({
        message: initialStatus === 'APROVADO' 
          ? 'Ativo cadastrado e aprovado com sucesso!' 
          : 'Ativo cadastrado com sucesso e encaminhado para aprovação da Diretoria Executiva.',
        data: result.rows[0]
      });
    } catch (error: any) {
      console.error('[ASSET CREATE ERROR]', error);
      res.status(500).json({ error: 'FALHA_CRIACAO_ATIVO', message: error.message });
    }
  }

  /**
   * Aprovação ou Rejeição de Ativo (Exclusivo Diretoria Executiva)
   */
  public static async evaluateAsset(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const { decision, rejectionReason } = req.body; // 'APROVAR' ou 'REJEITAR'

    if (!['APROVAR', 'REJEITAR'].includes(decision)) {
      res.status(400).json({ error: 'DECISAO_INVALIDA', message: 'Decisão deve ser APROVAR ou REJEITAR.' });
      return;
    }

    try {
      const status = decision === 'APROVAR' ? 'APROVADO' : 'REJEITADO';
      const approvedAt = decision === 'APROVAR' ? new Date() : null;

      const result = await db.query(
        `UPDATE assets 
         SET status = $1, approved_by = $2, approved_at = $3, rejection_reason = $4, updated_at = CURRENT_TIMESTAMP
         WHERE id = $5 RETURNING *`,
        [status, req.user?.id, approvedAt, rejectionReason || null, id]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'ATIVO_NAO_ENCONTRADO' });
        return;
      }

      res.json({
        message: `Ativo ${decision === 'APROVAR' ? 'aprovado' : 'rejeitado'} com sucesso pela Diretoria Executiva.`,
        asset: result.rows[0]
      });
    } catch (error: any) {
      res.status(500).json({ error: 'FALHA_AVALIACAO_ATIVO', message: error.message });
    }
  }

  /**
   * Exporta One-Page Report do Ativo para o Comitê de Investimentos
   */
  public static async exportOnePageReport(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const metrics = await FinancialMetricsService.getAssetMetrics(id);
      if (!metrics) {
        res.status(404).send('Ativo não encontrado.');
        return;
      }

      const assetDetails = (await db.query(`SELECT * FROM assets WHERE id = $1`, [id])).rows[0];
      const html = PdfReportService.generateOnePageHtml(metrics, assetDetails);

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(html);
    } catch (error: any) {
      res.status(500).send(`Erro ao gerar relatório: ${error.message}`);
    }
  }
}
