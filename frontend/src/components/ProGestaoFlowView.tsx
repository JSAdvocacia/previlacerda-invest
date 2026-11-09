import React, { useState, useEffect } from 'react';
import { 
  Award, 
  ShieldCheck, 
  Target, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Upload, 
  Trash2, 
  Plus, 
  Layers, 
  Search, 
  Filter, 
  Download, 
  ExternalLink,
  ChevronRight,
  BookOpen,
  Info,
  Building2,
  HelpCircle,
  BarChart3,
  Check,
  Edit2,
  RefreshCw,
  FolderLock
} from 'lucide-react';
import { 
  ProGestaoState, 
  ProGestaoAction, 
  ProGestaoTargetLevel, 
  ProGestaoDimensionId, 
  ProGestaoActionStatus, 
  ProGestaoEvidence 
} from '../types';
import { proGestaoService } from '../services/proGestaoService';

interface ProGestaoFlowViewProps {
  currentSubTab?: string;
  onSelectSubTab?: (tab: string) => void;
}

export const ProGestaoFlowView: React.FC<ProGestaoFlowViewProps> = ({
  currentSubTab = 'progestao_dashboard',
  onSelectSubTab
}) => {
  const [state, setState] = useState<ProGestaoState>(proGestaoService.getState());
  const [activeTab, setActiveTab] = useState<string>(
    currentSubTab.startsWith('progestao_') ? currentSubTab : 'progestao_dashboard'
  );

  // Filtros da Linha de Produção
  const [selectedDimension, setSelectedDimension] = useState<string>('todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modal de Detalhes da Ação / 5W2H / Evidências
  const [activeActionModal, setActiveActionModal] = useState<ProGestaoAction | null>(null);
  const [isEditing5w2h, setIsEditing5w2h] = useState(false);
  const [formData5w2h, setFormData5w2h] = useState({
    oque: '',
    porque: '',
    quem: '',
    onde: '',
    quando: '',
    como: '',
    quanto: ''
  });

  // Modal de Nova Evidência
  const [showAddEvidenceModal, setShowAddEvidenceModal] = useState(false);
  const [newEvidenceTitle, setNewEvidenceTitle] = useState('');
  const [newEvidenceType, setNewEvidenceType] = useState('Portaria / Ato Normativo');
  const [newEvidenceFileName, setNewEvidenceFileName] = useState('');
  const [newEvidenceValidity, setNewEvidenceValidity] = useState('31/12/2026');
  const [newEvidenceObservations, setNewEvidenceObservations] = useState('');

  // Notificação de Sucesso
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    if (currentSubTab && currentSubTab.startsWith('progestao_')) {
      setActiveTab(currentSubTab);
    }
  }, [currentSubTab]);

  const triggerFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const metrics = proGestaoService.calculateMetrics(state);

  const handleLevelChange = (newLevel: ProGestaoTargetLevel) => {
    const updated = proGestaoService.updateConfig({ nivelAlvo: newLevel });
    setState(updated);
    triggerFeedback(`Nível Alvo alterado com sucesso para Nível ${newLevel} do Manual 4.2.`);
  };

  const handleActionStatusChange = (actionId: number, newStatus: ProGestaoActionStatus) => {
    const updated = proGestaoService.updateAction(actionId, { status: newStatus });
    setState(updated);
    if (activeActionModal && activeActionModal.id === actionId) {
      setActiveActionModal(updated.acoes.find(a => a.id === actionId) || null);
    }
    triggerFeedback(`Status da Ação ${actionId} atualizado para ${newStatus}.`);
  };

  const handleOpenActionModal = (action: ProGestaoAction) => {
    setActiveActionModal(action);
    setFormData5w2h({ ...action.plano5W2H });
    setIsEditing5w2h(false);
  };

  const handleSave5W2H = () => {
    if (!activeActionModal) return;
    const updated = proGestaoService.updateAction(activeActionModal.id, {
      plano5W2H: { ...formData5w2h }
    });
    setState(updated);
    setActiveActionModal(updated.acoes.find(a => a.id === activeActionModal.id) || null);
    setIsEditing5w2h(false);
    triggerFeedback('Plano de Ação 5W2H atualizado com sucesso!');
  };

  const handleAddEvidenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeActionModal || !newEvidenceTitle) return;

    const updated = proGestaoService.addEvidence(activeActionModal.id, {
      titulo: newEvidenceTitle,
      tipo: newEvidenceType,
      arquivoNome: newEvidenceFileName || `${newEvidenceTitle.replace(/\s+/g, '_')}.pdf`,
      dataEmissao: new Date().toLocaleDateString('pt-BR'),
      validade: newEvidenceValidity,
      status: 'VALIDADA',
      observacoes: newEvidenceObservations
    });

    setState(updated);
    setActiveActionModal(updated.acoes.find(a => a.id === activeActionModal.id) || null);
    setShowAddEvidenceModal(false);
    setNewEvidenceTitle('');
    setNewEvidenceFileName('');
    setNewEvidenceObservations('');
    triggerFeedback('Evidência documental anexada e validada!');
  };

  const handleRemoveEvidence = (actionId: number, evidenceId: string) => {
    const updated = proGestaoService.removeEvidence(actionId, evidenceId);
    setState(updated);
    if (activeActionModal && activeActionModal.id === actionId) {
      setActiveActionModal(updated.acoes.find(a => a.id === actionId) || null);
    }
    triggerFeedback('Evidência removida.');
  };

  const handleDiagnosticoResposta = (actionId: number, resposta: 'TOTAL' | 'PARCIAL' | 'NAO' | 'DISPENSADA') => {
    const currentRespostas = { ...state.diagnosticoRespostas, [actionId]: resposta };
    const updated = proGestaoService.updateDiagnostico(currentRespostas, state.diagnosticoDispensadas);
    setState(updated);
  };

  // Filtragem das ações para a Linha de Produção
  const filteredActions = state.acoes.filter(action => {
    const matchDim = selectedDimension === 'todos' || action.dimensao === selectedDimension;
    const matchStatus = selectedStatus === 'todos' || action.status === selectedStatus;
    const matchSearch = searchTerm === '' || 
      action.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
      action.numero.toString() === searchTerm.trim();
    return matchDim && matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedbackMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Header Institucional do Módulo Pró-Gestão Flow */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-700 to-purple-800 p-2.5 flex items-center justify-center text-white shadow-md shrink-0">
              <Award className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full border border-purple-200">
                  Pró-Gestão Flow • Manual SPREV v4.2
                </span>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  PREVI-LACERDA (RPPS)
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Pró-Gestão Flow</span>
                <span className="text-xs font-normal text-slate-400">• Programa de Certificação Institucional</span>
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Ambiente autônomo de implantação, manualização de processos, conformidade 5W2H e auditoria documental prévia.
              </p>
            </div>
          </div>

          {/* Seletor de Nível Alvo de Certificação */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 block">NÍVEL PRETENDIDO (SPREV)</span>
              <span className="text-xs font-bold text-slate-800">Selecione a certificação alvo:</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
              {(['I', 'II', 'III', 'IV'] as ProGestaoTargetLevel[]).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => handleLevelChange(lvl)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                    state.config.nivelAlvo === lvl
                      ? 'bg-purple-700 text-white shadow-xs scale-105'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Nível {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Barra de Sub-Navegação Interna */}
        <div className="flex flex-wrap items-center gap-1 pt-4">
          {[
            { id: 'progestao_dashboard', label: 'Painel & Aderência', icon: BarChart3 },
            { id: 'progestao_linha_producao', label: 'Linha de Produção (24 Ações)', icon: Target },
            { id: 'progestao_evidencias', label: 'Repositório de Evidências', icon: FileText },
            { id: 'progestao_diagnostico', label: 'Diagnóstico & Autoavaliação', icon: Layers },
            { id: 'progestao_pre_auditoria', label: 'Simulador de Pré-Auditoria', icon: ShieldCheck },
            { id: 'progestao_dossie', label: 'Dossiê da Certificação', icon: BookOpen }
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (onSelectSubTab) onSelectSubTab(tab.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-purple-700' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 1. ABA: PAINEL & TERMÔMETRO DE ADERÊNCIA */}
      {/* ===================================================================== */}
      {activeTab === 'progestao_dashboard' && (
        <div className="space-y-6">
          {/* Cards de Resumo Executivo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black uppercase text-slate-400">ADERÊNCIA GERAL</span>
                <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                  Nível {metrics.targetLevel}
                </span>
              </div>
              <div className="text-3xl font-black text-slate-900 mt-2">
                {metrics.percentualGeral}%
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                <div 
                  className="bg-purple-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${metrics.percentualGeral}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2 font-medium">
                Meta mínima para Nível {metrics.targetLevel}: <strong>{metrics.notaMinimaAprovacao}%</strong>
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black uppercase text-slate-400">AÇÕES CONCLUÍDAS</span>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                  Auditadas
                </span>
              </div>
              <div className="text-3xl font-black text-emerald-700 mt-2">
                {metrics.concluidas} <span className="text-sm font-semibold text-slate-400">/ {metrics.totalObrigatorias}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-3 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{metrics.emElaboracao} ações em elaboração</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black uppercase text-slate-400">STATUS PRÉ-AUDITORIA</span>
                <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                  Manual 4.2
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {metrics.estaAptoAuditoria ? (
                  <>
                    <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
                    <div>
                      <div className="text-sm font-black text-emerald-700">Apto à Certificação</div>
                      <span className="text-[10px] text-slate-400">Requisitos cumpridos</span>
                    </div>
                  </>
                ) : (
                  <>
                    <Clock className="w-7 h-7 text-amber-500 shrink-0" />
                    <div>
                      <div className="text-sm font-black text-amber-700">Em Adequação</div>
                      <span className="text-[10px] text-slate-400">Faltam {metrics.pendentes} ações</span>
                    </div>
                  </>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-3 font-medium">
                Auditoria recomendada antes de submeter ao Ministério.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black uppercase text-slate-400">EVIDÊNCIAS ANEXADAS</span>
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                  Digitalizadas
                </span>
              </div>
              <div className="text-3xl font-black text-indigo-900 mt-2">
                {state.acoes.reduce((acc, a) => acc + (a.evidencias?.length || 0), 0)}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-3 font-medium">
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>Documentos oficiais rastreáveis</span>
              </div>
            </div>
          </div>

          {/* Progresso por Dimensão do Manual 4.2 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Desempenho por Dimensão Estruturante do Pró-Gestão RPPS
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Acompanhamento dos 3 pilares obrigatórios da Portaria MTP nº 1.467/2022 e Manual SPREV v4.2.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {metrics.dimensoes.map(dim => (
                <div key={dim.id} className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-black uppercase text-slate-700">{dim.nome}</span>
                      <span className="text-xs font-extrabold text-purple-700">{dim.percentual}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-purple-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${dim.percentual}%` }}
                      />
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 text-xs flex justify-between text-slate-600 font-medium">
                    <span>Ações obrigatórias: <strong>{dim.total}</strong></span>
                    <span>Concluídas: <strong className="text-emerald-700">{dim.concluidas}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Destaque das Próximas Ações Críticas */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Ações Prioritárias para Obtenção do Nível {metrics.targetLevel}</h3>
                <p className="text-xs text-slate-500">Ações em andamento com maior peso para auditoria externa.</p>
              </div>
              <button
                onClick={() => setActiveTab('progestao_linha_producao')}
                className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
              >
                <span>Ver todas as 24 ações</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {state.acoes
                .filter(a => a.obrigatorioNiveis.includes(metrics.targetLevel) && a.status !== 'CONCLUIDA')
                .slice(0, 4)
                .map(action => (
                  <div 
                    key={action.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 font-black text-xs flex items-center justify-center shrink-0">
                        {action.numero}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{action.titulo}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span>Dimensão: <strong>{action.dimensaoNome}</strong></span>
                          <span>•</span>
                          <span>Responsável: <strong>{action.responsavel}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className="text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-lg">
                        {action.status.replace('_', ' ')}
                      </span>
                      <button
                        onClick={() => handleOpenActionModal(action)}
                        className="text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Gerenciar 5W2H
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. ABA: LINHA DE PRODUÇÃO (AS 24 AÇÕES DO MANUAL 4.2) */}
      {/* ===================================================================== */}
      {activeTab === 'progestao_linha_producao' && (
        <div className="space-y-6">
          {/* Barra de Filtros e Busca */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por número da ação ou palavra-chave..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedDimension}
                onChange={e => setSelectedDimension(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="todos">Todas as Dimensões</option>
                <option value="controle_interno">Controle Interno</option>
                <option value="governanca">Governança Corporativa</option>
                <option value="educacao">Educação Previdenciária</option>
              </select>

              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="todos">Todos os Status</option>
                <option value="CONCLUIDA">Concluídas</option>
                <option value="EM_ELABORACAO">Em Elaboração</option>
                <option value="PENDENTE">Pendentes</option>
              </select>
            </div>
          </div>

          {/* Lista de Ações da Linha de Produção */}
          <div className="space-y-3">
            {filteredActions.map(action => {
              const isObrigatorioNivelAtual = action.obrigatorioNiveis.includes(metrics.targetLevel);
              const statusBg = action.status === 'CONCLUIDA'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : action.status === 'EM_ELABORACAO'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-slate-50 text-slate-600 border-slate-200';

              return (
                <div 
                  key={action.id}
                  className={`bg-white rounded-2xl border transition-all p-5 shadow-sm hover:shadow-md ${
                    isObrigatorioNivelAtual ? 'border-slate-200' : 'border-slate-200 opacity-80'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 font-black text-sm flex items-center justify-center shrink-0">
                        {action.numero}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                            {action.dimensaoNome}
                          </span>
                          {isObrigatorioNivelAtual ? (
                            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              Obrigatória no Nível {metrics.targetLevel}
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                              Opcional no Nível {metrics.targetLevel}
                            </span>
                          )}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusBg}`}>
                            {action.status.replace('_', ' ')}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900">{action.titulo}</h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {action.plano5W2H.oque}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 self-end lg:self-center shrink-0">
                      {/* Seletor Rápido de Status */}
                      <select
                        value={action.status}
                        onChange={e => handleActionStatusChange(action.id, e.target.value as ProGestaoActionStatus)}
                        className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="CONCLUIDA">Concluída</option>
                        <option value="EM_ELABORACAO">Em Elaboração</option>
                        <option value="PENDENTE">Pendente</option>
                      </select>

                      <button
                        onClick={() => handleOpenActionModal(action)}
                        className="inline-flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>5W2H & Evidências ({action.evidencias?.length || 0})</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. ABA: REPOSITÓRIO DE EVIDÊNCIAS DOCUMENTAIS */}
      {/* ===================================================================== */}
      {activeTab === 'progestao_evidencias' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Repositório Digital de Evidências Auditadas</h2>
              <p className="text-xs text-slate-500">Documentos comprobatórios vinculados às 24 ações do Pró-Gestão RPPS.</p>
            </div>
            <div className="text-xs text-slate-500">
              Total de documentos homologados: <strong>{state.acoes.reduce((acc, a) => acc + (a.evidencias?.length || 0), 0)}</strong>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {state.acoes.flatMap(action => 
              (action.evidencias || []).map(ev => ({
                ...ev,
                actionNumber: action.numero,
                actionTitle: action.titulo,
                actionDimension: action.dimensaoNome
              }))
            ).map((ev, idx) => (
              <div key={ev.id || idx} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase bg-purple-50 text-purple-700 px-2 py-0.5 rounded">
                        Ação {ev.actionNumber}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">
                        {ev.tipo}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">{ev.titulo}</h4>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span>Arquivo: <strong>{ev.arquivoNome}</strong></span>
                      <span>•</span>
                      <span>Emissão: {ev.dataEmissao}</span>
                      <span>•</span>
                      <span>Validade: <strong>{ev.validade}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                    {ev.status}
                  </span>
                  <button
                    onClick={() => handleRemoveEvidence(ev.actionNumber, ev.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Excluir evidência"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. ABA: DIAGNÓSTICO & AUTOAVALIAÇÃO */}
      {/* ===================================================================== */}
      {activeTab === 'progestao_diagnostico' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Autoavaliação de Conformidade Inicial</h2>
              <p className="text-xs text-slate-500">Avalie a situação das ações para o Nível {metrics.targetLevel} do Pró-Gestão.</p>
            </div>
            <div className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
              ISP Atual do Ente: Nota B
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">Nº</th>
                  <th className="py-3 px-4">Ação Institucional</th>
                  <th className="py-3 px-4">Dimensão</th>
                  <th className="py-3 px-4 text-center">Nível Exigido</th>
                  <th className="py-3 px-4 text-center">Conformidade Atual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {state.acoes.map(action => {
                  const resposta = state.diagnosticoRespostas[action.id] || 'NAO';
                  return (
                    <tr key={action.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 text-center font-black text-slate-900">{action.numero}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{action.titulo}</td>
                      <td className="py-3 px-4 font-medium text-slate-500">{action.dimensaoNome}</td>
                      <td className="py-3 px-4 text-center font-bold text-slate-600">
                        {action.obrigatorioNiveis.join(', ')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                          {[
                            { val: 'TOTAL', label: 'Total', color: 'bg-emerald-600 text-white' },
                            { val: 'PARCIAL', label: 'Parcial', color: 'bg-amber-500 text-white' },
                            { val: 'NAO', label: 'Não', color: 'bg-rose-500 text-white' }
                          ].map(opt => (
                            <button
                              key={opt.val}
                              onClick={() => handleDiagnosticoResposta(action.id, opt.val as any)}
                              className={`px-2 py-1 rounded text-[10px] font-black transition-all ${
                                resposta === opt.val ? opt.color : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 5. ABA: SIMULADOR DE PRÉ-AUDITORIA */}
      {/* ===================================================================== */}
      {activeTab === 'progestao_pre_auditoria' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Simulador de Auditoria de Certificação (SPREV)</h2>
              <p className="text-xs text-slate-500">Verificação automática de aderência aos requisitos mínimos do Manual 4.2.</p>
            </div>
            <span className="text-xs font-bold bg-slate-100 px-3 py-1.5 rounded-xl text-slate-700">
              Meta Mínima: {metrics.notaMinimaAprovacao}%
            </span>
          </div>

          <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 ${
            metrics.estaAptoAuditoria ? 'bg-emerald-50/60 border-emerald-200' : 'bg-amber-50/60 border-amber-200'
          }`}>
            <div className="flex items-center gap-4">
              {metrics.estaAptoAuditoria ? (
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                  <AlertTriangle className="w-8 h-8" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {metrics.estaAptoAuditoria ? 'RPPS Apto para Solicitar Certificação' : 'Adequações Necessárias antes do Envio'}
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  {metrics.estaAptoAuditoria
                    ? `O PREVI-LACERDA atingiu ${metrics.percentualGeral}% de conformidade, superando a meta de ${metrics.notaMinimaAprovacao}% exigida para o Nível ${metrics.targetLevel}.`
                    : `O RPPS atingiu ${metrics.percentualGeral}% de conformidade. É necessário atingir pelo menos ${metrics.notaMinimaAprovacao}% e concluir as ações essenciais do Nível ${metrics.targetLevel}.`}
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right shrink-0">
              <span className="text-xs text-slate-400 block font-bold">NOTA DE AUDITORIA</span>
              <span className={`text-4xl font-black ${metrics.estaAptoAuditoria ? 'text-emerald-700' : 'text-amber-700'}`}>
                {metrics.percentualGeral}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 6. ABA: DOSSIÊ CONSOLIDADO DE CERTIFICAÇÃO */}
      {/* ===================================================================== */}
      {activeTab === 'progestao_dossie' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Livro Dossiê da Certificação Pró-Gestão</h2>
              <p className="text-xs text-slate-500">Compilação consolidada de todas as 24 ações, 5W2H e evidências auditadas.</p>
            </div>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Imprimir / Salvar Dossiê em PDF</span>
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-purple-700" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Estrutura do Dossiê Homologado</h3>
                <p className="text-xs text-slate-500">Pronto para envio aos auditores credenciados pela SPREV.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">INSTITUTO</span>
                <strong className="text-slate-900">{state.config.nome}</strong>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">NÍVEL AUDITADO</span>
                <strong className="text-purple-700 font-black">Nível {metrics.targetLevel}</strong>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">TOTAL DE DOCUMENTOS</span>
                <strong className="text-slate-900">{state.acoes.reduce((acc, a) => acc + (a.evidencias?.length || 0), 0)} Evidências</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: DETALHES DA AÇÃO / 5W2H / EVIDÊNCIAS */}
      {/* ===================================================================== */}
      {activeActionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-8 animate-fadeIn">
            {/* Header Modal */}
            <div className="p-6 bg-slate-900 text-white flex justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase bg-purple-950 text-purple-300 px-2.5 py-0.5 rounded border border-purple-800">
                    Ação {activeActionModal.numero} • {activeActionModal.dimensaoNome}
                  </span>
                  <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    Manual v4.2
                  </span>
                </div>
                <h3 className="text-lg font-black text-white">{activeActionModal.titulo}</h3>
              </div>
              <button
                onClick={() => setActiveActionModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Conteúdo Modal */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
              {/* O que o Auditor SPREV Verifica */}
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                <h4 className="text-xs font-black uppercase text-purple-900 flex items-center gap-1.5 mb-2">
                  <ShieldCheck className="w-4 h-4 text-purple-700" />
                  <span>Critérios Oficiais do Auditor SPREV</span>
                </h4>
                <ul className="text-xs text-purple-950 space-y-1 list-disc list-inside">
                  {activeActionModal.criteriosAuditoria?.oQueAuditorVerifica?.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Plano 5W2H */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <h4 className="text-xs font-black uppercase text-slate-700">Plano de Trabalho 5W2H</h4>
                  {!isEditing5w2h ? (
                    <button
                      onClick={() => setIsEditing5w2h(true)}
                      className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Editar 5W2H</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleSave5W2H}
                      className="text-xs font-bold bg-purple-700 text-white px-3 py-1 rounded-lg hover:bg-purple-800"
                    >
                      Salvar Alterações
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">O QUE (WHAT)</span>
                    {isEditing5w2h ? (
                      <textarea
                        value={formData5w2h.oque}
                        onChange={e => setFormData5w2h({ ...formData5w2h, oque: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                        rows={2}
                      />
                    ) : (
                      <p className="text-slate-800 font-medium">{activeActionModal.plano5W2H.oque}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">POR QUE (WHY)</span>
                    {isEditing5w2h ? (
                      <textarea
                        value={formData5w2h.porque}
                        onChange={e => setFormData5w2h({ ...formData5w2h, porque: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                        rows={2}
                      />
                    ) : (
                      <p className="text-slate-800 font-medium">{activeActionModal.plano5W2H.porque}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">QUEM (WHO)</span>
                    {isEditing5w2h ? (
                      <input
                        type="text"
                        value={formData5w2h.quem}
                        onChange={e => setFormData5w2h({ ...formData5w2h, quem: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    ) : (
                      <p className="text-slate-800 font-medium">{activeActionModal.plano5W2H.quem}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">QUANDO (WHEN)</span>
                    {isEditing5w2h ? (
                      <input
                        type="text"
                        value={formData5w2h.quando}
                        onChange={e => setFormData5w2h({ ...formData5w2h, quando: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    ) : (
                      <p className="text-slate-800 font-medium">{activeActionModal.plano5W2H.quando}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Lista de Evidências Anexadas */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black uppercase text-slate-700">Evidências Anexadas ({activeActionModal.evidencias?.length || 0})</h4>
                  <button
                    onClick={() => setShowAddEvidenceModal(true)}
                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Anexar Evidência</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                  {(!activeActionModal.evidencias || activeActionModal.evidencias.length === 0) ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      Nenhuma evidência documental anexada para esta ação ainda.
                    </div>
                  ) : (
                    activeActionModal.evidencias.map(ev => (
                      <div key={ev.id} className="p-3 flex justify-between items-center gap-3">
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-purple-700 shrink-0" />
                          <div>
                            <div className="text-xs font-bold text-slate-900">{ev.titulo}</div>
                            <span className="text-[10px] text-slate-400">
                              {ev.arquivoNome} • Validade: {ev.validade}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveEvidence(activeActionModal.id, ev.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setActiveActionModal(null)}
                className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: ANEXAR NOVA EVIDÊNCIA */}
      {/* ===================================================================== */}
      {showAddEvidenceModal && activeActionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4 animate-fadeIn">
            <h3 className="text-base font-bold text-slate-900">Anexar Nova Evidência Documental</h3>
            <p className="text-xs text-slate-500">
              Vincule um documento oficial à Ação {activeActionModal.numero}: {activeActionModal.titulo}.
            </p>

            <form onSubmit={handleAddEvidenceSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Título do Documento *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Portaria nº 012/2026 de Instituição do Controle Interno"
                  value={newEvidenceTitle}
                  onChange={e => setNewEvidenceTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Tipo de Documento</label>
                <select
                  value={newEvidenceType}
                  onChange={e => setNewEvidenceType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Portaria / Ato Normativo">Portaria / Ato Normativo</option>
                  <option value="Manual Operacional / POP">Manual Operacional / POP</option>
                  <option value="Ata de Reunião">Ata de Reunião</option>
                  <option value="Relatório Periódico">Relatório Periódico</option>
                  <option value="Certificado de Qualificação">Certificado de Qualificação</option>
                  <option value="Edital / Publicação Oficial">Edital / Publicação Oficial</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Nome do Arquivo Digital (.pdf)</label>
                <input
                  type="text"
                  placeholder="Ex: Portaria_Controle_Interno_2026.pdf"
                  value={newEvidenceFileName}
                  onChange={e => setNewEvidenceFileName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Data de Validade</label>
                <input
                  type="text"
                  value={newEvidenceValidity}
                  onChange={e => setNewEvidenceValidity(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddEvidenceModal(false)}
                  className="px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                >
                  Confirmar e Anexar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
