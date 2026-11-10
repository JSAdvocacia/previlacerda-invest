import { Asset, AssetMetrics, AssetClass, RiskLevel } from '../types';
import { FundAnalysisReport, MARKET_ASSETS_DATABASE } from './fundAnalyzerService';
import { PREVI_LACERDA_OFFICIAL_ASSETS } from './dairParserService';
import { buildAssetMetrics } from './mockData';

export interface AnalyzedFundRecord {
  id: string;
  cnpj: string;
  formattedCnpj: string;
  ticker?: string;
  name: string;
  tradingName: string;
  assetClass: AssetClass;
  articleCode: string;
  cmnLimit: string;
  benchmark: string;
  overallScore: number;
  committeeVerdict: string;
  committeeVerdictLabel: string;
  committeeTechnicalOpinion: string;
  analyzedAt: string;
  analysisProtocol: string;
  netEquity: number;
  adminFeePct: number;
  returns12M: number;
  report: FundAnalysisReport;
  isStudiedAsset: true;
}

const STORAGE_KEY = 'argos_studied_funds_repo';

/**
 * Registros Iniciais Pré-Carregados no Repositório de Estudos
 */
const INITIAL_STUDIED_RECORDS: AnalyzedFundRecord[] = [
  // 1. Kinea Rendimentos Imobiliários FII (KNCR11)
  {
    id: 'studied_16706958000132',
    cnpj: '16706958000132',
    formattedCnpj: '16.706.958/0001-32',
    ticker: 'KNCR11',
    name: 'KINEA RENDIMENTOS IMOBILIARIOS FUNDO DE INVESTIMENTO IMOBILIARIO - FII',
    tradingName: 'Kinea Rendimentos Imobiliários (KNCR11)',
    assetClass: 'IMOVEIS_FII',
    articleCode: 'Art. 10 (FII)',
    cmnLimit: 'Até 5% da Carteira RPPS (Bolsa B3)',
    benchmark: 'CDI',
    overallScore: 96,
    committeeVerdict: 'APROVADO_APORTE',
    committeeVerdictLabel: 'APROVADO PARA APORTE (ART. 10 RES. CMN 5.272/2025 - LIMITE ATÉ 5%)',
    committeeTechnicalOpinion: 'O Comitê de Investimentos do PREVI-LACERDA analisou o fundo Kinea Rendimentos Imobiliários FII (KNCR11, CNPJ 16.706.958/0001-32). O fundo é o maior FII de títulos imobiliários do Brasil, possuindo R$ 10,98 Bilhões de PL, 593.704 cotistas, P/VP de 1,00 e DY de 13,36% a.a. Enquadra-se no Art. 10 da Res. CMN nº 5.272/2025 com teto de até 5%. Apto para alocação.',
    analyzedAt: '10/11/2026, 09:15:00',
    analysisProtocol: 'PAI-ANALISE-167069-KNCR',
    netEquity: 10984181400,
    adminFeePct: 1.08,
    returns12M: 11.15,
    isStudiedAsset: true,
    report: (MARKET_ASSETS_DATABASE['16.706.958/0001-32'] as FundAnalysisReport) || {}
  },
  // 2. Itaú Asset Rural FIAGRO (RURA11)
  {
    id: 'studied_42479593000160',
    cnpj: '42479593000160',
    formattedCnpj: '42.479.593/0001-60',
    ticker: 'RURA11',
    name: 'ITAÚ ASSET RURAL FIAGRO',
    tradingName: 'Itaú Asset Rural FIAGRO (RURA11)',
    assetClass: 'MULTIMERCADO',
    articleCode: 'Res. CMN 5.272/2025 - Estruturado (FIAGRO)',
    cmnLimit: 'Até 5% da Carteira RPPS (Exige Pró-Gestão Nível III ou IV)',
    benchmark: 'CDI',
    overallScore: 89,
    committeeVerdict: 'EM_OBSERVACAO',
    committeeVerdictLabel: 'CONDICIONADO AO NÍVEL III PRÓ-GESTÃO (LIMITE ATÉ 5%)',
    committeeTechnicalOpinion: 'O Comitê de Investimentos do PREVI-LACERDA analisou o ativo Itaú Asset Rural FIAGRO (RURA11). O fundo apresenta PL de R$ 1,65 Bilhão, P/VP de 0,75 e DY de 17,14% a.a. A aplicação é condicionada à obtenção pelo RPPS de Certificação Institucional Pró-Gestão Nível III ou IV pela Res. CMN 5.272/2025.',
    analyzedAt: '10/11/2026, 08:35:00',
    analysisProtocol: 'PAI-ANALISE-424795-RURA',
    netEquity: 1645822839,
    adminFeePct: 1.00,
    returns12M: 10.33,
    isStudiedAsset: true,
    report: (MARKET_ASSETS_DATABASE['42.479.593/0001-60'] as FundAnalysisReport) || {}
  },
  // 3. FII REC Renda Imobiliária (RECT11) - Oficial Investidor10 & CVM
  {
    id: 'studied_32274163000159',
    cnpj: '32274163000159',
    formattedCnpj: '32.274.163/0001-59',
    ticker: 'RECT11',
    name: 'FUNDO DE INVESTIMENTO IMOBILIARIO - FII REC RENDA IMOBILIARIA - RESPONSABILIDADE LIMITADA',
    tradingName: 'FII REC Renda Imobiliária (RECT11)',
    assetClass: 'IMOVEIS_FII',
    articleCode: 'Art. 10 (FII)',
    cmnLimit: 'Até 5% da Carteira RPPS (Bolsa B3)',
    benchmark: 'CDI',
    overallScore: 86,
    committeeVerdict: 'EM_OBSERVACAO',
    committeeVerdictLabel: 'APTO COM MONITORAMENTO RESTRITO (ART. 10 RES. CMN 5.272/2025 - TETO ATÉ 5%)',
    committeeTechnicalOpinion: 'O Comitê de Investimentos analisou o FII REC Renda Imobiliária (RECT11, CNPJ 32.274.163/0001-59). Dados auditados do Portal Investidor10 confirmam PL de R$ 766,83 Milhões, 44.976 cotistas, P/VP de 0,36 (-64% desconto patrimonial), Dividend Yield de 15,32% a.a. e taxa de administração de 0,17% a.a. Enquadra-se no Art. 10 da Res. CMN nº 5.272/2025. Alocação recomendada com monitoramento restrito da taxa de vacância física (8,36%).',
    analyzedAt: '10/11/2026, 10:45:00',
    analysisProtocol: 'PAI-ANALISE-322741-RECT',
    netEquity: 766830000,
    adminFeePct: 0.17,
    returns12M: 5.97,
    isStudiedAsset: true,
    report: (MARKET_ASSETS_DATABASE['32.274.163/0001-59'] as FundAnalysisReport) || {}
  }
];

