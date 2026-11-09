// Sugestões completas e detalhamento prático ('Como Fazer') para todas as manualizações do Pró-Gestão

export const sugestoesManualizacaoPorProcesso = {
  'Arrecadação': {
    objetivoManual: 'Sistematizar e padronizar o processo de arrecadação, emissão de guias, conciliação e cobrança das contribuições previdenciárias funcionais e patronais do RPPS.',
    documentos: 'Lei Municipal de Criação/Reestruturação do RPPS; Portaria MTP nº 1.467/2022; Manual do Pró-Gestão RPPS v3.4; Resoluções do Conselho Deliberativo; Convênios Bancários de Arrecadação.',
    anexos: 'Modelo de DARM/Guia de Recolhimento; Notificação Formal de Cobrança Administrativa; Planilha de Conciliação Bancária de Arrecadação.',
    detalhamentos: {
      'Cadastra o Órgão': 'Acessar o sistema de gestão previdenciária, cadastrar os dados institucionais do órgão empregador (Prefeitura, Câmara, Autarquia, Fundação), CNPJ, alíquotas vigentes (patronal e segurado) e vincular as contas bancárias arrecadadoras do RPPS.',
      'Gerar e emitir a Guia de Recolhimento': 'Importar o arquivo de folha de pagamento enviado pelo Ente Federativo, apurar a base de cálculo contributiva, calcular as alíquotas normais e suplementares e emitir a Guia de Recolhimento Previdenciário (DARM) com código de barras e data de vencimento legal.',
      'Encaminhar Guia para pagamento': 'Disponibilizar a guia de recolhimento via sistema eletrônico/e-mail oficial para a Tesouraria ou Secretaria de Finanças do Ente com antecedência mínima de 5 dias úteis do vencimento regulamentar.',
      'Acompanhar o pagamento das Guias mensalmente': 'Acessar o extrato das contas de arrecadação do RPPS, conciliar as baixas bancárias automáticas e conferir se os valores creditados conferem rigorosamente com a guia emitida e a folha de pagamento.',
      'Elaborar Notificação de Cobrança (se não pago)': 'Constatado o não pagamento até a data de vencimento, calcular os acréscimos legais (juros de mora e atualização monetária conforme legislação local) e lavrar Notificação de Cobrança Administrativa.',
      'Encaminhar Notificação de cobrança e nova Guia': 'Notificar oficialmente o Chefe do Poder Executivo e a Secretaria de Finanças, emitindo nova guia atualizada com encargos e fixando prazo peremptório para quitação antes do envio aos órgãos de controle.'
    }
  },
  'Aposentadoria Compulsória': {
    objetivoManual: 'Padronizar o rito de concessão de aposentadoria compulsória aos 75 anos de idade, garantindo agilidade no processamento, correção na fixação dos proventos e cumprimento dos prazos do Tribunal de Contas.',
    documentos: 'Constituição Federal (art. 40, § 1º, II); Lei Complementar nº 152/2015; Lei Municipal do RPPS; Instruções Normativas do Tribunal de Contas do Estado.',
    anexos: 'Ofício de Comunicação de Idade Limite; Ficha Funcional e Financeira; Mapa de Apuração de Tempo de Contribuição; Minuta de Portaria Concessória.',
    detalhamentos: {
      'Enviar solicitação de aposentadoria (Prefeitura)': 'O setor de RH do órgão de origem monitora a data de nascimento do servidor e emite ofício formal ao RPPS 60 dias antes do alcance dos 75 anos, anexando pasta funcional, declarações e ficha financeira.',
      'Realizar pedido de Benefício e fazer juntada de documento (Protocolo)': 'Autuar o processo administrativo no sistema informatizado de protocolo do RPPS, cadastrar os dados do segurado e juntar certidão de nascimento/casamento, RG, CPF, comprovante de residência e CTCs.',
      'Analisa a documentação encaminhada': 'Conferir o mapa de tempo de contribuição líquido, verificar se há períodos averbados de outros regimes e levantar o histórico de remunerações contributivas para aplicação da média aritmética.',
      'Solicitar a servidor via Carta de Exigência documentos faltantes': 'Havendo divergências funcionais ou certidões incompletas, emitir Carta de Exigência formal concedendo prazo de 30 dias para o servidor ou órgão de origem sanar a pendência.',
      'Analisa documentação (Jurídico)': 'A assessoria jurídica examina o cumprimento dos requisitos legais, a correta aplicação da regra de proporcionalidade ao tempo de contribuição e a constitucionalidade do ato.',
      'Emitir e encaminhar parecer do processo': 'Redigir Parecer Jurídico circunstanciado e fundamentado com conclusão expressa pelo deferimento e encaminhar à Diretoria Executiva.',
      'Analisar o parecer do processo (Diretoria)': 'A Diretoria Executiva acolhe o parecer jurídico, delibera pelo deferimento formal da aposentadoria compulsória e autoriza a confecção do ato concessório.',
      'Juntar documentação e fazer cálculo de pagamento': 'Elaborar a planilha oficial de cálculo dos proventos proporcionais, fixando o valor inicial do benefício de acordo com as regras legais vigentes.',
      'Emitir Ato': 'Redigir a Portaria de Concessão de Aposentadoria Compulsória contendo identificação do segurado, cargo, fundamentação constitucional expressa e assinatura do Diretor-Presidente.',
      'Incluir aposentado na Folha de Pagamento (RH)': 'Cadastrar o aposentado no módulo de folha de pagamento de inativos do RPPS na competência subsequente ao desligamento funcional.',
      'Publicação de Ato no DOM': 'Encaminhar o extrato da portaria concessória para publicação no Diário Oficial do Município (DOM) e disponibilizar no portal da transparência.',
      'Envio do processo ao TCE/SC': 'Digitalizar as peças processuais e transmitir a prestação de contas via sistema eletrônico do Tribunal de Contas para homologação e registro.'
    }
  },
  'Aposentadoria Especial': {
    objetivoManual: 'Estabelecer os critérios técnicos, periciais e operacionais para a concessão de aposentadoria especial por exposição a agentes químicos, físicos, biológicos ou associação de agentes.',
    documentos: 'Constituição Federal (art. 40, § 4º-C); Portaria MTP nº 1.467/2022; LTCAT (Laudo Técnico de Condições Ambientais do Trabalho); PPP (Perfil Profissiográfico Previdenciário); Legislação Municipal.',
    anexos: 'Formulário de Requerimento de Aposentadoria Especial; Checklist Pericial; Laudo Médico Pericial Conclusivo; Portaria de Concessão.',
    detalhamentos: {
      'Solicita por ofício pedido (Servidor)': 'O servidor formaliza o pedido de aposentadoria especial via protocolo administrativo, anexando o Perfil Profissiográfico Previdenciário (PPP) emitido pelos órgãos empregadores onde trabalhou.',
      'Agendamento de Exames junto à Perícia Médica': 'Setor de Benefícios encaminha os PPPs e LTCATs para o setor de perícia médica/segurança do trabalho do RPPS e agenda avaliação técnica pericial.',
      'Realiza os exames exigidos (Perícia Médica)': 'O médico perito ou engenheiro de segurança do trabalho examina a documentação técnica, avalia a habitualidade e permanência da exposição aos agentes nocivos e emite Laudo Pericial de Enquadramento.',
      'Realizar pedido e fazer juntada de documentos': 'Juntar o Laudo Pericial conclusivo aos autos, conferir a certidão de tempo de contribuição com tempo especial computado e elaborar a contagem de tempo de serviço.',
      'Analisa documentação (Jurídico)': 'Assessoria jurídica avalia a regularidade do enquadramento legal, a regra de transição aplicável e o direito adquirido conforme a legislação de regência.',
      'Emitir e encaminhar parecer': 'Emitir parecer jurídico conclusivo com fundamentação legal explícita e submeter para deliberação da Diretoria Executiva.',
      'Analisar parecer (Diretoria)': 'Diretoria Executiva avalia o parecer jurídico e laudo técnico, deferindo o benefício e determinando a elaboração do ato concessório.',
      'Emitir Ato e Incluir na Folha': 'Emitir a Portaria de Concessão de Aposentadoria Especial, calcular a média contributiva e incluir o beneficiário na folha de pagamento.',
      'Publicação no DOM e Envio ao TCE/SC': 'Publicar a portaria no Diário Oficial do Município e enviar a prestação de contas eletrônica para homologação do Tribunal de Contas.'
    }
  },
  'Aposentadoria por Invalidez': {
    objetivoManual: 'Orientar o processo de concessão de aposentadoria por incapacidade permanente (invalidez), disciplinando a perícia médica oficial, avaliação jurídica e registro no Tribunal de Contas.',
    documentos: 'Constituição Federal (art. 40, § 1º, I); Portaria MTP nº 1.467/2022; Lei Municipal do RPPS; Laudos da Junta Médica Oficial do Município/RPPS.',
    anexos: 'Laudo Pericial da Junta Médica Oficial; Notificação de Conclusão Pericial; Memória de Cálculo de Proventos; Portaria Concessória.',
    detalhamentos: {
      'Apresenta atestado médico para avaliação': 'O servidor ou órgão de origem apresenta atestados médicos, exames complementares e relatórios clínicos que fundamentam o pedido de afastamento definitivo.',
      'Realiza os exames exigidos': 'A Junta Médica Oficial realiza exame clínico pericial presencial, avalia a inviabilidade de readaptação funcional e lavra Laudo Médico Conclusivo indicando se a invalidez decorre ou não de acidente em serviço.',
      'Juntar documentação e fazer pedido': 'Autuar processo no setor de protocolo, juntar laudo pericial oficial, certidão de tempo de contribuição e ficha financeira completa.',
      'Análise Jurídica e Parecer': 'A assessoria jurídica analisa se o cálculo dos proventos será integral (acidente em serviço/doença profissional) ou proporcional e emite Parecer Jurídico.',
      'Emitir Ato, Incluir na Folha e Publicar': 'A Diretoria emite a Portaria Concessória, cadastra o provento no sistema de folha, publica no Diário Oficial e transmite o processo ao Tribunal de Contas.'
    }
  },
  'Pensão por Morte': {
    objetivoManual: 'Regulamentar o fluxo de requerimento, habilitação de dependentes, rateio de cotas e concessão de pensão por morte previdenciária.',
    documentos: 'Constituição Federal (art. 40, § 7º); Portaria MTP nº 1.467/2022; Lei Municipal do RPPS; Certidão de Óbito; Documentos comprobatórios de dependência econômica.',
    anexos: 'Requerimento de Pensão por Morte; Declaração de Não Acúmulo de Benefícios / Acúmulo Legal; Planilha de Rateio de Cotas; Portaria de Concessão de Pensão.',
    detalhamentos: {
      'Solicita a pensão por morte': 'Requerente protocola requerimento anexando certidão de óbito do instituidor, certidão de casamento/união estável ou nascimento de filhos, documentos pessoais e comprovante de conta bancária.',
      'Analisa documentação e solicita pendências': 'Setor de Benefícios confere a legitimidade dos dependentes, verifica a qualidade de segurado do instituidor na data do óbito e emite Carta de Exigência caso falte documentação comprobatória.',
      'Análise Jurídica e Emissão de Parecer': 'Jurídico examina o rol de dependentes, a duração do benefício com base na tabela etária do cônjuge, a regra de cálculo e a existência de outros pensionistas para fixar a cota-parte.',
      'Analisar Parecer e Emitir Ato de concessão (Diretoria)': 'Diretoria Executiva homologa a habilitação e redige a Portaria de Concessão de Pensão por Morte contendo valor global, cotas individuais e prazo de vigência.',
      'Encaminhar para RH fazer os cálculos e Incluir na Folha': 'Setor de Folha de Pagamento efetua o lançamento do valor apurado no sistema, cadastra os dependentes com seus respectivos percentuais e programa o pagamento.',
      'Inclui e publica no DOM e Arquiva processo': 'Publicar o extrato no Diário Oficial do Município, enviar a prestação de contas ao Tribunal de Contas e arquivar o processo no prontuário do beneficiário.'
    }
  },
  'Processo Jurídico': {
    objetivoManual: 'Sistematizar a atuação da assessoria jurídica do RPPS no acompanhamento processual contencioso, consultivo e no cumprimento tempestivo de ordens judiciais.',
    documentos: 'Código de Processo Civil; Lei Orgânica Municipal; Estatuto do Servidor Público; Legislação Previdenciária Geral (Lei nº 9.717/98, Portaria MTP nº 1.467/2022).',
    anexos: 'Ficha de Controle de Prazos Processuais; Modelo de Parecer Jurídico Padrão; Relatório Trimestral de Ações Judiciais.',
    detalhamentos: {
      'Protocolar ações iniciais ou defesas iniciais': 'Receber a citação ou notificação judicial, cadastrar no sistema de controle de prazos, solicitar subsídios fáticos e documentais aos setores de RH/Benefícios e protocolar contestação tempestiva no sistema do Judiciário (PJe).',
      'Elaborar pareceres jurídicos ao setor solicitante': 'Analisar as consultas administrativas formuladas pela Presidência, Comitês ou Conselhos e emitir Parecer Jurídico fundamentado nas normas vigentes e jurisprudência pacificada.',
      'Monitorar decisões judiciais': 'Acompanhar diariamente as publicações no Diário da Justiça Eletrônico referente aos processos onde o RPPS figure como parte ou interessado.',
      'Analisar decisões judiciais': 'Examinar o teor das decisões interlocutórias e sentenças, avaliando impactos financeiros, atuariais e operacionais para a instituição.',
      'Elaborar recurso do processo (se cabível)': 'Interpor apelação, agravo de instrumento ou recursos aos Tribunais Superiores quando a decisão contrariar a legislação previdenciária e o equilíbrio atuarial do fundo.',
      'Emissão de decisões judiciais (Órgãos)': 'Comunicar formalmente à Diretoria e aos setores de Folha/Benefícios sobre o trânsito em julgado e orientar o cumprimento exato da determinação judicial.',
      'Baixar processo e arquivar': 'Registrar o cumprimento da obrigação nos autos judiciais, dar baixa no sistema de controle processual interno e arquivar a pasta jurídica.'
    }
  },
  'Aposentadoria Voluntária': {
    objetivoManual: 'Normatizar o fluxo completo de concessão da aposentadoria voluntária, orientando a contagem de tempo, simulação de regras de transição, cálculos de proventos e fixação de paridade.',
    documentos: 'Emenda Constitucional nº 103/2019; Lei Municipal do RPPS; Portaria MTP nº 1.467/2022; Manual de Certificação Pró-Gestão v3.4; Regras do Tribunal de Contas.',
    anexos: 'Requerimento Padrão de Aposentadoria Voluntária; Mapa de Simulação de Regras de Transição; Planilha de Cálculo de Média Aritmética; Minuta de Portaria.',
    detalhamentos: {
      'Solicita o pedido de aposentadoria (Servidor)': 'O servidor formaliza o pedido de aposentadoria voluntária no setor de protocolo do RPPS, indicando a regra pretendida e juntando documentos pessoais e comprovantes de tempo.',
      'Verificação de preenchimento de requisitos': 'Apurar o tempo líquido de contribuição, verificar o tempo de efetivo serviço público, tempo na carreira e no cargo, idade mínima exigida e simular a regra de cálculo mais vantajosa (paridade ou média).',
      'Realizar pedido e juntada de documentos': 'Autuar o processo administrativo digital, anexar certidões de tempo de contribuição (CTC) homologadas, histórico de remunerações e mapa de tempo consolidado.',
      'Análise Jurídica e Parecer': 'A assessoria jurídica emite Parecer fundamentado atestando o direito adquirido ou preenchimento integral dos requisitos da regra de transição constitucional aplicável.',
      'Emitir Ato e Calcular pagamento': 'Elaborar a memória de cálculo do benefício, emitir a Portaria de Concessão de Aposentadoria Voluntária e colher assinatura do Diretor-Presidente do RPPS.',
      'Incluir na Folha e Publicar no DOM': 'Cadastrar o segurado na folha de pagamento de inativos e enviar o ato concessório para publicação oficial no Diário Oficial do Município.',
      'Envio ao TCE/SC': 'Transmitir os autos do processo com demonstrativos de cálculo e portaria publicada para o Tribunal de Contas para fins de registro e homologação.'
    }
  },
  'Geração de Folha de Pagamento': {
    objetivoManual: 'Padronizar as rotinas mensais de fechamento, lançamento de vantagens e descontos, auditoria de folha, transmissão bancária e contabilização dos proventos previdenciários.',
    documentos: 'Lei Municipal do RPPS; Tabela do Imposto de Renda (RFB); Convênios Bancários de Folha de Pagamento; Legislação de Consignações em Folha.',
    anexos: 'Checklist de Fechamento Mensal de Folha; Relatório Sintético e Analítico de Folha; Arquivo de Remessa Bancária CNAB 240; Guia de Recolhimento do IRRF Retido.',
    detalhamentos: {
      'Encaminhar novos para inclusão': 'Receber do Setor de Benefícios a relação oficial de novas portarias concessórias e revisões publicadas no mês corrente para implantação em folha.',
      'Inserir e Cadastrar novos beneficiários': 'Cadastrar os dados funcionais, bancários, dependentes para dedução de IRRF e valores de proventos no módulo de folha de pagamento.',
      'Importar e lançar arquivos de descontos': 'Importar os arquivos de consignações financeiras facultativas (empréstimos bancários, planos de saúde, associações) e lançar pensões alimentícias judiciais.',
      'Cancelar beneficiários por óbito / Cancelar pensões': 'Cruzar mensalmente os dados com o Sistema de Informações de Mortalidade (SIM/SISOBI) e com o Censo Previdenciário para suspender pagamentos indevidos por óbito ou maioridade.',
      'Calcular Folha de Pagamento': 'Executar o processamento automático da folha de pagamento no sistema, calculando proventos brutos, retenção de IRRF e descontos consignados.',
      'Conferência de valores': 'Emitir relatórios de conferência comparando a folha atual com a do mês anterior, auditando variações relevantes de valores e garantindo o respeito ao teto constitucional.',
      'Gerar arquivo bancário e Financeiro': 'Gerar o arquivo eletrônico de remessa bancária no padrão CNAB 240 contendo os créditos líquidos de todos os inativos e pensionistas.',
      'Enviar arquivo para Instituição bancária': 'Transmitir o arquivo de pagamento pelo canal bancário homologado e acompanhar o relatório de validação e confirmação de crédito em conta.',
      'Emitir e enviar relatório para Contabilidade': 'Gerar os relatórios contábeis de empenho, liquidação, retenções tributárias e extratos de proventos para a contabilidade efetuar a escrituração contábil.'
    }
  },
  'Elaboração da Política de Investimentos': {
    objetivoManual: 'Definir o processo de planejamento, elaboração, análise técnica, aprovação colegiada e publicação da Política de Investimentos dos recursos do RPPS.',
    documentos: 'Resolução CMN nº 4.963/2021 (e alterações); Portaria MTP nº 1.467/2022; Manual do Pró-Gestão RPPS v3.4; Relatório de Avaliação Atuarial Anual; Estudo de ALM.',
    anexos: 'Minuta da Política Anual de Investimentos; Parecer da Consultoria de Investimentos; Ata de Aprovação do Comitê de Investimentos; Ata de Aprovação do Conselho Deliberativo; DPIN (CADPREV).',
    detalhamentos: {
      'Avaliar resultados do ano anterior': 'O Comitê de Investimentos analisa o relatório anual de rentabilidade, o atingimento da meta atuarial (IPCA + taxa de juros real) e a volatilidade dos segmentos de renda fixa, renda variável e investimentos no exterior do exercício anterior.',
      'Elaborar e revisar minuta da nova PI': 'Redigir a minuta da nova Política Anual de Investimentos baseada no Estudo de ALM (Asset Liability Management), fixando limites mínimos e máximos de alocação de recursos por segmento em consonância com a Resolução CMN.',
      'Encaminhar para análise da consultoria': 'Enviar a minuta da Política de Investimentos à consultoria de investimentos credenciada para elaboração de relatório técnico de aderência atuarial e validação das premissas de risco.',
      'Analisar e fazer ajustes (Consultoria/Comitê)': 'O Comitê de Investimentos se reúne, avalia os apontamentos do relatório da consultoria, promove os ajustes pertinentes no texto e formaliza a ata de encaminhamento.',
      'Encaminhar PI para aprovação do Conselho': 'Encaminhar formalmente a minuta final da Política de Investimentos e seus anexos técnicos para pauta da reunião ordinária do Conselho Deliberativo.',
      'Analisar e aprovar a nova PI (Conselho)': 'O Conselho Deliberativo debate as propostas de alocação, aprova a Política de Investimentos e lavra a respectiva ata deliberativa devidamente assinada por todos os conselheiros.',
      'Encaminhar para publicação no site do Instituto': 'Publicar a íntegra da Política de Investimentos aprovada e a ata do Conselho no portal da transparência do RPPS até 31 de dezembro para amplo acesso público.',
      'Envio a SPREV através do DPIN via CADPREV': 'Cadastrar e transmitir o Demonstrativo da Política de Investimentos (DPIN) no sistema CADPREV da Secretaria de Regime Próprio e Complementar (SPREV) dentro do prazo legal.'
    }
  },
  'Credenciamento das Instituições Financeiras': {
    objetivoManual: 'Normatizar o procedimento de credenciamento e monitoramento contínuo das instituições financeiras, gestores e administradores de fundos autorizados a receber recursos do RPPS.',
    documentos: 'Resolução CMN nº 4.963/2021; Portaria MTP nº 1.467/2022; Edital Permanente de Credenciamento; Certidões CVM, ANBIMA e BACEN.',
    anexos: 'Edital Permanente de Credenciamento; Questionário de Due Diligence / Análise de Risco; Ficha de Avaliação Técnica de Credenciamento; Atestado de Credenciamento Homologado.',
    detalhamentos: {
      'Lança o Edital com regras': 'Elaborar e publicar o Edital Permanente de Credenciamento no Diário Oficial e no portal do RPPS, detalhando os requisitos de habilitação jurídica, solidez financeira e certificações técnicas exigidas.',
      'Receber documentação das Instituições': 'Receber e protocolar os envelopes/arquivos digitais contendo certidões de regularidade fiscal, registro CVM/BACEN, termo de adesão ao código ANBIMA e questionários de due diligence preenchidos.',
      'Avalia a documentação para Credenciamento': 'O Comitê de Investimentos confere a autenticidade e validade das certidões, volume de recursos sob gestão, rating de crédito da instituição e histórico de reputação dos gestores.',
      'Solicita parecer': 'Solicitar parecer técnico da consultoria de investimentos credenciada e emitir parecer do Comitê de Investimentos recomendando a homologação ou recusa fundamentada do credenciamento.',
      'Publica lista de Instituições credenciadas no site': 'Emitir o Termo de Credenciamento, publicar no Diário Oficial e atualizar a relação oficial de instituições financeiras habilitadas no portal da transparência do RPPS.',
      'Monitora Instituição credenciada': 'Acompanhar anualmente a renovação das certidões fiscais e avaliar periodicamente o desempenho dos fundos de investimento alocados.'
    }
  },
  'Revisão de Aposentadorias e Pensões': {
    objetivoManual: 'Disciplinar o rito de análise, reavaliação de cálculos, parecer jurídico e aplicação de revisões de proventos e pensões em conformidade com as decisões administrativas e judiciais.',
    documentos: 'Constituição Federal; Lei Municipal do RPPS; Lei Orgânica; Súmulas e Teses Vinculantes do STF e STJ; Processo Original de Concessão.',
    anexos: 'Requerimento de Revisão de Benefício; Planilha de Evolução e Retificação de Proventos; Parecer Jurídico de Revisão; Portaria de Retificação / Revisão.',
    detalhamentos: {
      'Solicita revisão (Beneficiário)': 'O inativo ou pensionista protocola requerimento fundamentando o pedido de revisão (reajuste de plano de cargos, tempo residual averbado, conversão de tempo ou decisão judicial).',
      'Analisa documentação para revisão': 'O Setor de Benefícios localiza e desarquiva os autos originais de concessão do benefício, conferindo os demonstrativos de pagamento e a base de cálculo impugnada.',
      'Análise Jurídica e Emissão de Parecer': 'A assessoria jurídica examina o cabimento legal do pedido, a ocorrência de prescrição quinquenal de parcelas vencidas e emite Parecer Jurídico fundamentado.',
      'Análise pela Diretoria e Decisão': 'A Diretoria Executiva delibera sobre o deferimento ou indeferimento do pedido e autoriza a confecção do ato retificador nos casos pertinentes.',
      'Encaminhar para RH aplicar as revisões': 'O Setor de Folha de Pagamento implementa o novo valor do provento no sistema de pagamento e apura o montante de diferenças retroativas devidas.',
      'Inclui e publica no DOM': 'Emitir a Portaria de Revisão, publicar o extrato no Diário Oficial do Município e arquivar a documentação nos autos do benefício.'
    }
  },
  'Controle de Acesso': {
    objetivoManual: 'Estabelecer as diretrizes e procedimentos para concessão, alteração e revogação de acessos lógicos e físicos no âmbito do RPPS, assegurando a integridade e confidencialidade das informações.',
    documentos: 'Política de Segurança da Informação (PSI); Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018); Manual do Pró-Gestão v3.4.',
    anexos: 'Termo de Responsabilidade e Sigilo; Formulário de Solicitação de Acesso Lógico; Relatório Mensal de Auditoria de Acessos.',
    detalhamentos: {
      'Recebe solicitação de Acesso': 'Receber formulário formal assinado pela chefia imediata solicitando criação ou alteração de credenciais de acesso aos módulos de arrecadação, folha, protocolo ou contabilidade.',
      'Verifica se existe autorização': 'Verificar se o perfil de permissão solicitado condiz estritamente com as funções do cargo (princípio do privilégio mínimo) e colher assinatura no Termo de Confidencialidade e LGPD.',
      'Fazer o registro de entrada': 'Cadastrar o usuário no servidor de domínio e nos sistemas do RPPS, definindo login individual e exigindo criação de senha forte com expiração periódica.',
      'Encaminhar para setor autorizado': 'Transmitir as credenciais de forma segura ao colaborador e orientá-lo sobre as boas práticas da Política de Segurança da Informação.',
      'Registrar saída e verificar entrega de documentos': 'No encerramento de vínculo funcional, licença prolongada ou exoneração, desativar imediatamente o login e recolher equipamentos/tokens corporativos.',
      'Verificar com responsável do Setor se tudo está OK': 'Emitir relatório de revogação de acessos e arquivar no prontuário de segurança da informação para auditoria interna.'
    }
  },
  'Planos de Contingências': {
    objetivoManual: 'Definir as rotinas de backup, contingência operacional, restauração de dados e recuperação de desastres tecnológicos para assegurar a perenidade dos serviços previdenciários.',
    documentos: 'Política de Segurança da Informação; Plano de Continuidade de Negócios; Manual do Pró-Gestão v3.4; Contratos de Suporte e Cloud.',
    anexos: 'Matriz de Risco e Criticidade de Sistemas; Cronograma de Testes de Restauração de Backup; Relatório Semestral de Teste de Contingência.',
    detalhamentos: {
      'Solicitar elaboração de planos': 'A Diretoria Executiva determina a revisão anual do Plano de Contingência e Continuidade dos serviços previdenciários essenciais (folha de pagamento, arrecadação e protocolo).',
      'Elaborar estratégias de contingências': 'Mapear a infraestrutura de redundância, regras de backup automático em nuvem criptografada (regra 3-2-1) e definir os tempos máximos aceitáveis de recuperação (RTO e RPO).',
      'Analisar planos (Diretoria)': 'Apresentar o Plano de Contingência para validação da Diretoria e do Conselho Deliberativo, formalizando a aprovação em ata.',
      'Aplicar planos de recuperação e backup': 'Executar backups diários incrementais e semanais completos, além de simulações periódicas de restauração em ambiente isolado (sandbox).',
      'Monitorar execução do plano': 'Registrar logs diários de sucesso dos backups e lavrar Relatório Semestral de Teste de Contingência para apresentação aos órgãos de auditoria externa.'
    }
  }
};

