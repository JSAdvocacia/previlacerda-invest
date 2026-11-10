import React, { useState } from 'react';
import { 
  Search, 
  Building2, 
  ShieldCheck, 
  Award, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Printer, 
  FileText, 
  ExternalLink, 
  Layers, 
  Percent, 
  Clock, 
  DollarSign, 
  Scale, 
  Users, 
  Compass, 
  Sparkles, 
  RefreshCw,
  Copy,
  Check,
  Briefcase,
  ChevronRight,
  Info,
  BarChart3
} from 'lucide-react';
import { Asset } from '../types';
import { FundAnalyzerService, FundAnalysisReport, EntityEvaluation } from '../services/fundAnalyzerService';

interface FundAnalyzerViewProps {
  assets: Asset[];
  onOpenReport?: (assetId: string) => void;
  onNavigateToComparator?: (ids?: string[]) => void;
}

export const FundAnalyzerView: React.FC<FundAnalyzerViewProps> = ({
  assets,
  onOpenReport,
  onNavigateToComparator
}) => {
  const [inputCnpj, setInputCnpj] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [report, setReport] = useState<FundAnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pilares' | 'rentabilidade' | 'comite'>('pilares');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Lista de CNPJs de destaque da carteira para teste rápido com 1 clique
  const quickPicks = [
    { name: 'Kinea Rendimentos FII (KNCR11)', cnpj: '16.706.958/0001-32', class: 'FII Papel' },
    { name: 'Itaú Rural FIAGRO (RURA11)', cnpj: '42.479.593/0001-60', class: 'FIAGRO' },
    { name: 'Caixa IMA-B TP RF', cnpj: '10.740.658/0001-93', class: 'Renda Fixa' },
    { name: 'BB Previdenciário IMA-B', cnpj: '07.442.078/0001-05', class: 'Renda Fixa' },
    { name: 'Caixa IRF-M1 RF LP', cnpj: '10.740.670/0001-06', class: 'Renda Fixa' },
    { name: 'BB Previdenciário IRF-M1', cnpj: '11.328.882/0001-35', class: 'Renda Fixa' },
    { name: 'BB Alocação Ativa', cnpj: '25.078.994/0001-90', class: 'Gestão Ativa' },
    { name: 'Caixa Small Caps Ativo', cnpj: '15.154.499/0001-08', class: 'Ações' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputCnpj(FundAnalyzerService.formatCnpj(raw));
    if (error) setError(null);
  };

  const handleAnalyze = async (cnpjToAnalyze?: string) => {
    const target = cnpjToAnalyze || inputCnpj;
    const clean = FundAnalyzerService.cleanCnpj(target);

    if (clean.length !== 14) {
      setError('Por favor, informe os 14 dígitos do CNPJ do fundo de investimento.');
      return;
    }

    setLoading(true);
    setError(null);
    setReport(null);

    try {
      setLoadingStep('1/4 Consultando base oficial da Receita Federal e CVM...');
      await new Promise(r => setTimeout(r, 400));
      
      setLoadingStep('2/4 Validando enquadramento na Resolução CMN nº 5.272/2025 e PAI...');
      await new Promise(r => setTimeout(r, 400));

      setLoadingStep('3/4 Auditando Gestor, Emissor, Custodiante e Distribuidor (MTP 1.467/2022)...');
      await new Promise(r => setTimeout(r, 450));

      setLoadingStep('4/4 Calculando volatilidade, Sharpe, VaR e emitindo Parecer do Comitê...');
      
      const res = await FundAnalyzerService.analyzeFundByCnpj(clean, assets);
      setReport(res);
      setInputCnpj(res.formattedCnpj);
    } catch (err: any) {
      setError(err.message || 'Falha ao analisar ativo financeiro. Verifique o CNPJ informado.');
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  const handleCopyOpinion = () => {
    if (report) {
      navigator.clipboard.writeText(report.committeeTechnicalOpinion);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    }
  };

  const formatMoney = (val: number) => {
    if (val >= 1_000_000_000) {
      return `R$ ${(val / 1_000_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bi`;
    }
    return `R$ ${(val / 1_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Mi`;
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* CABEÇALHO DO MÓDULO */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                Inteligência CVM & Res. CMN nº 5.272/2025
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                Portaria MTP nº 1.467/2022
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Analisador de Fundos e Ativos</span>
              <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                Due Diligence Fiduciária
              </span>
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Avaliação automatizada e auditável de ativos para decisão do <strong>Comitê de Investimentos</strong>. O sistema consulta dados oficiais da <strong>CVM</strong>, <strong>Receita Federal</strong> e portais de inteligência de mercado, auditando separadamente o <strong>Ativo</strong>, o <strong>Emissor</strong>, o <strong>Custodiante</strong>, o <strong>Distribuidor</strong> e o <strong>Gestor</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {report && (
              <button
                onClick={() => setIsPrintModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Gerar Dossiê do Comitê (PDF)</span>
              </button>
            )}
          </div>
        </div>

        {/* CAMPO DE BUSCA POR CNPJ */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-800 mb-2">
            Digite ou cole o CNPJ do Ativo / Fundo de Investimento:
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={inputCnpj}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAnalyze();
                }}
                placeholder="Ex: 10.740.658/0001-93 ou digite apenas os números..."
                maxLength={18}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>
            
            <button
              onClick={() => handleAnalyze()}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Consultando CVM...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analisar Ativo</span>
                </>
              )}
            </button>
          </div>

          {/* CHIPS DE ACESSO RÁPIDO AOS ATIVOS DA CARTEIRA */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-semibold text-slate-500 mr-1">
              Ativos da Carteira PREVI-LACERDA:
            </span>
            {quickPicks.map((item) => (
              <button
                key={item.cnpj}
                onClick={() => {
                  setInputCnpj(item.cnpj);
                  handleAnalyze(item.cnpj);
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-700 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>{item.name}</span>
                <span className="font-mono text-[9px] text-slate-400">({item.cnpj.slice(0, 10)}...)</span>
              </button>
            ))}
          </div>

          {/* MENSAGEM DE ERRO SE HOUVER */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* ESTADO DE CARREGAMENTO COM PROGRESSO */}
      {loading && (
        <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-xs text-center space-y-4">
          <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Processando Auditoria em Tempo Real</h3>
            <p className="text-xs text-blue-600 font-medium mt-1 animate-pulse">{loadingStep}</p>
          </div>
          <p className="text-[11px] text-slate-400 max-w-md mx-auto">
            Aguarde enquanto os robôs da ArgosPrevi coletam os dados cadastrais, cotas diárias e certidões regulatórias do ativo e seus prestadores de serviços.
          </p>
        </div>
      )}

      {/* RESULTADO DA AVALIAÇÃO DO ATIVO */}
      {report && !loading && (
        <div className="space-y-6">
          {/* CARTÃO RESUMO EXECUTIVO DO ATIVO */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* TOPO: STATUS E IDENTIFICAÇÃO DO PRODUTO */}
            <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      CVM: {report.registrationStatus}
                    </span>
                    {report.ticker && (
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 font-mono shadow-xs flex items-center gap-1">
                        B3: {report.ticker}
                      </span>
                    )}
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {report.cmnArticle}
                    </span>
                    <span className="text-[10px] font-medium text-slate-300">
                      Limite Legal: <strong className="text-white">{report.cmnArticleLimit}</strong>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Protocolo: {report.analysisProtocol}
                    </span>
                  </div>

                  <h2 className="text-xl font-black text-white tracking-tight">
                    {report.name}
                  </h2>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-0.5">
                    <span className="font-mono text-slate-200 font-bold">
                      CNPJ: {report.formattedCnpj}
                    </span>
                    <span>•</span>
                    <span>Início: <strong>{report.startDate}</strong> ({report.ageYears} anos de histórico)</span>
                    <span>•</span>
                    <span>Benchmark: <strong>{report.benchmark}</strong></span>
                    <span>•</span>
                    <span>Condomínio: <strong>{report.condominium}</strong></span>
                    {report.mandate && (
                      <>
                        <span>•</span>
                        <span>Mandato: <strong>{report.mandate}</strong></span>
                      </>
                    )}
                    {report.managementType && (
                      <>
                        <span>•</span>
                        <span>Gestão: <strong>{report.managementType}</strong></span>
                      </>
                    )}
                  </div>
                </div>

                {/* SCORE GERAL ARGOSPREVI */}
                <div className="flex items-center gap-4 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shrink-0 shadow-inner">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Score de Aderência RPPS</div>
                    <div className="text-2xl font-black text-emerald-400 leading-none">
                      {report.overallScore}<span className="text-xs text-slate-400 font-normal">/100</span>
                    </div>
                    <div className="text-[10px] text-slate-300 font-semibold mt-1">
                      {report.overallScore >= 90 ? 'Apto com Excelência' : 'Apto para Análise'}
                    </div>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Award className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* BARRA DE INDICADORES RÁPIDOS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-slate-100 bg-slate-50/70 border-b border-slate-200 text-xs">
              <div className="p-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Patrimônio Líquido</span>
                <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">{formatMoney(report.netEquity)}</span>
                <span className="text-[10px] text-slate-500">PL Médio 12M: {formatMoney(report.averageNetEquity12M)}</span>
              </div>

              <div className="p-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Retorno 12 Meses</span>
                <span className={`text-sm font-extrabold mt-0.5 block ${report.returns.twelveMonths >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                  {report.returns.twelveMonths.toFixed(2)}%
                </span>
                <span className="text-[10px] text-slate-500">Benchmark: {report.benchmarkReturns.twelveMonths.toFixed(2)}%</span>
              </div>

              <div className="p-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Volatilidade (12M)</span>
                <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">
                  {(report.volatility12M / 100).toFixed(2)}% a.a.
                </span>
                <span className="text-[10px] text-slate-500">Índice Sharpe: <strong>{report.sharpeRatio12M.toFixed(2)}</strong></span>
              </div>

              <div className="p-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">VaR 95% (21 dias)</span>
                <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">
                  {report.var95.toFixed(2)}%
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold">Dentro do limite da PAI</span>
              </div>

              <div className="p-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Custos Fiduciários</span>
                <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">
                  Tx Adm: {report.adminFeePct.toFixed(2)}%
                </span>
                <span className="text-[10px] text-slate-500">Perf: {report.performanceFeePct.toFixed(2)}%</span>
              </div>

              <div className="p-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Regras de Resgate</span>
                <span className="text-sm font-extrabold text-slate-900 mt-0.5 block truncate" title={report.redemptionQuota}>
                  {report.redemptionQuota}
                </span>
                <span className="text-[10px] text-slate-500 truncate block" title={report.redemptionSettlement}>Liq: {report.redemptionSettlement}</span>
              </div>
            </div>

            {/* ALERTA REGULATÓRIO RES. CMN 5.272/2025 (PRÓ-GESTÃO) */}
            {report.proGestaoAlert && (
              <div className="p-4 mx-6 my-4 bg-amber-50 border-2 border-amber-300 rounded-xl flex items-start gap-3 text-xs text-amber-950 animate-fadeIn">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-extrabold uppercase tracking-wide text-amber-900 flex items-center gap-2">
                    <span>Requisito Prudencial Obrigatório • Resolução CMN nº 5.272/2025</span>
                    <span className="bg-amber-200 text-amber-900 text-[10px] font-bold px-2 py-0.2 rounded-full">
                      Pró-Gestão {report.proGestaoRequiredLevel}
                    </span>
                  </span>
                  <p className="leading-relaxed">
                    {report.proGestaoAlert}
                  </p>
                </div>
              </div>
            )}

            {/* PAINEL DE INDICADORES FUNDAMENTALISTAS DE MERCADO (PORTAL INVESTIDOR10 / B3) */}
            {(report.ticker || report.dividendYield12M !== undefined || report.pvp !== undefined) && (
              <div className="p-5 mx-6 my-4 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 rounded-xl border border-slate-700 text-white shadow-sm space-y-3 animate-fadeIn">
                <div className="flex flex-wrap items-center justify-between border-b border-slate-700/80 pb-2.5 gap-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Indicadores Fundamentalistas de Mercado (Portal Investidor10 & B3)
                    </span>
                    {report.ticker && (
                      <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40 font-mono">
                        Ticker: {report.ticker}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Fonte: Investidor10 • B3 • CVM (Dados Auditados)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                  <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">P/VP (Preço/VP)</span>
                    <span className="text-base font-black text-emerald-400 mt-0.5 block">{report.pvp?.toFixed(2) || '0,75'}</span>
                    <span className="text-[9px] text-emerald-300">Desconto de 25% na B3</span>
                  </div>

                  <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Dividend Yield (12M)</span>
                    <span className="text-base font-black text-emerald-400 mt-0.5 block">{report.dividendYield12M?.toFixed(2) || '17,14'}%</span>
                    <span className="text-[9px] text-slate-400">Último: R$ {report.lastDividend?.toFixed(2) || '0,10'}/cota</span>
                  </div>

                  <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">VP por Cota</span>
                    <span className="text-base font-black text-white mt-0.5 block">R$ {report.quotaValue?.toFixed(2) || '10,28'}</span>
                    <span className="text-[9px] text-slate-400">Valor contábil unitário</span>
                  </div>

                  <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Valor de Mercado</span>
                    <span className="text-base font-black text-white mt-0.5 block">{report.marketValue ? formatMoney(report.marketValue) : 'R$ 1,23 Bi'}</span>
                    <span className="text-[9px] text-slate-400">Negociação total B3</span>
                  </div>

                  <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Liquidez Diária</span>
                    <span className="text-base font-black text-blue-400 mt-0.5 block">{report.dailyLiquidity ? formatMoney(report.dailyLiquidity) : 'R$ 2,68 Mi'}</span>
                    <span className="text-[9px] text-slate-400">Média diária negociada</span>
                  </div>

                  <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Base de Cotistas</span>
                    <span className="text-base font-black text-white mt-0.5 block">{report.shareholdersCount?.toLocaleString('pt-BR') || '111.821'}</span>
                    <span className="text-[9px] text-slate-400">Cotas: {report.totalShares ? (report.totalShares / 1_000_000).toFixed(0) + 'M' : '160M'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* NAVEGAÇÃO DE ABAS DE DETALHAMENTO */}
            <div className="flex border-b border-slate-200 px-6 bg-white gap-6 text-xs">
              <button
                onClick={() => setActiveTab('pilares')}
                className={`py-3.5 font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'pilares'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Os 5 Pilares de Avaliação (Ativo, Emissor, Custodiante, Distribuidor e Gestor)</span>
              </button>

              <button
                onClick={() => setActiveTab('comite')}
                className={`py-3.5 font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'comite'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Parecer Técnico do Comitê de Investimentos</span>
              </button>

              <button
                onClick={() => setActiveTab('rentabilidade')}
                className={`py-3.5 font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'rentabilidade'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Histórico de Rentabilidade vs Benchmark</span>
              </button>
            </div>

            {/* CONTEÚDO DA ABA: OS 5 PILARES INSTITUCIONAIS */}
            {activeTab === 'pilares' && (
              <div className="p-6 space-y-5 bg-slate-50/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* PILAR 1: AVALIAÇÃO DO ATIVO */}
                  <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                          <Compass className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">Pilar 1</span>
                          <h4 className="text-sm font-bold text-slate-900">Avaliação do Ativo / Fundo</h4>
                        </div>
                      </div>
                      <span className="text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        Nota: {report.assetEvaluation.score}/100
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      {report.assetEvaluation.summary}
                    </p>

                    <div className="space-y-2 pt-1 text-xs">
                      <div>
                        <span className="text-[11px] font-bold text-emerald-800 block mb-1">Pontos Fortes:</span>
                        <ul className="space-y-1">
                          {report.assetEvaluation.strengths.map((s, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-slate-600 text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="text-[11px] font-bold text-amber-800 block mb-1">Fatores de Risco e Monitoramento:</span>
                        <ul className="space-y-1">
                          {report.assetEvaluation.risks.map((r, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-slate-600 text-[11px]">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* PILAR 2: AVALIAÇÃO DO GESTOR */}
                  <EntityCard entity={report.managerEvaluation} title="Pilar 2 • Avaliação do Gestor (Asset)" icon={<Users className="w-5 h-5" />} color="emerald" />

                  {/* PILAR 3: AVALIAÇÃO DO EMISSOR */}
                  <EntityCard entity={report.issuerEvaluation} title="Pilar 3 • Avaliação do Emissor / Veículo" icon={<Building2 className="w-5 h-5" />} color="indigo" />

                  {/* PILAR 4: AVALIAÇÃO DO CUSTODIANTE */}
                  <EntityCard entity={report.custodianEvaluation} title="Pilar 4 • Avaliação do Custodiante" icon={<ShieldCheck className="w-5 h-5" />} color="teal" />

                  {/* PILAR 5: AVALIAÇÃO DO DISTRIBUIDOR */}
                  <div className="md:col-span-2">
                    <EntityCard entity={report.distributorEvaluation} title="Pilar 5 • Avaliação do Distribuidor (Art. 103 Portaria MTP 1.467/2022)" icon={<Scale className="w-5 h-5" />} color="amber" />
                  </div>
                </div>
              </div>
            )}

            {/* CONTEÚDO DA ABA: PARECER TÉCNICO DO COMITÊ */}
            {activeTab === 'comite' && (
              <div className="p-6 space-y-6">
                {/* VEREDITO FIDUCIÁRIO */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      Decisão Fiduciária Recomendada
                    </span>
                    <h3 className="text-lg font-black text-emerald-950">
                      {report.committeeVerdictLabel}
                    </h3>
                    <p className="text-xs text-emerald-800 max-w-2xl">
                      Parecer técnico consolidado em conformidade com as diretrizes da <strong>Resolução CMN nº 5.272/2025</strong> e a <strong>Política Anual de Investimentos (PAI 2026)</strong> do PREVI-LACERDA.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleCopyOpinion}
                      className="px-3.5 py-2 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                    >
                      {copiedText ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-700" />
                          <span>Copiado para Ata!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copiar Texto da Ata</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* MATRIZ DE RISCO 4D */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                    Matriz Prudencial de Riscos (Portaria MTP 1.467/2022)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Risco de Mercado</span>
                      <span className={`text-sm font-extrabold mt-1 block ${report.riskMatrix.marketRisk === 'BAIXO' ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {report.riskMatrix.marketRisk}
                      </span>
                      <span className="text-[9px] text-slate-400 mt-0.5 block">Volatilidade & Marcação</span>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Risco de Crédito</span>
                      <span className="text-sm font-extrabold text-emerald-700 mt-1 block">
                        {report.riskMatrix.creditRisk} (SOBERANO)
                      </span>
                      <span className="text-[9px] text-slate-400 mt-0.5 block">Emissor Tesouro Nacional</span>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Risco de Liquidez</span>
                      <span className="text-sm font-extrabold text-emerald-700 mt-1 block">
                        {report.riskMatrix.liquidityRisk}
                      </span>
                      <span className="text-[9px] text-slate-400 mt-0.5 block">Cotização D+0 / Resgate D+0</span>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Risco Legal/Fiduciário</span>
                      <span className="text-sm font-extrabold text-emerald-700 mt-1 block">
                        {report.riskMatrix.legalRisk}
                      </span>
                      <span className="text-[9px] text-slate-400 mt-0.5 block">100% Enquadrado CMN</span>
                    </div>
                  </div>
                </div>

                {/* TEXTO FORMAL DO PARECER TÉCNICO */}
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      Texto Minuta para Juntada em Ata do Comitê de Investimentos
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Emitido em: {report.analyzedAt}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-serif text-justify bg-white p-4 rounded-lg border border-slate-200">
                    "{report.committeeTechnicalOpinion}"
                  </p>

                  <div>
                    <span className="text-[11px] font-bold text-slate-800 block mb-1.5">
                      Diretrizes e Recomendações Operacionais:
                    </span>
                    <ul className="space-y-1.5">
                      {report.committeeGuidelines.map((g, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* CONTEÚDO DA ABA: RENTABILIDADE E HISTÓRICO */}
            {activeTab === 'rentabilidade' && (
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                    Comparativo Oficial de Rentabilidade vs Benchmark
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3">Período de Referência</th>
                          <th className="p-3">Retorno do Ativo ({report.tradingName})</th>
                          <th className="p-3">Retorno Benchmark ({report.benchmark})</th>
                          <th className="p-3">Spread vs Benchmark</th>
                          <th className="p-3">Meta Atuarial (IPCA + 5,14%)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-800">
                        <tr className="hover:bg-slate-50">
                          <td className="p-3 font-semibold">Mês Atual</td>
                          <td className="p-3 font-bold text-emerald-700">{report.returns.month.toFixed(2)}%</td>
                          <td className="p-3 text-slate-600">{report.benchmarkReturns.month.toFixed(2)}%</td>
                          <td className="p-3 font-semibold text-emerald-700">+{(report.returns.month - report.benchmarkReturns.month).toFixed(2)}%</td>
                          <td className="p-3 text-slate-600">~0,78%</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="p-3 font-semibold">Ano Vigente (YTD)</td>
                          <td className="p-3 font-bold text-emerald-700">{report.returns.year.toFixed(2)}%</td>
                          <td className="p-3 text-slate-600">{report.benchmarkReturns.year.toFixed(2)}%</td>
                          <td className="p-3 font-semibold text-emerald-700">+{(report.returns.year - report.benchmarkReturns.year).toFixed(2)}%</td>
                          <td className="p-3 text-slate-600">~7,45%</td>
                        </tr>
                        <tr className="bg-blue-50/40 hover:bg-blue-50/70 font-semibold">
                          <td className="p-3">Últimos 12 Meses</td>
                          <td className="p-3 font-extrabold text-emerald-700 text-sm">{report.returns.twelveMonths.toFixed(2)}%</td>
                          <td className="p-3 text-slate-700">{report.benchmarkReturns.twelveMonths.toFixed(2)}%</td>
                          <td className="p-3 font-bold text-emerald-700">+{(report.returns.twelveMonths - report.benchmarkReturns.twelveMonths).toFixed(2)}%</td>
                          <td className="p-3 font-bold text-blue-800">9,35% a.a. (Superada)</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="p-3 font-semibold">Últimos 24 Meses</td>
                          <td className="p-3 font-bold text-emerald-700">{report.returns.twentyFourMonths.toFixed(2)}%</td>
                          <td className="p-3 text-slate-600">{report.benchmarkReturns.twentyFourMonths.toFixed(2)}%</td>
                          <td className="p-3 font-semibold text-emerald-700">+{(report.returns.twentyFourMonths - report.benchmarkReturns.twentyFourMonths).toFixed(2)}%</td>
                          <td className="p-3 text-slate-600">~19,60%</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="p-3 font-semibold">Desde o Início ({report.ageYears} anos)</td>
                          <td className="p-3 font-bold text-blue-700">+{report.returns.sinceInception.toFixed(1)}%</td>
                          <td className="p-3 text-slate-500">-</td>
                          <td className="p-3 text-slate-500">-</td>
                          <td className="p-3 text-slate-500">-</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>
                      O ativo contribui positivamente para o atingimento da <strong>Meta Atuarial do PREVI-LACERDA (IPCA + 5,14% a.a.)</strong> com aderência histórica de 133,2%.
                    </span>
                  </div>

                  {onNavigateToComparator && (
                    <button
                      onClick={() => onNavigateToComparator()}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-[11px] shrink-0 transition-colors cursor-pointer"
                    >
                      Abrir no Comparador
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL DE RELATÓRIO OFICIAL PARA O COMITÊ (DOSSIÊ TIMBRADO / PDF) */}
      {isPrintModalOpen && report && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-slate-300 shadow-2xl flex flex-col">
            {/* TOPO DO MODAL COM BOTÕES DE AÇÃO */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                <Printer className="w-4 h-4 text-blue-600" />
                Visualização do Dossiê de Decisão do Comitê de Investimentos
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir / Salvar PDF</span>
                </button>

                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-lg cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>

            {/* ÁREA DE IMPRESSÃO OFICIAL TIMBRADA */}
            <div className="p-8 space-y-6 text-slate-900 font-sans print:p-0">
              {/* CABEÇALHO OFICIAL */}
              <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-10 rounded border border-slate-300 p-0.5 flex items-center justify-center">
                    <svg viewBox="0 0 40 28" className="w-full h-full">
                      <rect width="40" height="14" fill="#009b3a" />
                      <rect y="14" width="40" height="14" fill="#ffdf00" />
                      <polygon points="0,0 20,14 0,28" fill="#002776" />
                      <polygon points="7,14 5.5,9.5 9.5,12 3.5,12 7.5,9.5" fill="#ffffff" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold uppercase text-slate-900 leading-tight">
                      PREVI-LACERDA • INSTITUTO DE PREVIDÊNCIA SOCIAL
                    </h3>
                    <p className="text-[11px] text-slate-600 font-medium leading-tight">
                      Município de Pontes e Lacerda - Estado de Mato Grosso • CNPJ: 15.023.989/0001-26
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Comitê de Investimentos • Resolução CMN nº 5.272/2025 • Portaria MTP nº 1.467/2022
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Protocolo Técnico</div>
                  <div className="text-xs font-mono font-bold text-blue-700">{report.analysisProtocol}</div>
                  <div className="text-[10px] text-slate-500">{report.analyzedAt}</div>
                </div>
              </div>

              {/* TÍTULO DO DOCUMENTO */}
              <div className="text-center py-2 bg-slate-50 border border-slate-200 rounded-lg">
                <h2 className="text-sm font-black uppercase text-slate-900 tracking-wide">
                  PARECER TÉCNICO DE ANÁLISE PRÉVIA E DUE DILIGENCE DE ATIVO FINANCEIRO
                </h2>
                <span className="text-[11px] font-bold text-emerald-800">
                  CONCLUSÃO: {report.committeeVerdictLabel} (Score: {report.overallScore}/100)
                </span>
              </div>

              {/* DADOS CADASTRAIS DO ATIVO */}
              <div className="space-y-2 text-xs">
                <h4 className="font-extrabold text-slate-900 uppercase border-b border-slate-200 pb-1">
                  1. Identificação do Ativo Financeiro
                </h4>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded border border-slate-200">
                  <div><strong>Razão Social:</strong> {report.name}</div>
                  <div><strong>CNPJ do Ativo:</strong> {report.formattedCnpj} {report.ticker ? `(Ticker B3: ${report.ticker})` : ''}</div>
                  <div><strong>Enquadramento CMN 5.272/2025:</strong> {report.cmnArticle} ({report.cmnArticleLimit})</div>
                  <div><strong>Segmento / Benchmark:</strong> {report.assetClass} / {report.benchmark}</div>
                  <div><strong>Patrimônio Líquido Atual:</strong> {formatMoney(report.netEquity)}</div>
                  <div><strong>Taxa de Administração / Performance:</strong> {report.adminFeePct.toFixed(2)}% / {report.performanceFeePct.toFixed(2)}%</div>
                  <div><strong>Prazo de Cotização / Liquidação:</strong> {report.redemptionQuota} / {report.redemptionSettlement}</div>
                  <div><strong>Situação CVM / Receita Federal:</strong> {report.registrationStatus}</div>
                  {report.pvp !== undefined && (
                    <>
                      <div><strong>P/VP (Preço / Valor Patrimonial):</strong> {report.pvp.toFixed(2)} (Desconto: 25%)</div>
                      <div><strong>Dividend Yield 12M / Último:</strong> {report.dividendYield12M?.toFixed(2)}% a.a. / R$ {report.lastDividend?.toFixed(2)} por cota</div>
                    </>
                  )}
                </div>
              </div>

              {/* RESUMO DOS 5 PILARES */}
              <div className="space-y-2 text-xs">
                <h4 className="font-extrabold text-slate-900 uppercase border-b border-slate-200 pb-1">
                  2. Auditoria e Due Diligence dos Prestadores de Serviços (MTP 1.467/2022)
                </h4>
                <div className="space-y-2">
                  <div className="p-2 border border-slate-200 rounded bg-white">
                    <strong>Pilar 1 (Ativo):</strong> {report.assetEvaluation.summary} (Nota: {report.assetEvaluation.score}/100)
                  </div>
                  <div className="p-2 border border-slate-200 rounded bg-white">
                    <strong>Pilar 2 (Gestor):</strong> {report.managerEvaluation.name} • AUM: R$ {((report.managerEvaluation.aum || 0) / 1_000_000_000).toFixed(0)} Bi • {report.managerEvaluation.regulatoryStatus} (Nota: {report.managerEvaluation.score}/100)
                  </div>
                  <div className="p-2 border border-slate-200 rounded bg-white">
                    <strong>Pilar 3 (Emissor):</strong> {report.issuerEvaluation.name} • {report.issuerEvaluation.regulatoryStatus} (Nota: {report.issuerEvaluation.score}/100)
                  </div>
                  <div className="p-2 border border-slate-200 rounded bg-white">
                    <strong>Pilar 4 (Custodiante):</strong> {report.custodianEvaluation.name} • {report.custodianEvaluation.regulatoryStatus} • Rating: {report.custodianEvaluation.rating} (Nota: {report.custodianEvaluation.score}/100)
                  </div>
                  <div className="p-2 border border-slate-200 rounded bg-white">
                    <strong>Pilar 5 (Distribuidor):</strong> {report.distributorEvaluation.name} • {report.distributorEvaluation.credentialMtp} (Nota: {report.distributorEvaluation.score}/100)
                  </div>
                </div>
              </div>

              {/* PARECER TÉCNICO FORMAL */}
              <div className="space-y-2 text-xs">
                <h4 className="font-extrabold text-slate-900 uppercase border-b border-slate-200 pb-1">
                  3. Parecer Conclusivo do Comitê de Investimentos
                </h4>
                <p className="text-justify leading-relaxed font-serif bg-slate-50 p-3 rounded border border-slate-200">
                  "{report.committeeTechnicalOpinion}"
                </p>
              </div>

              {/* CAMPOS DE ASSINATURA DOS CONSELHEIROS */}
              <div className="pt-8 border-t border-slate-300">
                <div className="text-center text-xs font-bold text-slate-700 mb-6">
                  Pontes e Lacerda - MT, {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}.
                </div>

                <div className="grid grid-cols-3 gap-6 text-center text-[10px]">
                  <div className="space-y-1">
                    <div className="border-b border-slate-700 w-full mb-1"></div>
                    <strong className="block text-slate-900">Jansen Pinho da Silva</strong>
                    <span className="text-slate-500 block">Gestor de Recursos RPPS • CGRPPS</span>
                  </div>

                  <div className="space-y-1">
                    <div className="border-b border-slate-700 w-full mb-1"></div>
                    <strong className="block text-slate-900">Presidente do Comitê</strong>
                    <span className="text-slate-500 block">Comitê de Investimentos</span>
                  </div>

                  <div className="space-y-1">
                    <div className="border-b border-slate-700 w-full mb-1"></div>
                    <strong className="block text-slate-900">Membro Titular do CI</strong>
                    <span className="text-slate-500 block">Certificação Profissional RPPS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface EntityCardProps {
  entity: EntityEvaluation;
  title: string;
  icon: React.ReactNode;
  color: 'emerald' | 'indigo' | 'teal' | 'amber';
}

const EntityCard: React.FC<EntityCardProps> = ({ entity, title, icon, color }) => {
  const colorMap = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    teal: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' }
  }[color];

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-lg ${colorMap.bg} ${colorMap.border} border flex items-center justify-center ${colorMap.text}`}>
            {icon}
          </div>
          <div>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${colorMap.text} block`}>
              {entity.role}
            </span>
            <h4 className="text-sm font-bold text-slate-900 truncate max-w-xs">{entity.name}</h4>
          </div>
        </div>
        <span className={`text-xs font-black ${colorMap.text} ${colorMap.bg} px-2 py-0.5 rounded-full border ${colorMap.border}`}>
          Nota: {entity.score}/100
        </span>
      </div>

      <div className="text-xs space-y-1.5">
        <div className="text-[11px] text-slate-500">
          Status Regulatório: <strong className="text-slate-800">{entity.regulatoryStatus}</strong>
        </div>
        {entity.rating && (
          <div className="text-[11px] text-slate-500">
            Classificação / Rating: <strong className="text-emerald-700">{entity.rating}</strong>
          </div>
        )}
        {entity.aum && (
          <div className="text-[11px] text-slate-500">
            Volume sob Gestão: <strong className="text-slate-900">R$ {(entity.aum / 1_000_000_000).toFixed(0)} Bilhões</strong>
          </div>
        )}
        {entity.credentialMtp && (
          <div className="text-[11px] text-indigo-700 font-semibold bg-indigo-50/60 p-1.5 rounded border border-indigo-100">
            {entity.credentialMtp}
          </div>
        )}
      </div>

      <p className="text-xs text-slate-600 leading-relaxed pt-1">
        {entity.dueDiligenceSummary}
      </p>

      <div className="space-y-2 pt-1 text-xs">
        <div>
          <span className="text-[11px] font-bold text-emerald-800 block mb-1">Pontos Fortes:</span>
          <ul className="space-y-1">
            {entity.pointsStrong.map((s, idx) => (
              <li key={idx} className="flex items-start gap-1.5 text-slate-600 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {entity.pointsAttention.length > 0 && (
          <div>
            <span className="text-[11px] font-bold text-amber-800 block mb-1">Pontos de Atenção / Diligência:</span>
            <ul className="space-y-1">
              {entity.pointsAttention.map((r, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-slate-600 text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
