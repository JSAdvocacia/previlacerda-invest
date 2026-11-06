import { Asset, AssetMetrics, PortfolioOverview, AuditLog, CvmLog, User } from '../types';

export const OFFICIAL_REGULATION_URL = 'https://www.gov.br/previdencia/pt-br/assuntos/rpps/legislacao-dos-rpps/arquivos/2025/ResoluoBCCMNn5.272de18dez2025.pdf';
export const OFFICIAL_REGULATION_NORM = 'Resolução CMN nº 5.272/2025 (de 18/12/2025)';

export const mockUsers: User[] = [
  {
    id: '00000000-0000-0000-0000-000000000000',
    name: 'Prof. Jansen (Administrador Master)',
    email: 'prof.jan100@gmail.com',
    role: 'MASTER_ADMIN',
    cpf: '000.111.222-33',
    is_email_verified: true,
    must_change_password: true // Exigência expressa: troca no primeiro acesso
  },
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Dr. Carlos E. Guimarães',
    email: 'diretoria@previlacerda.mt.gov.br',
    role: 'DIRETORIA_EXECUTIVA',
    cpf: '123.456.789-01',
    is_email_verified: true,
    must_change_password: false
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Mariana Alencar Souza',
    email: 'comite@previlacerda.mt.gov.br',
    role: 'COMITE_INVESTIMENTOS',
    cpf: '234.567.890-12',
    is_email_verified: true,
    must_change_password: false
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Roberto Mendonça (Auditor Fiscal)',
    email: 'auditoria@previlacerda.mt.gov.br',
    role: 'AUDITORIA_CONSELHO_FISCAL',
    cpf: '345.678.901-23',
    is_email_verified: true,
    must_change_password: false
  }
];

