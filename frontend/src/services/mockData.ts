import { Asset, AssetMetrics, PortfolioOverview, AuditLog, CvmLog, User } from '../types';
import { PREVI_LACERDA_OFFICIAL_ASSETS } from './dairParserService';

export const OFFICIAL_REGULATION_URL = 'https://www.gov.br/previdencia/pt-br/assuntos/rpps/legislacao-dos-rpps/arquivos/2025/ResoluoBCCMNn5.272de18dez2025.pdf';
export const OFFICIAL_REGULATION_NORM = 'Resolução CMN nº 5.272/2025 (de 18/12/2025)';

export const mockUsers: User[] = [
  {
    id: '00000000-0000-0000-0000-000000000000',
    name: 'Prof. Jansen (Administrador Master)',
    email: 'prof.jan100@gmail.com',
    role: 'Administrador',
    cpf: '559.218.411-53',
    is_email_verified: true,
    must_change_password: false // Cancelada a exigência de troca de senha inicial
  }
];

export const mockAssets: Asset[] = PREVI_LACERDA_OFFICIAL_ASSETS;

export const mockMetrics: Record<string, AssetMetrics> = PREVI_LACERDA_OFFICIAL_ASSETS.reduce((acc, asset) => {
  acc[asset.id] = {
    assetId: asset.id,
    name: asset.name,
    tradingName: asset.trading_name || asset.name,
    cnpj: asset.cnpj,
    assetClass: asset.asset_class,
    riskLevel: asset.risk_level,
    benchmark: asset.benchmark || 'CDI',
    adminFeePct: asset.admin_fee_pct || 0.20,
    performanceFeePct: asset.performance_fee_pct || 0.00,
    currentQuota: asset.latest_quota || 1.0,
    currentNetEquity: asset.latest_pl || 1000000000,
    shareholdersCount: 5000,
    returns: {
      oneMonth: 1.51,
      sixMonths: 5.80,
      twelveMonths: 12.85,
      twentyFourMonths: 24.50,
      yearToDate: 9.83,
      allTime: 65.40
    },
    volatilityTwelveMonths: asset.asset_class === 'RENDA_VARIAVEL' ? 14.5 : 1.8,
    sharpeRatioTwelveMonths: 0.45,
    maxDrawdownTwelveMonths: asset.asset_class === 'RENDA_VARIAVEL' ? 8.2 : 0.3,
    benchmarkComparisonTwelveMonths: {
      assetReturn: 12.85,
      cdiReturn: 10.75,
      pctOfCdi: 119.5
    },
    cmnRegulation: {
      articleCode: asset.article_code || 'Art. 7º, I, "b"',
      description: asset.article_code || 'Enquadramento Resolução CMN nº 5.272/2025',
      maxLimitPct: asset.max_portfolio_limit_pct || 100,
      regulationNorm: OFFICIAL_REGULATION_NORM,
      regulationUrl: OFFICIAL_REGULATION_URL
    }
  };
  return acc;
}, {} as Record<string, AssetMetrics>);

export const mockPortfolioOverview: PortfolioOverview = {
  totalAum: 138781858.93,
  allocationsCount: 32,
  regulationNorm: OFFICIAL_REGULATION_NORM,
  regulationUrl: OFFICIAL_REGULATION_URL,
  returns: {
    month: 1.51,
    year: 9.83,
    twelveMonths: 12.85,
    actuarialTarget12M: 8.20,
    cdi12M: 10.75,
    pctOfActuarialTarget: 119.8,
    pctOfCdi: 111.4
  },
  classAllocation: [
    { assetClass: 'RENDA_FIXA', amount: 127452086.47, percentage: 91.84 },
    { assetClass: 'RENDA_VARIAVEL', amount: 8204605.06, percentage: 5.91 },
    { assetClass: 'MULTIMERCADO', amount: 3125167.41, percentage: 2.25 }
  ],
  cmnCompliance: [
    {
      articleCode: 'Art. 7º, I, "b" (Fundos RF 100% Títulos Públicos)',
      maxLimitPct: 100,
      currentAllocatedPct: 63.21,
      isCompliant: true,
      marginPct: 36.79
    },
    {
      articleCode: 'Art. 7º, III, "a" (Fundos Renda Fixa CVM)',
      maxLimitPct: 60,
      currentAllocatedPct: 22.77,
      isCompliant: true,
      marginPct: 37.23
    },
    {
      articleCode: 'Art. 8º, I (Fundos de Ações / FIA)',
      maxLimitPct: 30,
      currentAllocatedPct: 5.91,
      isCompliant: true,
      marginPct: 24.09
    },
    {
      articleCode: 'Art. 7º, V, "b" (RF Crédito Privado)',
      maxLimitPct: 20,
      currentAllocatedPct: 2.29,
      isCompliant: true,
      marginPct: 17.71
    },
    {
      articleCode: 'Art. 10, I (Fundos Multimercado)',
      maxLimitPct: 10,
      currentAllocatedPct: 2.25,
      isCompliant: true,
      marginPct: 7.75
    },
    {
      articleCode: 'Art. 7º, IV (Letras Financeiras Bancárias)',
      maxLimitPct: 20,
      currentAllocatedPct: 3.56,
      isCompliant: true,
      marginPct: 16.44
    }
  ],
  evolutionHistory: [
    { month: 'Jan/26', portfolioValue: 130790202.26, benchmarkCdi: 129000000, actuarialTarget: 128922000 },
    { month: 'Fev/26', portfolioValue: 131863656.72, benchmarkCdi: 130100000, actuarialTarget: 130393000 },
    { month: 'Mar/26', portfolioValue: 131684695.55, benchmarkCdi: 131200000, actuarialTarget: 132133000 },
    { month: 'Abr/26', portfolioValue: 132562993.96, benchmarkCdi: 132300000, actuarialTarget: 133615000 },
    { month: 'Mai/26', portfolioValue: 133336163.24, benchmarkCdi: 133400000, actuarialTarget: 134983000 },
    { month: 'Jun/26', portfolioValue: 133788243.05, benchmarkCdi: 134500000, actuarialTarget: 135802000 },
    { month: 'Jul/26', portfolioValue: 134893677.35, benchmarkCdi: 135600000, actuarialTarget: 136506000 },
    { month: 'Ago/26', portfolioValue: 135288278.08, benchmarkCdi: 136700000, actuarialTarget: 136673000 },
    { month: 'Set/26', portfolioValue: 138781858.93, benchmarkCdi: 137800000, actuarialTarget: 138409000 }
  ],
  allocations: PREVI_LACERDA_OFFICIAL_ASSETS.map((a) => ({
    id: a.id,
    trading_name: a.trading_name,
    cnpj: a.cnpj,
    asset_class: a.asset_class,
    article_code: a.article_code,
    risk_level: a.risk_level,
    total_invested: a.total_invested || 0,
    weight_pct: a.weight_pct || 0,
    current_quota: a.current_quota || 1
  }))
};

