import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { FinancialMetricsService, AssetMetrics } from '../services/financialMetricsService';
import { db } from '../database/connection';

export class ComparatorController {
  /**
   * Compara 2 ou mais ativos lado a lado com métricas fundamentalistas e série normalizada
   */
  public static async compare(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { assetIds } = req.body;

    if (!Array.isArray(assetIds) || assetIds.length < 2) {
      res.status(400).json({
        error: 'PARAMETRO_INVALIDO',
        message: 'Informe uma lista com pelo menos 2 IDs de ativos para comparação.'
      });
      return;
    }

    try {
      const metricsList: AssetMetrics[] = [];
      for (const id of assetIds) {
        const m = await FinancialMetricsService.getAssetMetrics(id);
        if (m) {
          metricsList.push(m);
        }
      }

      if (metricsList.length === 0) {
        res.status(404).json({ error: 'NENHUM_ATIVO_ENCONTRADO' });
        return;
      }

      // Busca séries históricas dos últimos 180 dias de cada ativo para montar o gráfico comparativo normalizado (Base 100)
      const seriesMap: { [assetId: string]: Array<{ date: string; quota: number }> } = {};
      const allDatesSet = new Set<string>();

      for (const m of metricsList) {
        const rows = (await db.query(
          `SELECT reference_date, quota_value 
           FROM asset_daily_quotes 
           WHERE asset_id = $1 
           ORDER BY reference_date DESC 
           LIMIT 120`,
          [m.assetId]
        )).rows;

        const chronological = rows.reverse();
        seriesMap[m.assetId] = chronological.map(r => {
          const d = new Date(r.reference_date).toISOString().split('T')[0];
          allDatesSet.add(d);
          return { date: d, quota: parseFloat(r.quota_value) };
        });
      }

      const sortedDates = Array.from(allDatesSet).sort();

      // Monta série unificada base 100
      const normalizedChartData = sortedDates.map(date => {
        const point: any = { date };
        metricsList.forEach(m => {
          const series = seriesMap[m.assetId] || [];
          const item = series.find(s => s.date === date);
          const firstItem = series[0];
          if (item && firstItem && firstItem.quota > 0) {
            // Normalização: (cota_atual / cota_inicial) * 100
            point[m.tradingName] = parseFloat(((item.quota / firstItem.quota) * 100).toFixed(2));
          } else {
            point[m.tradingName] = null;
          }
        });
        return point;
      });

      res.json({
        comparedCount: metricsList.length,
        metrics: metricsList,
        normalizedChartData
      });

    } catch (error: any) {
      console.error('[COMPARATOR ERROR]', error);
      res.status(500).json({ error: 'FALHA_COMPARADOR', message: error.message });
    }
  }
}
