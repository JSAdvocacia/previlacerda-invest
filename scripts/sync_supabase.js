const https = require('https');

const SUPABASE_HOST = 'emwutayyleogkfyfhkpd.supabase.co';
const SECRET_KEY = process.env.SUPABASE_SECRET_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';
const PORTFOLIO_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const defaultHeaders = {
      'apikey': SECRET_KEY,
      'Authorization': `Bearer ${SECRET_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...headers
    };

    const options = {
      hostname: SUPABASE_HOST,
      port: 443,
      path: path,
      method: method,
      headers: defaultHeaders
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : null;
          resolve({ status: res.statusCode, data: parsed, raw: data });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

const assets = [
  {
    id: 'a0000001-0000-0000-0000-000000000001',
    cnpj: '10.740.658/0001-93',
    cvm_code: '142839',
    name: 'CAIXA FI BRASIL IMA-B TIT PUBL RF',
    trading_name: 'Caixa FI Brasil IMA-B TP RF',
    asset_class: 'RENDA_FIXA',
    cmn_regulation_id: 2,
    administrator: 'CAIXA ECONÔMICA FEDERAL',
    manager: 'CAIXA DTVM S.A.',
    custodian: 'CAIXA ECONÔMICA FEDERAL',
    benchmark: 'IMA-B',
    risk_level: 'MEDIO',
    anbima_category: 'Renda Fixa Indexados',
    liquidity_days: 0,
    admin_fee_pct: 0.20,
    performance_fee_pct: 0.00,
    status: 'APROVADO'
  },
  {
    id: 'a0000002-0000-0000-0000-000000000002',
    cnpj: '07.442.078/0001-05',
    cvm_code: '114812',
    name: 'BB PREVIDENCIÁRIO RENDA FIXA IMA-B TP FI',
    trading_name: 'BB Previdenciário RF IMA-B TP FI',
    asset_class: 'RENDA_FIXA',
    cmn_regulation_id: 2,
    administrator: 'BB GESTÃO DE RECURSOS DTVM S.A.',
    manager: 'BB GESTÃO DE RECURSOS DTVM S.A.',
    custodian: 'BANCO DO BRASIL S.A.',
    benchmark: 'IMA-B',
    risk_level: 'MEDIO',
    anbima_category: 'Renda Fixa Indexados',
    liquidity_days: 1,
    admin_fee_pct: 0.20,
    performance_fee_pct: 0.00,
    status: 'APROVADO'
  },
  {
    id: 'a0000003-0000-0000-0000-000000000003',
    cnpj: '10.740.670/0001-06',
    cvm_code: '142820',
    name: 'CAIXA FI BRASIL IRF-M1 RF LP',
    trading_name: 'Caixa FI Brasil IRF-M1 RF LP',
    asset_class: 'RENDA_FIXA',
    cmn_regulation_id: 2,
    administrator: 'CAIXA ECONÔMICA FEDERAL',
    manager: 'CAIXA DTVM S.A.',
    custodian: 'CAIXA ECONÔMICA FEDERAL',
    benchmark: 'IRF-M 1',
    risk_level: 'BAIXO',
    anbima_category: 'Renda Fixa Indexados',
    liquidity_days: 0,
    admin_fee_pct: 0.20,
    performance_fee_pct: 0.00,
    status: 'APROVADO'
  },
  {
    id: 'a0000004-0000-0000-0000-000000000004',
    cnpj: '14.508.643/0001-55',
    cvm_code: '190454',
    name: 'CAIXA FI BRASIL DISPONIBILIDADES RF',
    trading_name: 'Caixa FI Brasil Disponibilidades RF',
    asset_class: 'RENDA_FIXA',
    cmn_regulation_id: 3,
    administrator: 'CAIXA ECONÔMICA FEDERAL',
    manager: 'CAIXA DTVM S.A.',
    custodian: 'CAIXA ECONÔMICA FEDERAL',
    benchmark: 'CDI',
    risk_level: 'MUITO_BAIXO',
    anbima_category: 'Renda Fixa Soberano',
    liquidity_days: 0,
    admin_fee_pct: 0.30,
    performance_fee_pct: 0.00,
    status: 'APROVADO'
  },
  {
    id: 'a0000005-0000-0000-0000-000000000005',
    cnpj: '13.077.415/0001-05',
    cvm_code: '180285',
    name: 'BB PREVIDENCIÁRIO RF FLUXO',
    trading_name: 'BB Previdenciário RF Fluxo FI',
    asset_class: 'RENDA_FIXA',
    cmn_regulation_id: 2,
    administrator: 'BB GESTÃO DE RECURSOS DTVM S.A.',
    manager: 'BB GESTÃO DE RECURSOS DTVM S.A.',
    custodian: 'BANCO DO BRASIL S.A.',
    benchmark: 'CDI',
    risk_level: 'MUITO_BAIXO',
    anbima_category: 'Renda Fixa Soberano',
    liquidity_days: 0,
    admin_fee_pct: 0.15,
    performance_fee_pct: 0.00,
    status: 'APROVADO'
  },
  {
    id: 'a0000006-0000-0000-0000-000000000006',
    cnpj: '13.058.816/0001-18',
    cvm_code: '180120',
    name: 'CAIXA FIC AÇÕES IBOVESPA',
    trading_name: 'Caixa FIC Ações Ibovespa',
    asset_class: 'RENDA_VARIAVEL',
    cmn_regulation_id: 5,
    administrator: 'CAIXA ECONÔMICA FEDERAL',
    manager: 'CAIXA DTVM S.A.',
    custodian: 'CAIXA ECONÔMICA FEDERAL',
    benchmark: 'IBOVESPA',
    risk_level: 'ALTO',
    anbima_category: 'Ações Indexadas',
    liquidity_days: 3,
    admin_fee_pct: 1.00,
    performance_fee_pct: 0.00,
    status: 'APROVADO'
  },
  {
    id: 'a0000007-0000-0000-0000-000000000007',
    cnpj: '10.577.503/0001-88',
    cvm_code: '142847',
    name: 'CAIXA FI BRASIL IRF-M1+ TP RF LP',
    trading_name: 'Caixa FI Brasil IRF-M1+ TP RF LP',
    asset_class: 'RENDA_FIXA',
    cmn_regulation_id: 2,
    administrator: 'CAIXA ECONÔMICA FEDERAL',
    manager: 'CAIXA DTVM S.A.',
    custodian: 'CAIXA ECONÔMICA FEDERAL',
    benchmark: 'IRF-M 1+',
    risk_level: 'MEDIO',
    anbima_category: 'Renda Fixa Indexados',
    liquidity_days: 0,
    admin_fee_pct: 0.20,
    performance_fee_pct: 0.00,
    status: 'APROVADO'
  },
  {
    id: 'a0000008-0000-0000-0000-000000000008',
    cnpj: '23.215.097/0001-55',
    cvm_code: '280912',
    name: 'CAIXA FIC BRASIL GESTÃO ESTRATÉGICA',
    trading_name: 'Caixa FIC Brasil Gestão Estratégica RF',
    asset_class: 'RENDA_FIXA',
    cmn_regulation_id: 3,
    administrator: 'CAIXA ECONÔMICA FEDERAL',
    manager: 'CAIXA DTVM S.A.',
    custodian: 'CAIXA ECONÔMICA FEDERAL',
    benchmark: 'CDI / IMA-Geral',
    risk_level: 'MEDIO',
    anbima_category: 'Renda Fixa Duração Livre',
    liquidity_days: 3,
    admin_fee_pct: 0.40,
    performance_fee_pct: 0.00,
    status: 'APROVADO'
  },
  {
    id: 'a0000009-0000-0000-0000-000000000009',
    cnpj: '13.397.466/0001-14',
    cvm_code: '180293',
    name: 'FI INSTITUCIONAL RF IRF-M LP',
    trading_name: 'FI Institucional RF IRF-M LP',
    asset_class: 'RENDA_FIXA',
    cmn_regulation_id: 2,
    administrator: 'BB GESTÃO DE RECURSOS DTVM S.A.',
    manager: 'BB GESTÃO DE RECURSOS DTVM S.A.',
    custodian: 'BANCO DO BRASIL S.A.',
    benchmark: 'IRF-M',
    risk_level: 'MEDIO',
    anbima_category: 'Renda Fixa Indexados',
    liquidity_days: 1,
    admin_fee_pct: 0.20,
    performance_fee_pct: 0.00,
    status: 'APROVADO'
  },
  {
    id: 'a0000010-0000-0000-0000-000000000010',
    cnpj: '13.081.159/0001-20',
    cvm_code: '180320',
    name: 'SICREDI FI RENDA FIXA LIQUIDEZ EMPRESARIAL',
    trading_name: 'Sicredi FI RF Liquidez Empresarial',
    asset_class: 'RENDA_FIXA',
    cmn_regulation_id: 2,
    administrator: 'BANCO COOPERATIVO SICREDI S.A.',
    manager: 'SICREDI ASSET MANAGEMENT',
    custodian: 'BANCO COOPERATIVO SICREDI S.A.',
    benchmark: 'CDI',
    risk_level: 'BAIXO',
    anbima_category: 'Renda Fixa Soberano',
    liquidity_days: 0,
    admin_fee_pct: 0.20,
    performance_fee_pct: 0.00,
    status: 'APROVADO'
  },
  {
    id: 'a0000011-0000-0000-0000-000000000011',
    cnpj: '14.386.926/0001-71',
    cvm_code: '190342',
    name: 'FI INSTITUCIONAL RF IRF-M1',
    trading_name: 'FI Institucional RF IRF-M1',
    asset_class: 'RENDA_FIXA',
    cmn_regulation_id: 2,
    administrator: 'CAIXA ECONÔMICA FEDERAL',
    manager: 'CAIXA DTVM S.A.',
    custodian: 'CAIXA ECONÔMICA FEDERAL',
    benchmark: 'IRF-M 1',
    risk_level: 'BAIXO',
    anbima_category: 'Renda Fixa Indexados',
    liquidity_days: 0,
    admin_fee_pct: 0.18,
    performance_fee_pct: 0.00,
    status: 'APROVADO'
  },
  {
    id: 'a0000012-0000-0000-0000-000000000012',
    cnpj: '13.322.202/0001-92',
    cvm_code: '180210',
    name: 'BB PREVID RF IDKA 2',
    trading_name: 'BB Previdenciário RF IDKA 2 TP',
    asset_class: 'RENDA_FIXA',
    cmn_regulation_id: 2,
    administrator: 'BB GESTÃO DE RECURSOS DTVM S.A.',
    manager: 'BB GESTÃO DE RECURSOS DTVM S.A.',
    custodian: 'BANCO DO BRASIL S.A.',
    benchmark: 'IDKA 2',
    risk_level: 'BAIXO',
    anbima_category: 'Renda Fixa Indexados',
    liquidity_days: 1,
    admin_fee_pct: 0.20,
    performance_fee_pct: 0.00,
    status: 'APROVADO'
  },
  {
    id: 'a0000013-0000-0000-0000-000000000013',
    cnpj: '42.318.981/0001-75',
    cvm_code: '450219',
    name: 'AÇÕES ESG GLOBAIS IS',
    trading_name: 'Ações ESG Globais IS FIA',
    asset_class: 'RENDA_VARIAVEL',
    cmn_regulation_id: 5,
    administrator: 'CAIXA ECONÔMICA FEDERAL',
    manager: 'CAIXA DTVM S.A.',
    custodian: 'CAIXA ECONÔMICA FEDERAL',
    benchmark: 'MSCI ESG',
    risk_level: 'ALTO',
    anbima_category: 'Ações Sustentabilidade/ESG',
    liquidity_days: 4,
    admin_fee_pct: 0.90,
    performance_fee_pct: 0.00,
    status: 'APROVADO'
  },
  {
    id: 'a0000014-0000-0000-0000-000000000014',
    cnpj: '11.328.882/0001-35',
    cvm_code: '150428',
    name: 'BB PREVID RF IRF-M TP',
    trading_name: 'BB Previdenciário RF IRF-M TP FI',
    asset_class: 'RENDA_FIXA',
    cmn_regulation_id: 2,
    administrator: 'BB GESTÃO DE RECURSOS DTVM S.A.',
    manager: 'BB GESTÃO DE RECURSOS DTVM S.A.',
    custodian: 'BANCO DO BRASIL S.A.',
    benchmark: 'IRF-M',
    risk_level: 'MEDIO',
    anbima_category: 'Renda Fixa Indexados',
    liquidity_days: 1,
    admin_fee_pct: 0.20,
    performance_fee_pct: 0.00,
    status: 'APROVADO'
  },
  {
    id: 'a0000015-0000-0000-0000-000000000015',
    cnpj: '14.218.835/0001-27',
    cvm_code: '190124',
    name: 'BB AÇÕES DIVIDENDOS MIDCAPS',
    trading_name: 'BB Ações Dividendos Midcaps FIA',
    asset_class: 'RENDA_VARIAVEL',
    cmn_regulation_id: 5,
    administrator: 'BB GESTÃO DE RECURSOS DTVM S.A.',
    manager: 'BB GESTÃO DE RECURSOS DTVM S.A.',
    custodian: 'BANCO DO BRASIL S.A.',
    benchmark: 'IDIV',
    risk_level: 'ALTO',
    anbima_category: 'Ações Dividendos',
    liquidity_days: 3,
    admin_fee_pct: 1.00,
    performance_fee_pct: 0.00,
    status: 'APROVADO'
  },
  {
    id: 'a0000016-0000-0000-0000-000000000016',
    cnpj: '10.742.584/0001-59',
    cvm_code: '142980',
    name: 'BB PREVIDENCIÁRIO RF IRF-M 1+ FI',
    trading_name: 'BB Previdenciário RF IRF-M 1+ TP',
    asset_class: 'RENDA_FIXA',
    cmn_regulation_id: 2,
    administrator: 'BB GESTÃO DE RECURSOS DTVM S.A.',
    manager: 'BB GESTÃO DE RECURSOS DTVM S.A.',
    custodian: 'BANCO DO BRASIL S.A.',
    benchmark: 'IRF-M 1+',
    risk_level: 'MEDIO',
    anbima_category: 'Renda Fixa Indexados',
    liquidity_days: 1,
    admin_fee_pct: 0.20,
    performance_fee_pct: 0.00,
    status: 'APROVADO'
  },
  {
    id: 'a0000017-0000-0000-0000-000000000017',
    cnpj: '21.838.144/0001-08',
    cvm_code: '260450',
    name: 'ITAÚ INSTITUCIONAL ALOCAÇÃO DINÂMICA RF FIF CIC RL',
    trading_name: 'Itaú Institucional Alocação Dinâmica RF',
    asset_class: 'RENDA_FIXA',
    cmn_regulation_id: 3,
    administrator: 'INTAG DTVM LTDA.',
    manager: 'ITAÚ UNIBANCO ASSET MANAGEMENT',
    custodian: 'ITAÚ UNIBANCO S.A.',
    benchmark: 'CDI / IMA-Geral',
    risk_level: 'MEDIO',
    anbima_category: 'Renda Fixa Duração Livre',
    liquidity_days: 1,
    admin_fee_pct: 0.30,
    performance_fee_pct: 0.00,
    status: 'APROVADO'
  },
  {
    id: 'a0000018-0000-0000-0000-000000000018',
    cnpj: '03.543.447/0001-03',
    cvm_code: '089450',
    name: 'SANTANDER RENDA FIXA REFERENCIADO DI INSTITUCIONAL PREMIUM',
    trading_name: 'Santander RF Ref DI Institucional Premium',
    asset_class: 'RENDA_FIXA',
    cmn_regulation_id: 3,
    administrator: 'BANCO SANTANDER (BRASIL) S.A.',
    manager: 'SANTANDER ASSET MANAGEMENT DTVM',
    custodian: 'BANCO SANTANDER (BRASIL) S.A.',
    benchmark: 'CDI',
    risk_level: 'BAIXO',
    anbima_category: 'Renda Fixa Referenciado DI',
    liquidity_days: 0,
    admin_fee_pct: 0.15,
    performance_fee_pct: 0.00,
    status: 'APROVADO'
  },
  {
    id: 'a0000019-0000-0000-0000-000000000019',
    cnpj: '05.164.356/0001-84',
    cvm_code: '100450',
    name: 'CAIXA FI BRASIL TÍTULOS PÚBLICOS RF',
    trading_name: 'Caixa FI Brasil Títulos Públicos RF',
    asset_class: 'RENDA_FIXA',
    cmn_regulation_id: 3,
    administrator: 'CAIXA ECONÔMICA FEDERAL',
    manager: 'CAIXA DTVM S.A.',
    custodian: 'CAIXA ECONÔMICA FEDERAL',
    benchmark: 'CDI',
    risk_level: 'BAIXO',
    anbima_category: 'Renda Fixa Soberano',
    liquidity_days: 0,
    admin_fee_pct: 0.20,
    performance_fee_pct: 0.00,
    status: 'APROVADO'
  },
  {
    id: 'a0000020-0000-0000-0000-000000000020',
    cnpj: '28.323.714/0001-87',
    cvm_code: '330150',
    name: 'TARPON GT INSTITUCIONAL FUNDO DE INVESTIMENTO EM COTAS',
    trading_name: 'Tarpon GT Institucional FIC FIA',
    asset_class: 'RENDA_VARIAVEL',
    cmn_regulation_id: 5,
    administrator: 'BNY MELLON SERVIÇOS FINANCEIROS DTVM S.A.',
    manager: 'TARPON GESTORA DE RECURSOS LTDA.',
    custodian: 'BNY MELLON BANCO S.A.',
    benchmark: 'IBOVESPA',
    risk_level: 'ALTO',
    anbima_category: 'Ações Livre',
    liquidity_days: 30,
    admin_fee_pct: 1.50,
    performance_fee_pct: 20.00,
    status: 'APROVADO'
  },
  {
    id: 'a0000021-0000-0000-0000-000000000021',
    cnpj: '14.508.605/0001-00',
    cvm_code: '190412',
    name: 'CAIXA ALIANÇA TÍTULOS PÚBLICOS FUNDO DE INVESTIMENTO FINANCEIRO',
    trading_name: 'Caixa Aliança Títulos Públicos FIF',
    asset_class: 'RENDA_FIXA',
    cmn_regulation_id: 2,
    administrator: 'CAIXA ECONÔMICA FEDERAL',
    manager: 'CAIXA DTVM S.A.',
    custodian: 'CAIXA ECONÔMICA FEDERAL',
    benchmark: 'IMA-Geral',
    risk_level: 'BAIXO',
    anbima_category: 'Renda Fixa Soberano',
    liquidity_days: 0,
    admin_fee_pct: 0.18,
    performance_fee_pct: 0.00,
    status: 'APROVADO'
  },
  {
    id: 'a0000022-0000-0000-0000-000000000022',
    cnpj: '21.986.074/0001-19',
    cvm_code: '270120',
    name: 'CAIXA BRASIL IPCA XVI FUNDO DE INVESTIMENTO FINANCEIRO RF CRÉDITO PRIVADO',
    trading_name: 'Caixa Brasil IPCA XVI FIF RF CP',
    asset_class: 'RENDA_FIXA',
    cmn_regulation_id: 4,
    administrator: 'CAIXA ECONÔMICA FEDERAL',
    manager: 'CAIXA DTVM S.A.',
    custodian: 'CAIXA ECONÔMICA FEDERAL',
    benchmark: 'IPCA',
    risk_level: 'MEDIO',
    anbima_category: 'Renda Fixa Crédito Privado',
    liquidity_days: 30,
    admin_fee_pct: 0.40,
    performance_fee_pct: 0.00,
    status: 'APROVADO'
  },
  {
    id: 'a0000023-0000-0000-0000-000000000023',
    cnpj: '30.075.696/0001-89',
    cvm_code: '340812',
    name: 'CAIXA INDEXA BOLSA AMERICANA MM LP RL',
    trading_name: 'Caixa Indexa Bolsa Americana MM LP',
    asset_class: 'MULTIMERCADO',
    cmn_regulation_id: 7,
    administrator: 'CAIXA ECONÔMICA FEDERAL',
    manager: 'CAIXA DTVM S.A.',
    custodian: 'CAIXA ECONÔMICA FEDERAL',
    benchmark: 'S&P 500 / USD',
    risk_level: 'MEDIO',
    anbima_category: 'Multimercados Estruturados',
    liquidity_days: 5,
    admin_fee_pct: 0.60,
    performance_fee_pct: 0.00,
    status: 'APROVADO'
  },
  {
    id: 'a0000024-0000-0000-0000-000000000024',
    cnpj: '35.651.712/0001-80',
    cvm_code: '380450',
    name: 'SICREDI FUNDO DE INVESTIMENTO FINANCEIRO OURO MULTIMERCADO RL',
    trading_name: 'Sicredi FIF Ouro Multimercado RL',
    asset_class: 'MULTIMERCADO',
    cmn_regulation_id: 7,
    administrator: 'BANCO COOPERATIVO SICREDI S.A.',
    manager: 'SICREDI ASSET MANAGEMENT',
    custodian: 'BANCO COOPERATIVO SICREDI S.A.',
    benchmark: 'Ouro BM&F',
    risk_level: 'MEDIO',
    anbima_category: 'Multimercados Commodities',
    liquidity_days: 5,
    admin_fee_pct: 0.50,
    performance_fee_pct: 0.00,
    status: 'APROVADO'
  },
  {
    id: 'a0000025-0000-0000-0000-000000000025',
    cnpj: '19.833.264/0001-49',
    cvm_code: '250140',
    name: 'SANTANDER CRESCIMENTO INSTITUCIONAL ADVANCED RF CP LP CIC FIF RL',
    trading_name: 'Santander Crescimento Inst Adv RF CP',
    asset_class: 'RENDA_FIXA',
    cmn_regulation_id: 4,
    administrator: 'BANCO SANTANDER (BRASIL) S.A.',
    manager: 'SANTANDER ASSET MANAGEMENT DTVM',
    custodian: 'BANCO SANTANDER (BRASIL) S.A.',
    benchmark: 'CDI',
    risk_level: 'MEDIO',
    anbima_category: 'Renda Fixa Crédito Privado',
    liquidity_days: 30,
    admin_fee_pct: 0.35,
    performance_fee_pct: 0.00,
    status: 'APROVADO'
  },
  {
    id: 'a0000026-0000-0000-0000-000000000026',
    cnpj: '08.246.333/0001-70',
    cvm_code: '124982',
    name: 'SANTANDER TÍTULOS PÚBLICOS PREMIUM RENDA FIXA REFERENCIADO DI - CIC FIF RL',
    trading_name: 'Santander TP Premium RF Ref DI',
    asset_class: 'RENDA_FIXA',
    cmn_regulation_id: 2,
    administrator: 'BANCO SANTANDER (BRASIL) S.A.',
    manager: 'SANTANDER ASSET MANAGEMENT DTVM',
    custodian: 'BANCO SANTANDER (BRASIL) S.A.',
    benchmark: 'CDI',
    risk_level: 'BAIXO',
    anbima_category: 'Renda Fixa Referenciado DI',
    liquidity_days: 0,
    admin_fee_pct: 0.15,
    performance_fee_pct: 0.00,
    status: 'APROVADO'
  },
  {
    id: 'a0000027-0000-0000-0000-000000000027',
    cnpj: '42.318.949/0001-90',
    cvm_code: '450120',
    name: 'ITAÚ AÇÕES S&P500® BRL FUNDO DE INVESTIMENTO FINANCEIRO DA CIC RL',
    trading_name: 'Itaú Ações S&P 500 BRL FIF',
    asset_class: 'RENDA_VARIAVEL',
    cmn_regulation_id: 5,
    administrator: 'INTAG DTVM LTDA.',
    manager: 'ITAÚ UNIBANCO ASSET MANAGEMENT',
    custodian: 'ITAÚ UNIBANCO S.A.',
    benchmark: 'S&P 500',
    risk_level: 'ALTO',
    anbima_category: 'Ações BDR Nível I',
    liquidity_days: 3,
    admin_fee_pct: 0.50,
    performance_fee_pct: 0.00,
    status: 'APROVADO'
  },
  {
    id: 'a0000028-0000-0000-0000-000000000028',
    cnpj: '14.188.162/0001-00',
    cvm_code: '190820',
    name: 'ITAÚ KINEA INSTITUCIONAL FIF DA CIC RENDA FIXA CRÉDITO PRIVADO LONGO PRAZO',
    trading_name: 'Itaú Kinea Inst FIF RF CP LP',
    asset_class: 'RENDA_FIXA',
    cmn_regulation_id: 4,
    administrator: 'INTAG DTVM LTDA.',
    manager: 'KINEA INVESTIMENTOS LTDA.',
    custodian: 'ITAÚ UNIBANCO S.A.',
    benchmark: 'CDI',
    risk_level: 'MEDIO',
    anbima_category: 'Renda Fixa Crédito Privado',
    liquidity_days: 30,
    admin_fee_pct: 0.40,
    performance_fee_pct: 0.00,
    status: 'APROVADO'
  },
  {
    id: 'a0000029-0000-0000-0000-000000000029',
    cnpj: '23.215.097/0001-50',
    cvm_code: '280918',
    name: 'CAIXA FI BRASIL MATRIZ RENDA FIXA',
    trading_name: 'Caixa FI Brasil Matriz RF',
    asset_class: 'RENDA_FIXA',
    cmn_regulation_id: 2,
    administrator: 'CAIXA ECONÔMICA FEDERAL',
    manager: 'CAIXA DTVM S.A.',
    custodian: 'CAIXA ECONÔMICA FEDERAL',
    benchmark: 'IMA-B / CDI',
    risk_level: 'BAIXO',
    anbima_category: 'Renda Fixa Soberano',
    liquidity_days: 0,
    admin_fee_pct: 0.20,
    performance_fee_pct: 0.00,
    status: 'APROVADO'
  },
  {
    id: 'a0000030-0000-0000-0000-000000000030',
    cnpj: '35.805.898/0001-60',
    cvm_code: '380910',
    name: 'BB PREV V ESP 2028',
    trading_name: 'BB Previdenciário TP V Especial 2028 FI',
    asset_class: 'RENDA_FIXA',
    cmn_regulation_id: 2,
    administrator: 'BB GESTÃO DE RECURSOS DTVM S.A.',
    manager: 'BB GESTÃO DE RECURSOS DTVM S.A.',
    custodian: 'BANCO DO BRASIL S.A.',
    benchmark: 'IMA-B 5',
    risk_level: 'BAIXO',
    anbima_category: 'Renda Fixa Títulos Públicos',
    liquidity_days: 0,
    admin_fee_pct: 0.15,
    performance_fee_pct: 0.00,
    status: 'APROVADO'
  },
  {
    id: 'a0000031-0000-0000-0000-000000000031',
    cnpj: '60.701.190/0001-04',
    cvm_code: null,
    name: 'LF Nº 3689056 - ITAU (SEM LIQUIDEZ)',
    trading_name: 'Letra Financeira Itaú Unibanco nº 3689056',
    asset_class: 'TITULO_PUBLICO_DIRETO',
    cmn_regulation_id: 4,
    administrator: 'BANCO ITAÚ UNIBANCO S.A.',
    manager: 'BANCO ITAÚ UNIBANCO S.A.',
    custodian: 'BANCO ITAÚ UNIBANCO S.A. / B3',
    benchmark: 'CDI',
    risk_level: 'BAIXO',
    anbima_category: 'Letra Financeira',
    liquidity_days: 0,
    admin_fee_pct: 0.00,
    performance_fee_pct: 0.00,
    status: 'APROVADO'
  },
  {
    id: 'a0000032-0000-0000-0000-000000000032',
    cnpj: '90.400.888/0001-42',
    cvm_code: null,
    name: 'LF Nº 260016951915 - SANTANDER',
    trading_name: 'Letra Financeira Santander nº 260016951915',
    asset_class: 'TITULO_PUBLICO_DIRETO',
    cmn_regulation_id: 4,
    administrator: 'BANCO SANTANDER (BRASIL) S.A.',
    manager: 'BANCO SANTANDER (BRASIL) S.A.',
    custodian: 'BANCO SANTANDER (BRASIL) S.A. / B3',
    benchmark: 'CDI',
    risk_level: 'BAIXO',
    anbima_category: 'Letra Financeira',
    liquidity_days: 0,
    admin_fee_pct: 0.00,
    performance_fee_pct: 0.00,
    status: 'APROVADO'
  }
];

const allocations = [
  { portfolio_id: PORTFOLIO_ID, asset_id: 'a0000001-0000-0000-0000-000000000001', quantity_quotas: 1730001.19434500, acquisition_average_price: 5.40388900, total_invested: 9348734.43, weight_pct: 6.74, last_valuation_date: '2026-09-30' },
  { portfolio_id: PORTFOLIO_ID, asset_id: 'a0000002-0000-0000-0000-000000000002', quantity_quotas:  664517.73167000, acquisition_average_price: 9.55935947, total_invested: 6352363.87, weight_pct: 4.58, last_valuation_date: '2026-09-30' },
  { portfolio_id: PORTFOLIO_ID, asset_id: 'a0000003-0000-0000-0000-000000000003', quantity_quotas: 3445091.18742800, acquisition_average_price: 4.68154900, total_invested: 16128363.19, weight_pct: 11.62, last_valuation_date: '2026-09-30' },
  { portfolio_id: PORTFOLIO_ID, asset_id: 'a0000004-0000-0000-0000-000000000004', quantity_quotas: 2526690.12950600, acquisition_average_price: 3.26789400, total_invested: 8256958.63, weight_pct: 5.95, last_valuation_date: '2026-09-30' },
  { portfolio_id: PORTFOLIO_ID, asset_id: 'a0000005-0000-0000-0000-000000000005', quantity_quotas: 3174904.69041400, acquisition_average_price: 3.70674831, total_invested: 11768573.27, weight_pct: 8.48, last_valuation_date: '2026-09-30' },
  { portfolio_id: PORTFOLIO_ID, asset_id: 'a0000006-0000-0000-0000-000000000006', quantity_quotas:  269874.06596500, acquisition_average_price: 9.22126600, total_invested: 2488580.55, weight_pct: 1.79, last_valuation_date: '2026-09-30' },
  { portfolio_id: PORTFOLIO_ID, asset_id: 'a0000007-0000-0000-0000-000000000007', quantity_quotas: 2271979.58490000, acquisition_average_price: 3.94903600, total_invested: 8972129.17, weight_pct: 6.46, last_valuation_date: '2026-09-30' },
  { portfolio_id: PORTFOLIO_ID, asset_id: 'a0000008-0000-0000-0000-000000000008', quantity_quotas: 1340618.12454400, acquisition_average_price: 2.50052200, total_invested: 3352245.11, weight_pct: 2.42, last_valuation_date: '2026-09-30' },
  { portfolio_id: PORTFOLIO_ID, asset_id: 'a0000009-0000-0000-0000-000000000009', quantity_quotas: 1627934.14821800, acquisition_average_price: 4.80108230, total_invested: 7815845.82, weight_pct: 5.63, last_valuation_date: '2026-09-30' },
  { portfolio_id: PORTFOLIO_ID, asset_id: 'a0000010-0000-0000-0000-000000000010', quantity_quotas: 4579349.42122900, acquisition_average_price: 1.92331140, total_invested: 8807514.93, weight_pct: 6.35, last_valuation_date: '2026-09-30' },
  { portfolio_id: PORTFOLIO_ID, asset_id: 'a0000011-0000-0000-0000-000000000011', quantity_quotas: 1071439.45335300, acquisition_average_price: 3.34150390, total_invested: 3580219.11, weight_pct: 2.58, last_valuation_date: '2026-09-30' },
  { portfolio_id: PORTFOLIO_ID, asset_id: 'a0000012-0000-0000-0000-000000000012', quantity_quotas:  156069.86713400, acquisition_average_price: 4.85119911, total_invested: 757126.00, weight_pct: 0.55, last_valuation_date: '2026-09-30' },
  { portfolio_id: PORTFOLIO_ID, asset_id: 'a0000013-0000-0000-0000-000000000013', quantity_quotas:  228508.34869700, acquisition_average_price: 4.09362100, total_invested: 935426.56, weight_pct: 0.67, last_valuation_date: '2026-09-30' },
  { portfolio_id: PORTFOLIO_ID, asset_id: 'a0000014-0000-0000-0000-000000000014', quantity_quotas:   87591.42079900, acquisition_average_price: 9.89219004, total_invested: 866470.98, weight_pct: 0.62, last_valuation_date: '2026-09-30' },
  { portfolio_id: PORTFOLIO_ID, asset_id: 'a0000015-0000-0000-0000-000000000015', quantity_quotas:  262967.30587400, acquisition_average_price: 3.54598185, total_invested: 932477.29, weight_pct: 0.67, last_valuation_date: '2026-09-30' },
  { portfolio_id: PORTFOLIO_ID, asset_id: 'a0000016-0000-0000-0000-000000000016', quantity_quotas:  557199.51447500, acquisition_average_price: 1.81485992, total_invested: 1011239.07, weight_pct: 0.73, last_valuation_date: '2026-09-30' },
  { portfolio_id: PORTFOLIO_ID, asset_id: 'a0000017-0000-0000-0000-000000000017', quantity_quotas:  204123.68920500, acquisition_average_price: 30.85604400, total_invested: 6298449.53, weight_pct: 4.54, last_valuation_date: '2026-09-30' },
  { portfolio_id: PORTFOLIO_ID, asset_id: 'a0000018-0000-0000-0000-000000000018', quantity_quotas:   14898.75999100, acquisition_average_price: 353.04935940, total_invested: 5259997.67, weight_pct: 3.79, last_valuation_date: '2026-09-30' },
  { portfolio_id: PORTFOLIO_ID, asset_id: 'a0000019-0000-0000-0000-000000000019', quantity_quotas: 1127732.88456400, acquisition_average_price: 7.48090300, total_invested: 8436460.32, weight_pct: 6.08, last_valuation_date: '2026-09-30' },
  { portfolio_id: PORTFOLIO_ID, asset_id: 'a0000020-0000-0000-0000-000000000020', quantity_quotas:  686425.67688900, acquisition_average_price: 2.85533814, total_invested: 1959977.42, weight_pct: 1.41, last_valuation_date: '2026-09-30' },
  { portfolio_id: PORTFOLIO_ID, asset_id: 'a0000021-0000-0000-0000-000000000021', quantity_quotas:  316244.32329200, acquisition_average_price: 7.81601700, total_invested: 2471771.01, weight_pct: 1.78, last_valuation_date: '2026-09-30' },
  { portfolio_id: PORTFOLIO_ID, asset_id: 'a0000022-0000-0000-0000-000000000022', quantity_quotas:  352709.88918700, acquisition_average_price: 3.12159700, total_invested: 1101018.13, weight_pct: 0.79, last_valuation_date: '2026-09-30' },
  { portfolio_id: PORTFOLIO_ID, asset_id: 'a0000023-0000-0000-0000-000000000023', quantity_quotas:  407969.33576900, acquisition_average_price: 3.97802100, total_invested: 1622910.59, weight_pct: 1.17, last_valuation_date: '2026-09-30' },
  { portfolio_id: PORTFOLIO_ID, asset_id: 'a0000024-0000-0000-0000-000000000024', quantity_quotas: 1172731.74961000, acquisition_average_price: 1.28098930, total_invested: 1502256.82, weight_pct: 1.08, last_valuation_date: '2026-09-30' },
  { portfolio_id: PORTFOLIO_ID, asset_id: 'a0000025-0000-0000-0000-000000000025', quantity_quotas:  128134.04228600, acquisition_average_price: 13.38470270, total_invested: 1715036.06, weight_pct: 1.24, last_valuation_date: '2026-09-30' },
  { portfolio_id: PORTFOLIO_ID, asset_id: 'a0000026-0000-0000-0000-000000000026', quantity_quotas:   47063.98980600, acquisition_average_price: 52.55639640, total_invested: 2473513.70, weight_pct: 1.78, last_valuation_date: '2026-09-30' },
  { portfolio_id: PORTFOLIO_ID, asset_id: 'a0000027-0000-0000-0000-000000000027', quantity_quotas:   34049.91300000, acquisition_average_price: 55.56969400, total_invested: 1892143.24, weight_pct: 1.36, last_valuation_date: '2026-09-30' },
  { portfolio_id: PORTFOLIO_ID, asset_id: 'a0000028-0000-0000-0000-000000000028', quantity_quotas:  282765.49496500, acquisition_average_price: 1.28042718, total_invested: 362060.57, weight_pct: 0.26, last_valuation_date: '2026-09-30' },
  { portfolio_id: PORTFOLIO_ID, asset_id: 'a0000029-0000-0000-0000-000000000029', quantity_quotas: 2094225.09950000, acquisition_average_price: 2.72215500, total_invested: 5700805.33, weight_pct: 4.11, last_valuation_date: '2026-09-30' },
  { portfolio_id: PORTFOLIO_ID, asset_id: 'a0000030-0000-0000-0000-000000000030', quantity_quotas:    1434.39991800, acquisition_average_price: 1165.473350, total_invested: 1671754.88, weight_pct: 1.20, last_valuation_date: '2026-09-30' },
  { portfolio_id: PORTFOLIO_ID, asset_id: 'a0000031-0000-0000-0000-000000000031', quantity_quotas:       1.00000000, acquisition_average_price: 2473289.5700, total_invested: 2473289.57, weight_pct: 1.78, last_valuation_date: '2026-09-30' },
  { portfolio_id: PORTFOLIO_ID, asset_id: 'a0000032-0000-0000-0000-000000000032', quantity_quotas:       1.00000000, acquisition_average_price: 2466146.1100, total_invested: 2466146.11, weight_pct: 1.78, last_valuation_date: '2026-09-30' }
];

async function run() {
  console.log('--- 1. Limpando dados antigos da carteira no Supabase ---');
  const delAlloc = await request('DELETE', '/rest/v1/portfolio_allocations?portfolio_id=not.is.null');
  console.log('Deletou allocations:', delAlloc.status);

  const delAssets = await request('DELETE', '/rest/v1/assets?id=not.is.null');
  console.log('Deletou assets:', delAssets.status);

  console.log('--- 2. Atualizando Informações Gerais do Portfólio Previ-Lacerda ---');
  // Upsert portfolio record
  const portfolioData = {
    id: PORTFOLIO_ID,
    name: 'Carteira Consolidada PREVI-LACERDA',
    reference_date: '2026-09-30',
    total_equity: 138781858.93,
    cash_balance: 0.00
  };
  const upsertPort = await request('POST', '/rest/v1/portfolios', portfolioData, {
    'Prefer': 'resolution=merge-duplicates,return=representation'
  });
  console.log('Upsert portfolio:', upsertPort.status);

  console.log('--- 3. Inserindo os 32 Ativos Oficiais ---');
  const insAssets = await request('POST', '/rest/v1/assets', assets);
  console.log('Inseriu assets:', insAssets.status, 'Total inserido:', Array.isArray(insAssets.data) ? insAssets.data.length : insAssets.raw);

  console.log('--- 4. Inserindo as 32 Alocações Oficiais da Carteira ---');
  const insAlloc = await request('POST', '/rest/v1/portfolio_allocations', allocations);
  console.log('Inseriu allocations:', insAlloc.status, 'Total inserido:', Array.isArray(insAlloc.data) ? insAlloc.data.length : insAlloc.raw);

  console.log('--- 5. Verificação de Integridade ---');
  const checkAssets = await request('GET', '/rest/v1/assets?select=id,name,trading_name,total_invested:portfolio_allocations(total_invested,weight_pct)');
  if (Array.isArray(checkAssets.data)) {
    console.log('Ativos ativos no banco Supabase:', checkAssets.data.length);
    const total = checkAssets.data.reduce((sum, a) => {
      const alloc = a.total_invested && a.total_invested[0];
      return sum + (alloc ? Number(alloc.total_invested) : 0);
    }, 0);
    console.log('VALOR TOTAL CARTEIRA PREVI-LACERDA NO SUPABASE: R$', total.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
  } else {
    console.log('Resposta verificação:', checkAssets);
  }
}

run().catch(console.error);
