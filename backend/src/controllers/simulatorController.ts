import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { FinancialMetricsService } from '../services/financialMetricsService';

export class SimulatorController {
  public static simulate(req: AuthenticatedRequest, res: Response): void {
    const {
      initialAmount = 1000000,
      monthlyContribution = 50000,
      periodMonths = 60,
      annualBenchmarkRatePct = 11.25, // CDI / Selic
      annualInflationPct = 4.50,      // IPCA
      riskPremiumPct = 5.50           // Spread da Meta Atuarial RPPS
    } = req.body;

    if (initialAmount < 0 || monthlyContribution < 0 || periodMonths <= 0) {
      res.status(400).json({ error: 'PARAMETROS_INVALIDOS', message: 'Valores monetários e período devem ser positivos.' });
      return;
    }

    try {
      const result = FinancialMetricsService.simulateFuturePortfolio({
        initialAmount: Number(initialAmount),
        monthlyContribution: Number(monthlyContribution),
        periodMonths: Number(periodMonths),
        annualBenchmarkRatePct: Number(annualBenchmarkRatePct),
        annualInflationPct: Number(annualInflationPct),
        riskPremiumPct: Number(riskPremiumPct)
      });

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: 'FALHA_SIMULACAO', message: error.message });
    }
  }
}
