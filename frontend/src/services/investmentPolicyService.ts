import { InvestmentPolicy, PolicyAllocationLimit, ActuarialTargetConfig } from '../types';

const STORAGE_KEY = 'argos_investment_policy_v1';

// Política Padrão Oficial do PREVI-LACERDA (Pontes e Lacerda - MT) para 2026
// Totalmente parametrizada com a Portaria MTP nº 1.467/2022 e a Resolução CMN nº 5.272/2025
export const DEFAULT_PREVI_LACERDA_POLICY: InvestmentPolicy = {
  id: 'pai-previ-lacerda-2026',
  exerciseYear: 2026,
  status: 'VIGENTE',
  version: '1.0 - Resolução CONDEL nº 06/2025',
  
  // Prazos e Governança Decisória (Portaria MTP nº 1.467/2022, Art. 85)
  committeeProposalDate: '2025-11-18',
  committeeAtaNumber: 'Ata CI nº 11/2025',
  deliberativeApprovalDeadline: '2025-12-31', // Prazo fatal da Portaria MTP 1.467/2022
  deliberativeApprovalDate: '2025-12-15', // Aprovado antes do encerramento do exercício
  deliberativeAtaNumber: 'Resolução CONDEL nº 06/2025',
  cadprevSubmissionDeadline: '2026-01-14', // 30 dias após aprovação
  cadprevSubmissionDate: '2026-01-12', // Cumprido dentro do prazo legal
  cadprevProtocol: 'PAI-2026-5106752-SPREV',
  
  // Meta Atuarial (Art. 85 e Anexo VII da Portaria MTP 1.467/2022)
  actuarialTarget: {
    indexName: 'IPCA',
    realInterestRatePct: 5.14,
    projectedIndexPct: 4.00,
    annualTargetPct: 9.35, // ((1 + 0.04) * (1 + 0.0514) - 1) * 100
    referenceLegalStudy: 'Estudo de Aderência Atuarial do PREVI-LACERDA (Exercício 2026) fundamentado na Curva ETTJ da Portaria MTP nº 1.467/2022.',
    calculationFormula: '(1 + IPCA) × (1 + 5,14% a.a.) - 1',
    notes: 'A taxa real de juros de 5,14% a.a. reflete o equilíbrio atuarial de longo prazo para cobertura das provisões matemáticas dos servidores de Pontes e Lacerda - MT.'
  },
  
  // Limites por Segmento e Artigos da Resolução CMN nº 5.272/2025
  allocationLimits: [
    {
      id: 'lim-rf-tp-direto',
      segment: 'RENDA_FIXA',
      segmentName: 'Renda Fixa - Títulos Públicos Federais (Emissão Direta / Compromissadas)',
      articleCode: 'Art. 7º, I, a',
      description: 'Títulos da dívida pública federal mobiliária de emissão do Tesouro Nacional e operações compromissadas.',
      cmnMaxLimitPct: 100.0,
      policyLowerLimitPct: 0.0,
      policyTargetLimitPct: 15.0,
      policyUpperLimitPct: 100.0,
      benchmark: 'Taxa Selic / CDI / NTN-B'
    },
    {
      id: 'lim-rf-tp-fundos',
      segment: 'RENDA_FIXA',
      segmentName: 'Renda Fixa - Fundos 100% Títulos Públicos',
      articleCode: 'Art. 7º, I, b',
      description: 'Fundos de investimento cujas carteiras sejam constituídas exclusivamente por títulos públicos federais.',
      cmnMaxLimitPct: 100.0,
      policyLowerLimitPct: 20.0,
      policyTargetLimitPct: 45.0,
      policyUpperLimitPct: 100.0,
      benchmark: 'IMA-B / IRF-M / Selic'
    },
    {
      id: 'lim-rf-referenciados',
      segment: 'RENDA_FIXA',
      segmentName: 'Renda Fixa - Fundos Referenciados em Índices de Preço / Juros',
      articleCode: 'Art. 7º, III, a',
      description: 'Fundos de renda fixa que buscam acompanhar a variação de taxas de juros ou de índices de preços oficiais.',
      cmnMaxLimitPct: 60.0,
      policyLowerLimitPct: 10.0,
      policyTargetLimitPct: 25.0,
      policyUpperLimitPct: 50.0,
      benchmark: 'IMA-B 5 / IMA Geral'
    },
    {
      id: 'lim-rf-credito-privado',
      segment: 'RENDA_FIXA',
      segmentName: 'Renda Fixa - Fundos com Crédito Privado',
      articleCode: 'Art. 7º, IV, a',
      description: 'Fundos de investimento de renda fixa com alocação em títulos e emissores de crédito privado de baixo risco.',
      cmnMaxLimitPct: 20.0,
      policyLowerLimitPct: 0.0,
      policyTargetLimitPct: 5.0,
      policyUpperLimitPct: 15.0,
      benchmark: 'CDI + Spread'
    },
    {
      id: 'lim-rv-fundos-acoes',
      segment: 'RENDA_VARIAVEL',
      segmentName: 'Renda Variável - Fundos de Investimento em Ações',
      articleCode: 'Art. 8º, I, a',
      description: 'Fundos de ações abertos, fundos indexados ao Ibovespa/IBrX e ETFs negociados na B3.',
      cmnMaxLimitPct: 30.0,
      policyLowerLimitPct: 0.0,
      policyTargetLimitPct: 5.0,
      policyUpperLimitPct: 15.0,
      benchmark: 'Ibovespa / IBrX-100'
    },
    {
      id: 'lim-exterior-fundos',
      segment: 'INVESTIMENTO_EXTERIOR',
      segmentName: 'Investimentos no Exterior - Fundos de Ações Globais / BDR Nível I',
      articleCode: 'Art. 9º, I',
      description: 'Fundos de investimento constituídos no Brasil que aplicam em ativos financeiros no exterior.',
      cmnMaxLimitPct: 10.0,
      policyLowerLimitPct: 0.0,
      policyTargetLimitPct: 2.0,
      policyUpperLimitPct: 7.0,
      benchmark: 'MSCI World / S&P 500'
    },
    {
      id: 'lim-multimercado',
      segment: 'MULTIMERCADO',
      segmentName: 'Investimentos Estruturados - Fundos Multimercado (FIM)',
      articleCode: 'Art. 10, I',
      description: 'Fundos de investimento multimercado com estratégias de juros, moedas e valor relativo.',
      cmnMaxLimitPct: 10.0,
      policyLowerLimitPct: 0.0,
      policyTargetLimitPct: 3.0,
      policyUpperLimitPct: 8.0,
      benchmark: 'CDI / CDI + 2% a.a.'
    },
    {
      id: 'lim-fii-imobiliario',
      segment: 'IMOVEIS_FII',
      segmentName: 'Fundos de Investimento Imobiliário (FII)',
      articleCode: 'Art. 11',
      description: 'Cotas de fundos de investimento imobiliário negociadas em bolsa de valores ou mercado de balcão organizado.',
      cmnMaxLimitPct: 5.0,
      policyLowerLimitPct: 0.0,
      policyTargetLimitPct: 0.0,
      policyUpperLimitPct: 3.0,
      benchmark: 'IFIX'
    }
  ],
  
  // Diretrizes Fiduciárias e Governança
  managementModel: 'PROPRIA',
  riskTolerance: 'CONSERVADOR',
  varLimitPct: 2.50, // Limite máximo de VaR 95% para 21 dias úteis
  stressTestingFrequency: 'TRIMESTRAL',
  credenciamentoCriteria: 'Exigência de credenciamento formal e prévio nos termos do Art. 21 da Resolução CMN nº 5.272/2025, com análise da capacidade técnica, idoneidade fiduciária, regularidade cadastral (CVM/BACEN) e patrimônio líquido mínimo de R$ 500 milhões para administradores e gestores.',
  esgGuidelines: 'Adoção prioritária de instituições e emissores que comprovem práticas formais de responsabilidade Ambiental, Social e Governança Corporativa (ASG / ESG), em conformidade com o Pró-Gestão RPPS.',
  transparencyAndControl: 'Elaboração e divulgação de relatórios de desempenho e conformidade fiduciária mensais ao Comitê de Investimentos e trimestrais ao Conselho Fiscal e Conselho Deliberativo, bem como publicação integral no portal da transparência do PREVI-LACERDA.',
  
  fullPolicyText: `PREFEITURA MUNICIPAL DE PONTES E LACERDA - MT
PREVI-LACERDA - INSTITUTO MUNICIPAL DE PREVIDÊNCIA SOCIAL
POLÍTICA ANUAL DE INVESTIMENTOS - EXERCÍCIO DE 2026
Aprovada pela Resolução CONDEL nº 06/2025 de 15/12/2025.

1. OBJETIVO GERAL E META ATUARIAL
A presente Política de Investimentos tem por finalidade estabelecer os princípios, diretrizes e limites para a gestão das aplicações dos recursos previdenciários do PREVI-LACERDA no exercício de 2026, com foco na segurança, rentabilidade, solvência e liquidez.

A Meta Atuarial do exercício é fixada no índice IPCA acrescido de juros reais de 5,14% ao ano (IPCA + 5,14% a.a.), parametrizada com o Estudo de Aderência Atuarial e a Curva ETTJ da Portaria MTP nº 1.467/2022.

2. ENQUADRAMENTO E LIMITES LEGAIS
As aplicações dos recursos respeitarão rigorosamente os limites quantitativos e qualitativos da Resolução CMN nº 5.272/2025:
- Renda Fixa (Art. 7º): Limite mínimo de 70%, meta de 90% e teto legal de 100%.
- Renda Variável (Art. 8º): Limite máximo da PAI de 15% (teto legal CMN de 30%).
- Investimentos no Exterior (Art. 9º): Limite máximo da PAI de 7% (teto legal CMN de 10%).
- Investimentos Estruturados (Art. 10): Limite máximo da PAI de 8% (teto legal CMN de 10%).
- Fundos Imobiliários (Art. 11): Limite máximo da PAI de 3% (teto legal CMN de 5%).

3. DATAS DE APROVAÇÃO E GOVERNANÇA
- Proposta do Comitê de Investimentos: 18 de novembro de 2025 (Ata nº 11/2025).
- Aprovação pelo Conselho Deliberativo: 15 de dezembro de 2025 (Resolução nº 06/2025), cumprindo o prazo legal estipulado pelo Art. 85 da Portaria MTP nº 1.467/2022 (anterior a 31/12).
- Envio ao CADPREV: 12 de janeiro de 2026 (Protocolo PAI-2026-5106752-SPREV).
- Gestão Própria dos recursos com credenciamento obrigatório nos termos do Art. 21 da Res. CMN nº 5.272/2025.`,
  
  updatedAt: new Date().toISOString(),
  updatedBy: 'Prof. Jansen (Administrador Master)'
};

