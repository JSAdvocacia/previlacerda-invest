export type UserRole = 
  | 'MASTER_ADMIN' 
  | 'DIRETORIA_EXECUTIVA' 
  | 'COMITE_INVESTIMENTOS' 
  | 'AUDITORIA_CONSELHO_FISCAL';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  cpf?: string;
  is_email_verified: boolean;
  must_change_password: boolean;
}

export type AssetClass = 
  | 'RENDA_FIXA' 
  | 'RENDA_VARIAVEL' 
  | 'INVESTIMENTO_EXTERIOR' 
  | 'MULTIMERCADO' 
  | 'IMOVEIS_FII' 
  | 'TITULO_PUBLICO_DIRETO';

export type RiskLevel = 'MUITO_BAIXO' | 'BAIXO' | 'MEDIO' | 'ALTO' | 'MUITO_ALTO';
export type AssetStatus = 'PENDENTE_APROVACAO' | 'APROVADO' | 'REJEITADO' | 'INATIVO';

export interface Asset {
  id: string;
  cnpj: string;
  cvm_code?: string;
  name: string;
  trading_name: string;
  asset_class: AssetClass;
  article_code?: string;
  max_portfolio_limit_pct?: number;
  administrator: string;
  manager: string;
  custodian?: string;
  benchmark: string;
  risk_level: RiskLevel;
  anbima_category?: string;
  liquidity_days: number;
  admin_fee_pct: number;
  performance_fee_pct: number;
  maturity_date?: string;
  status: AssetStatus;
  latest_quota?: number;
  latest_pl?: number;
  latest_quote_date?: string;
}

export interface AssetMetrics {
  assetId: string;
  name: string;
  tradingName: string;
  cnpj: string;
  assetClass: string;
  riskLevel: RiskLevel;
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
  volatilityTwelveMonths: number;
  sharpeRatioTwelveMonths: number;
  maxDrawdownTwelveMonths: number;
  benchmarkComparisonTwelveMonths: {
    assetReturn: number;
    cdiReturn: number;
    pctOfCdi: number;
  };
  cmnRegulation?: {
    articleCode: string;
    description: string;
    maxLimitPct: number;
    regulationNorm?: string;
    regulationUrl?: string;
  };
}

export interface PortfolioOverview {
  totalAum: number;
  allocationsCount: number;
  regulationNorm: string;
  regulationUrl: string;
  returns: {
    month: number;
    year: number;
    twelveMonths: number;
    actuarialTarget12M: number;
    cdi12M: number;
    pctOfActuarialTarget: number;
    pctOfCdi: number;
  };
  classAllocation: Array<{
    assetClass: string;
    amount: number;
    percentage: number;
  }>;
  cmnCompliance: Array<{
    articleCode: string;
    maxLimitPct: number;
    currentAllocatedPct: number;
    isCompliant: boolean;
    marginPct: number;
  }>;
  evolutionHistory: Array<{
    month: string;
    portfolioValue: number;
    benchmarkCdi: number;
    actuarialTarget: number;
  }>;
  allocations: any[];
}

export interface AuditLog {
  id: number;
  user_id: string;
  user_email: string;
  user_role: string;
  action: string;
  resource: string;
  record_id?: string;
  ip_address: string;
  user_agent?: string;
  old_data?: any;
  new_data?: any;
  timestamp: string;
  integrity_hash?: string;
}

export interface CvmLog {
  id: number;
  job_identifier: string;
  target_date: string;
  file_processed: string;
  total_records_read: number;
  assets_updated: number;
  execution_time_seconds: number;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  error_message?: string;
  executed_at: string;
}
