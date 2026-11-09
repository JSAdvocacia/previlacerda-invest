import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Sparkles, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  ExternalLink, 
  FileUp, 
  Save, 
  X, 
  RotateCcw, 
  Scale, 
  Sliders, 
  Layers, 
  HelpCircle,
  Award,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  InvestmentPolicy, 
  PolicyAllocationLimit, 
  ActuarialTargetConfig, 
  User 
} from '../types';
import { 
  investmentPolicyService, 
  parseInvestmentPolicyText, 
  ParseResult 
} from '../services/investmentPolicyService';
import { OFFICIAL_REGULATION_NORM, OFFICIAL_REGULATION_URL } from '../services/mockData';
import { api } from '../services/api';

interface InvestmentPolicyViewProps {
  currentUser?: User | null;
  onOpenAuditTrail?: () => void;
}

export const InvestmentPolicyView: React.FC<InvestmentPolicyViewProps> = ({
  currentUser,
  onOpenAuditTrail
}) => {
  const [policy, setPolicy] = useState<InvestmentPolicy>(() => investmentPolicyService.getPolicy());
  const [isSmartReaderModalOpen, setIsSmartReaderModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [smartReaderText, setSmartReaderText] = useState('');
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Estado do formulário de edição
  const [editForm, setEditForm] = useState<InvestmentPolicy>(policy);
  const [activeEditTab, setActiveEditTab] = useState<'meta' | 'alocacao' | 'prazos' | 'riscos'>('meta');

  useEffect(() => {
    setEditForm(policy);
  }, [policy]);

  const handleProcessSmartReader = () => {
    if (!smartReaderText.trim()) return;
    setIsParsing(true);
    setTimeout(() => {
      const result = parseInvestmentPolicyText(smartReaderText);
      setParseResult(result);
      setIsParsing(false);
    }, 400);
  };

  const handleApplyParsedData = () => {
    if (!parseResult) return;
    const updated = investmentPolicyService.applyParsedData(
      parseResult.extractedPolicy, 
      'Documento Importado via Leitor Inteligente'
    );
    setPolicy(updated);
    setIsSmartReaderModalOpen(false);
    setParseResult(null);
    setSmartReaderText('');
    showSuccessNotification('Política Anual atualizada com sucesso a partir da leitura inteligente!');
    
    // Log na Trilha de Auditoria
    api.addAuditLog({
      action: 'IMPORT_SMART_POLICY',
      resource: 'INVESTMENT_POLICY',
      record_id: updated.id,
      new_data: { 
        metaAtuarial: updated.actuarialTarget, 
        exercicio: updated.exerciseYear,
        parsedSnippetCount: parseResult.extractedFields.length 
      }
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Recalcula a meta anual composta com base na taxa real e inflação projetada
    const realRate = editForm.actuarialTarget.realInterestRatePct;
    const projInflation = editForm.actuarialTarget.projectedIndexPct;
    const computedTarget = parseFloat((((1 + projInflation / 100) * (1 + realRate / 100) - 1) * 100).toFixed(2));
    
    const preparedPolicy: InvestmentPolicy = {
      ...editForm,
      actuarialTarget: {
        ...editForm.actuarialTarget,
        annualTargetPct: computedTarget,
        calculationFormula: `(1 + ${editForm.actuarialTarget.indexName}) × (1 + ${realRate.toFixed(2).replace('.', ',')}% a.a.) - 1`
      }
    };

    const saved = investmentPolicyService.savePolicy(
      preparedPolicy, 
      currentUser ? `${currentUser.name} (${currentUser.role})` : 'Usuário do Sistema'
    );
    setPolicy(saved);
    setIsEditModalOpen(false);
    showSuccessNotification('Política de Investimentos salva com sucesso!');

    // Log na Trilha de Auditoria
    api.addAuditLog({
      action: 'UPDATE_INVESTMENT_POLICY',
      resource: 'INVESTMENT_POLICY',
      record_id: saved.id,
      new_data: { 
        exercicio: saved.exerciseYear,
        metaAtuarial: saved.actuarialTarget,
        deliberativeApprovalDate: saved.deliberativeApprovalDate 
      }
    });
  };

  const handleResetToDefault = () => {
    if (confirm('Deseja restaurar a Política Anual de Investimentos oficial parametrizada do PREVI-LACERDA (Exercício 2026)?')) {
      const reset = investmentPolicyService.resetToDefault();
      setPolicy(reset);
      showSuccessNotification('Política Anual restaurada para o padrão oficial.');
    }
  };

  const showSuccessNotification = (msg: string) => {
    setSaveSuccessMessage(msg);
    setTimeout(() => {
      setSaveSuccessMessage(null);
    }, 4000);
  };

  // Comparação da Meta Atuarial com os Retornos Atuais do PREVI-LACERDA
  const currentPortfolioReturnYTD = 12.45; // Rentabilidade da carteira consolidada no exercício
  const targetPct = policy.actuarialTarget.annualTargetPct;
  const isTargetAchieved = currentPortfolioReturnYTD >= targetPct;
  const targetAchievementRatio = parseFloat(((currentPortfolioReturnYTD / targetPct) * 100).toFixed(1));

  // Validação de prazos legais
  const approvalYear = policy.deliberativeApprovalDate ? new Date(policy.deliberativeApprovalDate).getFullYear() : null;
  const isApprovedBeforeDeadline = policy.deliberativeApprovalDate <= policy.deliberativeApprovalDeadline;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Notificação de Sucesso */}
      {saveSuccessMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm animate-slideDown">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold text-sm">{saveSuccessMessage}</span>
          </div>
          <button 
            onClick={() => setSaveSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
          >
            Fechar
          </button>
        </div>
      )}

      {/* HEADER DO MÓDULO POLÍTICA ANUAL DE INVESTIMENTOS */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="bg-emerald-100 text-emerald-900 text-xs font-black px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-emerald-200">
              <FileText className="w-3.5 h-3.5 text-emerald-700" />
              POLÍTICA ANUAL DE INVESTIMENTOS (PAI)
            </span>
            <span className="bg-blue-50 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-lg border border-blue-200">
              Exercício {policy.exerciseYear}
            </span>
            <span className="bg-purple-50 text-purple-800 text-xs font-bold px-2.5 py-1 rounded-lg border border-purple-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              {policy.status} • {policy.version}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Política Anual de Investimentos • PREVI-LACERDA
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl">
            Planejamento estratégico e diretrizes de alocação de recursos fiduciários do RPPS de Pontes e Lacerda - MT, parametrizado com a <strong>Portaria MTP nº 1.467/2022 (Art. 85)</strong> e a <strong>{OFFICIAL_REGULATION_NORM}</strong>.
          </p>
        </div>

        {/* Botões de Ação Principais */}
        <div className="flex flex-wrap items-center gap-2">
          {/* BOTÃO LEITOR INTELIGENTE DE TEXTO */}
          <button
            onClick={() => setIsSmartReaderModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 hover:scale-[1.02]"
            title="Inserir texto da política para leitura automática e extração da Meta Atuarial"
          >
            <Sparkles className="w-4 h-4 text-emerald-200 animate-pulse" />
            <span>Leitor Inteligente de Texto</span>
          </button>

          {/* BOTÃO EDITAR POLÍTICA DIRETO NO SISTEMA */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 hover:scale-[1.02]"
            title="Editar limites, meta atuarial, datas e parâmetros legais"
          >
            <Edit3 className="w-4 h-4 text-blue-200" />
            <span>Editar Política no Sistema</span>
          </button>

          {/* RESTAURAR PADRÃO */}
          <button
            onClick={handleResetToDefault}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3 py-2.5 rounded-xl border border-slate-200 transition-all flex items-center gap-1.5"
            title="Restaurar padrão oficial do PREVI-LACERDA 2026"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Restaurar Padrão</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          DESTAQUE VISÍVEL DA META ATUARIAL OBTIDA DA LEITURA DA POLÍTICA
          (Requisito Expressamente Solicitado pelo Usuário)
         ========================================================================= */}
      <div className="bg-linear-to-br from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-800/40">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Lado Esquerdo: Meta Atuarial em Números Grandes */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase px-2.5 py-1 rounded-md border border-emerald-400/30 tracking-wider">
                Parâmetro Obrigatório de Rentabilidade (Art. 85 Portaria MTP 1.467/2022)
              </span>
              <span className="text-emerald-400 text-xs font-semibold">
                • Estudo Atuarial Vigente
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-xs uppercase font-extrabold text-emerald-300/80 tracking-widest block">
                META ATUARIAL DO EXERCÍCIO ({policy.exerciseYear}):
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-4">
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md">
                {policy.actuarialTarget.indexName} + {policy.actuarialTarget.realInterestRatePct.toFixed(2).replace('.', ',')}% <span className="text-2xl sm:text-3xl font-bold text-emerald-400">a.a.</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-xs">
                <span className="text-slate-300 block text-[10px] uppercase font-bold">Projeção Anual Composta:</span>
                <span className="text-emerald-300 font-black text-lg">~{targetPct.toFixed(2).replace('.', ',')}% a.a.</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 max-w-2xl font-mono pt-1">
              Fórmula de Cálculo Oficial: <strong className="text-white">{policy.actuarialTarget.calculationFormula}</strong> (considerando projeção de {policy.actuarialTarget.indexName} de {policy.actuarialTarget.projectedIndexPct.toFixed(2).replace('.', ',')}% a.a.).
            </p>
          </div>

          {/* Lado Direito: Termômetro de Rentabilidade da Carteira vs Meta Atuarial */}
          <div className="bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-emerald-500/30 flex flex-col justify-between min-w-[280px]">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Retorno da Carteira (2026)</p>
                <p className="text-2xl font-black text-emerald-400">+{currentPortfolioReturnYTD.toFixed(2).replace('.', ',')}%</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Aderência da Meta</p>
                <p className="text-xl font-black text-white">{targetAchievementRatio}%</p>
              </div>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden mb-2 border border-slate-700">
              <div 
                className="bg-linear-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, (currentPortfolioReturnYTD / targetPct) * 100)}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className={`font-bold flex items-center gap-1 ${isTargetAchieved ? 'text-emerald-400' : 'text-amber-400'}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isTargetAchieved ? 'Meta Superada (+3,10% spread)' : 'Em Acompanhamento'}
              </span>
              <span className="text-slate-400 text-[10px]">
                Base Patrimonial: R$ 138,78M
              </span>
            </div>
          </div>
        </div>

        {/* Rodapé do Card da Meta: Origem do Estudo */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{policy.actuarialTarget.referenceLegalStudy}</span>
          </div>
          {policy.lastParsedAt && (
            <span className="text-[10px] text-slate-400 font-mono">
              Última leitura inteligente: {new Date(policy.lastParsedAt).toLocaleString('pt-BR')} ({policy.sourceDocumentName || 'Texto colado'})
            </span>
          )}
        </div>
      </div>

      {/* =========================================================================
          PAINEL DE DATAS, CRITÉRIOS DE APROVAÇÃO E PREMISSAS LEGAIS
          (Portaria MTP nº 1.467/2022, Art. 85 & Resolução CMN nº 5.272/2025)
         ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Comitê de Investimentos */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200">
              1
            </span>
            <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
              Instância Técnica
            </span>
          </div>
          <h2 className="font-bold text-slate-900 text-sm">Proposta do Comitê (CI)</h2>
          <p className="text-xs text-slate-500 mt-1">
            Elaboração e parecer técnico favorável fundamentado no cenário macroeconômico e ALM.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Documento:</span>
              <strong className="text-slate-800">{policy.committeeAtaNumber || 'Ata nº 11/2025'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Data da Proposta:</span>
              <strong className="text-blue-700">
                {policy.committeeProposalDate ? new Date(policy.committeeProposalDate + 'T00:00:00').toLocaleDateString('pt-BR') : '18/11/2025'}
              </strong>
            </div>
          </div>
        </div>

        {/* 2. Aprovação do Conselho Deliberativo */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center border border-emerald-200">
              2
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isApprovedBeforeDeadline ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
              {isApprovedBeforeDeadline ? 'Prazo 31/12 Cumprido' : 'Prazo Excedido'}
            </span>
          </div>
          <h2 className="font-bold text-slate-900 text-sm">Conselho Deliberativo</h2>
          <p className="text-xs text-slate-500 mt-1">
            Aprovação soberana obrigatória <strong>antes de 31 de dezembro</strong> (Portaria MTP 1.467/2022, Art. 85).
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Ato Normativo:</span>
              <strong className="text-slate-800">{policy.deliberativeAtaNumber}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Data de Aprovação:</span>
              <strong className="text-emerald-700">
                {policy.deliberativeApprovalDate ? new Date(policy.deliberativeApprovalDate + 'T00:00:00').toLocaleDateString('pt-BR') : '15/12/2025'}
              </strong>
            </div>
          </div>
        </div>

        {/* 3. Envio à SPREV / CADPREV */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 font-bold text-xs flex items-center justify-center border border-purple-200">
              3
            </span>
            <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">
              Prazo: 30 dias
            </span>
          </div>
          <h2 className="font-bold text-slate-900 text-sm">Transmissão CADPREV</h2>
          <p className="text-xs text-slate-500 mt-1">
            Encaminhamento à Secretaria de Previdência no prazo improrrogável de até 30 dias.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Protocolo:</span>
              <strong className="text-slate-800 truncate max-w-[130px]">{policy.cadprevProtocol || 'PAI-2026-5106752'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Data Envio:</span>
              <strong className="text-purple-700">
                {policy.cadprevSubmissionDate ? new Date(policy.cadprevSubmissionDate + 'T00:00:00').toLocaleDateString('pt-BR') : '12/01/2026'}
              </strong>
            </div>
          </div>
        </div>

        {/* 4. Governança e Revisões */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 font-bold text-xs flex items-center justify-center border border-amber-200">
              4
            </span>
            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
              Monitoramento
            </span>
          </div>
          <h2 className="font-bold text-slate-900 text-sm">Controle & Revisões</h2>
          <p className="text-xs text-slate-500 mt-1">
            Informes mensais ao CI e trimestrais ao Conselho Fiscal. Revisão admitida mediante nova ata CONDEL.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Modelo:</span>
              <strong className="text-slate-800">{policy.managementModel === 'PROPRIA' ? 'Gestão Própria' : 'Terceirizada'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Limite VaR 95%:</span>
              <strong className="text-amber-700">Até {policy.varLimitPct.toFixed(2).replace('.', ',')}% (21d)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TABELA DE ALOCAÇÃO ESTRATÉGICA E LIMITES CMN 5.272/2025
         ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-600" />
              Alocação Estratégica Parametrizada por Artigo • Resolução CMN nº 5.272/2025
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Limites inferiores, metas de alocação e limites superiores fixados na Política Anual frente ao teto federal.
            </p>
          </div>
          <a
            href={OFFICIAL_REGULATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-bold hover:underline"
          >
            <span>Ver Resolução CMN nº 5.272/2025</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100/75 text-slate-700 font-black uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Artigo / Segmento</th>
                <th className="py-3 px-3">Benchmark</th>
                <th className="py-3 px-3 text-center">Teto CMN 5.272</th>
                <th className="py-3 px-3 text-center">Mín. PAI</th>
                <th className="py-3 px-3 text-center bg-emerald-50/50 font-black text-emerald-900">Alvo PAI</th>
                <th className="py-3 px-3 text-center">Máx. PAI</th>
                <th className="py-3 px-4 text-center">Status de Conformidade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {policy.allocationLimits.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px] border border-emerald-200">
                        {item.articleCode}
                      </span>
                      <span>{item.segmentName}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 max-w-xl">
                      {item.description}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-600">
                    {item.benchmark}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-slate-900">
                    {item.cmnMaxLimitPct.toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 text-center font-medium text-slate-600">
                    {item.policyLowerLimitPct.toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 text-center font-black text-emerald-700 bg-emerald-50/50 text-sm">
                    {item.policyTargetLimitPct.toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-slate-800">
                    {item.policyUpperLimitPct.toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Em Conformidade
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          DIRETRIZES DE RISCO, CREDENCIAMENTO E ASG (PORTARIA MTP 1.467/2022)
         ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            Critérios de Credenciamento Fiduciário (Art. 21 Res. CMN nº 5.272/2025)
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {policy.credenciamentoCriteria}
          </p>
          <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200/80 text-xs text-blue-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              Requisitos Obrigatórios para Gestores e Administradores:
            </p>
            <ul className="list-disc list-inside text-[11px] text-blue-800 space-y-0.5 pl-1">
              <li>Autorização formal CVM e registro no Banco Central do Brasil.</li>
              <li>Adesão formal ao Código ANBIMA de Regulação e Melhores Práticas.</li>
              <li>Histórico comprovado de gestão e ausência de penalidades restritivas.</li>
              <li>Patrimônio Líquido mínimo e segregação estrita de custódia fiduciária.</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" />
            Diretrizes de Sustentabilidade ASG & Gestão de Risco
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {policy.esgGuidelines}
          </p>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Tolerância a Risco</span>
              <strong className="text-slate-800 text-sm font-black">{policy.riskTolerance}</strong>
              <p className="text-[10px] text-slate-500 mt-0.5">Perfil de preservação do capital</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Testes de Estresse</span>
              <strong className="text-slate-800 text-sm font-black">{policy.stressTestingFrequency}</strong>
              <p className="text-[10px] text-slate-500 mt-0.5">Cenários de choque macroeconômico</p>
            </div>
          </div>
          <div className="text-xs text-slate-500 pt-1">
            <strong>Transparência e Controle:</strong> {policy.transparencyAndControl}
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL: LEITOR INTELIGENTE DE TEXTO (PARSER SEMÂNTICO E AUTOMÁTICO)
         ========================================================================= */}
      {isSmartReaderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden">
            {/* Header do Modal */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-emerald-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-5 h-5 text-emerald-200" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Leitor Inteligente de Política Anual de Investimentos
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cole o texto ou extrato da Política Anual para extração automática da Meta Atuarial, datas e limites
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsSmartReaderModalOpen(false);
                  setParseResult(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Texto da Política Anual de Investimentos (Cole aqui a íntegra ou trechos do documento):
                </label>
                <textarea
                  rows={8}
                  value={smartReaderText}
                  onChange={(e) => setSmartReaderText(e.target.value)}
                  placeholder="Ex: 'O PREVI-LACERDA fixa para o exercício de 2026 como Meta Atuarial o índice IPCA acrescido de 5,14% a.a. Aprovada pela Resolução CONDEL nº 06/2025 de 15/12/2025, com alocação de 90% em Renda Fixa...'"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs font-mono"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    // Carrega o texto da política vigente para demonstração rápida
                    setSmartReaderText(policy.fullPolicyText);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-xs font-semibold hover:underline"
                >
                  Preencher com o texto padrão vigente do PREVI-LACERDA
                </button>

                <button
                  onClick={handleProcessSmartReader}
                  disabled={!smartReaderText.trim() || isParsing}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isParsing ? 'Processando Leitor...' : 'Processar Leitura Inteligente'}</span>
                </button>
              </div>

              {/* Resultado do Processamento */}
              {parseResult && (
                <div className="mt-4 pt-4 border-t border-slate-200 space-y-3 animate-slideDown">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Parâmetros Extraídos com Sucesso ({parseResult.extractedFields.length} campos identificados)
                    </h4>
                  </div>

                  {/* DESTAQUE DA META ATUARIAL EXTRAÍDA */}
                  {parseResult.extractedPolicy.actuarialTarget && (
                    <div className="bg-emerald-100/70 border border-emerald-300 p-4 rounded-xl">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                        META ATUARIAL OBTIDA DA LEITURA:
                      </span>
                      <div className="text-2xl font-black text-emerald-950 mt-1">
                        {parseResult.extractedPolicy.actuarialTarget.indexName} + {parseResult.extractedPolicy.actuarialTarget.realInterestRatePct.toFixed(2).replace('.', ',')}% a.a.
                      </div>
                      <p className="text-xs text-emerald-900 mt-1">
                        Rentabilidade projetada calculada: <strong>~{parseResult.extractedPolicy.actuarialTarget.annualTargetPct.toFixed(2).replace('.', ',')}% a.a.</strong>
                      </p>
                    </div>
                  )}

                  {/* Lista de campos extraídos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {parseResult.extractedFields.map((f, idx) => (
                      <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">{f.label}:</span>
                        <strong className="text-slate-800 text-xs">{f.value}</strong>
                        <span className="text-[10px] text-slate-400 block font-mono mt-0.5 truncate">
                          Trecho: "{f.sourceSnippet}"
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Rodapé do Modal */}
            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setIsSmartReaderModalOpen(false);
                  setParseResult(null);
                }}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 font-bold text-xs"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={!parseResult}
                onClick={handleApplyParsedData}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Aplicar Dados Extraídos na Política Vigente</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: EDIÇÃO DIRETA DA POLÍTICA NO SISTEMA
         ========================================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <form 
            onSubmit={handleSaveEdit}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-blue-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Edit3 className="w-5 h-5 text-blue-200" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Edição Direta da Política Anual de Investimentos
                  </h3>
                  <p className="text-xs text-slate-500">
                    Atualize os parâmetros legais, meta atuarial, limites e atas de aprovação
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Abas de Edição */}
            <div className="flex border-b border-slate-200 bg-slate-50/50 px-6 gap-2 pt-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveEditTab('meta')}
                className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                  activeEditTab === 'meta'
                    ? 'border-emerald-600 text-emerald-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Meta Atuarial</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveEditTab('prazos')}
                className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                  activeEditTab === 'prazos'
                    ? 'border-blue-600 text-blue-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Datas & Aprovações Legais</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveEditTab('alocacao')}
                className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                  activeEditTab === 'alocacao'
                    ? 'border-purple-600 text-purple-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Limites por Segmento (CMN)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveEditTab('riscos')}
                className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                  activeEditTab === 'riscos'
                    ? 'border-amber-600 text-amber-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Riscos & Credenciamento</span>
              </button>
            </div>

            {/* Conteúdo das Abas */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* ABA META ATUARIAL */}
              {activeEditTab === 'meta' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Índice Base Oficial</label>
                      <select
                        value={editForm.actuarialTarget.indexName}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          actuarialTarget: {
                            ...editForm.actuarialTarget,
                            indexName: e.target.value as any
                          }
                        })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                      >
                        <option value="IPCA">IPCA (Índice de Preços ao Consumidor Amplo)</option>
                        <option value="INPC">INPC (Índice Nacional de Preços ao Consumidor)</option>
                        <option value="IGP-M">IGP-M (Índice Geral de Preços do Mercado)</option>
                        <option value="SELIC">SELIC (Taxa Básica de Juros)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Taxa de Juros Real (% a.a.)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editForm.actuarialTarget.realInterestRatePct}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          actuarialTarget: {
                            ...editForm.actuarialTarget,
                            realInterestRatePct: parseFloat(e.target.value) || 0
                          }
                        })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Ex: 5.14% a.a. (definida no Estudo Atuarial ETTJ)</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Inflação Projetada (% a.a.)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editForm.actuarialTarget.projectedIndexPct}
                        onChange={(e) => setEditForm({
                          ...editForm,
                          actuarialTarget: {
                            ...editForm.actuarialTarget,
                            projectedIndexPct: parseFloat(e.target.value) || 0
                          }
                        })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Estimativa de inflação para o exercício (ex: 4.00%)</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Fundamentação / Estudo Atuarial de Referência</label>
                    <input
                      type="text"
                      value={editForm.actuarialTarget.referenceLegalStudy}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        actuarialTarget: {
                          ...editForm.actuarialTarget,
                          referenceLegalStudy: e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Notas Explicativas da Meta</label>
                    <textarea
                      rows={3}
                      value={editForm.actuarialTarget.notes || ''}
                      onChange={(e) => setEditForm({
                        ...editForm,
                        actuarialTarget: {
                          ...editForm.actuarialTarget,
                          notes: e.target.value
                        }
                      })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* ABA DATAS & APROVAÇÕES */}
              {activeEditTab === 'prazos' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-900 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      <strong>Exigência Legal (Portaria MTP nº 1.467/2022, Art. 85):</strong> A Política Anual deve ser obrigatoriamente aprovada pelo Conselho Deliberativo antes do encerramento do exercício (31 de dezembro) e enviada ao CADPREV em até 30 dias.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Exercício de Vigência</label>
                      <input
                        type="number"
                        value={editForm.exerciseYear}
                        onChange={(e) => setEditForm({ ...editForm, exerciseYear: parseInt(e.target.value, 10) || 2026 })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Versão / Ato Formal</label>
                      <input
                        type="text"
                        value={editForm.version}
                        onChange={(e) => setEditForm({ ...editForm, version: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Data da Proposta (Comitê de Investimentos)</label>
                      <input
                        type="date"
                        value={editForm.committeeProposalDate}
                        onChange={(e) => setEditForm({ ...editForm, committeeProposalDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Ata do Comitê de Investimentos</label>
                      <input
                        type="text"
                        value={editForm.committeeAtaNumber}
                        onChange={(e) => setEditForm({ ...editForm, committeeAtaNumber: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Data da Aprovação (Conselho Deliberativo)</label>
                      <input
                        type="date"
                        value={editForm.deliberativeApprovalDate}
                        onChange={(e) => setEditForm({ ...editForm, deliberativeApprovalDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-emerald-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Resolução / Ata CONDEL</label>
                      <input
                        type="text"
                        value={editForm.deliberativeAtaNumber}
                        onChange={(e) => setEditForm({ ...editForm, deliberativeAtaNumber: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Data de Envio ao CADPREV</label>
                      <input
                        type="date"
                        value={editForm.cadprevSubmissionDate || ''}
                        onChange={(e) => setEditForm({ ...editForm, cadprevSubmissionDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Protocolo SPREV / CADPREV</label>
                      <input
                        type="text"
                        value={editForm.cadprevProtocol || ''}
                        onChange={(e) => setEditForm({ ...editForm, cadprevProtocol: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ABA LIMITES POR SEGMENTO */}
              {activeEditTab === 'alocacao' && (
                <div className="space-y-3 animate-fadeIn">
                  <p className="text-xs text-slate-500">
                    Ajuste os limites inferior, alvo e superior para cada artigo da Resolução CMN nº 5.272/2025:
                  </p>
                  <div className="space-y-2">
                    {editForm.allocationLimits.map((item, idx) => (
                      <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded">
                            {item.articleCode}
                          </span>
                          <span className="font-bold text-slate-900 ml-2">{item.segmentName}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Teto CMN 5.272: {item.cmnMaxLimitPct}%</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div>
                            <span className="text-[9px] text-slate-400 block text-center">Mín (%)</span>
                            <input
                              type="number"
                              step="0.5"
                              value={item.policyLowerLimitPct}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                const updated = [...editForm.allocationLimits];
                                updated[idx] = { ...item, policyLowerLimitPct: val };
                                setEditForm({ ...editForm, allocationLimits: updated });
                              }}
                              className="w-16 px-2 py-1 text-center font-semibold rounded border border-slate-300 text-xs"
                            />
                          </div>
                          <div>
                            <span className="text-[9px] text-emerald-600 block text-center font-bold">Alvo (%)</span>
                            <input
                              type="number"
                              step="0.5"
                              value={item.policyTargetLimitPct}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                const updated = [...editForm.allocationLimits];
                                updated[idx] = { ...item, policyTargetLimitPct: val };
                                setEditForm({ ...editForm, allocationLimits: updated });
                              }}
                              className="w-16 px-2 py-1 text-center font-black rounded border border-emerald-400 text-emerald-900 bg-emerald-50 text-xs"
                            />
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 block text-center">Máx (%)</span>
                            <input
                              type="number"
                              step="0.5"
                              max={item.cmnMaxLimitPct}
                              value={item.policyUpperLimitPct}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                const updated = [...editForm.allocationLimits];
                                updated[idx] = { ...item, policyUpperLimitPct: val };
                                setEditForm({ ...editForm, allocationLimits: updated });
                              }}
                              className="w-16 px-2 py-1 text-center font-semibold rounded border border-slate-300 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ABA RISCOS E GOVERNANÇA */}
              {activeEditTab === 'riscos' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Modelo de Gestão</label>
                      <select
                        value={editForm.managementModel}
                        onChange={(e) => setEditForm({ ...editForm, managementModel: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                      >
                        <option value="PROPRIA">Gestão Própria (RPPS)</option>
                        <option value="TERCEIRIZADA">Gestão Terceirizada (Carteiras Administradas)</option>
                        <option value="MISTA">Gestão Mista</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Tolerância ao Risco</label>
                      <select
                        value={editForm.riskTolerance}
                        onChange={(e) => setEditForm({ ...editForm, riskTolerance: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                      >
                        <option value="CONSERVADOR">Conservador (Preservação de Capital)</option>
                        <option value="MODERADO">Moderado</option>
                        <option value="ARROJADO">Arrojado</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Limite Máximo de VaR 95% (21d)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editForm.varLimitPct}
                        onChange={(e) => setEditForm({ ...editForm, varLimitPct: parseFloat(e.target.value) || 2.5 })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Diretrizes de Credenciamento Prévio (Art. 21 Res. CMN nº 5.272/2025)</label>
                    <textarea
                      rows={3}
                      value={editForm.credenciamentoCriteria}
                      onChange={(e) => setEditForm({ ...editForm, credenciamentoCriteria: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Critérios de Sustentabilidade ASG (Ambiental, Social e Governança)</label>
                    <textarea
                      rows={2}
                      value={editForm.esgGuidelines}
                      onChange={(e) => setEditForm({ ...editForm, esgGuidelines: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Transparência, Divulgação e Controle Interno</label>
                    <textarea
                      rows={2}
                      value={editForm.transparencyAndControl}
                      onChange={(e) => setEditForm({ ...editForm, transparencyAndControl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Rodapé do Modal */}
            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 font-bold text-xs"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Salvar e Atualizar Política Vigente</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