export const getComoFazerPadrao = (procNome, subNome, ativNome, ativId = '') => {
  if (!ativNome) return '';
  const ativTrim = ativNome.trim();

  // 1. Busca exata pelo nome do processo e da atividade
  const procSugestoes = sugestoesManualizacaoPorProcesso[procNome];
  if (procSugestoes?.detalhamentos?.[ativTrim]) {
    return procSugestoes.detalhamentos[ativTrim];
  }

  // 2. Busca flexível em todos os processos cadastrados por nome de atividade
  for (const p of Object.values(sugestoesManualizacaoPorProcesso)) {
    if (p.detalhamentos?.[ativTrim]) {
      return p.detalhamentos[ativTrim];
    }
  }

  // 3. Geração inteligente contextualizada para qualquer atividade avulsa
  return `Executar a atividade de "${ativTrim}" conforme os procedimentos operacionais padrão do RPPS, realizando a conferência de documentos no protocolo, validação técnica das informações e registro conclusivo no sistema corporativo.`;
};

export const getObjetivoManualPadrao = (proc) => {
  if (!proc) return '';
  return proc.manualizacao?.objetivoManual || 
    sugestoesManualizacaoPorProcesso[proc.nome]?.objetivoManual || 
    proc.objetivo || 
    `Sistematizar, padronizar e orientar o fluxo operacional de ${proc.nome}, garantindo conformidade com as diretrizes do Pró-Gestão e legislação vigente.`;
};

export const getDocumentosPadrao = (proc) => {
  if (!proc) return '';
  return proc.manualizacao?.documentos || 
    sugestoesManualizacaoPorProcesso[proc.nome]?.documentos || 
    'Lei Municipal do RPPS; Portaria MTP nº 1.467/2022; Manual do Pró-Gestão RPPS v3.4; Resoluções do Conselho Deliberativo.';
};

export const getAnexosPadrao = (proc) => {
  if (!proc) return '';
  return proc.manualizacao?.anexos || 
    sugestoesManualizacaoPorProcesso[proc.nome]?.anexos || 
    'Formulário de Requerimento Padrão; Checklist de Documentação Obrigatória; Modelo de Parecer Técnico; Minuta de Portaria / Ato Concessório.';
};