export const mockAuditLogs: AuditLog[] = [
  {
    id: 105,
    user_id: '00000000-0000-0000-0000-000000000000',
    user_email: 'prof.jan100@gmail.com',
    user_role: 'MASTER_ADMIN',
    action: 'UPDATE_REGULATION_CMN_5272',
    resource: 'cmn_regulations',
    record_id: 'CMN_5272_2025',
    ip_address: '189.44.120.15',
    timestamp: '2026-11-06T10:30:00Z',
    new_data: {
      regulation: 'Resolução CMN nº 5.272/2025',
      url: OFFICIAL_REGULATION_URL,
      status: 'Base legal atualizada com sucesso no PREVI-LACERDA'
    },
    integrity_hash: '7c82e0911bcdaef2018840291baec90321a4879201fba4190cde41728bbac012'
  },
  {
    id: 104,
    user_id: '11111111-1111-1111-1111-111111111111',
    user_email: 'diretoria@previlacerda.mt.gov.br',
    user_role: 'DIRETORIA_EXECUTIVA',
    action: 'APPROVE_ASSET',
    resource: 'assets',
    record_id: 'b2222222-2222-2222-2222-222222222222',
    ip_address: '189.44.120.15',
    timestamp: '2026-11-06T09:40:12Z',
    new_data: { decision: 'APROVAR', asset: 'Caixa Brasil IMA-B 5+ TP RF LP' },
    integrity_hash: 'a3f78e91cb82903e1e2d4a6f98c4309aef1024317820ab1e43d928bcfe0218a4'
  },
  {
    id: 103,
    user_id: '22222222-2222-2222-2222-222222222222',
    user_email: 'comite@previlacerda.mt.gov.br',
    user_role: 'COMITE_INVESTIMENTOS',
    action: 'CREATE_ASSET',
    resource: 'assets',
    record_id: 'b5555555-5555-5555-5555-555555555555',
    ip_address: '189.44.120.18',
    timestamp: '2026-11-06T08:15:44Z',
    new_data: { name: 'Western Asset Global Bond BDR Nível I', status: 'PENDENTE_APROVACAO' },
    integrity_hash: '4bc0891d227fca8e1540a9ef673100ba709320da9081e6fa4366cefa59810bb2'
  },
  {
    id: 102,
    user_id: 'system',
    user_email: 'CRON_DAEMON@previlacerda.internal',
    user_role: 'SYSTEM',
    action: 'CVM_DAILY_SYNC_AUTOMATION',
    resource: 'cvm_ingestion',
    record_id: 'CVM_SYNC_1794024000',
    ip_address: '127.0.0.1',
    timestamp: '2026-11-05T21:05:00Z',
    new_data: { fileProcessed: 'inf_diario_fi_202611.zip', assetsUpdated: 5, status: 'SUCCESS' },
    integrity_hash: '8f0012bc55621894d0c2e39199a4192bc51904aef7298c801032ba61d87e0081'
  }
];

export const mockCvmLogs: CvmLog[] = [
  {
    id: 42,
    job_identifier: 'CVM_SYNC_1794024000',
    target_date: '2026-11-05',
    file_processed: 'inf_diario_fi_202611.zip',
    total_records_read: 28410,
    assets_updated: 5,
    execution_time_seconds: 4.82,
    status: 'SUCCESS',
    executed_at: '2026-11-05 21:05:00'
  }
];
