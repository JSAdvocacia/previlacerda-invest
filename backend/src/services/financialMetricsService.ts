import { db } from '../database/connection';

export interface AssetMetrics {
  assetId: string;
  name: string;
  tradingName: string;
  cnpj: string;
  assetClass: string;
  riskLevel: string;
  benchmark: string;
  adminFeePct: number;
  performanceFeePct: number;
  currentQuota: number;
  currentNetEquity: number;
  shareholdersCount: number;
  returns: {
    oneMonth: number;
    sixMonths: number;
    twelveMonths: number;
    twentyFourMonths: number;
    yearToDate: number;
    allTime: number;
  };
  volatilityTwelveMonths: number; // Volatilidade anualizada (%)
  sharpeRatioTwelveMonths: number; // Índice Sharpe 12M
  maxDrawdownTwelveMonths: number; // Queda máxima (%)
  benchmarkComparisonTwelveMonths: {
    assetReturn: number;
    cdiReturn: number;
    pctOfCdi: number;
  };
  cmnRegulation?: {
    articleCode: string;
    description: string;
    maxLimitPct: number;
  };
}

export class FinancialMetricsService {
  /**
   * Calcula desvio padrão de retornos diários
   */
  public static calculateStandardDeviation(values: number[]): number {
    if (values.length < 2) return 0;
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    const variance = squaredDiffs.reduce((sum, v) => sum + v, 0) / (values.length - 1);
    return Math.sqrt(variance);
  }

  /**
   * Calcula volatilidade anualizada padrão mercado brasileiro (252 dias úteis)
   */
  public static calculateAnnualizedVolatility(dailyReturnsPct: number[]): number {
    if (dailyReturnsPct.length < 20) return 0;
    const dailyStdDev = this.calculateStandardDeviation(dailyReturnsPct.map(r => r / 100));
    return dailyStdDev * Math.sqrt(252) * 100;
  }