export const mockAssets: Asset[] = [
  {
    id: 'b1111111-1111-1111-1111-111111111111',
    cnpj: '13.397.466/0001-14',
    cvm_code: '180293',
    name: 'BB PREVIDENCIÁRIO RENDA FIXA ALOCAÇÃO ATIVA FIC FI',
    trading_name: 'BB Previdência RF Alocação Ativa',
    asset_class: 'RENDA_FIXA',
    article_code: 'Art. 7º, I, "b"',
    max_portfolio_limit_pct: 100,
    administrator: 'BB GESTÃO DE RECURSOS DTVM S.A.',
    manager: 'BB GESTÃO DE RECURSOS DTVM S.A.',
    custodian: 'BANCO DO BRASIL S.A.',
    benchmark: 'IMA-B / CDI',
    risk_level: 'BAIXO',
    anbima_category: 'Renda Fixa Duração Livre Soberano',
    liquidity_days: 1,
    admin_fee_pct: 0.20,
    performance_fee_pct: 0.00,
    status: 'APROVADO',
    latest_quota: 4.195021,
    latest_pl: 1845200000,
    latest_quote_date: '2026-11-05'
  },
  {
    id: 'b2222222-2222-2222-2222-222222222222',
    cnpj: '11.060.940/0001-65',
    cvm_code: '142839',
    name: 'CAIXA BRASIL IMA-B 5+ TÍTULOS PÚBLICOS FI RENDA FIXA LP',
    trading_name: 'Caixa Brasil IMA-B 5+ TP RF LP',
    asset_class: 'RENDA_FIXA',
    article_code: 'Art. 7º, I, "b"',
    max_portfolio_limit_pct: 100,
    administrator: 'CAIXA ECONÔMICA FEDERAL',
    manager: 'CAIXA DTVM S.A.',
    custodian: 'CAIXA ECONÔMICA FEDERAL',
    benchmark: 'IMA-B 5+',
    risk_level: 'MEDIO',
    anbima_category: 'Renda Fixa Indexados',
    liquidity_days: 0,
    admin_fee_pct: 0.20,
    performance_fee_pct: 0.00,
    status: 'APROVADO',
    latest_quota: 5.694650,
    latest_pl: 2150000000,
    latest_quote_date: '2026-11-05'
  },
  {
    id: 'b3333333-3333-3333-3333-333333333333',
    cnpj: '10.742.584/0001-59',
    cvm_code: '124982',
    name: 'SANTANDER INSTITUCIONAL TITULOS PUBLICOS FI RENDA FIXA',
    trading_name: 'Santander Institucional TP RF',
    asset_class: 'RENDA_FIXA',
    article_code: 'Art. 7º, I, "b"',
    max_portfolio_limit_pct: 100,
    administrator: 'BANCO SANTANDER (BRASIL) S.A.',
    manager: 'SANTANDER ASSET MANAGEMENT DTVM',
    custodian: 'BANCO SANTANDER S.A.',
    benchmark: 'CDI',
    risk_level: 'MUITO_BAIXO',
    anbima_category: 'Renda Fixa Soberano',
    liquidity_days: 0,
    admin_fee_pct: 0.15,
    performance_fee_pct: 0.00,
    status: 'APROVADO',
    latest_quota: 3.210450,
    latest_pl: 3450000000,
    latest_quote_date: '2026-11-05'
  },
  {
    id: 'b4444444-4444-4444-4444-444444444444',
    cnpj: '03.922.311/0001-98',
    cvm_code: '089201',
    name: 'ITAÚ IBOVESPA ATIVO INSTITUCIONAL FIA',
    trading_name: 'Itaú Institucional FIA Ações',
    asset_class: 'RENDA_VARIAVEL',
    article_code: 'Art. 8º, I',
    max_portfolio_limit_pct: 30,
    administrator: 'BANCO ITAÚ CARTEIRAS S.A.',
    manager: 'ITAÚ ASSET MANAGEMENT LTDA',
    custodian: 'BANCO ITAÚ UNIBANCO S.A.',
    benchmark: 'IBOVESPA',
    risk_level: 'ALTO',
    anbima_category: 'Ações Indexadas',
    liquidity_days: 3,
    admin_fee_pct: 1.00,
    performance_fee_pct: 0.00,
    status: 'APROVADO',
    latest_quota: 4.315200,
    latest_pl: 890000000,
    latest_quote_date: '2026-11-05'
  },
  {
    id: 'b5555555-5555-5555-5555-555555555555',
    cnpj: '35.651.712/0001-80',
    cvm_code: '321940',
    name: 'WESTERN ASSET GLOBAL BOND BDR NÍVEL I FI RENDA FIXA EXTERIOR',
    trading_name: 'Western Asset Global Bond Exterior',
    asset_class: 'INVESTIMENTO_EXTERIOR',
    article_code: 'Art. 9º, II',
    max_portfolio_limit_pct: 10,
    administrator: 'BEM DTVM LTDA',
    manager: 'WESTERN ASSET MANAGEMENT DTVM',
    custodian: 'BANCO BRADESCO S.A.',
    benchmark: 'Global Aggregate USD',
    risk_level: 'MEDIO',
    anbima_category: 'Renda Fixa Exterior',
    liquidity_days: 5,
    admin_fee_pct: 0.60,
    performance_fee_pct: 0.00,
    status: 'APROVADO',
    latest_quota: 3.877500,
    latest_pl: 450000000,
    latest_quote_date: '2026-11-05'
  },
  {
    id: 'b6666666-6666-6666-6666-666666666666',
    cnpj: '00.000.000/0001-00',
    name: 'NOTA DO TESOURO NACIONAL - SÉRIE B (NTN-B 2035)',
    trading_name: 'NTN-B 2035 (Tesouro IPCA+)',
    asset_class: 'TITULO_PUBLICO_DIRETO',
    article_code: 'Art. 7º, I, "a"',
    max_portfolio_limit_pct: 100,
    administrator: 'SECRETARIA DO TESOURO NACIONAL',
    manager: 'TESOURO DIRETO / SELIC',
    custodian: 'BANCO CENTRAL DO BRASIL',
    benchmark: 'IPCA + 5,85% a.a.',
    risk_level: 'MUITO_BAIXO',
    anbima_category: 'Título Público Federal',
    liquidity_days: 0,
    admin_fee_pct: 0.00,
    performance_fee_pct: 0.00,
    maturity_date: '2035-05-15',
    status: 'APROVADO',
    latest_quota: 4225.35,
    latest_pl: 6000000,
    latest_quote_date: '2026-11-05'
  }
];

