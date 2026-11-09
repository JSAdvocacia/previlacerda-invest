// Guia Prático de Auditoria e Critérios de Aceitação SPREV para as 24 Ações do Pró-Gestão RPPS

export const guiasAuditoriaSPREV = {
  1: {
    titulo: 'Mapeamento de Processos',
    pilar: 'Controle Interno',
    objetivo: 'Identificar, estruturar e padronizar os fluxos de trabalho essenciais da gestão previdenciária.',
    oQueAuditorVerifica: [
      'Existência de mapeamento formal para os 5 processos obrigatórios: Arrecadação/Cobrança, Concessão de Benefícios, Manutenção/Folha de Pagamentos, Gestão de Investimentos e Compensação Previdenciária (Comprev).',
      'Definição clara de entradas (Inputs), saídas (Outputs), fornecedores (Suppliers) e clientes (Customers) no modelo SIPOC.',
      'Identificação dos responsáveis por cada etapa e controles de riscos operacionais associados.'
    ],
    evidenciasAceitas: [
      'Documento do Mapeamento de Processos formalizado com data e assinatura do gestor.',
      'Diagramas/fluxogramas de processos (SIPOC ou BPMN).',
      'Portaria ou Resolução que aprova os mapeamentos no âmbito do RPPS.'
    ],
    errosComuns: [
      'Mapear apenas 1 ou 2 processos esquecendo Compensação (Comprev) ou Arrecadação.',
      'Apresentar fluxogramas genéricos sem detalhar as atividades práticas e pontos de controle.',
      'Ausência de ato formal de aprovação pela Diretoria Executiva.'
    ],
    dicaOuro: 'Utilize o exportador de PDF do sistema na Linha de Produção, pois ele já gera o documento formalizado no padrão aceito pelos auditores credenciados.'
  },
  2: {
    titulo: 'Manualização de Processos',
    pilar: 'Controle Interno',
    objetivo: 'Documentar de forma prática e detalhada "como fazer" cada atividade dos processos mapeados, garantindo a continuidade do serviço público.',
    oQueAuditorVerifica: [
      'Manuais de procedimentos operacionais padrão (POPs) cobrindo todos os processos mapeados.',
      'Detalhamento prático de cada etapa com telas de sistemas, prazos limites e formulários utilizados.',
      'Previsão de revisões periódicas e controle de versões.'
    ],
    evidenciasAceitas: [
      'Manuais de Procedimentos Operacionais aprovados por ato normativo.',
      'Comprovante de disponibilização aos servidores do RPPS (e-mail, intranet ou publicação).',
      'Registro de treinamento ou ciência dos servidores envolvidos.'
    ],
    errosComuns: [
      'Manuais copiados de outros entes que mencionam sistemas ou cargos inexistentes no município.',
      'Campos de "Como Fazer" vagos ou em branco.',
      'Falta de indicação de data de vigência e versão.'
    ],
    dicaOuro: 'Certifique-se de salvar o Manual gerado diretamente nas Evidências do sistema para manter a rastreabilidade.'
  },
  3: {
    titulo: 'Capacitação e Qualificação dos Gestores e Servidores',
    pilar: 'Controle Interno',
    objetivo: 'Garantir que dirigentes, membros dos conselhos e comitê de investimentos atendam aos requisitos legais de certificação e capacitação contínua.',
    oQueAuditorVerifica: [
      'Certificação profissional válida e reconhecida pela SPREV (CPRP, CGRP, CP-RPPS, etc.) para dirigentes e membros.',
      'Plano Anual de Capacitação (PAC) aprovado para o exercício vigente.',
      'Comprovação de formação acadêmica superior e inexistência de condenações (certidões negativas).'
    ],
    evidenciasAceitas: [
      'Certificados de qualificação emitidos por instituições credenciadas pela SPREV.',
      'Plano Anual de Capacitação formalizado com cronograma e orçamento.',
      'Atos de nomeação e posse dos dirigentes e conselheiros acompanhados das certidões de antecedentes.'
    ],
    errosComuns: [
      'Certificações profissionais vencidas ou de entidades não homologadas pelo Ministério da Previdência.',
      'Falta do Plano Anual de Capacitação aprovado em ata do Conselho Deliberativo.',
      'Ausência de capacitação específica para os conselheiros recém-empossados.'
    ],
    dicaOuro: 'Cadastre todos os membros na Ação 3 da Linha de Produção e anexe os certificados para gerar a matriz de conformidade automática.'
  },
  4: {
    titulo: 'Estrutura de Controle Interno',
    pilar: 'Controle Interno',
    objetivo: 'Instituir mecanismos autônomos de fiscalização preventiva, auditoria e conformidade dos atos de gestão.',
    oQueAuditorVerifica: [
      'Ato normativo (Lei ou Decreto) que institui a Unidade ou Responsável pelo Controle Interno do RPPS.',
      'Relatórios periódicos de controle interno emitidos com apontamentos e planos de providências.',
      'Segregação de funções entre o executor do ato e o controlador.'
    ],
    evidenciasAceitas: [
      'Portaria de designação do Responsável pelo Controle Interno.',
      'Plano Anual de Auditoria Interna / Controle Interno.',
      'Pelo menos 2 Relatórios de Acompanhamento do Controle Interno com ciência do Dirigente.'
    ],
    errosComuns: [
      'Designar para o Controle Interno servidor que executa pagamentos ou investimentos (conflito de interesse).',
      'Apenas ter a lei sem apresentar nenhum relatório prático de fiscalização emitido.'
    ],
    dicaOuro: 'Gere a minuta de Regulamento do Controle Interno pelo Gerador de Minutas e junte com o primeiro relatório semestral.'
  },
  5: {
    titulo: 'Política de Segurança da Informação (PSI)',
    pilar: 'Controle Interno',
    objetivo: 'Proteger os dados cadastrais, financeiros e previdenciários dos segurados e garantir a integridade dos sistemas.',
    oQueAuditorVerifica: [
      'Política de Segurança da Informação formalmente instituída e divulgada.',
      'Rotinas estabelecidas de backup em nuvem ou local seguro e testes periódicos de restauração.',
      'Controle de acesso aos sistemas por perfil de usuário com política de senhas fortes.'
    ],
    evidenciasAceitas: [
      'Portaria ou Resolução de aprovação da PSI.',
      'Termos de Confidencialidade e Sigilo assinados pelos servidores e terceiros.',
      'Relatório de execução e teste de restauração de backup.'
    ],
    errosComuns: [
      'Apresentar uma política genérica sem comprovar que os servidores assinaram o termo de ciência.',
      'Não ter registros de testes de restauração de backup.'
    ],
    dicaOuro: 'Utilize o modelo estruturado de PSI da plataforma, personalize para seu RPPS e colha a assinatura da diretoria.'
  },
  6: {
    titulo: 'Código de Ética e de Conduta',
    pilar: 'Governança Corporativa',
    objetivo: 'Estabelecer os princípios éticos, deveres e vedações aplicáveis a dirigentes, conselheiros e servidores do RPPS.',
    oQueAuditorVerifica: [
      'Código de Ética próprio aprovado pela Diretoria e pelo Conselho Deliberativo.',
      'Criação de Comissão de Ética ou canal para recebimento de denúncias e dúvidas éticas.',
      'Ampla divulgação aos segurados e servidores no portal da transparência.'
    ],
    evidenciasAceitas: [
      'Resolução/Portaria de publicação do Código de Ética.',
      'Termos de Adesão/Compromisso Ético assinados por gestores e conselheiros.',
      'Link de publicação na página oficial do RPPS.'
    ],
    errosComuns: [
      'Utilizar o código geral da Prefeitura sem adaptações às especificidades previdenciárias e de investimentos.',
      'Falta de previsão de canal ou comissão para apuração.'
    ],
    dicaOuro: 'O modelo base da biblioteca de minutas já possui cláusulas específicas sobre conflito de interesse em investimentos.'
  },
  7: {
    titulo: 'Ouvidoria e Pesquisa de Satisfação',
    pilar: 'Governança Corporativa',
    objetivo: 'Disponibilizar canais estruturados para acolher manifestações dos segurados e mensurar a qualidade dos serviços.',
    oQueAuditorVerifica: [
      'Canal formal de Ouvidoria ativo (presencial, e-mail, telefone ou sistema web).',
      'Relatório anual da Ouvidoria com estatística de prazos e respostas aos cidadãos.',
      'Pesquisa de Satisfação aplicada junto aos segurados com tabulação dos resultados.'
    ],
    evidenciasAceitas: [
      'Normativo de criação e regulamento da Ouvidoria.',
      'Relatório Anual de Atendimento da Ouvidoria.',
      'Relatório com gráficos e resultados da Pesquisa de Satisfação anual.'
    ],
    errosComuns: [
      'Ter apenas um e-mail geral "fale conosco" sem controle de protocolo e prazos de resposta.',
      'Aplicar a pesquisa mas não publicar a tabulação dos resultados.'
    ],
    dicaOuro: 'Documente os canais de atendimento no portal da transparência e faça um relatório semestral simples de atendimentos.'
  },
  8: {
    titulo: 'Planejamento Estratégico',
    pilar: 'Governança Corporativa',
    objetivo: 'Definir a visão de futuro, missão, valores, objetivos estratégicos e metas plurianuais do RPPS.',
    oQueAuditorVerifica: [
      'Documento do Planejamento Estratégico com vigência definida (mínimo de 3 a 4 anos).',
      'Mapa estratégico com objetivos nas perspectivas: Segurados, Processos Internos, Governança/Financeira e Pessoas.',
      'Indicadores de desempenho (KPIs) com metas claras e reuniões periódicas de monitoramento.'
    ],
    evidenciasAceitas: [
      'Ato de aprovação do Planejamento Estratégico pelo Conselho Deliberativo.',
      'Documento consolidado do Planejamento Estratégico.',
      'Ata de Reunião de Acompanhamento das Metas do Planejamento.'
    ],
    errosComuns: [
      'Apresentar metas vagas sem indicadores numéricos mensuráveis.',
      'Não comprovar que o plano foi apreciado e aprovado pelo Conselho Deliberativo.'
    ],
    dicaOuro: 'Utilize a aba "Planejamento" na Linha de Produção para preencher a matriz e exportar o relatório oficial em PDF.'
  },
  9: {
    titulo: 'Transparência e Prestação de Contas',
    pilar: 'Governança Corporativa',
    objetivo: 'Garantir o acesso público e facilitado às informações financeiras, atuariais e administrativas do RPPS.',
    oQueAuditorVerifica: [
      'Portal da Transparência atualizado com relatórios da Lei 9.717/98 e Portaria SPREV.',
      'Publicação de balancetes, atas de conselhos, DAIR, DPIN, demonstrativos de investimentos e avaliação atuarial.',
      'Facilidade de navegação e linguagem cidadã.'
    ],
    evidenciasAceitas: [
      'Relatório com print das páginas do site oficial e links diretos para cada relatório.',
      'Comprovantes de envio de informações ao CADPREV dentro dos prazos legais.'
    ],
    errosComuns: [
      'Links quebrados no portal da transparência ou documentos desatualizados há mais de 90 dias.',
      'Publicar apenas relatórios técnicos sem sumário executivo em linguagem clara.'
    ],
    dicaOuro: 'Monte uma folha de rosto de evidência contendo os links diretos para cada publicação no portal da transparência.'
  },
  10: {
    titulo: 'Comitê de Investimentos',
    pilar: 'Governança Corporativa',
    objetivo: 'Assessorar a diretoria nas decisões de alocação de recursos em conformidade com a Resolução CMN.',
    oQueAuditorVerifica: [
      'Regimento Interno do Comitê de Investimentos aprovado.',
      'Membros formalmente nomeados com certificação CGRPPS/CPRP vigente (maioria ou totalidade conforme nível).',
      'Atas mensais de reunião com análise técnica de cenários e fundos de investimentos.'
    ],
    evidenciasAceitas: [
      'Regimento Interno e Portaria de nomeação dos membros.',
      'Certificados profissionais válidos de todos os integrantes.',
      'Pelo menos as últimas 6 atas mensais consecutivas de reunião do Comitê.'
    ],
    errosComuns: [
      'Atas genéricas que apenas registram "reuniram-se para falar de investimentos" sem análise técnica de risco e retorno.',
      'Membros sem certificação válida.'
    ],
    dicaOuro: 'Organize as atas em ordem cronológica com as respectivas assinaturas em PDF único para anexar nas Evidências.'
  }
};

export const getGuiaAuditoria = (acaoId) => {
  return guiasAuditoriaSPREV[acaoId] || {
    titulo: `Ação ${acaoId}`,
    pilar: 'Pró-Gestão RPPS',
    objetivo: 'Atendimento aos requisitos e diretrizes estabelecidas no Manual do Pró-Gestão da SPREV.',
    oQueAuditorVerifica: [
      'Existência de ato formal de aprovação da diretoria ou conselhos.',
      'Comprovação de efetiva execução e aplicação prática no RPPS.',
      'Divulgação e transparência dos atos aos segurados.'
    ],
    evidenciasAceitas: [
      'Normativo, portaria ou resolução vigente.',
      'Relatórios e comprovantes de publicação.',
      'Atas de reuniões deliberativas.'
    ],
    errosComuns: [
      'Apresentar minutas sem data ou sem assinatura.',
      'Documento com vigência expirada sem renovação.'
    ],
    dicaOuro: 'Elabore a minuta pela Linha de Produção, colete as assinaturas e anexe o comprovante com o selo de validação.'
  };
};
