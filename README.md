# PREVI-LACERDA — Sistema de Gestão da Carteira de Investimentos RPPS
### Instituto de Previdência dos Servidores Públicos do Município de Pontes e Lacerda - MT

Sistema web corporativo para gestão, conformidade legal, análise fundamentalista e acompanhamento fiduciário da carteira de investimentos do **PREVI-LACERDA**, desenvolvido em estrita conformidade com a **Resolução CMN nº 5.272/2025** (de 18 de dezembro de 2025), normativos da **CVM** e diretrizes de controle do **TCE-MT**.

---

## 🌐 Disponibilidade em Nuvem (Acesso de Qualquer Lugar)

O sistema foi preparado para **deploy 100% gratuito em nuvem, com segurança de nível bancário e sem problemas de suspensão/inatividade (sem usar servidores de renderização SSR lentos ou plataformas que dormem como o Render)**:

1. **Frontend na Edge CDN (Vercel ou Cloudflare Pages)**:
   - Aplicação compilada em Single Page Application (SPA) pura com cache global de alta velocidade (servida a partir de São Paulo/Brasília em milissegundos).
   - HTTPS e certificado SSL automático gratuito.
   - Sem "cold start": a página abre instantaneamente a qualquer hora do dia ou da noite.
2. **Banco de Dados PostgreSQL em Nuvem Gratuito (Supabase / Neon)**:
   - 500 MB de armazenamento permanente gratuito com SSL/TLS obrigatório e criptografia em repouso.
   - Trilha de auditoria imutável via triggers SQL.
3. **Robô CVM Automatizado em Nuvem (GitHub Actions Scheduled Workflow)**:
   - Executa pontualmente de segunda a sexta às 21:00 BRT, baixa o informe diário de fundos da CVM e atualiza a carteira no banco em nuvem de forma autônoma, sem necessidade de computador ligado ou custos de VPS.

📖 **Consulte o passo a passo completo no guia**: [`docs/DEPLOY_GRATUITO_NUVEM.md`](docs/DEPLOY_GRATUITO_NUVEM.md).

---

## 📜 Base Legal Vigente
- **Norma**: **Resolução CMN nº 5.272/2025**
- **Documento Oficial (Ministério da Previdência)**:  
  👉 [https://www.gov.br/previdencia/pt-br/assuntos/rpps/legislacao-dos-rpps/arquivos/2025/ResoluoBCCMNn5.272de18dez2025.pdf](https://www.gov.br/previdencia/pt-br/assuntos/rpps/legislacao-dos-rpps/arquivos/2025/ResoluoBCCMNn5.272de18dez2025.pdf)

---

## 🔐 Controle de Acesso, Autenticação e Usuário Master

1. **Identificação por E-mail Validado**: O usuário deve ser sempre um endereço de e-mail institucional. O acesso ao sistema é condicionado à prévia validação do e-mail.
2. **Usuário Master (`prof.jan100@gmail.com`)**:
   - Perfil: `MASTER_ADMIN` com **acesso total** ao sistema.
   - **Senha Inicial**: `123456`.
   - **Troca Obrigatória de Senha**: No primeiro acesso, o sistema bloqueia a navegação e exige a definição de uma nova senha pessoal definitiva.
   - **Gestão e Atribuição de Perfis**: O usuário master possui exclusividade para atribuir perfis a outros servidores:
     - `DIRETORIA_EXECUTIVA` (Acesso total, aprovação e risco)
     - `COMITE_INVESTIMENTOS` (Análise, simulador e cadastro)
     - `AUDITORIA_CONSELHO_FISCAL` (Somente Leitura e Trilha de Auditoria)
     - `MASTER_ADMIN`

---

## 🏛️ Módulos Implementados

1. **Dashboard Gerencial (Referência: Investidor10)**:
   - Cards de indicadores fundamentalistas (Rentabilidade 12M, Meta Atuarial IPCA + 5,50% a.a., % do CDI e Volatilidade).
   - Barras de enquadramento da Resolução CMN 5.272/2025 com link direto para o PDF oficial.
   - Gráfico de evolução patrimonial e comparativo com benchmarks.
2. **Comparador Interativo de Fundos e Ativos (Estilo Investidor10)**:
   - Comparação simultânea de 2 a 4 ativos com matriz fundamentalista e gráfico normalizado em Base 100.
3. **Robô de Automação Diária da CVM**:
   - Serviço em background que conecta diariamente ao portal de Dados Abertos da CVM (`dados.cvm.gov.br`) e atualiza as cotas sem intervenção humana.
4. **Simulador de Investimentos & Meta Atuarial**:
   - Calculadora com projeção de juros compostos com aportes regulares dos servidores e cota patronal.
5. **Exportador 'One-Page Report'**:
   - Relatório condensado oficial para reuniões do Comitê de Investimentos com referências à Resolução CMN 5.272/2025.
6. **Trilha de Auditoria Imutável (Audit Trail)**:
   - Tabela `audit_logs` no PostgreSQL com trigger que impede alteração ou exclusão, gravando IP, usuário, data/hora e hash SHA-256.
