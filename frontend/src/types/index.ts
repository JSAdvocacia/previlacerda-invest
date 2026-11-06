export type UserRole = 
  | 'Administrador'
  | 'Diretor Executivo'
  | 'Membro do Comitê'
  | 'Gestor de Recursos'
  | 'Membro de Conselho'
  | 'Presidente do Conselho'
  | 'Membro do Conselho Fiscal'
  | 'Presidente do Comitê'
  | 'Presidente do C. Fiscal'
  | 'MASTER_ADMIN' 
  | 'DIRETORIA_EXECUTIVA' 
  | 'COMITE_INVESTIMENTOS' 
  | 'AUDITORIA_CONSELHO_FISCAL';

export const USER_ROLES_LIST: { id: UserRole; label: string; description: string }[] = [
  { id: 'Administrador', label: 'Administrador', description: 'Acesso total a todas as configurações, usuários e carteira' },
  { id: 'Diretor Executivo', label: 'Diretor Executivo', description: 'Aprovação de ativos, relatórios executivos e gestão do instituto' },
  { id: 'Presidente do Comitê', label: 'Presidente do Comitê', description: 'Presidência das deliberações e propostas de alocação de investimentos' },
  { id: 'Membro do Comitê', label: 'Membro do Comitê', description: 'Análise de fundos, simulações atuariais e cadastro de investimentos' },
  { id: 'Gestor de Recursos', label: 'Gestor de Recursos', description: 'Gestão técnica de ativos e certificação CP RPPS fiduciária' },
  { id: 'Presidente do Conselho', label: 'Presidente do Conselho', description: 'Supervisão executiva do Conselho Deliberativo RPPS' },
  { id: 'Membro de Conselho', label: 'Membro de Conselho', description: 'Acompanhamento do Conselho Deliberativo' },
  { id: 'Presidente do C. Fiscal', label: 'Presidente do C. Fiscal', description: 'Fiscalização contábil, financeira e auditoria fiduciária' },
  { id: 'Membro do Conselho Fiscal', label: 'Membro do Conselho Fiscal', description: 'Fiscalização e visualização irrestrita da trilha de auditoria' }
];

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
  | 'TITULO_PUBLICO_DIRETO'
  | 'EMPRESTIMOS_CONSIGNADOS';

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
  monthly_return_pct?: number;
  total_invested?: number;
  weight_pct?: number;
}

export interface CommitteeMember {
  cpf: string;
  name: string;
  startDate: string;
  role?: string;
}

export interface InstituteProfile {
  enteName: string;
  enteCnpj: string;
  uf: string;
  competency: string;
  proGestaoLevel: string;
  enteRepresentativeName: string;
  enteRepresentativeCpf: string;
  gestoraUnitName: string;
  gestoraRepresentativeName: string;
  gestoraRepresentativeCpf: string;
  resourceManagerName: string;
  resourceManagerCpf: string;
  resourceManagerCert: string;
  address?: string;
  phone?: string;
  email?: string;
  committeeMembers: CommitteeMember[];
  deliberativeCouncil: CommitteeMember[];
  fiscalCouncil: CommitteeMember[];
  lastDairImportAt?: string;
}

export interface DairExtractedData {
  institute: Partial<InstituteProfile>;
  portfolioSummary: {
    totalGeneral: number;
    totalCarteiraCmn: number;
    saldoContaCorrente: number;
    rendaFixaTotal: number;
    rendaVariavelTotal: number;
    estruturadosTotal: number;
    consignadosTotal: number;
    rentabilidadeMesPct: number;
    competency: string;
  };
  assets: Asset[];
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
  totalGeralCarteira: number;
  saldoContaCorrente: number;
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