export const mockMetrics: Record<string, AssetMetrics> = {
  'b1111111-1111-1111-1111-111111111111': {
    assetId: 'b1111111-1111-1111-1111-111111111111',
    name: 'BB PREVIDENCIÁRIO RENDA FIXA ALOCAÇÃO ATIVA FIC FI',
    tradingName: 'BB Previdência RF Alocação Ativa',
    cnpj: '13.397.466/0001-14',
    assetClass: 'RENDA_FIXA',
    riskLevel: 'BAIXO',
    benchmark: 'IMA-B / CDI',
    adminFeePct: 0.20,
    performanceFeePct: 0.00,
    currentQuota: 4.195021,
    currentNetEquity: 1845200000,
    shareholdersCount: 14200,
    returns: {
      oneMonth: 0.98,
      sixMonths: 5.64,
      twelveMonths: 11.85,
      twentyFourMonths: 24.30,
      yearToDate: 9.80,
      allTime: 84.50
    },
    volatilityTwelveMonths: 2.15,
    sharpeRatioTwelveMonths: 0.51,
    maxDrawdownTwelveMonths: 0.45,
    benchmarkComparisonTwelveMonths: {
      assetReturn: 11.85,
      cdiReturn: 10.75,
      pctOfCdi: 110.2
    },
    cmnRegulation: {
      articleCode: 'Art. 7º, I, "b"',
      description: 'Fundos de Índice Referenciados em Títulos Públicos (100% TP)',
      maxLimitPct: 100,
      regulationNorm: OFFICIAL_REGULATION_NORM,
      regulationUrl: OFFICIAL_REGULATION_URL
    }
  },
  'b2222222-2222-2222-2222-222222222222': {
    assetId: 'b2222222-2222-2222-2222-222222222222',
    name: 'CAIXA BRASIL IMA-B 5+ TÍTULOS PÚBLICOS FI RENDA FIXA LP',
    tradingName: 'Caixa Brasil IMA-B 5+ TP RF LP',
    cnpj: '11.060.940/0001-65',
    assetClass: 'RENDA_FIXA',
    riskLevel: 'MEDIO',
    benchmark: 'IMA-B 5+',
    adminFeePct: 0.20,
    performanceFeePct: 0.00,
    currentQuota: 5.694650,
    currentNetEquity: 2150000000,
    shareholdersCount: 18900,
    returns: {
      oneMonth: 1.12,
      sixMonths: 6.80,
      twelveMonths: 13.45,
      twentyFourMonths: 27.80,
      yearToDate: 11.20,
      allTime: 96.20
    },
    volatilityTwelveMonths: 6.85,
    sharpeRatioTwelveMonths: 0.39,
    maxDrawdownTwelveMonths: 3.20,
    benchmarkComparisonTwelveMonths: {
      assetReturn: 13.45,
      cdiReturn: 10.75,
      pctOfCdi: 125.1
    },
    cmnRegulation: {
      articleCode: 'Art. 7º, I, "b"',
      description: 'Fundos de Índice Referenciados em Títulos Públicos (100% TP)',
      maxLimitPct: 100,
      regulationNorm: OFFICIAL_REGULATION_NORM,
      regulationUrl: OFFICIAL_REGULATION_URL
    }
  },
  'b3333333-3333-3333-3333-333333333333': {
    assetId: 'b3333333-3333-3333-3333-333333333333',
    name: 'SANTANDER INSTITUCIONAL TITULOS PUBLICOS FI RENDA FIXA',
    tradingName: 'Santander Institucional TP RF',
    cnpj: '10.742.584/0001-59',
    assetClass: 'RENDA_FIXA',
    riskLevel: 'MUITO_BAIXO',
    benchmark: 'CDI',
    adminFeePct: 0.15,
    performanceFeePct: 0.00,
    currentQuota: 3.210450,
    currentNetEquity: 3450000000,
    shareholdersCount: 25400,
    returns: {
      oneMonth: 0.88,
      sixMonths: 5.25,
      twelveMonths: 10.82,
      twentyFourMonths: 22.90,
      yearToDate: 9.15,
      allTime: 62.40
    },
    volatilityTwelveMonths: 0.18,
    sharpeRatioTwelveMonths: 0.38,
    maxDrawdownTwelveMonths: 0.05,
    benchmarkComparisonTwelveMonths: {
      assetReturn: 10.82,
      cdiReturn: 10.75,
      pctOfCdi: 100.6
    },
    cmnRegulation: {
      articleCode: 'Art. 7º, I, "b"',
      description: 'Fundos de Índice Referenciados em Títulos Públicos (100% TP)',
      maxLimitPct: 100,
      regulationNorm: OFFICIAL_REGULATION_NORM,
      regulationUrl: OFFICIAL_REGULATION_URL
    }
  },
  'b4444444-4444-4444-4444-444444444444': {
    assetId: 'b4444444-4444-4444-4444-444444444444',
    name: 'ITAÚ IBOVESPA ATIVO INSTITUCIONAL FIA',
    tradingName: 'Itaú Institucional FIA Ações',
    cnpj: '03.922.311/0001-98',
    assetClass: 'RENDA_VARIAVEL',
    riskLevel: 'ALTO',
    benchmark: 'IBOVESPA',
    adminFeePct: 1.00,
    performanceFeePct: 0.00,
    currentQuota: 4.315200,
    currentNetEquity: 890000000,
    shareholdersCount: 8200,
    returns: {
      oneMonth: -0.65,
      sixMonths: 4.20,
      twelveMonths: 8.90,
      twentyFourMonths: 19.50,
      yearToDate: 6.40,
      allTime: 112.00
    },
    volatilityTwelveMonths: 16.40,
    sharpeRatioTwelveMonths: -0.11,
    maxDrawdownTwelveMonths: 11.50,
    benchmarkComparisonTwelveMonths: {
      assetReturn: 8.90,
      cdiReturn: 10.75,
      pctOfCdi: 82.8
    },
    cmnRegulation: {
      articleCode: 'Art. 8º, I',
      description: 'Fundos de Investimento em Ações (FIA)',
      maxLimitPct: 30,
      regulationNorm: OFFICIAL_REGULATION_NORM,
      regulationUrl: OFFICIAL_REGULATION_URL
    }
  }
};

