// Definição dos Módulos do Sistema para Controle de Permissões
export const MODULOS_SISTEMA = [
  { id: 'dashboard', label: 'Painel - Visão Geral (Dashboard)', descricao: 'Visualização de métricas e status geral do RPPS' },
  { id: 'cadastro-rpps', label: 'Cadastro de RPPS', descricao: 'Gerenciar e cadastrar novos RPPS na plataforma' },
  { id: 'identificacao', label: 'Identificação do RPPS', descricao: 'Dados institucionais e geração do Termo de Adesão' },
  { id: 'diagnostico', label: 'Diagnóstico Institucional', descricao: 'Avaliação de maturidade e aderência ao Pró-Gestão' },
  { id: 'requisitos', label: 'Requisitos do Pró-Gestão', descricao: 'Consulta de requisitos dos 3 níveis de certificação' },
  { id: 'plano-trabalho', label: 'Plano de Trabalho (5W2H)', descricao: 'Planejamento e cronograma de ações do RPPS' },
  { id: 'planejamento-estrategico', label: 'Planejamento Estratégico', descricao: 'Diretrizes, metas e mapa estratégico' },
  { id: 'linha-producao', label: 'Linha de Produção', descricao: 'Execução e geração de minutas e artefatos' },
  { id: 'mapeamento-processos', label: 'Mapeamento de Processos', descricao: 'SIPOC, subprocessos e fluxogramas BPMN' },
  { id: 'manualizacao-processos', label: 'Manualização de Processos', descricao: 'Manuais operacionais de procedimentos' },
  { id: 'pipeline', label: 'Acompanhamento (Pipeline)', descricao: 'Controle de tarefas e progresso das ações' },
  { id: 'evidencias', label: 'Repositório de Evidências', descricao: 'Gestão de trilha documental e versionamento' },
  { id: 'pre-auditoria', label: 'Simulador de Pré-Auditoria', descricao: 'Auditoria virtual e verificação de conformidade' },
  { id: 'normativos', label: 'Normativos & Consulta Técnica', descricao: 'Acervo legislativo e análise de normas' },
  { id: 'gerenciador-acesso', label: 'Gestão de Usuários & Acessos', descricao: 'Administração de perfis, permissões e aprovações' },
];

export const PERFIS_SISTEMA = [
  {
    id: 'Administrador Master',
    label: 'Administrador Master',
    descricao: 'Acesso irrestrito e imutável a todos os RPPS e funcionalidades do sistema.',
    permissoesPadrao: MODULOS_SISTEMA.map(m => m.id),
    escopo: 'global'
  },
  {
    id: 'Administrador',
    label: 'Administrador',
    descricao: 'Gestão administrativa e operacional de RPPS autorizados mediante aprovação do Master.',
    permissoesPadrao: [
      'dashboard', 'cadastro-rpps', 'identificacao', 'diagnostico', 'requisitos',
      'plano-trabalho', 'planejamento-estrategico', 'linha-producao', 'mapeamento-processos',
      'manualizacao-processos', 'pipeline', 'evidencias', 'pre-auditoria', 'normativos', 'gerenciador-acesso'
    ],
    escopo: 'multi'
  },
  {
    id: 'Gestor',
    label: 'Gestor',
    descricao: 'Gestão completa dos processos, planos e evidências do seu RPPS.',
    permissoesPadrao: [
      'dashboard', 'identificacao', 'diagnostico', 'requisitos', 'plano-trabalho',
      'planejamento-estrategico', 'linha-producao', 'mapeamento-processos',
      'manualizacao-processos', 'pipeline', 'evidencias', 'pre-auditoria', 'normativos'
    ],
    escopo: 'unico'
  },
  {
    id: 'Conselheiro',
    label: 'Conselheiro',
    descricao: 'Acompanhamento, consulta, relatórios, atas e auditoria do seu RPPS.',
    permissoesPadrao: [
      'dashboard', 'identificacao', 'diagnostico', 'requisitos', 'plano-trabalho',
      'planejamento-estrategico', 'pipeline', 'evidencias', 'pre-auditoria', 'normativos'
    ],
    escopo: 'unico'
  },
  {
    id: 'Operador',
    label: 'Operador',
    descricao: 'Execução operacional: Mapeamento, Manualização, Linha de Produção e Evidências.',
    permissoesPadrao: [
      'dashboard', 'identificacao', 'linha-producao', 'mapeamento-processos',
      'manualizacao-processos', 'evidencias', 'normativos'
    ],
    escopo: 'unico'
  }
];

export function getPermissoesPadrao(perfilNome) {
  const p = PERFIS_SISTEMA.find(perf => perf.id === perfilNome);
  return p ? [...p.permissoesPadrao] : [...PERFIS_SISTEMA[4].permissoesPadrao];
}
