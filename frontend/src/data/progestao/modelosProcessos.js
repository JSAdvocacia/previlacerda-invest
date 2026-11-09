export const modelosProcessosProGestao = [
  {
    cadeiaValor: 'Operacional',
    macroprocesso: 'Gestão de Passivos',
    nome: 'Arrecadação',
    objetivo: 'Gerenciar o recebimento das contribuições previdenciárias.',
    entradas: 'Informação do servidor cedido, Dados da folha',
    saidas: 'Pagamento das guias, Notificações de cobrança',
    recursos: 'Sistema de Arrecadação, Guias',
    responsavel: 'Setor Financeiro',
    subprocessos: [
      {
        id: 'sub_arr_1',
        nome: 'Gestão da Guia de Recolhimento',
        atividades: [
          { id: 'ativ_arr_1_1', nome: 'Cadastra o Órgão' },
          { id: 'ativ_arr_1_2', nome: 'Gerar e emitir a Guia de Recolhimento' },
          { id: 'ativ_arr_1_3', nome: 'Encaminhar Guia para pagamento' }
        ]
      },
      {
        id: 'sub_arr_2',
        nome: 'Acompanhamento do Pagamento',
        atividades: [
          { id: 'ativ_arr_2_1', nome: 'Acompanhar o pagamento das Guias mensalmente' },
          { id: 'ativ_arr_2_2', nome: 'Elaborar Notificação de Cobrança (se não pago)' },
          { id: 'ativ_arr_2_3', nome: 'Encaminhar Notificação de cobrança e nova Guia' }
        ]
      }
    ]
  },
  {
    cadeiaValor: 'Operacional',
    macroprocesso: 'Gestão de Passivos',
    nome: 'Aposentadoria Compulsória',
    objetivo: 'Conceder benefício de aposentadoria compulsória ao servidor.',
    entradas: 'Solicitação da Prefeitura, Documentação do Servidor',
    saidas: 'Emissão e publicação de Ato, Envio ao TCE/SC',
    recursos: 'Sistemas de RH, Pareceres',
    responsavel: 'Setor de Benefícios',
    subprocessos: [
      {
        id: 'sub_comp_1',
        nome: 'Solicitação e Autuação',
        atividades: [
          { id: 'ativ_comp_1_1', nome: 'Enviar solicitação de aposentadoria (Prefeitura)' },
          { id: 'ativ_comp_1_2', nome: 'Realizar pedido de Benefício e fazer juntada de documento (Protocolo)' }
        ]
      },
      {
        id: 'sub_comp_2',
        nome: 'Análise e Complementação',
        atividades: [
          { id: 'ativ_comp_2_1', nome: 'Analisa a documentação encaminhada' },
          { id: 'ativ_comp_2_2', nome: 'Solicitar a servidor via Carta de Exigência documentos faltantes' }
        ]
      },
      {
        id: 'sub_comp_3',
        nome: 'Análise Jurídica e Decisão',
        atividades: [
          { id: 'ativ_comp_3_1', nome: 'Analisa documentação (Jurídico)' },
          { id: 'ativ_comp_3_2', nome: 'Emitir e encaminhar parecer do processo' },
          { id: 'ativ_comp_3_3', nome: 'Analisar o parecer do processo (Diretoria)' }
        ]
      },
      {
        id: 'sub_comp_4',
        nome: 'Emissão de Ato e Conclusão',
        atividades: [
          { id: 'ativ_comp_4_1', nome: 'Juntar documentação e fazer cálculo de pagamento' },
          { id: 'ativ_comp_4_2', nome: 'Emitir Ato' },
          { id: 'ativ_comp_4_3', nome: 'Incluir aposentado na Folha de Pagamento (RH)' },
          { id: 'ativ_comp_4_4', nome: 'Publicação de Ato no DOM' },
          { id: 'ativ_comp_4_5', nome: 'Envio do processo ao TCE/SC' }
        ]
      }
    ]
  },
  {
    cadeiaValor: 'Operacional',
    macroprocesso: 'Gestão de Passivos',
    nome: 'Aposentadoria Especial',
    objetivo: 'Conceder benefício de aposentadoria especial ao servidor.',
    entradas: 'Pedido do Servidor, Laudos Periciais',
    saidas: 'Ato publicado, Envio ao TCE/SC',
    recursos: 'Laudos Médicos, Sistema RPPS',
    responsavel: 'Setor de Benefícios',
    subprocessos: [
      {
        id: 'sub_esp_1',
        nome: 'Solicitação e Perícia',
        atividades: [
          { id: 'ativ_esp_1_1', nome: 'Solicita por ofício pedido (Servidor)' },
          { id: 'ativ_esp_1_2', nome: 'Agendamento de Exames junto à Perícia Médica' },
          { id: 'ativ_esp_1_3', nome: 'Realiza os exames exigidos (Perícia Médica)' }
        ]
      },
      {
        id: 'sub_esp_2',
        nome: 'Autuação e Análise',
        atividades: [
          { id: 'ativ_esp_2_1', nome: 'Realizar pedido e fazer juntada de documentos' },
          { id: 'ativ_esp_2_2', nome: 'Analisa documentação (Jurídico)' },
          { id: 'ativ_esp_2_3', nome: 'Emitir e encaminhar parecer' }
        ]
      },
      {
        id: 'sub_esp_3',
        nome: 'Conclusão',
        atividades: [
          { id: 'ativ_esp_3_1', nome: 'Analisar parecer (Diretoria)' },
          { id: 'ativ_esp_3_2', nome: 'Emitir Ato e Incluir na Folha' },
          { id: 'ativ_esp_3_3', nome: 'Publicação no DOM e Envio ao TCE/SC' }
        ]
      }
    ]
  },
  {
    cadeiaValor: 'Operacional',
    macroprocesso: 'Gestão de Passivos',
    nome: 'Aposentadoria por Invalidez',
    objetivo: 'Conceder aposentadoria por invalidez.',
    entradas: 'Atestado Médico',
    saidas: 'Ato de aposentadoria por invalidez',
    recursos: 'Perícia Médica, Protocolo',
    responsavel: 'Setor de Benefícios',
    subprocessos: [
      {
        id: 'sub_inv_1',
        nome: 'Avaliação Pericial',
        atividades: [
          { id: 'ativ_inv_1_1', nome: 'Apresenta atestado médico para avaliação' },
          { id: 'ativ_inv_1_2', nome: 'Realiza os exames exigidos' }
        ]
      },
      {
        id: 'sub_inv_2',
        nome: 'Análise e Emissão',
        atividades: [
          { id: 'ativ_inv_2_1', nome: 'Juntar documentação e fazer pedido' },
          { id: 'ativ_inv_2_2', nome: 'Análise Jurídica e Parecer' },
          { id: 'ativ_inv_2_3', nome: 'Emitir Ato, Incluir na Folha e Publicar' }
        ]
      }
    ]
  },
  {
    cadeiaValor: 'Operacional',
    macroprocesso: 'Gestão de Passivos',
    nome: 'Pensão por Morte',
    objetivo: 'Conceder pensão por morte aos beneficiários legais.',
    entradas: 'Solicitação do Beneficiário, Certidão de Óbito',
    saidas: 'Ato de Pensão',
    recursos: 'Protocolo, Parecer Jurídico',
    responsavel: 'Setor de Benefícios',
    subprocessos: [
      {
        id: 'sub_pensao_1',
        nome: 'Solicitação e Conferência',
        atividades: [
          { id: 'ativ_pensao_1_1', nome: 'Solicita a pensão por morte' },
          { id: 'ativ_pensao_1_2', nome: 'Analisa documentação e solicita pendências' }
        ]
      },
      {
        id: 'sub_pensao_2',
        nome: 'Parecer e Ato',
        atividades: [
          { id: 'ativ_pensao_2_1', nome: 'Análise Jurídica e Emissão de Parecer' },
          { id: 'ativ_pensao_2_2', nome: 'Analisar Parecer e Emitir Ato de concessão (Diretoria)' },
          { id: 'ativ_pensao_2_3', nome: 'Encaminhar para RH fazer os cálculos e Incluir na Folha' },
          { id: 'ativ_pensao_2_4', nome: 'Inclui e publica no DOM e Arquiva processo' }
        ]
      }
    ]
  },
  {
    cadeiaValor: 'Suporte',
    macroprocesso: 'Processos de Apoio',
    nome: 'Processo Jurídico',
    objetivo: 'Analisar e emitir pareceres e recursos jurídicos.',
    entradas: 'Solicitação de outros setores, Ações Judiciais',
    saidas: 'Pareceres, Defesas e Recursos',
    recursos: 'Sistemas Judiciais, Biblioteca Jurídica',
    responsavel: 'Setor Jurídico',
    subprocessos: [
      {
        id: 'sub_jur_1',
        nome: 'Ações e Pareceres Iniciais',
        atividades: [
          { id: 'ativ_jur_1_1', nome: 'Protocolar ações iniciais ou defesas iniciais' },
          { id: 'ativ_jur_1_2', nome: 'Elaborar pareceres jurídicos ao setor solicitante' }
        ]
      },
      {
        id: 'sub_jur_2',
        nome: 'Acompanhamento e Recursos',
        atividades: [
          { id: 'ativ_jur_2_1', nome: 'Monitorar decisões judiciais' },
          { id: 'ativ_jur_2_2', nome: 'Analisar decisões judiciais' },
          { id: 'ativ_jur_2_3', nome: 'Elaborar recurso do processo (se cabível)' }
        ]
      },
      {
        id: 'sub_jur_3',
        nome: 'Conclusão',
        atividades: [
          { id: 'ativ_jur_3_1', nome: 'Emissão de decisões judiciais (Órgãos)' },
          { id: 'ativ_jur_3_2', nome: 'Baixar processo e arquivar' }
        ]
      }
    ]
  },
  {
    cadeiaValor: 'Operacional',
    macroprocesso: 'Gestão de Passivos',
    nome: 'Aposentadoria Voluntária',
    objetivo: 'Analisar e conceder aposentadoria voluntária.',
    entradas: 'Pedido do Servidor',
    saidas: 'Emissão e publicação de Ato',
    recursos: 'Sistemas de RH, Pareceres',
    responsavel: 'Setor de Benefícios',
    subprocessos: [
      {
        id: 'sub_vol_1',
        nome: 'Solicitação e Verificação',
        atividades: [
          { id: 'ativ_vol_1_1', nome: 'Solicita o pedido de aposentadoria (Servidor)' },
          { id: 'ativ_vol_1_2', nome: 'Verificação de preenchimento de requisitos' }
        ]
      },
      {
        id: 'sub_vol_2',
        nome: 'Autuação e Análises',
        atividades: [
          { id: 'ativ_vol_2_1', nome: 'Realizar pedido e juntada de documentos' },
          { id: 'ativ_vol_2_2', nome: 'Análise Jurídica e Parecer' }
        ]
      },
      {
        id: 'sub_vol_3',
        nome: 'Conclusão',
        atividades: [
          { id: 'ativ_vol_3_1', nome: 'Emitir Ato e Calcular pagamento' },
          { id: 'ativ_vol_3_2', nome: 'Incluir na Folha e Publicar no DOM' },
          { id: 'ativ_vol_3_3', nome: 'Envio ao TCE/SC' }
        ]
      }
    ]
  },
  {
    cadeiaValor: 'Operacional',
    macroprocesso: 'Gestão de Passivos',
    nome: 'Geração de Folha de Pagamento',
    objetivo: 'Gerar e processar a folha de pagamento de aposentados e pensionistas.',
    entradas: 'Novos Cadastros, Arquivos de descontos',
    saidas: 'Arquivos bancários, Relatórios contábeis',
    recursos: 'Sistema de Folha',
    responsavel: 'Folha de Pagamento',
    subprocessos: [
      {
        id: 'sub_folha_1',
        nome: 'Atualização de Base',
        atividades: [
          { id: 'ativ_folha_1_1', nome: 'Encaminhar novos para inclusão' },
          { id: 'ativ_folha_1_2', nome: 'Inserir e Cadastrar novos beneficiários' },
          { id: 'ativ_folha_1_3', nome: 'Importar e lançar arquivos de descontos' },
          { id: 'ativ_folha_1_4', nome: 'Cancelar beneficiários por óbito / Cancelar pensões' }
        ]
      },
      {
        id: 'sub_folha_2',
        nome: 'Cálculo e Geração',
        atividades: [
          { id: 'ativ_folha_2_1', nome: 'Calcular Folha de Pagamento' },
          { id: 'ativ_folha_2_2', nome: 'Conferência de valores' }
        ]
      },
      {
        id: 'sub_folha_3',
        nome: 'Fechamento e Relatórios',
        atividades: [
          { id: 'ativ_folha_3_1', nome: 'Gerar arquivo bancário e Financeiro' },
          { id: 'ativ_folha_3_2', nome: 'Enviar arquivo para Instituição bancária' },
          { id: 'ativ_folha_3_3', nome: 'Emitir e enviar relatório para Contabilidade' }
        ]
      }
    ]
  },
  {
    cadeiaValor: 'Operacional',
    macroprocesso: 'Gestão de Ativos',
    nome: 'Elaboração da Política de Investimentos',
    objetivo: 'Aprovar e publicar a Política de Investimentos (PI).',
    entradas: 'Resultados do Ano Anterior, Requisitos legais',
    saidas: 'Política Aprovada, Publicação na SPREV',
    recursos: 'Consultoria, Atas do Comitê/Conselho',
    responsavel: 'Comitê de Investimentos',
    subprocessos: [
      {
        id: 'sub_pi_1',
        nome: 'Elaboração e Revisão',
        atividades: [
          { id: 'ativ_pi_1_1', nome: 'Avaliar resultados do ano anterior' },
          { id: 'ativ_pi_1_2', nome: 'Elaborar e revisar minuta da nova PI' },
          { id: 'ativ_pi_1_3', nome: 'Encaminhar para análise da consultoria' }
        ]
      },
      {
        id: 'sub_pi_2',
        nome: 'Aprovação',
        atividades: [
          { id: 'ativ_pi_2_1', nome: 'Analisar e fazer ajustes (Consultoria/Comitê)' },
          { id: 'ativ_pi_2_2', nome: 'Encaminhar PI para aprovação do Conselho' },
          { id: 'ativ_pi_2_3', nome: 'Analisar e aprovar a nova PI (Conselho)' }
        ]
      },
      {
        id: 'sub_pi_3',
        nome: 'Publicação',
        atividades: [
          { id: 'ativ_pi_3_1', nome: 'Encaminhar para publicação no site do Instituto' },
          { id: 'ativ_pi_3_2', nome: 'Envio a SPREV através do DPIN via CADPREV' }
        ]
      }
    ]
  },
  {
    cadeiaValor: 'Operacional',
    macroprocesso: 'Gestão de Ativos',
    nome: 'Credenciamento das Instituições Financeiras',
    objetivo: 'Analisar documentação para credenciar instituições no RPPS.',
    entradas: 'Edital, Documentação de Fundos/Bancos',
    saidas: 'Instituições Credenciadas publicadas',
    recursos: 'Site do RPPS, Pareceres',
    responsavel: 'Comitê de Investimentos',
    subprocessos: [
      {
        id: 'sub_cred_1',
        nome: 'Abertura de Credenciamento',
        atividades: [
          { id: 'ativ_cred_1_1', nome: 'Lança o Edital com regras' },
          { id: 'ativ_cred_1_2', nome: 'Receber documentação das Instituições' }
        ]
      },
      {
        id: 'sub_cred_2',
        nome: 'Avaliação e Decisão',
        atividades: [
          { id: 'ativ_cred_2_1', nome: 'Avalia a documentação para Credenciamento' },
          { id: 'ativ_cred_2_2', nome: 'Solicita parecer' }
        ]
      },
      {
        id: 'sub_cred_3',
        nome: 'Publicação e Monitoramento',
        atividades: [
          { id: 'ativ_cred_3_1', nome: 'Publica lista de Instituições credenciadas no site' },
          { id: 'ativ_cred_3_2', nome: 'Monitora Instituição credenciada' }
        ]
      }
    ]
  },
  {
    cadeiaValor: 'Operacional',
    macroprocesso: 'Gestão de Passivos',
    nome: 'Revisão de Aposentadorias e Pensões',
    objetivo: 'Realizar a revisão de benefícios previdenciários.',
    entradas: 'Solicitação de Revisão, Documentação atualizada',
    saidas: 'Ato de Revisão Publicado',
    recursos: 'Processos Antigos, Sistema de RH',
    responsavel: 'Setor de Benefícios',
    subprocessos: [
      {
        id: 'sub_rev_1',
        nome: 'Solicitação',
        atividades: [
          { id: 'ativ_rev_1_1', nome: 'Solicita revisão (Beneficiário)' },
          { id: 'ativ_rev_1_2', nome: 'Analisa documentação para revisão' }
        ]
      },
      {
        id: 'sub_rev_2',
        nome: 'Análise e Aprovação',
        atividades: [
          { id: 'ativ_rev_2_1', nome: 'Análise Jurídica e Emissão de Parecer' },
          { id: 'ativ_rev_2_2', nome: 'Análise pela Diretoria e Decisão' }
        ]
      },
      {
        id: 'sub_rev_3',
        nome: 'Aplicação',
        atividades: [
          { id: 'ativ_rev_3_1', nome: 'Encaminhar para RH aplicar as revisões' },
          { id: 'ativ_rev_3_2', nome: 'Inclui e publica no DOM' }
        ]
      }
    ]
  },
  {
    cadeiaValor: 'Suporte',
    macroprocesso: 'Tecnologia da Informação',
    nome: 'Controle de Acesso',
    objetivo: 'Gerenciar o acesso a sistemas e instalações físicas.',
    entradas: 'Solicitação por protocolo',
    saidas: 'Autorização/Registro de Acesso',
    recursos: 'Sistemas de TI',
    responsavel: 'Atendimento / TI',
    subprocessos: [
      {
        id: 'sub_acesso_1',
        nome: 'Solicitação e Verificação',
        atividades: [
          { id: 'ativ_acesso_1_1', nome: 'Recebe solicitação de Acesso' },
          { id: 'ativ_acesso_1_2', nome: 'Verifica se existe autorização' }
        ]
      },
      {
        id: 'sub_acesso_2',
        nome: 'Registros',
        atividades: [
          { id: 'ativ_acesso_2_1', nome: 'Fazer o registro de entrada' },
          { id: 'ativ_acesso_2_2', nome: 'Encaminhar para setor autorizado' }
        ]
      },
      {
        id: 'sub_acesso_3',
        nome: 'Saída e Conferência',
        atividades: [
          { id: 'ativ_acesso_3_1', nome: 'Registrar saída e verificar entrega de documentos' },
          { id: 'ativ_acesso_3_2', nome: 'Verificar com responsável do Setor se tudo está OK' }
        ]
      }
    ]
  },
  {
    cadeiaValor: 'Suporte',
    macroprocesso: 'Tecnologia da Informação',
    nome: 'Planos de Contingências',
    objetivo: 'Elaborar e testar planos de recuperação e contingência de TI.',
    entradas: 'Solicitação / Planejamento',
    saidas: 'Planos Aprovados e Monitorados',
    recursos: 'Infraestrutura de TI, Backups',
    responsavel: 'Área de TI',
    subprocessos: [
      {
        id: 'sub_contig_1',
        nome: 'Elaboração e Aprovação',
        atividades: [
          { id: 'ativ_contig_1_1', nome: 'Solicitar elaboração de planos' },
          { id: 'ativ_contig_1_2', nome: 'Elaborar estratégias de contingências' },
          { id: 'ativ_contig_1_3', nome: 'Analisar planos (Diretoria)' }
        ]
      },
      {
        id: 'sub_contig_2',
        nome: 'Execução e Monitoramento',
        atividades: [
          { id: 'ativ_contig_2_1', nome: 'Aplicar planos de recuperação e backup' },
          { id: 'ativ_contig_2_2', nome: 'Monitorar execução do plano' }
        ]
      }
    ]
  }
];
