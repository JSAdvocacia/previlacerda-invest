export const templatePlanejamentoEstrategico = {
  introducao: "A elaboração deste planejamento visa definir estrategicamente ações de curto, médio e longo prazo nas áreas de competência do RPPS a serem implantadas e executadas pelo atual Conselho de Administração da referida unidade gestora do RPPS.\n\nA forma de elaboração do presente planejamento estratégico e o período compreendido de 5 (cinco) anos atende ao requisito de uma das ações do Pró Gestão RPPS, Programa de Certificação Institucional e Modernização da Gestão dos RPPS. Este planejamento será revisto anualmente e modificado sempre que se fizer necessário, observando-se os procedimentos pertinentes para tanto.",
  
  instituto: "O Regime Próprio de Previdência Social do Município – RPPS foi instituído pela Legislação Municipal, dispondo sobre a organização do Regime de Previdência dos Servidores Públicos e que criou o Fundo de Aposentadoria e Pensão.\n\nA estrutura de governança do Instituto é composta por um Conselho de Administração, um Conselho Fiscal e um Comitê de Investimentos, sendo administrado de forma colegiada, cabendo às funções deliberativas e de execução ao Conselho de Administração.\n\nSão segurados todos os servidores municipais titulares de cargos efetivos da administração direta, do Poder Legislativo Municipal e os atuais aposentados e pensionistas.",
  
  organogramaDescricao: "Organograma: \n- Conselho de Administração\n- Conselho Fiscal\n- Comitê de Investimentos\n- Diretoria Executiva\n- Gestores de Área",
  
  diretrizes: [
    {
      titulo: "Financeira e Investimentos",
      conteudo: "Acompanhamento sistemático das aplicações financeiras – Gerenciamento de Riscos e obtenção de melhores resultados.\nO Comitê de Investimentos, com apoio de empresa contratada especializada em assessoria financeira, realiza acompanhamento sistemático dos valores aplicados no mercado financeiro. Este acompanhamento objetiva a otimização dos valores investidos, buscando sempre bons rendimentos e minimizando qualquer tipo de perda financeira."
    },
    {
      titulo: "Atuarial - Meta Atuarial",
      conteudo: "A meta atuarial é a rentabilidade que o RPPS precisa atingir durante um exercício para se manter em equilíbrio a longo prazo. O RPPS estabelece como meta que a rentabilidade anual da carteira de investimentos alcance, no mínimo, desempenho equivalente a meta atuarial."
    },
    {
      titulo: "Administrativa - Capacitação",
      conteudo: "O RPPS tem por meta propiciar a capacitação com incentivo constante à educação previdenciária, visando a melhoria constante da qualidade dos servidores e conselheiros."
    },
    {
      titulo: "Gestão – Certificação Institucional",
      conteudo: "Buscaremos a certificação do Pró Gestão, com o comprometimento de estar em constante aperfeiçoamento, a fim de alcançar os níveis superiores de certificação supervenientemente. O objetivo é adotar as melhores práticas de gestão previdenciária."
    }
  ],
  
  swot: {
    pontosFortes: [
      "Competência técnica e equipe capacitada",
      "Ótimo atendimento prestado aos servidores e segurados",
      "Realização de Seminários de Previdência e capacitações",
      "Ausência de atraso no repasse do recolhimento previdenciário"
    ],
    pontosFracos: [
      "Falta de autonomia administrativo-financeira",
      "Ausência de estrutura de pessoal adequada",
      "Forma de atendimento com número considerado de atos ainda manuais",
      "Aumento constante do déficit atuarial"
    ],
    oportunidades: [
      "Disponibilização de novas tecnologias e formas de atendimento",
      "Elaboração, atualização e divulgação de materiais informativos",
      "Potencial aumento da demanda de servidores atendidos",
      "Proximidade e relacionamento com os órgãos de controle (TCE e SPREV)"
    ],
    ameacas: [
      "Volatilidade do Mercado e instabilidade econômica",
      "Aumento constante do déficit atuarial (revisões sem impacto atuarial prévio)",
      "Ausência de autonomia e estrutura de pessoal",
      "Falta de certificação da totalidade dos membros dos conselhos"
    ]
  }
};

export const templatePlanoAnual = [
  {
    id: "meta1",
    objetivo: "Obter a Certificação Pró-Gestão Nível II",
    indicador: "Certificado emitido",
    meta: "100%",
    prazo: "Dezembro/2024",
    responsavel: "Diretoria Executiva",
    status: "Pendente"
  },
  {
    id: "meta2",
    objetivo: "Capacitação e Certificação dos Conselheiros (CPA-10 / TOTUM)",
    indicador: "Percentual de Membros Certificados",
    meta: "100% Comitê de Invest., 50%+ Conselhos",
    prazo: "Julho/2024",
    responsavel: "Comitê de Investimentos",
    status: "Em Andamento"
  },
  {
    id: "meta3",
    objetivo: "Implantação de Sistema Eletrônico 100% Digital",
    indicador: "Processos tramitando eletronicamente",
    meta: "100%",
    prazo: "Novembro/2024",
    responsavel: "Setor de TI e Administração",
    status: "Pendente"
  },
  {
    id: "meta4",
    objetivo: "Atingimento da Meta Atuarial (INPC + 5%)",
    indicador: "Rentabilidade da Carteira",
    meta: "Superar INPC + 5%",
    prazo: "Dezembro/2024",
    responsavel: "Comitê de Investimentos",
    status: "Em Andamento"
  }
];