export const mockPortfolioOverview: PortfolioOverview = {
  totalAum: 68500000,
  allocationsCount: 6,
  regulationNorm: OFFICIAL_REGULATION_NORM,
  regulationUrl: OFFICIAL_REGULATION_URL,
  returns: {
    month: 0.94,
    year: 10.42,
    twelveMonths: 12.18,
    actuarialTarget12M: 10.25,
    cdi12M: 10.75,
    pctOfActuarialTarget: 118.8,
    pctOfCdi: 113.3
  },
  classAllocation: [
    { assetClass: 'RENDA_FIXA', amount: 53500000, percentage: 78.11 },
    { assetClass: 'TITULO_PUBLICO_DIRETO', amount: 6000000, percentage: 8.75 },
    { assetClass: 'RENDA_VARIAVEL', amount: 5200000, percentage: 7.59 },
    { assetClass: 'INVESTIMENTO_EXTERIOR', amount: 3800000, percentage: 5.55 }
  ],
  cmnCompliance: [
    {
      articleCode: 'Art. 7º, I, "a" (Títulos Tesouro Selic)',
      maxLimitPct: 100,
      currentAllocatedPct: 8.75,
      isCompliant: true,
      marginPct: 91.25
    },
    {
      articleCode: 'Art. 7º, I, "b" (Fundos RF Títulos Públicos)',
      maxLimitPct: 100,
      currentAllocatedPct: 78.11,
      isCompliant: true,
      marginPct: 21.89
    },
    {
      articleCode: 'Art. 8º, I (Ações / FIA)',
      maxLimitPct: 30,
      currentAllocatedPct: 7.59,
      isCompliant: true,
      marginPct: 22.41
    },
    {
      articleCode: 'Art. 9º, II (Exterior)',
      maxLimitPct: 10,
      currentAllocatedPct: 5.55,
      isCompliant: true,
      marginPct: 4.45
    }
  ],
  evolutionHistory: [
    { month: 'Dez/25', portfolioValue: 61650000, benchmarkCdi: 61500000, actuarialTarget: 61400000 },
    { month: 'Jan/26', portfolioValue: 62300000, benchmarkCdi: 62050000, actuarialTarget: 61950000 },
    { month: 'Fev/26', portfolioValue: 62950000, benchmarkCdi: 62600000, actuarialTarget: 62500000 },
    { month: 'Mar/26', portfolioValue: 63650000, benchmarkCdi: 63150000, actuarialTarget: 63050000 },
    { month: 'Abr/26', portfolioValue: 64300000, benchmarkCdi: 63700000, actuarialTarget: 63600000 },
    { month: 'Mai/26', portfolioValue: 65000000, benchmarkCdi: 64280000, actuarialTarget: 64150000 },
    { month: 'Jun/26', portfolioValue: 65700000, benchmarkCdi: 64850000, actuarialTarget: 64700000 },
    { month: 'Jul/26', portfolioValue: 66350000, benchmarkCdi: 65420000, actuarialTarget: 65280000 },
    { month: 'Ago/26', portfolioValue: 67100000, benchmarkCdi: 66000000, actuarialTarget: 65850000 },
    { month: 'Set/26', portfolioValue: 67750000, benchmarkCdi: 66580000, actuarialTarget: 66420000 },
    { month: 'Out/26', portfolioValue: 68150000, benchmarkCdi: 67180000, actuarialTarget: 67000000 },
    { month: 'Nov/26', portfolioValue: 68500000, benchmarkCdi: 67770000, actuarialTarget: 67580000 }
  ],
  allocations: [
    {
      id: 'a1',
      trading_name: 'BB Previdência RF Alocação Ativa',
      cnpj: '13.397.466/0001-14',
      asset_class: 'RENDA_FIXA',
      article_code: 'Art. 7º, I, "b"',
      risk_level: 'BAIXO',
      total_invested: 24500000,
      weight_pct: 35.77,
      current_quota: 4.195021
    },
    {
      id: 'a2',
      trading_name: 'Caixa Brasil IMA-B 5+ TP RF LP',
      cnpj: '11.060.940/0001-65',
      asset_class: 'RENDA_FIXA',
      article_code: 'Art. 7º, I, "b"',
      risk_level: 'MEDIO',
      total_invested: 16800000,
      weight_pct: 24.53,
      current_quota: 5.694650
    },
    {
      id: 'a3',
      trading_name: 'Santander Institucional TP RF',
      cnpj: '10.742.584/0001-59',
      asset_class: 'RENDA_FIXA',
      article_code: 'Art. 7º, I, "b"',
      risk_level: 'MUITO_BAIXO',
      total_invested: 12200000,
      weight_pct: 17.81,
      current_quota: 3.210450
    },
    {
      id: 'a6',
      trading_name: 'NTN-B 2035 (Tesouro IPCA+)',
      cnpj: '00.000.000/0001-00',
      asset_class: 'TITULO_PUBLICO_DIRETO',
      article_code: 'Art. 7º, I, "a"',
      risk_level: 'MUITO_BAIXO',
      total_invested: 6000000,
      weight_pct: 8.75,
      current_quota: 4225.35
    },
    {
      id: 'a4',
      trading_name: 'Itaú Institucional FIA Ações',
      cnpj: '03.922.311/0001-98',
      asset_class: 'RENDA_VARIAVEL',
      article_code: 'Art. 8º, I',
      risk_level: 'ALTO',
      total_invested: 5200000,
      weight_pct: 7.59,
      current_quota: 4.315200
    },
    {
      id: 'a5',
      trading_name: 'Western Asset Global Bond Exterior',
      cnpj: '35.651.712/0001-80',
      asset_class: 'INVESTIMENTO_EXTERIOR',
      article_code: 'Art. 9º, II',
      risk_level: 'MEDIO',
      total_invested: 3800000,
      weight_pct: 5.55,
      current_quota: 3.877500
    }
  ]
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