// =========================================================================
// LEITOR INTELIGENTE DE TEXTO (PARSER SEMÂNTICO E REGEX RPPS / CMN / MTP)
// =========================================================================

export interface ParseResult {
  extractedPolicy: Partial<InvestmentPolicy>;
  extractedFields: {
    field: string;
    label: string;
    value: string;
    confidence: 'ALTA' | 'MEDIA' | 'BAIXA';
    sourceSnippet: string;
  }[];
  rawTextLength: number;
}

export const parseInvestmentPolicyText = (rawText: string): ParseResult => {
  const extractedFields: ParseResult['extractedFields'] = [];
  const partialPolicy: Partial<InvestmentPolicy> = {};

  if (!rawText || rawText.trim().length === 0) {
    return {
      extractedPolicy: partialPolicy,
      extractedFields: [],
      rawTextLength: 0
    };
  }

  const clean = rawText.replace(/\r\n/g, '\n');

  // 1. Extração da Meta Atuarial (CRUCIAL)
  // Padrões comuns em RPPS: "IPCA + 5,14%", "IPCA + 5.14% a.a.", "INPC acrescido de 5,45%", "taxa real de juros de 5,14% ao ano"
  const metaRegex = /(IPCA|INPC|IGP-M|SELIC)\s*(?:\+|acrescido\s+de)?\s*([0-9]+[,\.][0-9]{1,2})\s*%\s*(?:a\.?a\.?|ao\s+ano)?/i;
  const metaMatch = clean.match(metaRegex);

  if (metaMatch) {
    const indexName = metaMatch[1].toUpperCase() as 'IPCA' | 'INPC' | 'IGP-M' | 'SELIC';
    const rateStr = metaMatch[2].replace(',', '.');
    const realRate = parseFloat(rateStr);
    
    // Inflação projetada padrão baseada no índice
    const projectedInflation = indexName === 'IPCA' ? 4.00 : (indexName === 'INPC' ? 4.10 : 3.80);
    const calculatedTarget = parseFloat((((1 + projectedInflation / 100) * (1 + realRate / 100) - 1) * 100).toFixed(2));

    partialPolicy.actuarialTarget = {
      indexName,
      realInterestRatePct: realRate,
      projectedIndexPct: projectedInflation,
      annualTargetPct: calculatedTarget,
      referenceLegalStudy: `Identificado pelo Leitor Inteligente na Política Anual: ${metaMatch[0]}`,
      calculationFormula: `(1 + ${indexName}) × (1 + ${realRate.toFixed(2).replace('.', ',')}% a.a.) - 1`
    };

    extractedFields.push({
      field: 'actuarialTarget',
      label: 'Meta Atuarial do Exercício',
      value: `${indexName} + ${realRate.toFixed(2).replace('.', ',')}% a.a. (Total estimado: ${calculatedTarget.toFixed(2).replace('.', ',')}%)`,
      confidence: 'ALTA',
      sourceSnippet: metaMatch[0]
    });
  } else {
    // Procura alternativa: "taxa real de juros de X%"
    const fallbackRate = /(?:taxa\s+real\s+de\s+juros|juros\s+reais)\s*(?:de|fixada\s+em)?\s*([0-9]+[,\.][0-9]{1,2})\s*%/i;
    const fallbackMatch = clean.match(fallbackRate);
    if (fallbackMatch) {
      const realRate = parseFloat(fallbackMatch[1].replace(',', '.'));
      const calculatedTarget = parseFloat((((1 + 0.04) * (1 + realRate / 100) - 1) * 100).toFixed(2));
      partialPolicy.actuarialTarget = {
        indexName: 'IPCA',
        realInterestRatePct: realRate,
        projectedIndexPct: 4.00,
        annualTargetPct: calculatedTarget,
        referenceLegalStudy: `Taxa real de juros extraída: ${fallbackMatch[0]}`,
        calculationFormula: `(1 + IPCA) × (1 + ${realRate.toFixed(2).replace('.', ',')}% a.a.) - 1`
      };
      extractedFields.push({
        field: 'actuarialTarget',
        label: 'Meta Atuarial (Taxa Real)',
        value: `IPCA + ${realRate.toFixed(2).replace('.', ',')}% a.a. (Total estimado: ${calculatedTarget.toFixed(2).replace('.', ',')}%)`,
        confidence: 'MEDIA',
        sourceSnippet: fallbackMatch[0]
      });
    }
  }

  // 2. Extração do Ano do Exercício
  const yearRegex = /(?:exercício(?:\s+de)?|ano(?:\s+de)?|política(?:\s+anual)?(?:\s+de\s+investimentos)?(?:\s+do\s+ano)?)\s*(202[4-9]|203[0-5])/i;
  const yearMatch = clean.match(yearRegex);
  if (yearMatch) {
    const year = parseInt(yearMatch[1], 10);
    partialPolicy.exerciseYear = year;
    extractedFields.push({
      field: 'exerciseYear',
      label: 'Ano do Exercício da Política',
      value: year.toString(),
      confidence: 'ALTA',
      sourceSnippet: yearMatch[0]
    });
  }

  // 3. Extração de Resolução / Ata do Conselho Deliberativo
  const condelRegex = /(?:Resolução|Ata)(?:\s+(?:CONDEL|do\s+Conselho\s+Deliberativo))?\s*(?:nº|n°|n\.?)\s*([0-9]+[\/-][0-9]+)/i;
  const condelMatch = clean.match(condelRegex);
  if (condelMatch) {
    const ataNum = `Resolução CONDEL nº ${condelMatch[1]}`;
    partialPolicy.deliberativeAtaNumber = ataNum;
    extractedFields.push({
      field: 'deliberativeAtaNumber',
      label: 'Ato de Aprovação (Conselho Deliberativo)',
      value: ataNum,
      confidence: 'ALTA',
      sourceSnippet: condelMatch[0]
    });
  }

  // 4. Extração de Data de Aprovação
  const dateRegex = /(?:aprovada|deliberada|homologada|em|data:)\s*([0-3]?[0-9][\/\.-][0-1]?[0-9][\/\.-]202[4-9])/i;
  const dateMatch = clean.match(dateRegex);
  if (dateMatch) {
    const rawDate = dateMatch[1].replace(/[\.-]/g, '/');
    const parts = rawDate.split('/');
    if (parts.length === 3) {
      const isoDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      partialPolicy.deliberativeApprovalDate = isoDate;
      extractedFields.push({
        field: 'deliberativeApprovalDate',
        label: 'Data de Aprovação pelo Conselho',
        value: rawDate,
        confidence: 'ALTA',
        sourceSnippet: dateMatch[0]
      });
    }
  }

  // 5. Extração de Ata do Comitê de Investimentos
  const ciRegex = /(?:Comitê\s+de\s+Investimentos|Ata\s+do\s+Comitê|Ata\s+CI)\s*(?:nº|n°|n\.?)\s*([0-9]+[\/-][0-9]+)/i;
  const ciMatch = clean.match(ciRegex);
  if (ciMatch) {
    const ciNum = `Ata CI nº ${ciMatch[1]}`;
    partialPolicy.committeeAtaNumber = ciNum;
    extractedFields.push({
      field: 'committeeAtaNumber',
      label: 'Proposta do Comitê de Investimentos',
      value: ciNum,
      confidence: 'MEDIA',
      sourceSnippet: ciMatch[0]
    });
  }

  // 6. Extração de Limites de Alocação por Segmento
  // Detecta seções de Renda Fixa, Renda Variável, Exterior, etc.
  const rfRegex = /Renda\s+Fixa.*?([0-9]{1,2}(?:[,\.][0-9]+)?)\s*%/i;
  const rfMatch = clean.match(rfRegex);
  if (rfMatch) {
    extractedFields.push({
      field: 'allocation_rf',
      label: 'Alocação Detectada em Renda Fixa',
      value: `${rfMatch[1]}%`,
      confidence: 'MEDIA',
      sourceSnippet: rfMatch[0]
    });
  }

  const rvRegex = /Renda\s+Variável.*?([0-9]{1,2}(?:[,\.][0-9]+)?)\s*%/i;
  const rvMatch = clean.match(rvRegex);
  if (rvMatch) {
    extractedFields.push({
      field: 'allocation_rv',
      label: 'Alocação Detectada em Renda Variável',
      value: `${rvMatch[1]}%`,
      confidence: 'MEDIA',
      sourceSnippet: rvMatch[0]
    });
  }

  // 7. Extração de Modelo de Gestão
  if (/gestão\s+própria/i.test(clean)) {
    partialPolicy.managementModel = 'PROPRIA';
    extractedFields.push({
      field: 'managementModel',
      label: 'Modelo de Gestão',
      value: 'Gestão Própria (RPPS)',
      confidence: 'ALTA',
      sourceSnippet: 'gestão própria'
    });
  } else if (/gestão\s+terceirizada/i.test(clean)) {
    partialPolicy.managementModel = 'TERCEIRIZADA';
    extractedFields.push({
      field: 'managementModel',
      label: 'Modelo de Gestão',
      value: 'Gestão Terceirizada (Carteiras Administradas)',
      confidence: 'ALTA',
      sourceSnippet: 'gestão terceirizada'
    });
  }

  // 8. Extração de Limite de Risco (VaR)
  const varRegex = /VaR.*?([0-9]+[,\.][0-9]{1,2})\s*%/i;
  const varMatch = clean.match(varRegex);
  if (varMatch) {
    const varValue = parseFloat(varMatch[1].replace(',', '.'));
    partialPolicy.varLimitPct = varValue;
    extractedFields.push({
      field: 'varLimitPct',
      label: 'Limite de Value at Risk (VaR)',
      value: `${varValue.toFixed(2).replace('.', ',')}%`,
      confidence: 'MEDIA',
      sourceSnippet: varMatch[0]
    });
  }

  partialPolicy.fullPolicyText = rawText;
  partialPolicy.lastParsedAt = new Date().toISOString();

  return {
    extractedPolicy: partialPolicy,
    extractedFields,
    rawTextLength: clean.length
  };
};