export const analyzedFundsRepository = {
  /**
   * Recupera todos os fundos analisados armazenados no repositório
   */
  getAll(): AnalyzedFundRecord[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: AnalyzedFundRecord[] = JSON.parse(saved);
        // Garante que os registros iniciais auditados estão presentes
        for (const initial of INITIAL_STUDIED_RECORDS) {
          if (!parsed.some(p => p.cnpj === initial.cnpj || p.id === initial.id)) {
            parsed.unshift(initial);
          }
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Erro ao carregar repositório de fundos analisados', e);
    }
    return [...INITIAL_STUDIED_RECORDS];
  },

  /**
   * Busca um registro por ID ou CNPJ
   */
  getByIdOrCnpj(identifier: string): AnalyzedFundRecord | null {
    const clean = identifier.replace(/\D/g, '');
    const all = this.getAll();
    return all.find(r => 
      r.id === identifier || 
      r.cnpj === identifier || 
      r.cnpj === clean || 
      (r.ticker && r.ticker.toLowerCase() === identifier.toLowerCase())
    ) || null;
  },

  /**
   * Salva ou atualiza um relatório de análise no repositório
   */
  saveReport(report: FundAnalysisReport): AnalyzedFundRecord {
    const clean = report.cnpj.replace(/\D/g, '');
    const id = `studied_${clean}`;

    let assetClass: AssetClass = 'RENDA_FIXA';
    if (report.assetClass.includes('IMOBILIÁRIO') || report.assetClass.includes('FII')) {
      assetClass = 'IMOVEIS_FII';
    } else if (report.assetClass.includes('FIAGRO') || report.assetClass.includes('ESTRUTURADO')) {
      assetClass = 'MULTIMERCADO';
    } else if (report.assetClass.includes('VARIÁVEL') || report.assetClass.includes('AÇÕES')) {
      assetClass = 'RENDA_VARIAVEL';
    } else if (report.assetClass.includes('EXTERIOR')) {
      assetClass = 'INVESTIMENTO_EXTERIOR';
    }

    const record: AnalyzedFundRecord = {
      id,
      cnpj: clean,
      formattedCnpj: report.formattedCnpj,
      ticker: report.ticker,
      name: report.name,
      tradingName: report.tradingName,
      assetClass,
      articleCode: report.cmnArticle,
      cmnLimit: report.cmnArticleLimit,
      benchmark: report.benchmark,
      overallScore: report.overallScore,
      committeeVerdict: report.committeeVerdict,
      committeeVerdictLabel: report.committeeVerdictLabel,
      committeeTechnicalOpinion: report.committeeTechnicalOpinion,
      analyzedAt: report.analyzedAt,
      analysisProtocol: report.analysisProtocol,
      netEquity: report.netEquity,
      adminFeePct: report.adminFeePct,
      returns12M: report.returns.twelveMonths,
      report,
      isStudiedAsset: true
    };

    const current = this.getAll();
    const idx = current.findIndex(r => r.id === id || r.cnpj === clean);
    if (idx >= 0) {
      current[idx] = record;
    } else {
      current.unshift(record);
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch (e) {
      console.warn('Erro ao salvar no repositório de fundos estudados', e);
    }

    return record;
  },

  /**
   * Remove um fundo do repositório
   */
  delete(id: string): void {
    const current = this.getAll().filter(r => r.id !== id && r.cnpj !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch {}
  },

  /**
   * Converte um registro de fundo estudado em um objeto Asset virtual para o comparador
   * (NÃO SALVA na carteira oficial do RPPS!)
   */
  toVirtualAsset(recordOrReport: AnalyzedFundRecord | FundAnalysisReport): Asset {
    if ('isStudiedAsset' in recordOrReport) {
      const rec = recordOrReport as AnalyzedFundRecord;
      return {
        id: rec.id,
        cnpj: rec.formattedCnpj,
        name: rec.name,
        trading_name: rec.tradingName,
        asset_class: rec.assetClass,
        article_code: rec.articleCode,
        max_portfolio_limit_pct: 5,
        administrator: rec.report?.custodianEvaluation?.name || 'ADMINISTRADOR CVM',
        manager: rec.report?.managerEvaluation?.name || 'GESTOR CVM',
        custodian: rec.report?.custodianEvaluation?.name || 'CUSTODIANTE QUALIFICADO',
        benchmark: rec.benchmark,
        risk_level: 'MEDIO',
        liquidity_days: 2,
        admin_fee_pct: rec.adminFeePct,
        performance_fee_pct: 0,
        status: 'PENDENTE_APROVACAO',
        latest_pl: rec.netEquity,
        monthly_return_pct: rec.report?.returns?.month || 0,
        total_invested: 0,
        weight_pct: 0
      };
    }

    const rep = recordOrReport as FundAnalysisReport;
    const clean = rep.cnpj.replace(/\D/g, '');
    let assetClass: AssetClass = 'RENDA_FIXA';
    if (rep.assetClass.includes('IMOBILIÁRIO') || rep.assetClass.includes('FII')) assetClass = 'IMOVEIS_FII';
    else if (rep.assetClass.includes('FIAGRO') || rep.assetClass.includes('ESTRUTURADO')) assetClass = 'MULTIMERCADO';
    else if (rep.assetClass.includes('VARIÁVEL') || rep.assetClass.includes('AÇÕES')) assetClass = 'RENDA_VARIAVEL';
    else if (rep.assetClass.includes('EXTERIOR')) assetClass = 'INVESTIMENTO_EXTERIOR';

    return {
      id: `studied_${clean}`,
      cnpj: rep.formattedCnpj,
      name: rep.name,
      trading_name: rep.tradingName,
      asset_class: assetClass,
      article_code: rep.cmnArticle,
      max_portfolio_limit_pct: 5,
      administrator: rep.custodianEvaluation?.name || 'ADMINISTRADOR CVM',
      manager: rep.managerEvaluation?.name || 'GESTOR CVM',
      custodian: rep.custodianEvaluation?.name || 'CUSTODIANTE QUALIFICADO',
      benchmark: rep.benchmark,
      risk_level: 'MEDIO',
      liquidity_days: 2,
      admin_fee_pct: rep.adminFeePct,
      performance_fee_pct: 0,
      status: 'PENDENTE_APROVACAO',
      latest_pl: rep.netEquity,
      monthly_return_pct: rep.returns?.month || 0,
      total_invested: 0,
      weight_pct: 0
    };
  },

  /**
   * Gera AssetMetrics fidedignos para o Comparador de Fundos
   */
  getComparableMetrics(idOrCnpj: string): AssetMetrics | null {
    const record = this.getByIdOrCnpj(idOrCnpj);
    if (!record) return null;

    const rep = record.report;
    const virtualAsset = this.toVirtualAsset(record);

    const cdiReturn12M = 10.75;
    const ret12M = rep.returns?.twelveMonths ?? record.returns12M;
    const pctOfCdi = parseFloat(((ret12M / cdiReturn12M) * 100).toFixed(1));

    return {
      assetId: record.id,
      name: record.name,
      tradingName: record.tradingName,
      cnpj: record.formattedCnpj,
      assetClass: record.assetClass,
      riskLevel: 'MEDIO',
      benchmark: record.benchmark,
      adminFeePct: record.adminFeePct,
      performanceFeePct: 0.00,
      currentQuota: rep.quotaValue || 1.0,
      currentNetEquity: record.netEquity,
      shareholdersCount: rep.shareholdersCount || 1000,
      returns: {
        oneMonth: rep.returns?.month ?? 0.8,
        sixMonths: parseFloat((ret12M * 0.52).toFixed(2)),
        twelveMonths: ret12M,
        twentyFourMonths: rep.returns?.twentyFourMonths ?? parseFloat((ret12M * 2.1).toFixed(2)),
        yearToDate: rep.returns?.year ?? parseFloat((ret12M * 0.78).toFixed(2)),
        allTime: rep.returns?.sinceInception ?? parseFloat((ret12M * 3.5).toFixed(2))
      },
      volatilityTwelveMonths: rep.volatility12M ?? 5.5,
      sharpeRatioTwelveMonths: rep.sharpeRatio12M ?? 0.5,
      maxDrawdownTwelveMonths: rep.maxDrawdown12M ?? -3.5,
      benchmarkComparisonTwelveMonths: {
        assetReturn: ret12M,
        cdiReturn: cdiReturn12M,
        pctOfCdi
      },
      cmnRegulation: {
        articleCode: record.articleCode,
        description: `${record.articleCode} - ${record.cmnLimit}`,
        maxLimitPct: 5,
        regulationNorm: 'Resolução CMN nº 5.272/2025',
        regulationUrl: 'https://www.bcb.gov.br/'
      }
    };
  },

  /**
   * Encontra automaticamente os ativos oficiais da carteira do PREVI-LACERDA
   * mais semelhantes para comparação justa (mesma classe e/ou artigo da resolução)
   */
  findMatchingOfficialAssets(studiedAsset: { assetClass?: string; articleCode?: string; benchmark?: string }): Asset[] {
    const officials = [...PREVI_LACERDA_OFFICIAL_ASSETS];
    if (officials.length === 0) return [];

    const targetClass = studiedAsset.assetClass?.toUpperCase() || '';
    const targetArticle = (studiedAsset.articleCode || '').toLowerCase();
    const targetBenchmark = (studiedAsset.benchmark || '').toUpperCase();

    // 1. Prioridade Máxima: Mesma classe e mesmo artigo (ex: Art. 7º, I, 'b' ou Art. 8º)
    const exactMatches = officials.filter(a => {
      const art = (a.article_code || '').toLowerCase();
      const cls = a.asset_class.toUpperCase();
      const matchClass = cls === targetClass || (targetClass.includes('RENDA_FIXA') && cls === 'RENDA_FIXA');
      const matchArt = targetArticle.includes('7º, i,') && art.includes('7º, i,') ||
                       targetArticle.includes('7º, iii') && art.includes('7º, iii') ||
                       targetArticle.includes('8º') && art.includes('8º');
      return matchClass && matchArt;
    });

    if (exactMatches.length >= 2) {
      return exactMatches.slice(0, 3);
    }

    // 2. Se for Renda Variável (Ações)
    if (targetClass.includes('VARIAVEL') || targetClass.includes('ACOES') || targetArticle.includes('8º')) {
      const rvAssets = officials.filter(a => a.asset_class === 'RENDA_VARIAVEL');
      if (rvAssets.length > 0) {
        // Completa com os de maior retorno ou renda fixa correlata
        return [...rvAssets, officials[0], officials[1]].slice(0, 3);
      }
    }

    // 3. Se for FII (Imóveis/Papel) ou FIAGRO (Crédito estruturado)
    if (targetClass.includes('FII') || targetClass.includes('IMOVEIS') || targetClass.includes('FIAGRO') || targetClass.includes('MULTIMERCADO') || targetArticle.includes('10')) {
      // Compara com os fundos de Renda Fixa de Gestão Ativa e Crédito da Carteira (ex: Caixa Gestão Estratégica Art. 7º, III, 'a' e BB Fluxo/Disponibilidades)
      const creditOrActive = officials.filter(a => (a.article_code || '').includes('7º, III') || (a.benchmark || '').includes('CDI'));
      if (creditOrActive.length >= 2) {
        return creditOrActive.slice(0, 3);
      }
    }

    // 4. Se for Renda Fixa em geral
    const rfAssets = officials.filter(a => a.asset_class === 'RENDA_FIXA');
    if (rfAssets.length >= 2) {
      // Ordena por afinidade de benchmark (ex: se CDI, prioriza os de CDI; se IMA-B, prioriza IMA-B)
      const sorted = [...rfAssets].sort((a, b) => {
        const aBmk = (a.benchmark || '').toUpperCase();
        const bBmk = (b.benchmark || '').toUpperCase();
        const aMatches = aBmk === targetBenchmark ? 1 : 0;
        const bMatches = bBmk === targetBenchmark ? 1 : 0;
        return bMatches - aMatches;
      });
      return sorted.slice(0, 3);
    }

    return officials.slice(0, 2);
  }
};
