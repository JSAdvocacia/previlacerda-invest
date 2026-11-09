import { 
  ProGestaoState, 
  ProGestaoAction, 
  ProGestaoRppsConfig, 
  ProGestaoTargetLevel, 
  ProGestaoEvidence,
  ProGestao5W2H,
  ProGestaoDimensionId
} from '../types';

import { acoesEssenciais, requisitos, pilares } from '../data/progestao/requisitos';
import { DIRETRIZES_POR_NIVEL } from '../data/progestao/configuracoesAcoesNiveis';
import { guiasAuditoriaSPREV } from '../data/progestao/guiasAuditoria';
import { templates5w2h } from '../data/progestao/templates5w2h';

const STORAGE_KEY = 'argos_pro_gestao_state_v2';

const DEFAULT_CONFIG: ProGestaoRppsConfig = {
  id: 'previ-lacerda-rpps',
  nome: 'PREVI-LACERDA - Fundo Municipal de Previdência Social',
  ente: 'Prefeitura Municipal de Pontes e Lacerda - MT',
  cnpj: '15.023.989/0001-26',
  nivelAlvo: 'II',
  nivelAtual: 'Em Implantação (Rumo ao Nível II)',
  notaISP: 'B',
  dataMetaCertificacao: '31/12/2026'
};

const mapDimensionName = (dimId: ProGestaoDimensionId): string => {
  switch (dimId) {
    case 'controle_interno': return 'Controle Interno';
    case 'governanca': return 'Governança Corporativa';
    case 'educacao': return 'Educação Previdenciária';
    default: return 'Geral';
  }
};

const buildInitialActions = (): ProGestaoAction[] => {
  return acoesEssenciais.map((item: any) => {
    const guia = (guiasAuditoriaSPREV as any)[item.id] || {
      titulo: item.nome,
      pilar: item.pilar,
      objetivo: 'Atendimento às diretrizes do Manual do Pró-Gestão RPPS Versão 4.2.',
      oQueAuditorVerifica: [
        'Ato formal de aprovação da ação pela Diretoria ou Conselho.',
        'Comprovação de execução periódica e conformidade das rotinas operacionais.',
        'Publicidade dos documentos no Portal da Transparência do RPPS.'
      ],
      evidenciasAceitas: [
        'Documento formal assinado pelo gestor responsável.',
        'Relatório de execução das atividades previstas.',
        'Ata de deliberação ou aprovação colegiada.'
      ],
      errosComuns: [
        'Documentos sem assinatura digital ou física do dirigente.',
        'Falta de publicação dos atos na imprensa oficial ou portal.',
        'Ausência de controle de revisões periódicas.'
      ],
      dicaOuro: 'Mantenha os documentos comprobatórios organizados com datas e números de portarias/resoluções visíveis.'
    };

    const template5w = (templates5w2h as any)[`acao_${item.id}`] || (templates5w2h as any)[item.nome] || {
      oque: `Implantar e regulamentar a ${item.nome} no âmbito do PREVI-LACERDA.`,
      porque: 'Cumprir os requisitos do Programa Pró-Gestão RPPS e modernizar a governança previdenciária.',
      quem: item.id <= 6 ? 'Controladoria e Diretoria Executiva' : item.id <= 22 ? 'Conselho Deliberativo e Comitê de Investimentos' : 'Setor de Comunicação e RH',
      onde: 'Sede do PREVI-LACERDA e Portal Oficial',
      quando: 'Cronograma semestral de metas 2026',
      como: '1. Diagnóstico da situação atual\n2. Elaboração da minuta\n3. Aprovação colegiada\n4. Publicação e treinamento',
      quanto: 'Rotina administrativa (Sem custo extra)'
    };

    const reqItem = requisitos.find((r: any) => r.acaoId === item.id);
    const obrigatorioNiveis: ProGestaoTargetLevel[] = (reqItem?.obrigatorioNiveis as ProGestaoTargetLevel[]) || ['II', 'III', 'IV'];

    // Atribuição de status e progresso inicial coerente para PREVI-LACERDA
    let status: any = 'EM_ELABORACAO';
    let percentual = 40;
    let responsavel = 'Comissão Pró-Gestão PREVI-LACERDA';

    if (item.id === 3) { // Capacitação e Certificação
      status = 'CONCLUIDA';
      percentual = 100;
      responsavel = 'Jansen de Pinho e Silva / Anderson da Silva Lima';
    } else if (item.id === 10 || item.id === 11) { // Política e Comitê de Investimentos
      status = 'CONCLUIDA';
      percentual = 100;
      responsavel = 'Samir Gilberto Castro / Comitê de Investimentos';
    } else if (item.id === 12 || item.id === 13) { // Transparência e Ouvidoria
      status = 'CONCLUIDA';
      percentual = 90;
      responsavel = 'Diretoria Executiva';
    } else if (item.id === 15 || item.id === 16) { // Conselhos Deliberativo e Fiscal
      status = 'CONCLUIDA';
      percentual = 100;
      responsavel = 'Marcindo Leite Ribeiro / Roberto Mendonça';
    } else if (item.id === 1 || item.id === 2) { // Mapeamento e Manualização
      status = 'EM_ELABORACAO';
      percentual = 75;
      responsavel = 'Equipe Técnica de Benefícios e Arrecadação';
    } else if (item.id === 21 || item.id === 22) { // Gestão de Riscos / Auditoria Interna
      status = obrigatorioNiveis.includes('II') ? 'EM_ELABORACAO' : 'PENDENTE';
      percentual = 20;
      responsavel = 'Controladoria Interna';
    }

    const initialEvidence: ProGestaoEvidence[] = [];
    if (status === 'CONCLUIDA' || percentual >= 70) {
      initialEvidence.push({
        id: `ev-${item.id}-01`,
        titulo: `Portaria / Resolução de Homologação da Ação ${item.id}`,
        tipo: 'Ato Normativo Formal',
        arquivoNome: `Portaria_Acao_${item.id}_PREVI_LACERDA.pdf`,
        dataEmissao: '15/01/2026',
        validade: '31/12/2026',
        status: 'VALIDADA',
        observacoes: 'Documento auditado e em conformidade com o Manual Pró-Gestão v4.2.'
      });
    }

    return {
      id: item.id,
      numero: item.id,
      titulo: item.nome,
      dimensao: (item.pilar === 'governança' ? 'governanca' : item.pilar === 'educação' ? 'educacao' : 'controle_interno') as ProGestaoDimensionId,
      dimensaoNome: mapDimensionName((item.pilar === 'governança' ? 'governanca' : item.pilar === 'educação' ? 'educacao' : 'controle_interno') as ProGestaoDimensionId),
      obrigatorioNiveis,
      status,
      percentual,
      responsavel,
      prazo: '31/10/2026',
      plano5W2H: template5w,
      evidencias: initialEvidence,
      criteriosAuditoria: guia,
      subAreas: item.subAreas
    };
  });
};

