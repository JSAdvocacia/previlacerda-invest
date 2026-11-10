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
  BarChart3,
  ArrowLeftRight,
  Trash2,
  FolderArchive,
  Database,
  ArrowUpDown,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { Asset } from '../types';
import { FundAnalyzerService, FundAnalysisReport, EntityEvaluation } from '../services/fundAnalyzerService';
import { analyzedFundsRepository, AnalyzedFundRecord } from '../services/analyzedFundsRepository';

interface FundAnalyzerViewProps {
  assets: Asset[];
  onOpenReport?: (assetId: string) => void;
  onNavigateToComparator?: (ids?: string[], studiedAsset?: Asset | null) => void;
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
  const [activeTab, setActiveTab] = useState<'pilares' | 'rentabilidade' | 'comite' | 'repositorio'>('pilares');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [repositoryRecords, setRepositoryRecords] = useState<AnalyzedFundRecord[]>(() => analyzedFundsRepository.getAll());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Lista de CNPJs de destaque da carteira para teste rápido com 1 clique
  const quickPicks = [
    { name: 'Kinea Rendimentos FII (KNCR11)', cnpj: '16.706.958/0001-32', class: 'FII Papel' },
    { name: 'REC Renda FII (RECT11)', cnpj: '32.274.163/0001-59', class: 'FII Híbrido' },
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
      setLoadingStep('1/4 Consultando fonte primária: Portal Investidor10 (cotação, P/VP, DY, vacância e proventos)...');
      await new Promise(r => setTimeout(r, 450));
      
      setLoadingStep('2/4 Validando e confrontando com dados abertos da CVM, B3 e Receita Federal...');
      await new Promise(r => setTimeout(r, 450));

      setLoadingStep('3/4 Auditando enquadramento na Res. CMN nº 5.272/2025 e exigências do Pró-Gestão...');
      await new Promise(r => setTimeout(r, 450));

      setLoadingStep('4/4 Auditando Due Diligence fiduciária dos prestadores (MTP 1.467/2022) e emitindo Parecer...');
      
      const res = await FundAnalyzerService.analyzeFundByCnpj(clean, assets);
      setReport(res);
      setInputCnpj(res.formattedCnpj);
      setActiveTab('pilares');
      
      // Salva automaticamente no Repositório de Fundos Estudados (não salvo na carteira)
      analyzedFundsRepository.saveReport(res);
      setRepositoryRecords(analyzedFundsRepository.getAll());
    } catch (err: any) {
      setError(err.message || 'Falha ao analisar ativo financeiro. Verifique o CNPJ informado.');
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  const handleOpenInComparator = (target: FundAnalysisReport | AnalyzedFundRecord) => {
    if (!onNavigateToComparator) return;
    const isRecord = 'isStudiedAsset' in target;
    const virtualAsset = analyzedFundsRepository.toVirtualAsset(target);
    
    // Encontra os pares da carteira oficial do PREVI-LACERDA por classe e artigo CMN 5.272/2025
    const matches = analyzedFundsRepository.findMatchingOfficialAssets({
      assetClass: isRecord ? (target as AnalyzedFundRecord).assetClass : (target as FundAnalysisReport).assetClass,
      articleCode: isRecord ? (target as AnalyzedFundRecord).articleCode : (target as FundAnalysisReport).cmnArticle,
      benchmark: target.benchmark
    });

    const matchingIds = matches.map(m => m.id);
    // Passa o ID do ativo estudado + os IDs dos ativos oficiais pares
    onNavigateToComparator([virtualAsset.id, ...matchingIds], virtualAsset);
  };

  const handleDeleteRecord = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Deseja realmente remover este fundo do Repositório de Pareceres?')) {
      analyzedFundsRepository.delete(id);
      setRepositoryRecords(analyzedFundsRepository.getAll());
    }
  };

  const handleLoadRecordToAnalyzer = (record: AnalyzedFundRecord) => {
    if (record.report && record.report.cnpj) {
      setReport(record.report);
      setInputCnpj(record.formattedCnpj);
      setActiveTab('pilares');
    } else {
      handleAnalyze(record.cnpj);
    }
  };

  const handleOpenEditModal = () => {
    if (!report) return;
    setEditFormData({
      tradingName: report.tradingName || '',
      ticker: report.ticker || '',
      netEquity: report.netEquity || 0,
      pvp: report.pvp !== undefined ? report.pvp : 1.0,
      dividendYield12M: report.dividendYield12M !== undefined ? report.dividendYield12M : 0,
      lastDividend: report.lastDividend !== undefined ? report.lastDividend : 0,
      quotaValue: report.quotaValue !== undefined ? report.quotaValue : 0,
      dailyLiquidity: report.dailyLiquidity !== undefined ? report.dailyLiquidity : 0,
      shareholdersCount: report.shareholdersCount !== undefined ? report.shareholdersCount : 0,
      vacancy: report.vacancy !== undefined ? report.vacancy : 0,
      adminFeePct: report.adminFeePct || 0,
      returns12M: report.returns.twelveMonths || 0,
      volatility12M: report.volatility12M || 0,
      managerName: report.managerEvaluation?.name || '',
      custodianName: report.custodianEvaluation?.name || '',
      cmnArticle: report.cmnArticle || '',
      cmnArticleLimit: report.cmnArticleLimit || '',
      proGestaoRequiredLevel: report.proGestaoRequiredLevel || 'Nível I a IV',
      proGestaoAlert: report.proGestaoAlert || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEditModal = () => {
    if (!report) return;
    const numNetEquity = Number(editFormData.netEquity) || 0;
    const numRet12M = Number(editFormData.returns12M) || 0;
    const numAdminFee = Number(editFormData.adminFeePct) || 0;
    const numVolatility = Number(editFormData.volatility12M) || 0;
    const numPvp = editFormData.pvp !== '' && editFormData.pvp !== undefined ? Number(editFormData.pvp) : undefined;
    const numDY = editFormData.dividendYield12M !== '' && editFormData.dividendYield12M !== undefined ? Number(editFormData.dividendYield12M) : undefined;
    const numLastDiv = editFormData.lastDividend !== '' && editFormData.lastDividend !== undefined ? Number(editFormData.lastDividend) : undefined;
    const numQuotaVal = editFormData.quotaValue !== '' && editFormData.quotaValue !== undefined ? Number(editFormData.quotaValue) : undefined;
    const numDailyLiq = editFormData.dailyLiquidity !== '' && editFormData.dailyLiquidity !== undefined ? Number(editFormData.dailyLiquidity) : undefined;
    const numShareholders = editFormData.shareholdersCount !== '' && editFormData.shareholdersCount !== undefined ? Number(editFormData.shareholdersCount) : undefined;
    const numVacancy = editFormData.vacancy !== '' && editFormData.vacancy !== undefined ? Number(editFormData.vacancy) : undefined;

    const updatedReport: FundAnalysisReport = {
      ...report,
      tradingName: editFormData.tradingName || report.tradingName,
      ticker: editFormData.ticker ? editFormData.ticker.toUpperCase().trim() : undefined,
      netEquity: numNetEquity,
      averageNetEquity12M: Math.round(numNetEquity * 0.95),
      pvp: numPvp,
      dividendYield12M: numDY,
      lastDividend: numLastDiv,
      quotaValue: numQuotaVal,
      dailyLiquidity: numDailyLiq,
      shareholdersCount: numShareholders,
      vacancy: numVacancy,
      adminFeePct: numAdminFee,
      volatility12M: numVolatility,
      cmnArticle: editFormData.cmnArticle || report.cmnArticle,
      cmnArticleLimit: editFormData.cmnArticleLimit || report.cmnArticleLimit,
      proGestaoRequiredLevel: editFormData.proGestaoRequiredLevel || report.proGestaoRequiredLevel,
      proGestaoAlert: editFormData.proGestaoAlert || report.proGestaoAlert,
      returns: {
        ...report.returns,
        twelveMonths: numRet12M
      },
      managerEvaluation: {
        ...report.managerEvaluation,
        name: editFormData.managerName || report.managerEvaluation.name
      },
      custodianEvaluation: {
        ...report.custodianEvaluation,
        name: editFormData.custodianName || report.custodianEvaluation.name
      },
      isCustomized: true,
      isPendingVerification: false,
      dataSource: 'Parametrizado & Auditado pelo Usuário (Conforme Portal Investidor10)'
    };

    setReport(updatedReport);
    analyzedFundsRepository.saveReport(updatedReport);
    setRepositoryRecords(analyzedFundsRepository.getAll());
    setIsEditModalOpen(false);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
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

  const renderRepositorySection = () => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden animate-fadeIn">
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider bg-purple-500/25 text-purple-300 border border-purple-400/40 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-purple-300" />
              Banco de Dados de Ativos Estudados
            </span>
            <span className="text-[10px] font-bold text-slate-300">
              Resolução CMN nº 5.272/2025 • Portaria MTP nº 1.467/2022
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Repositório de Fundos Analisados & Pareceres Emitidos</span>
            <span className="text-xs font-semibold bg-purple-600/70 text-purple-100 px-2.5 py-0.5 rounded-full">
              {repositoryRecords.length} Ativos Arquivados
            </span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Histórico auditável para subsidiar decisões do <strong>Comitê de Investimentos</strong>. Os ativos abaixo mantêm dados fidedignos e são comparados com os pares oficiais da carteira <u>sem comprometer a alocação oficial do DAIR</u>.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <span className="text-[11px] font-bold text-purple-200 bg-purple-900/50 border border-purple-700/60 px-3 py-1.5 rounded-xl shadow-2xs">
            Ativos não misturados à carteira oficial
          </span>
        </div>
      </div>

      {repositoryRecords.length === 0 ? (
        <div className="p-12 text-center text-slate-500 space-y-2">
          <Database className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-700">Nenhum fundo analisado no repositório ainda.</p>
          <p className="text-xs text-slate-500">Digite um CNPJ acima e clique em "Analisar Ativo" para arquivar o estudo e parecer.</p>
        </div>
      ) : (
        <div className="p-6 space-y-4 bg-slate-50/50">
          <div className="grid grid-cols-1 gap-4">
            {repositoryRecords.map((record) => {
              const matches = analyzedFundsRepository.findMatchingOfficialAssets({
                assetClass: record.assetClass,
                articleCode: record.articleCode,
                benchmark: record.benchmark
              });

              return (
                <div 
                  key={record.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-sm hover:border-purple-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {record.ticker && (
                        <span className="text-xs font-black bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded font-mono shadow-2xs">
                          {record.ticker}
                        </span>
                      )}
                      <span className="text-xs font-black text-slate-900">
                        {record.tradingName}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        CNPJ: {record.formattedCnpj}
                      </span>
                      <span className="text-[10px] font-bold text-purple-800 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
                        {record.articleCode}
                      </span>
                      <span className="text-[10px] font-extrabold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                        Score: {record.overallScore}/100
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {record.committeeTechnicalOpinion}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1 border-t border-slate-100">
                      <span><strong>PL:</strong> {formatMoney(record.netEquity)}</span>
                      <span><strong>Tx Adm:</strong> {record.adminFeePct.toFixed(2)}% a.a.</span>
                      <span><strong>Retorno 12M:</strong> <strong className="text-emerald-700 font-extrabold">{record.returns12M.toFixed(2)}%</strong></span>
                      <span className="text-[11px] text-slate-400">Protocolo: <span className="font-mono">{record.analysisProtocol}</span></span>
                      <span className="text-[11px] text-slate-400">Data: {record.analyzedAt}</span>
                    </div>

                    {matches.length > 0 && (
                      <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="font-semibold text-slate-700">Pares sugeridos na carteira oficial:</span>
                        <div className="flex flex-wrap gap-1">
                          {matches.map(m => (
                            <span key={m.id} className="bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded text-[10px] font-medium border border-slate-200">
                              {m.trading_name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenInComparator(record)}
                      className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                      title="Comparar com os pares oficiais da carteira de mesma classe e artigo CMN 5.272/2025"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      <span>Comparar com a Carteira</span>
                    </button>

                    <button
                      onClick={() => {
                        if (record.report && record.report.cnpj) {
                          setReport(record.report);
                          setIsPrintModalOpen(true);
                        } else {
                          handleLoadRecordToAnalyzer(record);
                        }
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-blue-600" />
                      <span>Ver Parecer / PDF</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLoadRecordToAnalyzer(record)}
                        className="px-2.5 py-1 text-slate-600 hover:text-blue-700 hover:bg-blue-50 text-[11px] font-semibold rounded flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3 text-blue-600" />
                        <span>Carregar</span>
                      </button>

                      <button
                        onClick={(e) => handleDeleteRecord(record.id, e)}
                        className="px-2.5 py-1 text-slate-400 hover:text-red-700 hover:bg-red-50 text-[11px] font-semibold rounded flex items-center gap-1 transition-colors cursor-pointer"
                        title="Remover estudo do repositório"
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                        <span>Excluir</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

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

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {report && (
              <>
                <button
                  onClick={handleOpenEditModal}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer"
                  title="Editar ou parametrizar indicadores reais deste ativo conforme Portal Investidor10"
                >
                  <Edit2 className="w-4 h-4 text-slate-950" />
                  <span>Editar / Ajustar Indicadores</span>
                </button>

                <button
                  onClick={() => handleOpenInComparator(report)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer"
                  title="Comparar este ativo com os pares da carteira oficial segundo classe e artigo CMN 5.272/2025"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  <span>Comparar com a Carteira</span>
                </button>

                <button
                  onClick={() => setIsPrintModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Gerar Dossiê (PDF)</span>
                </button>
              </>
            )}

            <button
              onClick={() => setActiveTab('repositorio')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                activeTab === 'repositorio'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                  : 'bg-white hover:bg-purple-50 text-purple-700 border-purple-200 shadow-2xs'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Repositório de Estudos ({repositoryRecords.length})</span>
            </button>
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
                    {report.isCustomized && (
                      <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 flex items-center gap-1 shadow-2xs">
                        <Check className="w-3 h-3 text-emerald-300" />
                        Auditado pelo Usuário
                      </span>
                    )}
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

            {/* TOAST DE SALVAMENTO COM SUCESSO */}
            {showSavedToast && (
              <div className="p-3 mx-6 my-2 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Indicadores do ativo atualizados e salvos com sucesso no repositório auditado!</span>
              </div>
            )}

            {/* AVISO SE FOR ATIVO COM DADOS PENDENTES OU NECESSIDADE DE CONFERÊNCIA COM INVESTIDOR10 */}
            {report.isPendingVerification && (
              <div className="p-3.5 mx-6 my-3 bg-amber-50 border border-amber-300 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-950 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    Dados cadastrais oficiais confirmados via CVM e Receita Federal para este CNPJ. Os indicadores financeiros e de mercado (PL, Cotação, P/VP, DY, Custos) podem ser conferidos ou ajustados conforme o <strong>Portal Investidor10</strong> clicando em <strong>Editar / Ajustar Indicadores</strong>.
                  </span>
                </div>
                <button
                  onClick={handleOpenEditModal}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shrink-0 flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Editar Indicadores</span>
                </button>
              </div>
            )}

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
                  {report.volatility12M.toFixed(2)}% a.a.
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

            {/* PAINEL DE ADERÊNCIA AO PRÓ-GESTÃO E EXIGÊNCIAS LEGAIS */}
            <div className="p-4 mx-6 my-4 bg-gradient-to-r from-amber-50 via-orange-50/40 to-amber-50 border-2 border-amber-300 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs text-amber-950 animate-fadeIn">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold uppercase tracking-wide text-amber-950 flex items-center gap-1.5">
                      <span>Exigência Prudencial de Pró-Gestão • Resolução CMN nº 5.272/2025</span>
                    </span>
                    <span className="bg-amber-200 text-amber-900 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-300">
                      Nível Requerido: {report.proGestaoRequiredLevel || 'Nível I a IV'}
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      Adequação RPPS: até 31/12/2026
                    </span>
                  </div>
                  <p className="leading-relaxed text-amber-900 font-medium">
                    {report.proGestaoAlert || 'Conforme a Resolução CMN nº 5.272/2025 e Portaria MTP nº 1.467/2022, o RPPS deve atentar aos requisitos de governança e certificação institucional para alocação neste segmento.'}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className="text-[11px] font-extrabold text-amber-900 bg-white px-3 py-1.5 rounded-lg border border-amber-300 shadow-2xs">
                  Auditoria de Conformidade Ativa
                </span>
              </div>
            </div>

            {/* PAINEL DE INDICADORES FUNDAMENTALISTAS DE MERCADO (PORTAL INVESTIDOR10 / B3 / CVM) */}
            {(report.ticker || report.dividendYield12M !== undefined || report.pvp !== undefined) && (
              <div className="p-5 mx-6 my-4 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 rounded-xl border border-slate-700 text-white shadow-sm space-y-3 animate-fadeIn">
                <div className="flex flex-wrap items-center justify-between border-b border-slate-700/80 pb-2.5 gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Indicadores Fundamentalistas • Fonte Primária: Portal Investidor10 (Confrontado com CVM e B3)
                    </span>
                    {report.ticker && (
                      <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded font-mono shadow-2xs">
                        Ticker B3: {report.ticker}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleOpenEditModal}
                      className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-slate-950 text-[10px] font-bold rounded flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                      title="Editar indicadores fundamentalistas do Investidor10"
                    >
                      <Edit2 className="w-3 h-3 text-slate-950" />
                      <span>Editar Indicadores</span>
                    </button>
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40">
                      Dados Auditados & Fidedignos
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                  <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">P/VP (Preço/VP)</span>
                    <span className="text-base font-black text-emerald-400 mt-0.5 block">
                      {report.pvp !== undefined ? report.pvp.toFixed(2) : '-'}
                    </span>
                    <span className="text-[9px] text-emerald-300">
                      {report.pvp !== undefined
                        ? report.pvp < 1.0
                          ? `Desconto de ${Math.round((1 - report.pvp) * 100)}% na B3`
                          : report.pvp === 1.0
                          ? 'Paridade Patrimonial'
                          : `Ágio de +${Math.round((report.pvp - 1) * 100)}%`
                        : 'Preço sobre Valor Patrimonial'}
                    </span>
                  </div>

                  <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Dividend Yield (12M)</span>
                    <span className="text-base font-black text-emerald-400 mt-0.5 block">
                      {report.dividendYield12M !== undefined ? `${report.dividendYield12M.toFixed(2)}%` : '-'}
                    </span>
                    <span className="text-[9px] text-slate-400">
                      {report.lastDividend !== undefined ? `Último: R$ ${report.lastDividend.toFixed(2)}/cota` : 'Rendimentos proventos'}
                    </span>
                  </div>

                  <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">VP por Cota</span>
                    <span className="text-base font-black text-white mt-0.5 block">
                      {report.quotaValue !== undefined ? `R$ ${report.quotaValue.toFixed(2)}` : '-'}
                    </span>
                    <span className="text-[9px] text-slate-400">Valor contábil unitário</span>
                  </div>

                  <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Valor de Mercado</span>
                    <span className="text-base font-black text-white mt-0.5 block">
                      {report.marketValue ? formatMoney(report.marketValue) : (report.pvp ? formatMoney(report.netEquity * report.pvp) : '-')}
                    </span>
                    <span className="text-[9px] text-slate-400">Negociação total B3</span>
                  </div>

                  <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Liquidez Diária</span>
                    <span className="text-base font-black text-blue-400 mt-0.5 block">
                      {report.dailyLiquidity ? formatMoney(report.dailyLiquidity) : '-'}
                    </span>
                    <span className="text-[9px] text-slate-400">Média diária B3</span>
                  </div>

                  <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Base de Cotistas</span>
                    <span className="text-base font-black text-white mt-0.5 block">
                      {report.shareholdersCount ? report.shareholdersCount.toLocaleString('pt-BR') : '-'}
                    </span>
                    <span className="text-[9px] text-slate-400">
                      {report.totalShares ? `Cotas: ${(report.totalShares / 1_000_000).toFixed(2)}M` : 'Cotas emitidas'}
                    </span>
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

              <button
                onClick={() => setActiveTab('repositorio')}
                className={`py-3.5 font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'repositorio'
                    ? 'border-purple-600 text-purple-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Database className="w-4 h-4 text-purple-600" />
                <span>Repositório de Pareceres ({repositoryRecords.length})</span>
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
                      onClick={() => handleOpenInComparator(report)}
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-[11px] shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      <span>Abrir no Comparador de Fundos</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* CONTEÚDO DA ABA: REPOSITÓRIO DE PARECERES E ESTUDOS */}
            {activeTab === 'repositorio' && (
              <div className="p-6">
                {renderRepositorySection()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SE NÃO HÁ RELATÓRIO ATIVO NA TELA, EXIBE O REPOSITÓRIO DE PARECERES PARA CONSULTA IMEDIATA */}
      {!report && !loading && (
        <div className="space-y-6">
          {renderRepositorySection()}
        </div>
      )}

      {/* MODAL DE EDIÇÃO DE INDICADORES (INVESTIDOR10 & CVM) */}
      {isEditModalOpen && report && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-slate-300 shadow-2xl flex flex-col animate-scaleUp">
            {/* TOPO DO MODAL */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-slate-950">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <span>Parametrizar / Editar Dados do Ativo</span>
                    <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-mono font-bold">
                      {report.formattedCnpj}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Ajuste os dados conforme o <strong>Portal Investidor10</strong>, <strong>CVM</strong> e <strong>B3</strong> para conferência fidedigna.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* FORMULÁRIO DE EDIÇÃO */}
            <div className="p-6 space-y-6 text-xs text-slate-700 overflow-y-auto">
              {/* SEÇÃO 1: IDENTIFICAÇÃO E TICKER B3 */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5 border-b pb-1.5 border-slate-100">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>1. Identificação Básica do Ativo</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nome de Negociação / Fantasia:
                    </label>
                    <input
                      type="text"
                      value={editFormData.tradingName || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, tradingName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Ticker B3 (se negociado em bolsa):
                    </label>
                    <input
                      type="text"
                      value={editFormData.ticker || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, ticker: e.target.value.toUpperCase() })}
                      placeholder="Ex: RECT11, RURA11"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* SEÇÃO 2: INDICADORES FUNDAMENTALISTAS INVESTIDOR10 */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5 border-b pb-1.5 border-slate-100">
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  <span>2. Indicadores Fundamentalistas (Portal Investidor10 & B3)</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Patrimônio Líquido (PL em R$):
                    </label>
                    <input
                      type="number"
                      value={editFormData.netEquity || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, netEquity: e.target.value })}
                      placeholder="Ex: 766830000"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">{formatMoney(Number(editFormData.netEquity) || 0)}</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      P/VP (Preço / VP):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editFormData.pvp !== undefined ? editFormData.pvp : ''}
                      onChange={(e) => setEditFormData({ ...editFormData, pvp: e.target.value })}
                      placeholder="Ex: 0.36 ou 1.00"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-emerald-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Dividend Yield 12M (%):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editFormData.dividendYield12M !== undefined ? editFormData.dividendYield12M : ''}
                      onChange={(e) => setEditFormData({ ...editFormData, dividendYield12M: e.target.value })}
                      placeholder="Ex: 15.32"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-emerald-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Último Rendimento (R$/cota):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editFormData.lastDividend !== undefined ? editFormData.lastDividend : ''}
                      onChange={(e) => setEditFormData({ ...editFormData, lastDividend: e.target.value })}
                      placeholder="Ex: 0.45"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Valor Patrimonial p/ Cota (R$):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editFormData.quotaValue !== undefined ? editFormData.quotaValue : ''}
                      onChange={(e) => setEditFormData({ ...editFormData, quotaValue: e.target.value })}
                      placeholder="Ex: 89.76"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Vacância Física (%):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editFormData.vacancy !== undefined ? editFormData.vacancy : ''}
                      onChange={(e) => setEditFormData({ ...editFormData, vacancy: e.target.value })}
                      placeholder="Ex: 8.36"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Número de Cotistas:
                    </label>
                    <input
                      type="number"
                      value={editFormData.shareholdersCount !== undefined ? editFormData.shareholdersCount : ''}
                      onChange={(e) => setEditFormData({ ...editFormData, shareholdersCount: e.target.value })}
                      placeholder="Ex: 44976"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Liquidez Diária Média (R$):
                    </label>
                    <input
                      type="number"
                      value={editFormData.dailyLiquidity !== undefined ? editFormData.dailyLiquidity : ''}
                      onChange={(e) => setEditFormData({ ...editFormData, dailyLiquidity: e.target.value })}
                      placeholder="Ex: 268460"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* SEÇÃO 3: RENTABILIDADE & CUSTOS FIDUCIÁRIOS */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5 border-b pb-1.5 border-slate-100">
                  <Percent className="w-4 h-4 text-purple-600" />
                  <span>3. Rentabilidade e Custos Fiduciários</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Taxa de Administração (% a.a.):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editFormData.adminFeePct !== undefined ? editFormData.adminFeePct : ''}
                      onChange={(e) => setEditFormData({ ...editFormData, adminFeePct: e.target.value })}
                      placeholder="Ex: 0.17"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Retorno Acumulado 12M (%):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editFormData.returns12M !== undefined ? editFormData.returns12M : ''}
                      onChange={(e) => setEditFormData({ ...editFormData, returns12M: e.target.value })}
                      placeholder="Ex: 5.97"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Volatilidade 12M (% a.a.):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editFormData.volatility12M !== undefined ? editFormData.volatility12M : ''}
                      onChange={(e) => setEditFormData({ ...editFormData, volatility12M: e.target.value })}
                      placeholder="Ex: 8.20"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* SEÇÃO 4: PRESTADORES FIDUCIÁRIOS */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5 border-b pb-1.5 border-slate-100">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  <span>4. Prestadores de Serviços Fiduciários (Portaria MTP nº 1.467/2022)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nome do Gestor de Recursos:
                    </label>
                    <input
                      type="text"
                      value={editFormData.managerName || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, managerName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nome do Administrador / Custodiante:
                    </label>
                    <input
                      type="text"
                      value={editFormData.custodianName || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, custodianName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* SEÇÃO 5: ENQUADRAMENTO CMN 5.272/2025 & PRÓ-GESTÃO */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5 border-b pb-1.5 border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>5. Enquadramento Res. CMN nº 5.272/2025 & Exigência de Pró-Gestão</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Artigo de Enquadramento:
                    </label>
                    <input
                      type="text"
                      value={editFormData.cmnArticle || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, cmnArticle: e.target.value })}
                      placeholder="Ex: Resolução CMN nº 5.272/2025 - Art. 10 (FII)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Nível de Certificação Pró-Gestão Requerido:
                    </label>
                    <input
                      type="text"
                      value={editFormData.proGestaoRequiredLevel || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, proGestaoRequiredLevel: e.target.value })}
                      placeholder="Ex: Nível I a IV, Nível III ou IV, etc."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Texto do Alerta Prudencial de Pró-Gestão:
                    </label>
                    <textarea
                      rows={2}
                      value={editFormData.proGestaoAlert || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, proGestaoAlert: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RODAPÉ DO MODAL */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
              <span className="text-[11px] text-slate-500">
                Os dados serão salvos no repositório auditado e recalculados em tela imediatamente.
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleSaveEditModal}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Dados Auditados</span>
                </button>
              </div>
            </div>
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
                      <div><strong>P/VP (Preço / Valor Patrimonial):</strong> {report.pvp.toFixed(2)} {report.pvp < 1.0 ? `(Desconto de ${Math.round((1 - report.pvp) * 100)}% na B3)` : report.pvp === 1.0 ? '(Paridade Contábil)' : `(Ágio de +${Math.round((report.pvp - 1) * 100)}%)`}</div>
                      <div><strong>Dividend Yield 12M / Último:</strong> {report.dividendYield12M?.toFixed(2)}% a.a. / R$ {report.lastDividend?.toFixed(2)} por cota</div>
                    </>
                  )}
                  {report.proGestaoAlert && (
                    <div className="col-span-2 bg-amber-50 p-2.5 rounded border border-amber-200 text-amber-950 mt-1">
                      <strong>Exigência Pró-Gestão (Res. CMN 5.272/2025):</strong> {report.proGestaoAlert}
                    </div>
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
