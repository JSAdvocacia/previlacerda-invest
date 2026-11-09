export const acoesEssenciais = [
  { id: 1, nome: "Mapeamento das Áreas das Atividades", pilar: "controle_interno", subAreas: ["Benefícios", "Arrecadação", "Investimentos", "Compensação Previdenciária"] },
  { id: 2, nome: "Manualização das Áreas das Atividades", pilar: "controle_interno", subAreas: ["Benefícios", "Arrecadação", "Investimentos", "Compensação Previdenciária"] },
  { id: 3, nome: "Capacitação e Certificação dos Gestores e Servidores do RPPS", pilar: "controle_interno" },
  { id: 4, nome: "Estrutura de Controle Interno", pilar: "controle_interno" },
  { id: 5, nome: "Política de Segurança da Informação", pilar: "controle_interno" },
  { id: 6, nome: "Gestão e Controle da Base de Dados Cadastrais", pilar: "controle_interno" },
  
  { id: 7, nome: "Relatório de Governança Corporativa", pilar: "governança" },
  { id: 8, nome: "Planejamento", pilar: "governança" },
  { id: 9, nome: "Código de Ética e de Conduta", pilar: "governança" },
  { id: 10, nome: "Políticas de Investimentos", pilar: "governança" },
  { id: 11, nome: "Comitê de Investimentos", pilar: "governança" },
  { id: 12, nome: "Transparência", pilar: "governança" },
  { id: 13, nome: "Ouvidoria", pilar: "governança" },
  { id: 14, nome: "Diretoria Executiva", pilar: "governança" },
  { id: 15, nome: "Conselho de Administração, Deliberativo ou Curador", pilar: "governança" },
  { id: 16, nome: "Conselho Fiscal", pilar: "governança" },
  { id: 17, nome: "Gestão de Pessoas", pilar: "governança" },
  { id: 18, nome: "Mandato, Representação e Recondução", pilar: "governança" },
  { id: 19, nome: "Segregação das Atividades", pilar: "governança" },
  { id: 20, nome: "Gestão Atuarial", pilar: "governança" },
  { id: 21, nome: "Sistema de Gestão de Riscos", pilar: "governança" },
  { id: 22, nome: "Auditoria Interna", pilar: "governança" },

  { id: 23, nome: "Plano de Ação de Educação Previdenciária", pilar: "educação" },
  { id: 24, nome: "Ações de Diálogo com os Segurados e a Sociedade", pilar: "educação" },
];

export const pilares = [
  { id: "controle_interno", nome: "Controle Interno (no RPPS)" },
  { id: "governança", nome: "Governança Corporativa" },
  { id: "educação", nome: "Educação Previdenciária" },
];

export const niveis = ["I", "II", "III", "IV"];

export const requisitos = [
  // Controle Interno
  { id: "c1", pilar: "controle_interno", acaoId: 1, descricao: "Mapeamento das Áreas das Atividades", obrigatorioNiveis: ["II", "III", "IV"] },
  { id: "c2", pilar: "controle_interno", acaoId: 2, descricao: "Manualização das Áreas das Atividades", obrigatorioNiveis: ["II", "III", "IV"] },
  { id: "c3", pilar: "controle_interno", acaoId: 3, descricao: "Capacitação e Certificação dos Gestores e Servidores do RPPS", obrigatorioNiveis: ["I", "II", "III", "IV"] },
  { id: "c4", pilar: "controle_interno", acaoId: 4, descricao: "Estrutura de Controle Interno (no RPPS)", obrigatorioNiveis: ["I", "II", "III", "IV"] },
  { id: "c5", pilar: "controle_interno", acaoId: 5, descricao: "Política de Segurança da Informação", obrigatorioNiveis: ["I", "II", "III", "IV"] },
  { id: "c6", pilar: "controle_interno", acaoId: 6, descricao: "Gestão e Controle da Base de Dados Cadastrais", obrigatorioNiveis: ["I", "II", "III", "IV"] },
  
  // Governança Corporativa
  { id: "g1", pilar: "governança", acaoId: 7, descricao: "Relatório de Governança Corporativa", obrigatorioNiveis: ["III", "IV"] },
  { id: "g2", pilar: "governança", acaoId: 8, descricao: "Planejamento (Estratégico e Anual)", obrigatorioNiveis: ["I", "II", "III", "IV"] },
  { id: "g3", pilar: "governança", acaoId: 9, descricao: "Código de Ética e de Conduta", obrigatorioNiveis: ["I", "II", "III", "IV"] },
  { id: "g4", pilar: "governança", acaoId: 10, descricao: "Políticas de Investimentos", obrigatorioNiveis: ["I", "II", "III", "IV"] },
  { id: "g5", pilar: "governança", acaoId: 11, descricao: "Comitê de Investimentos", obrigatorioNiveis: ["I", "II", "III", "IV"] },
  { id: "g6", pilar: "governança", acaoId: 12, descricao: "Transparência", obrigatorioNiveis: ["I", "II", "III", "IV"] },
  { id: "g7", pilar: "governança", acaoId: 13, descricao: "Ouvidoria", obrigatorioNiveis: ["I", "II", "III", "IV"] },
  { id: "g8", pilar: "governança", acaoId: 14, descricao: "Diretoria Executiva", obrigatorioNiveis: ["I", "II", "III", "IV"] },
  { id: "g9", pilar: "governança", acaoId: 15, descricao: "Conselho de Administração, Deliberativo ou Curador", obrigatorioNiveis: ["I", "II", "III", "IV"] },
  { id: "g10", pilar: "governança", acaoId: 16, descricao: "Conselho Fiscal", obrigatorioNiveis: ["I", "II", "III", "IV"] },
  { id: "g11", pilar: "governança", acaoId: 17, descricao: "Gestão de Pessoas", obrigatorioNiveis: ["III", "IV"] },
  { id: "g12", pilar: "governança", acaoId: 18, descricao: "Mandato, Representação e Recondução", obrigatorioNiveis: ["I", "II", "III", "IV"] },
  { id: "g13", pilar: "governança", acaoId: 19, descricao: "Segregação das Atividades", obrigatorioNiveis: ["I", "II", "III", "IV"] },
  { id: "g14", pilar: "governança", acaoId: 20, descricao: "Gestão Atuarial", obrigatorioNiveis: ["I", "II", "III", "IV"] },
  { id: "g15", pilar: "governança", acaoId: 21, descricao: "Sistema de Gestão de Riscos", obrigatorioNiveis: ["IV"] },
  { id: "g16", pilar: "governança", acaoId: 22, descricao: "Controle Interno (no RPPS)", obrigatorioNiveis: ["IV"] },

  // Educação Previdenciária
  { id: "e1", pilar: "educação", acaoId: 23, descricao: "Plano de Ação de Educação Previdenciária", obrigatorioNiveis: ["I", "II", "III", "IV"] },
  { id: "e2", pilar: "educação", acaoId: 24, descricao: "Ações de Diálogo com os Segurados e a Sociedade", obrigatorioNiveis: ["I", "II", "III", "IV"] },
];