export const proGestaoService = {
  /**
   * Obtém o estado completo do Pró-Gestão Flow (com fallback para armazenamento local)
   */
  getState(): ProGestaoState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error('Falha ao ler dados locais do Pró-Gestão:', err);
    }

    const initialActions = buildInitialActions();
    const diagnosticoRespostas: Record<number, 'TOTAL' | 'PARCIAL' | 'NAO' | 'DISPENSADA'> = {};
    initialActions.forEach(a => {
      diagnosticoRespostas[a.id] = a.status === 'CONCLUIDA' ? 'TOTAL' : a.status === 'EM_ELABORACAO' ? 'PARCIAL' : 'NAO';
    });

    const defaultState: ProGestaoState = {
      config: DEFAULT_CONFIG,
      acoes: initialActions,
      diagnosticoRespostas,
      diagnosticoDispensadas: {}
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
    } catch {}

    return defaultState;
  },

  /**
   * Salva o estado atual
   */
  saveState(state: ProGestaoState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error('Erro ao salvar estado do Pró-Gestão:', err);
    }
  },

  /**
   * Atualiza a configuração do RPPS (ex: nível pretendido)
   */
  updateConfig(partial: Partial<ProGestaoRppsConfig>): ProGestaoState {
    const current = this.getState();
    const updated: ProGestaoState = {
      ...current,
      config: { ...current.config, ...partial }
    };
    this.saveState(updated);
    return updated;
  },

  /**
   * Atualiza uma ação específica
   */
  updateAction(actionId: number, partial: Partial<ProGestaoAction>): ProGestaoState {
    const current = this.getState();
    const acoes = current.acoes.map(a => {
      if (a.id === actionId) {
        const updatedAction = { ...a, ...partial };
        // Atualiza percentual caso o status mude para concluída
        if (partial.status === 'CONCLUIDA' && (partial.percentual === undefined || partial.percentual < 100)) {
          updatedAction.percentual = 100;
        } else if (partial.status === 'PENDENTE' && (partial.percentual === undefined || partial.percentual > 0)) {
          updatedAction.percentual = 0;
        }
        return updatedAction;
      }
      return a;
    });

    const updatedState: ProGestaoState = { ...current, acoes };
    this.saveState(updatedState);
    return updatedState;
  },

  /**
   * Adiciona evidência a uma ação
   */
  addEvidence(actionId: number, evidence: Omit<ProGestaoEvidence, 'id'>): ProGestaoState {
    const current = this.getState();
    const id = `ev-${actionId}-${Date.now()}`;
    const newEvidence: ProGestaoEvidence = { ...evidence, id };

    const acoes = current.acoes.map(a => {
      if (a.id === actionId) {
        return {
          ...a,
          evidencias: [...a.evidencias, newEvidence],
          percentual: Math.min(100, a.percentual + 20)
        };
      }
      return a;
    });

    const updatedState: ProGestaoState = { ...current, acoes };
    this.saveState(updatedState);
    return updatedState;
  },

  /**
   * Remove evidência de uma ação
   */
  removeEvidence(actionId: number, evidenceId: string): ProGestaoState {
    const current = this.getState();
    const acoes = current.acoes.map(a => {
      if (a.id === actionId) {
        return {
          ...a,
          evidencias: a.evidencias.filter(e => e.id !== evidenceId)
        };
      }
      return a;
    });

    const updatedState: ProGestaoState = { ...current, acoes };
    this.saveState(updatedState);
    return updatedState;
  },

  /**
   * Atualiza diagnóstico e respostas de conformidade
   */
  updateDiagnostico(
    respostas: Record<number, 'TOTAL' | 'PARCIAL' | 'NAO' | 'DISPENSADA'>,
    dispensadas: Record<number, string> = {}
  ): ProGestaoState {
    const current = this.getState();
    const updatedState: ProGestaoState = {
      ...current,
      diagnosticoRespostas: respostas,
      diagnosticoDispensadas: dispensadas
    };
    this.saveState(updatedState);
    return updatedState;
  },

  /**
   * Calcula as métricas consolidadas de conformidade para o Nível Pretendido
   */
  calculateMetrics(state: ProGestaoState) {
    const targetLevel = state.config.nivelAlvo;
    
    // Filtra ações obrigatórias para o nível alvo
    const acoesObrigatorias = state.acoes.filter(a => a.obrigatorioNiveis.includes(targetLevel));
    const totalObrigatorias = acoesObrigatorias.length;

    const concluidas = acoesObrigatorias.filter(a => a.status === 'CONCLUIDA' || state.diagnosticoRespostas[a.id] === 'TOTAL').length;
    const emElaboracao = acoesObrigatorias.filter(a => a.status === 'EM_ELABORACAO' || state.diagnosticoRespostas[a.id] === 'PARCIAL').length;
    const pendentes = totalObrigatorias - concluidas - emElaboracao;

    const percentualGeral = totalObrigatorias > 0 
      ? Math.round(acoesObrigatorias.reduce((acc, a) => acc + (a.percentual || 0), 0) / totalObrigatorias)
      : 0;

    // Métricas por Dimensão
    const dimensoes = [
      { id: 'controle_interno', nome: 'Controle Interno', cor: 'blue' },
      { id: 'governanca', nome: 'Governança Corporativa', cor: 'indigo' },
      { id: 'educacao', nome: 'Educação Previdenciária', cor: 'teal' }
    ].map(dim => {
      const acoesDim = acoesObrigatorias.filter(a => a.dimensao === dim.id);
      const total = acoesDim.length;
      const conc = acoesDim.filter(a => a.status === 'CONCLUIDA').length;
      const pct = total > 0 ? Math.round(acoesDim.reduce((acc, a) => acc + a.percentual, 0) / total) : 100;
      return {
        ...dim,
        total,
        concluidas: conc,
        percentual: pct
      };
    });

    // Requisitos mínimos do Manual 4.2 da SPREV
    let metaAcoes = 18;
    let notaMinimaAprovacao = 70;
    if (targetLevel === 'I') {
      metaAcoes = 12;
      notaMinimaAprovacao = 60;
    } else if (targetLevel === 'II') {
      metaAcoes = 18;
      notaMinimaAprovacao = 70;
    } else if (targetLevel === 'III') {
      metaAcoes = 21;
      notaMinimaAprovacao = 80;
    } else if (targetLevel === 'IV') {
      metaAcoes = 24;
      notaMinimaAprovacao = 90;
    }

    const estaAptoAuditoria = percentualGeral >= notaMinimaAprovacao && concluidas >= Math.round(totalObrigatorias * 0.85);

    return {
      targetLevel,
      totalObrigatorias,
      concluidas,
      emElaboracao,
      pendentes,
      percentualGeral,
      dimensoes,
      metaAcoes,
      notaMinimaAprovacao,
      estaAptoAuditoria
    };
  },

  /**
   * Reseta os dados para o padrão original
   */
  resetToDefault(): ProGestaoState {
    localStorage.removeItem(STORAGE_KEY);
    return this.getState();
  }
};