// =========================================================================
// SERVIÇO PRINCIPAL DE POLÍTICA ANUAL DE INVESTIMENTOS (CRUD E PERSISTÊNCIA)
// =========================================================================

export const investmentPolicyService = {
  getPolicy(): InvestmentPolicy {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Erro ao carregar política de investimentos salva:', e);
    }
    return { ...DEFAULT_PREVI_LACERDA_POLICY };
  },

  savePolicy(policy: InvestmentPolicy, updatedBy = 'Prof. Jansen (Administrador Master)'): InvestmentPolicy {
    const updated: InvestmentPolicy = {
      ...policy,
      updatedAt: new Date().toISOString(),
      updatedBy
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Erro ao persistir política de investimentos:', e);
    }
    return updated;
  },

  resetToDefault(): InvestmentPolicy {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    return { ...DEFAULT_PREVI_LACERDA_POLICY };
  },

  applyParsedData(parsed: Partial<InvestmentPolicy>, sourceName?: string): InvestmentPolicy {
    const current = this.getPolicy();
    const merged: InvestmentPolicy = {
      ...current,
      ...parsed,
      actuarialTarget: parsed.actuarialTarget 
        ? { ...current.actuarialTarget, ...parsed.actuarialTarget }
        : current.actuarialTarget,
      allocationLimits: parsed.allocationLimits || current.allocationLimits,
      sourceDocumentName: sourceName || current.sourceDocumentName || 'Texto colado no Leitor Inteligente',
      lastParsedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return this.savePolicy(merged);
  }
};
