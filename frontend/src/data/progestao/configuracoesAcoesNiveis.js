// Configurações, requisitos e diretrizes oficiais por Nível (I, II, III, IV) para as 24 Ações do Pró-Gestão RPPS

export const DIRETRIZES_POR_NIVEL = {
  // AÇÃO 1: Mapeamento de Processos
  1: {
    I: {
      status: 'Recomendado',
      exigencia: 'Mapeamento simplificado dos fluxos principais de concessão de aposentadorias e pensões.',
      processosObrigatorios: ['Concessão de Benefícios'],
      foco: 'Identificar as etapas básicas do protocolo até a homologação do benefício.'
    },
    II: {
      status: 'Obrigatório',
      exigencia: 'Mapeamento formal dos 3 macroprocessos essenciais: Concessão de Benefícios, Arrecadação/Cobrança e Gestão de Investimentos.',
      processosObrigatorios: ['Concessão de Benefícios', 'Arrecadação e Cobrança', 'Investimentos'],
      foco: 'Definição de entradas, saídas, responsáveis e fluxos com modelo SIPOC.'
    },
    III: {
      status: 'Obrigatório',
      exigencia: 'Mapeamento completo dos 5 macroprocessos previdenciários, incluindo Compensação Previdenciária (Comprev) e Folha de Pagamentos.',
      processosObrigatorios: ['Concessão de Benefícios', 'Arrecadação e Cobrança', 'Investimentos', 'Compensação Previdenciária (Comprev)', 'Manutenção/Folha'],
      foco: 'Modelagem detalhada em BPMN/SIPOC com pontos de controle de risco identificados.'
    },
    IV: {
      status: 'Obrigatório',
      exigencia: 'Mapeamento de ponta a ponta de todos os processos finalísticos e de suporte, com integração direta à Matriz de Riscos e Indicadores de Desempenho (KPIs).',
      processosObrigatorios: ['Concessão de Benefícios', 'Arrecadação e Cobrança', 'Investimentos', 'Compensação Previdenciária (Comprev)', 'Manutenção/Folha', 'Atendimento/Ouvidoria', 'Controle Interno'],
      foco: 'Automação de fluxos, governança de processos com revisões anuais obrigatórias e auditoria de conformidade.'
    }
  },

  // AÇÃO 2: Manualização de Processos
  2: {
    I: {
      status: 'Recomendado',
      exigencia: 'Roteiros operacionais básicos e formulários padronizados para requerimento de aposentadoria e pensão.',
      processosObrigatorios: ['Concessão de Benefícios'],
      foco: 'Garantir que os passos essenciais de concessão estejam registrados por escrito.'
    },
    II: {
      status: 'Obrigatório',
      exigencia: 'Manuais de Procedimentos Operacionais Padrão (POPs) cobrindo Benefícios, Arrecadação e Investimentos.',
      processosObrigatorios: ['Concessão de Benefícios', 'Arrecadação e Cobrança', 'Investimentos'],
      foco: 'Instruções passo a passo com telas de sistemas, modelos de certidões e prazos regulamentares.'
    },
    III: {
      status: 'Obrigatório',
      exigencia: 'Manuais operacionais completos para as 5 áreas com controle de versões e publicação oficial.',
      processosObrigatorios: ['Concessão de Benefícios', 'Arrecadação e Cobrança', 'Investimentos', 'Compensação Previdenciária (Comprev)', 'Manutenção/Folha'],
      foco: 'Padronização total dos POPs, ciência formal de 100% dos servidores da equipe e revisão bienal.'
    },
    IV: {
      status: 'Obrigatório',
      exigencia: 'Manuais integrados com trilha de auditoria digital, SLA de atendimento por atividade e governança de melhoria contínua.',
      processosObrigatorios: ['Todos os Processos Institucionais'],
      foco: 'Manuais eletrônicos interativos, integrados ao sistema de gestão de riscos e comitê de melhoria de processos.'
    }
  },

  // AÇÃO 3: Capacitação e Certificação
  3: {
    I: {
      status: 'Obrigatório',
      exigencia: 'Dirigente Máximo com certificação básica SPREV (CP RPPS CDIR I) e pelo menos 1 membro do Comitê de Investimentos certificado.',
      foco: 'Cumprir a exigência legal mínima da Portaria MTP 1.467/2022.'
    },
    II: {
      status: 'Obrigatório',
      exigencia: 'Dirigente Máximo Intermediário (CDIR II), maioria simples (>50%) do Comitê de Investimentos e 50% dos membros dos Conselhos Deliberativo e Fiscal certificados.',
      foco: 'Plano Anual de Capacitação (PAC) executado e antecedentes criminais 100% vigentes.'
    },
    III: {
      status: 'Obrigatório',
      exigencia: '100% dos Dirigentes e Gestores de Investimento certificados em nível Intermediário/Avançado e 66% dos membros de cada Conselho certificados.',
      foco: 'Comprovação de formação superior e experiência mínima de 2 anos na área pública/previdenciária.'
    },
    IV: {
      status: 'Obrigatório',
      exigencia: '100% de todos os membros (Diretoria, Comitê e Conselhos) certificados, com nível Avançado para Diretoria e Comitê de Investimentos (CDIR III, CGINV III, CGA/CEA).',
      foco: '100% dos membros com Formação Superior ou Pós-Graduação e capacitação contínua semestral comprovada.'
    }
  },

  // AÇÃO 4: Estrutura de Controle Interno
  4: {
    I: {
      status: 'Obrigatório',
      exigencia: 'Ato formal de designação do Responsável pelo Controle Interno do RPPS e definição básica de suas atribuições fiscalizatórias.',
      foco: 'Portaria de nomeação com segregação de funções (sem acúmulo de funções executivas) e checklist de conferência prévia.'
    },
    II: {
      status: 'Obrigatório',
      exigencia: 'Manual de Procedimentos de Controle Interno e emissão de Relatórios Semestrais de Acompanhamento com ciência do Dirigente Máximo.',
      foco: 'Checklists de conformidade setorial aplicados em Benefícios, Arrecadação e Investimentos.'
    },
    III: {
      status: 'Obrigatório',
      exigencia: 'Unidade de Controle Interno estruturada, Plano Anual de Controle Interno (PACI) e relatórios trimestrais com acompanhamento de recomendações dos Conselhos e TCE.',
      foco: 'Auditorias internas planejadas, matriz de recomendações e plano de providências com prazos formais.'
    },
    IV: {
      status: 'Obrigatório',
      exigencia: 'Gestão Avançada de Riscos baseada em COSO/ISO 31000, Matriz de Calor 5x5 (riscos inerentes e residuais) e Auditoria Externa Independente periódica.',
      foco: 'Matriz 5x5 de riscos mapeados com planos de mitigação, comitê de auditoria e pareceres de auditores independentes.'
    }
  },

  // AÇÃO 5: Política de Segurança da Informação
  5: {
    I: {
      status: 'Obrigatório',
      exigencia: 'Regulamento básico de segurança da informação e rotinas de backup comprovadas.',
      foco: 'Termos de sigilo assinados pelos servidores e comprovação de backup periódico da base previdenciária.'
    },
    II: {
      status: 'Obrigatório',
      exigencia: 'Política de Segurança da Informação (PSI) aprovada por ato formal, controle de acessos por perfil e testes de restauração de backup.',
      foco: 'Política de senhas fortes, antivírus corporativo e relatório de teste de restauração.'
    },
    III: {
      status: 'Obrigatório',
      exigencia: 'PSI completa em conformidade com a LGPD (Lei 13.709/2018), nomeação do Encarregado de Dados (DPO) e backup em nuvem com redundância.',
      foco: 'Mapeamento de fluxo de dados pessoais dos segurados e plano de resposta a incidentes de segurança.'
    },
    IV: {
      status: 'Obrigatório',
      exigencia: 'Framework avançado de segurança cibernética (ISO 27001), auditoria de vulnerabilidades periódica, autenticação multifator (MFA) e Plano de Continuidade de Negócios (PCN).',
      foco: 'Testes de intrusão periódicos, redundância geográfica e plano de recuperação de desastres (Disaster Recovery) testado anualmente.'
    }
  },

  // AÇÃO 6: Gestão e Controle da Base de Dados Cadastrais
  6: {
    I: {
      status: 'Obrigatório',
      exigencia: 'Cadastro previdenciário informatizado e cruzamento mensal de óbitos (SISOBI).',
      foco: 'Manter a base de segurados ativos e inativos atualizada.'
    },
    II: {
      status: 'Obrigatório',
      exigencia: 'Censo Previdenciário Cadastral realizado a cada 5 anos e validação sistemática de dados com a folha de pagamento do Ente.',
      foco: 'Relatório de consistência cadastral e saneamento de divergências (PIS/PASEP, CPF, data de nascimento).'
    },
    III: {
      status: 'Obrigatório',
      exigencia: 'Censo Previdenciário Cadastral e Funcional a cada 3 anos com Prova de Vida anual obrigatória para todos os aposentados e pensionistas.',
      foco: 'Integração cadastral com o CNIS e cruzamento automatizado com bases governamentais.'
    },
    IV: {
      status: 'Obrigatório',
      exigencia: 'Prova de Vida digital contínua (com biometria facial/gov.br), atualização cadastral permanente e base 100% saneada para a Avaliação Atuarial.',
      foco: 'Base de dados auditada com taxa de consistência superior a 99% e histórico funcional digitalizado.'
    }
  },

  // AÇÃO 7: Relatório de Governança Corporativa
  7: {
    I: {
      status: 'Opcional / Recomendado',
      exigencia: 'Relatório simplificado de prestação de contas anual apresentado aos segurados e conselhos.',
      foco: 'Transparência básica dos resultados da gestão.'
    },
    II: {
      status: 'Opcional / Recomendado',
      exigencia: 'Relatório anual de gestão contendo o resumo das decisões dos conselhos, investimentos e situação atuarial.',
      foco: 'Consolidação das atividades anuais com divulgação no site do RPPS.'
    },
    III: {
      status: 'Obrigatório',
      exigencia: 'Relatório de Governança Corporativa anual estruturado conforme o padrão SPREV, aprovado pelos Conselhos e amplamente divulgado.',
      foco: 'Detalhamento do cumprimento do plano de metas, execução orçamentária e sustentabilidade atuarial.'
    },
    IV: {
      status: 'Obrigatório',
      exigencia: 'Relatório Integrado de Governança e Sustentabilidade no padrão internacional (GRI / IIRC), com parecer do Conselho Fiscal e auditoria externa.',
      foco: 'Governança avançada com indicadores estratégicos, prestação de contas transparente e métricas ESG.'
    }
  },

  // AÇÃO 8: Planejamento
  8: {
    I: {
      status: 'Obrigatório',
      exigencia: 'Plano de Ação Anual com metas operacionais e cronograma das principais atividades previdenciárias.',
      foco: 'Definição de prazos e responsáveis no modelo 5W2H.'
    },
    II: {
      status: 'Obrigatório',
      exigencia: 'Planejamento Estratégico para o período de 3 a 4 anos (alinhado ao PPA) com missão, visão, valores e mapa de objetivos.',
      foco: 'Metas estratégicas desdobradas em planos operacionais anuais com monitoramento semestral.'
    },
    III: {
      status: 'Obrigatório',
      exigencia: 'Planejamento Estratégico com Metodologia Balanced Scorecard (BSC) ou OKRs, com indicadores de desempenho e reuniões trimestrais de avaliação.',
      foco: 'Painel de bordo de metas com reuniões de análise da estratégia (RAE) documentadas em ata.'
    },
    IV: {
      status: 'Obrigatório',
      exigencia: 'Planejamento Estratégico de Longo Prazo (10 a 20 anos) com cenários prospectivos atuariais, integrando gestão de riscos e orçamento plurianual.',
      foco: 'Alinhamento integral com a Gestão de Riscos, ALM e revisões contínuas baseadas em inteligência de dados.'
    }
  },

  // AÇÃO 9: Código de Ética e de Conduta
  9: {
    I: {
      status: 'Obrigatório',
      exigencia: 'Código de Ética aprovado e divulgado aos servidores e conselheiros do RPPS.',
      foco: 'Definição dos princípios éticos, deveres e vedações básicas.'
    },
    II: {
      status: 'Obrigatório',
      exigencia: 'Código de Ética formalizado, declarações de confidencialidade e regras claras sobre conflito de interesses para membros do Comitê de Investimentos.',
      foco: 'Termos de adesão e ciência assinados por 100% dos dirigentes e conselheiros.'
    },
    III: {
      status: 'Obrigatório',
      exigencia: 'Código de Ética e Conduta estruturado com Comissão de Ética instituída e canal sigiloso para denúncias de desvios éticos.',
      foco: 'Comissão de Ética com regimento interno e capacitação anual obrigatória sobre conduta ética.'
    },
    IV: {
      status: 'Obrigatório',
      exigencia: 'Programa de Integridade e Compliance completo, canal de denúncias independente (Whistleblower) com garantia de não retaliação e auditoria ética anual.',
      foco: 'Monitoramento contínuo de integridade, gestão de conflitos de interesse e política anticorrupção rigorosa.'
    }
  },

  // AÇÃO 10: Política de Investimentos
  10: {
    I: {
      status: 'Obrigatório',
      exigencia: 'Política Anual de Investimentos elaborada conforme a Resolução CMN vigente e aprovada pelo Conselho Deliberativo.',
      foco: 'Definição dos limites de alocação por segmento (Renda Fixa, Renda Variável, etc.).'
    },
    II: {
      status: 'Obrigatório',
      exigencia: 'Política de Investimentos com cenários macroeconômicos fundamentados, processo formal de credenciamento de instituições financeiras e relatórios mensais.',
      foco: 'Critérios objetivos de seleção de fundos e análise prévia de risco e liquidez.'
    },
    III: {
      status: 'Obrigatório',
      exigencia: 'Política de Investimentos fundamentada em Estudo de ALM (Asset Liability Management) e modelo formal de Due Diligence de gestores e custodiantes.',
      foco: 'Aderência estrita entre o fluxo de caixa dos benefícios futuros e a carteira de investimentos.'
    },
    IV: {
      status: 'Obrigatório',
      exigencia: 'Política de Investimentos com ALM dinâmico, critérios ESG (Ambiental, Social e Governança), limites de Stop Loss e Comitê de Riscos de Investimento.',
      foco: 'Otimização de fronteira eficiente de Markowitz e monitoramento diário de VaR (Value at Risk) e stress testing.'
    }
  },

  // AÇÃO 11: Comitê de Investimentos
  11: {
    I: {
      status: 'Obrigatório',
      exigencia: 'Comitê de Investimentos constituído por ato formal com regimento interno e reuniões periódicas registradas em ata.',
      foco: 'Pelo menos 1 membro certificado conforme a Portaria MTP 1.467/2022.'
    },
    II: {
      status: 'Obrigatório',
      exigencia: 'Comitê de Investimentos atuante, com maioria de membros certificados, atas mensais publicadas no portal e parecer prévio sobre as aplicações.',
      foco: 'Análise mensal de rentabilidade vs. meta atuarial e aderência à Política de Investimentos.'
    },
    III: {
      status: 'Obrigatório',
      exigencia: '100% dos membros do Comitê de Investimentos certificados, com relatórios técnicos trimestrais e participação obrigatória nas decisões de alocação.',
      foco: 'Avaliação de risco de crédito, liquidez e mercado para cada ativo da carteira.'
    },
    IV: {
      status: 'Obrigatório',
      exigencia: 'Comitê de Investimentos com membros com certificação avançada (CGA, CEA, CP RPPS CGINV III), assessoria técnica especializada e sistema de gestão de risco de mercado em tempo real.',
      foco: 'Governança avançada de investimentos com autonomia técnica e deliberações pautadas em análises quantitativas de risco.'
    }
  },

  // AÇÃO 12: Transparência
  12: {
    I: {
      status: 'Obrigatório',
      exigencia: 'Página da Transparência no site oficial com publicação das leis, atas, relatórios de investimentos e avaliações atuariais.',
      foco: 'Atendimento aos requisitos básicos da Lei de Acesso à Informação (LAI).'
    },
    II: {
      status: 'Obrigatório',
      exigencia: 'Portal da Transparência estruturado com ferramenta de busca, relatórios contábeis, DAIR, DPIN, atas dos conselhos e extratos em até 30 dias.',
      foco: 'Atualização tempestiva e disponibilização em formatos abertos (PDF, CSV).'
    },
    III: {
      status: 'Obrigatório',
      exigencia: 'Portal da Transparência com Carta de Serviços ao Cidadão, canal de Ouvidoria integrado, dados em formato aberto (Open Data) e relatórios de governança.',
      foco: 'Transparência ativa com linguagem cidadã e divulgação dos custos de administração.'
    },
    IV: {
      status: 'Obrigatório',
      exigencia: 'Painel Interativo de Business Intelligence (BI) para acompanhamento público em tempo real da carteira de investimentos, pirâmide etária e solvência atuarial.',
      foco: 'Transparência total em tempo real com acessibilidade digital (WCAG) e aplicativo móvel de autoatendimento.'
    }
  },

  // AÇÃO 13: Ouvidoria
  13: {
    I: {
      status: 'Obrigatório',
      exigencia: 'Canal formal de Ouvidoria (e-mail, formulário web ou presencial) com registro de protocolos e prazo de resposta.',
      foco: 'Atendimento e resposta às demandas dos segurados em até 30 dias.'
    },
    II: {
      status: 'Obrigatório',
      exigencia: 'Ouvidoria com sistema informatizado de controle de chamados, prazos regulamentados em norma e emissão de Relatório Semestral de Demandas.',
      foco: 'Classificação por assunto (concessão, recadastramento, atendimento) e indicadores de tempo de resposta.'
    },
    III: {
      status: 'Obrigatório',
      exigencia: 'Ouvidoria com ouvidor formalmente designado, relatórios trimestrais apreciados pela Diretoria e pesquisa de satisfação periódica dos segurados.',
      foco: 'Uso das manifestações como insumo para a melhoria dos processos operacionais do RPPS.'
    },
    IV: {
      status: 'Obrigatório',
      exigencia: 'Ouvidoria integrada aos órgãos de controle, pesquisa contínua de Net Promoter Score (NPS), canal anônimo com proteção ao denunciante e resolução em SLA reduzido.',
      foco: 'Atendimento omnichannel (WhatsApp, App, Web, Balcão) com índice de satisfação superior a 90%.'
    }
  },

  // AÇÕES 14 a 24
  14: {
    I: { status: 'Obrigatório', exigencia: 'Diretoria Executiva formalmente nomeada com atribuições regimentais.', foco: 'Atas de posse e cumprimento de requisitos estatutários.' },
    II: { status: 'Obrigatório', exigencia: 'Diretoria com reuniões periódicas em ata e metas anuais de gestão.', foco: 'Prestação de contas mensal aos conselhos.' },
    III: { status: 'Obrigatório', exigencia: 'Diretoria com 100% de certificação intermediária/avançada e plano de metas desdobrado.', foco: 'Avaliação de desempenho da gestão.' },
    IV: { status: 'Obrigatório', exigencia: 'Diretoria profissionalizada, mandato com estabilidade relativa e metas atreladas ao planejamento estratégico.', foco: 'Governança corporativa plena.' }
  },
  15: {
    I: { status: 'Obrigatório', exigencia: 'Conselho Deliberativo atuante com calendário anual de reuniões e atas publicadas.', foco: 'Aprovação da política de investimentos e orçamento.' },
    II: { status: 'Obrigatório', exigencia: 'Conselho Deliberativo com 50% dos membros certificados e regimento interno atualizado.', foco: 'Acompanhamento do plano de metas e atuarial.' },
    III: { status: 'Obrigatório', exigencia: 'Conselho com 66% de certificação, comissões temáticas e relatórios periódicos de acompanhamento.', foco: 'Deliberações fundamentadas tecnicamente.' },
    IV: { status: 'Obrigatório', exigencia: '100% dos conselheiros certificados e com formação superior, autoavaliação anual do colegiado e auditoria de governança.', foco: 'Decisões estratégicas de alto impacto.' }
  },
  16: {
    I: { status: 'Obrigatório', exigencia: 'Conselho Fiscal atuante com reuniões trimestrais e emissão de pareceres sobre as contas.', foco: 'Fiscalização contábil e financeira básica.' },
    II: { status: 'Obrigatório', exigencia: 'Conselho Fiscal com 50% de membros certificados, regimento interno e pareceres semestrais detalhados.', foco: 'Verificação de conformidade de despesas e investimentos.' },
    III: { status: 'Obrigatório', exigencia: 'Conselho Fiscal com maioria qualificada certificada, plano de fiscalização anual e auditoria de balancetes.', foco: 'Análise atuarial e controle de apontamentos de auditoria.' },
    IV: { status: 'Obrigatório', exigencia: '100% de conselheiros fiscais certificados com qualificação em contabilidade pública, direito ou finanças e parecer integrado de auditoria.', foco: 'Controle rigoroso e independente.' }
  },
  17: {
    I: { status: 'Recomendado', exigencia: 'Quadro de pessoal identificado e registro dos servidores cedidos ou efetivos.', foco: 'Controle funcional.' },
    II: { status: 'Recomendado', exigencia: 'Manual de atribuições de cargos e plano de capacitação dos servidores do RPPS.', foco: 'Capacitação contínua.' },
    III: { status: 'Obrigatório', exigencia: 'Estrutura de cargos e salários própria ou regulamentada no Ente, com avaliação de desempenho anual.', foco: 'Gestão de pessoas profissionalizada.' },
    IV: { status: 'Obrigatório', exigencia: 'Carreira própria da previdência com concurso público específico, plano de sucessão de lideranças e política de incentivo à qualificação.', foco: 'Sustentabilidade do quadro técnico.' }
  },
  18: {
    I: { status: 'Obrigatório', exigencia: 'Definição em lei dos prazos de mandato e regras de recondução para dirigentes e conselheiros.', foco: 'Cumprimento dos mandatos vigentes.' },
    II: { status: 'Obrigatório', exigencia: 'Mandatos com mandatos escalonados para garantir a continuidade da gestão e evitar descontinuidade total.', foco: 'Escalonamento de mandatos dos conselhos.' },
    III: { status: 'Obrigatório', exigencia: 'Regras rigorosas de mandato com vedação a reconduções indefinidas e processo seletivo/eleitoral transparente.', foco: 'Representatividade e legitimidade.' },
    IV: { status: 'Obrigatório', exigencia: 'Mandatos técnicos blindados contra interferências político-partidárias, com avaliação periódica de desempenho e requisitos de investidura de alto nível.', foco: 'Independência técnica institucional.' }
  },
  19: {
    I: { status: 'Obrigatório', exigencia: 'Separação básica entre quem autoriza, quem liquida e quem paga as despesas e benefícios.', foco: 'Segregação de funções operacionais.' },
    II: { status: 'Obrigatório', exigencia: 'Matriz formal de segregação de funções cadastrada e validada no sistema de controle interno.', foco: 'Impedimento de aprovação de atos por quem os elaborou.' },
    III: { status: 'Obrigatório', exigencia: 'Segregação total entre áreas de Investimentos, Benefícios, Contabilidade e Controle Interno.', foco: 'Controles sistêmicos em sistemas de gestão.' },
    IV: { status: 'Obrigatório', exigencia: 'Trilha de auditoria digital com perfis de acesso imutáveis e dupla custódia para movimentações financeiras relevantes.', foco: 'Segregação com governança tecnológica avançada.' }
  },
  20: {
    I: { status: 'Obrigatório', exigencia: 'Avaliação Atuarial anual elaborada por atuário credenciado pelo IBA e enviada à SPREV.', foco: 'Plano de custeio aprovado em lei.' },
    II: { status: 'Obrigatório', exigencia: 'Avaliação Atuarial acompanhada de Nota Técnica Atuarial e apresentação dos resultados aos Conselhos e Dirigentes.', foco: 'Acompanhamento da evolução das reservas e déficit.' },
    III: { status: 'Obrigatório', exigencia: 'Estudo de aderência das hipóteses atuariais bienal e plano formal de equacionamento do déficit atuarial.', foco: 'Auditoria da base de dados e teste de hipóteses biométricas.' },
    IV: { status: 'Obrigatório', exigencia: 'Modelo de Gestão Atuarial Integrada com ALM, projeções dinâmicas de longo prazo e comitê atuarial permanente.', foco: 'Sustentabilidade atuarial com inteligência de dados.' }
  },
  21: {
    I: { status: 'Opcional / Recomendado', exigencia: 'Identificação dos riscos básicos operacionais e financeiros do RPPS.', foco: 'Conscientização dos gestores.' },
    II: { status: 'Opcional / Recomendado', exigencia: 'Levantamento dos principais riscos por área e plano de contingência para benefícios e folha.', foco: 'Mapeamento de riscos preliminar.' },
    III: { status: 'Opcional / Recomendado', exigencia: 'Política de Gestão de Riscos formalizada com catálogo de riscos previdenciários e responsáveis.', foco: 'Estruturação da gestão de riscos.' },
    IV: { status: 'Obrigatório', exigencia: 'Sistema de Gestão de Riscos Operacionais, Atuariais, de Mercado e de Crédito integrado (ISO 31000/COSO) com Matriz de Calor 5x5 ativa.', foco: 'Monitoramento contínuo de riscos inerentes e residuais com mitigação auditável.' }
  },
  22: {
    I: { status: 'Opcional / Recomendado', exigencia: 'Rotinas de verificação e auditoria de conformidade dos processos de benefícios.', foco: 'Fiscalização interna básica.' },
    II: { status: 'Opcional / Recomendado', exigencia: 'Auditoria interna anual dos processos de arrecadação, investimentos e concessões.', foco: 'Emissão de relatório anual de auditoria.' },
    III: { status: 'Opcional / Recomendado', exigencia: 'Auditoria interna estruturada com plano anual e acompanhamento dos apontamentos do TCE.', foco: 'Relatórios trimestrais de conformidade.' },
    IV: { status: 'Obrigatório', exigencia: 'Auditoria Interna autônoma e contratação periódica de Auditoria Externa Independente com emissão de parecer sobre as demonstrações financeiras e controles.', foco: 'Auditoria independente certificada.' }
  },
  23: {
    I: { status: 'Obrigatório', exigencia: 'Plano de Ação de Educação Previdenciária anual com realização de pelo menos 1 evento ou palestra informativa.', foco: 'Disseminação da cultura previdenciária aos segurados.' },
    II: { status: 'Obrigatório', exigencia: 'Plano de Ação com calendário semestral, cartilhas informativas e cursos de preparação para a aposentadoria (PPA).', foco: 'Capacitação financeira e previdenciária dos servidores.' },
    III: { status: 'Obrigatório', exigencia: 'Programa Contínuo de Educação Previdenciária com portal web, eventos trimestrais, PPA e programa pós-aposentadoria.', foco: 'Avaliação de satisfação e engajamento dos segurados.' },
    IV: { status: 'Obrigatório', exigencia: 'Escola de Gestão Previdenciária / Plataforma EAD com cursos certificados, PPA contínuo e métricas de impacto na comunidade.', foco: 'Excelência em educação financeira e previdenciária cidadã.' }
  },
  24: {
    I: { status: 'Obrigatório', exigencia: 'Canal de atendimento ao público com divulgação de canais de contato e atendimento presencial.', foco: 'Atendimento humanizado e esclarecimento de dúvidas.' },
    II: { status: 'Obrigatório', exigencia: 'Encontros periódicos ou audiência pública anual para apresentação dos resultados da gestão aos segurados.', foco: 'Prestação de contas presencial e online.' },
    III: { status: 'Obrigatório', exigencia: 'Audiências públicas semestrais, boletins informativos periódicos e canais digitais interativos de diálogo.', foco: 'Diálogo ativo com sindicatos, associações e aposentados.' },
    IV: { status: 'Obrigatório', exigencia: 'Programa Integrado de Relacionamento e Diálogo Cidadão com audiências públicas transmitidas ao vivo, fórum permanente de aposentados e portal de escuta social.', foco: 'Participação social efetiva e transparência comunitária.' }
  }
};