  /**
   * Calcula a queda máxima (Maximum Drawdown) a partir das cotas diárias
   */
  public static calculateMaxDrawdown(quotes: number[]): number {
    if (quotes.length < 2) return 0;
    let peak = quotes[0];
    let maxDrawdown = 0;

    for (const quote of quotes) {
      if (quote > peak) {
        peak = quote;
      }
      const drawdown = (quote - peak) / peak;
      if (drawdown < maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }

    return Math.abs(maxDrawdown * 100);
  }

  /**
   * Computa o pacote completo de métricas fundamentalistas de um ativo
   */
  public static async getAssetMetrics(assetId: string): Promise<AssetMetrics | null> {
    const assetQuery = `
      SELECT a.*, r.article_code, r.description as cmn_desc, r.max_portfolio_limit_pct
      FROM assets a
      LEFT JOIN cmn_regulations r ON a.cmn_regulation_id = r.id
      WHERE a.id = $1
    `;
    const assetResult = await db.query(assetQuery, [assetId]);
    if (assetResult.rows.length === 0) return null;

    const asset = assetResult.rows[0];

    // Busca histórico de cotas dos últimos 24 meses
    const quotesQuery = `
      SELECT reference_date, quota_value, net_equity, shareholders_count, daily_return_pct
      FROM asset_daily_quotes
      WHERE asset_id = $1
      ORDER BY reference_date DESC
      LIMIT 520
    `;
    const quotesResult = await db.query(quotesQuery, [assetId]);
    const quotes = quotesResult.rows;

    const latest = quotes[0] || {
      quota_value: '10.0',
      net_equity: '100000000.0',
      shareholders_count: 1000
    };

    const currentQuota = parseFloat(latest.quota_value);
    const currentPL = parseFloat(latest.net_equity);
    const shareholders = parseInt(latest.shareholders_count, 10);

    // Índices de tempo aproximados em dias úteis (1M=21, 6M=126, 12M=252, 24M=504)
    const getReturnAtLag = (lag: number): number => {
      if (quotes.length <= lag) {
        if (quotes.length > 1) {
          const oldest = parseFloat(quotes[quotes.length - 1].quota_value);
          return oldest > 0 ? ((currentQuota / oldest) - 1) * 100 : 0;
        }
        return 0;
      }
      const past = parseFloat(quotes[lag].quota_value);
      return past > 0 ? ((currentQuota / past) - 1) * 100 : 0;
    };

    const return1M = getReturnAtLag(21);
    const return6M = getReturnAtLag(126);
    const return12M = getReturnAtLag(252);
    const return24M = getReturnAtLag(504);
    const returnAllTime = quotes.length > 0 ? ((currentQuota / parseFloat(quotes[quotes.length - 1].quota_value)) - 1) * 100 : 0;

    // Retorno do ano atual (YTD)
    const currentYear = new Date().getFullYear();
    const firstQuoteYear = quotes.find(q => new Date(q.reference_date).getFullYear() === currentYear && new Date(q.reference_date).getMonth() === 0);
    const returnYTD = firstQuoteYear 
      ? ((currentQuota / parseFloat(firstQuoteYear.quota_value)) - 1) * 100 
      : return6M;

    // Retornos diários para volatilidade e Sharpe (amostra de 12 meses)
    const twelveMonthsQuotes = quotes.slice(0, 252);
    const dailyReturns = twelveMonthsQuotes
      .map(q => q.daily_return_pct ? parseFloat(q.daily_return_pct) : 0)
      .filter(r => !isNaN(r));

    const quoteValues = twelveMonthsQuotes.map(q => parseFloat(q.quota_value)).reverse();

    const volatility12M = this.calculateAnnualizedVolatility(dailyReturns);
    const maxDrawdown12M = this.calculateMaxDrawdown(quoteValues);

    // CDI de referência estimado de 12 meses (~10.75% a.a.)
    const estimatedCdi12M = 10.75;
    const sharpe12M = volatility12M > 0 
      ? (return12M - estimatedCdi12M) / volatility12M 
      : 0;

    const pctOfCdi = estimatedCdi12M > 0 ? (return12M / estimatedCdi12M) * 100 : 0;

    return {
      assetId: asset.id,
      name: asset.name,
      tradingName: asset.trading_name || asset.name,
      cnpj: asset.cnpj,
      assetClass: asset.asset_class,
      riskLevel: asset.risk_level,
      benchmark: asset.benchmark,
      adminFeePct: parseFloat(asset.admin_fee_pct || '0'),
      performanceFeePct: parseFloat(asset.performance_fee_pct || '0'),
      currentQuota,
      currentNetEquity: currentPL,
      shareholdersCount: shareholders,
      returns: {
        oneMonth: parseFloat(return1M.toFixed(2)),
        sixMonths: parseFloat(return6M.toFixed(2)),
        twelveMonths: parseFloat(return12M.toFixed(2)),
        twentyFourMonths: parseFloat(return24M.toFixed(2)),
        yearToDate: parseFloat(returnYTD.toFixed(2)),
        allTime: parseFloat(returnAllTime.toFixed(2))
      },
      volatilityTwelveMonths: parseFloat(volatility12M.toFixed(2)),
      sharpeRatioTwelveMonths: parseFloat(sharpe12M.toFixed(2)),
      maxDrawdownTwelveMonths: parseFloat(maxDrawdown12M.toFixed(2)),
      benchmarkComparisonTwelveMonths: {
        assetReturn: parseFloat(return12M.toFixed(2)),
        cdiReturn: estimatedCdi12M,
        pctOfCdi: parseFloat(pctOfCdi.toFixed(1))
      },
      cmnRegulation: asset.article_code ? {
        articleCode: asset.article_code,
        description: asset.cmn_desc,
        maxLimitPct: parseFloat(asset.max_portfolio_limit_pct)
      } : undefined
    };
  }

  /**
   * Simulação estocástica e determinística de aportes futuros
   */
  public static simulateFuturePortfolio(params: {
    initialAmount: number;
    monthlyContribution: number;
    periodMonths: number;
    annualBenchmarkRatePct: number; // e.g. Selic ou CDI (11.25%)
    annualInflationPct: number;     // e.g. IPCA (4.50%)
    riskPremiumPct: number;          // e.g. Spread atuarial (5.50%)
  }) {
    const {
      initialAmount,
      monthlyContribution,
      periodMonths,
      annualBenchmarkRatePct,
      annualInflationPct,
      riskPremiumPct
    } = params;

    // Taxa Atuarial RPPS Anual = (1 + IPCA) * (1 + Spread) - 1
    const actuarialTargetAnnual = ((1 + annualInflationPct / 100) * (1 + riskPremiumPct / 100) - 1) * 100;
    
    // Converte taxas anuais em mensais equivalentes: (1 + i_a)^(1/12) - 1
    const monthlyBenchmarkRate = Math.pow(1 + annualBenchmarkRatePct / 100, 1 / 12) - 1;
    const monthlyActuarialRate = Math.pow(1 + actuarialTargetAnnual / 100, 1 / 12) - 1;

    let balanceBenchmark = initialAmount;
    let balanceActuarial = initialAmount;
    let balanceNoYield = initialAmount;

    const timeline: Array<{
      month: number;
      year: number;
      totalDeposited: number;
      balanceBenchmark: number;
      balanceActuarial: number;
      earningsActuarial: number;
    }> = [];

    for (let m = 1; m <= periodMonths; m++) {
      // Rendimento sobre o saldo inicial do mês
      balanceBenchmark = (balanceBenchmark * (1 + monthlyBenchmarkRate)) + monthlyContribution;
      balanceActuarial = (balanceActuarial * (1 + monthlyActuarialRate)) + monthlyContribution;
      balanceNoYield += monthlyContribution;

      if (m % 6 === 0 || m === periodMonths) {
        timeline.push({
          month: m,
          year: parseFloat((m / 12).toFixed(1)),
          totalDeposited: parseFloat(balanceNoYield.toFixed(2)),
          balanceBenchmark: parseFloat(balanceBenchmark.toFixed(2)),
          balanceActuarial: parseFloat(balanceActuarial.toFixed(2)),
          earningsActuarial: parseFloat((balanceActuarial - balanceNoYield).toFixed(2))
        });
      }
    }

    return {
      finalBalanceActuarial: parseFloat(balanceActuarial.toFixed(2)),
      finalBalanceBenchmark: parseFloat(balanceBenchmark.toFixed(2)),
      totalInvested: parseFloat(balanceNoYield.toFixed(2)),
      totalInterestEarned: parseFloat((balanceActuarial - balanceNoYield).toFixed(2)),
      actuarialTargetAnnualPct: parseFloat(actuarialTargetAnnual.toFixed(2)),
      timeline
    };
  }
}
