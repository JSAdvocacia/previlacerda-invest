# Guia Definitivo: Hospedagem Gratuita, Segura e sem Servidor de Renderização
## PREVI-LACERDA — Sistema de Gestão da Carteira de Investimentos RPPS

Este guia orienta o deploy completo do sistema na internet para acesso público ou institucional a partir de qualquer dispositivo (computador, tablet, celular), **sem custos mensais**, com **banco de dados em nuvem criptografado**, **HTTPS automático** e **sem problemas de suspensão por inatividade** (sem usar o Render.com que "dorme" após 15 minutos e sem o overhead de renderização SSR).

---

### 1. Arquitetura da Solução em Nuvem Gratuita

```
                 [ USUÁRIO EM QUALQUER LUGAR ]
                              │ (HTTPS / TLS 1.3)
                              ▼
    ┌────────────────────────────────────────────────────────┐
    │  FRONTEND NA EDGE CDN (Vercel ou Cloudflare Pages)     │
    │  - Pura SPA Estática compilada (HTML/JS/CSS)           │
    │  - Carregamento instantâneo em milissegundos           │
    │  - Custo: R$ 0,00 | SSL Gratuito | Sem Cold-Start      │
    └─────────────────────────┬──────────────────────────────┘
                              │
               Chamadas REST  │
                              ▼
    ┌────────────────────────────────────────────────────────┐
    │  BANCO DE DADOS POSTGRESQL EM NUVEM (Supabase / Neon)  │
    │  - 500 MB gratuitos permanentes com SSL Obrigatório    │
    │  - Schema com triggers de auditoria imutáveis          │
    │  - Acessível com alta segurança de qualquer IP         │
    └─────────────────────────▲──────────────────────────────┘
                              │
               Execução Diária│ (Às 21:00 BRT via CRON)
                              │
    ┌────────────────────────────────────────────────────────┐
    │  ROBÔ CVM NOTURNO (GitHub Actions Scheduled Workflow)  │
    │  - Executa pontualmente de Seg a Sex às 21:00 BRT      │
    │  - Baixa dados da CVM e atualiza as cotas no Supabase  │
    │  - Custo: R$ 0,00 (2.000 minutos grátis/mês)          │
    └────────────────────────────────────────────────────────┘
```

---

### 2. Passo 1: Criar o Banco de Dados em Nuvem Gratuito no Supabase

1. Acesse [https://supabase.com](https://supabase.com) e crie uma conta gratuita com seu GitHub ou e-mail.
2. Clique em **"New Project"**:
   - **Name**: `previlacerda-invest`
   - **Database Password**: Escolha uma senha forte (anote-a!).
   - **Region**: Selecione `São Paulo (South America)` para menor latência.
   - **Plan**: `Free` (Gratuito).
3. Após a criação (cerca de 1 minuto), vá em **SQL Editor** no menu lateral esquerdo.
4. Clique em **"New query"**:
   - Abra o arquivo `database/schema.sql` deste projeto, copie todo o conteúdo e cole no SQL Editor do Supabase.
   - Clique em **"Run"** para criar todas as tabelas, tipos ENUM e triggers de auditoria.
   - Em seguida, abra o arquivo `database/seeds.sql`, copie e cole no SQL Editor e clique em **"Run"** para carregar os fundos, a Resolução CMN 5.272/2025 e o usuário Master (`prof.jan100@gmail.com`).
5. Obtenha a String de Conexão:
   - Vá em **Project Settings** (ícone de engrenagem) -> **Database**.
   - Na seção **Connection String**, selecione a aba **URI**.
   - Copie a URL (ela terá o formato `postgresql://postgres:[SUA_SENHA]@db.[PROJECT_REF].supabase.co:5432/postgres`).

---

### 3. Passo 2: Publicar o Repositório no GitHub

1. Crie um repositório no seu GitHub (pode ser Público ou Privado), por exemplo `previlacerda-invest`.
2. No seu computador, dentro da pasta `d:\Nova pasta`:
```bash
git init
git add .
git commit -m "feat: PREVI-LACERDA versao com CMN 5272/2025 e deploy em nuvem"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/previlacerda-invest.git
git push -u origin main
```
3. No GitHub do seu repositório, vá em **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**:
   - **Name**: `DATABASE_URL`
   - **Secret**: Cole a URL de conexão do Supabase obtida no Passo 1.
   *(Isso ativa o robô automático noturno da CVM via GitHub Actions sem custo algum!).*

---

### 4. Passo 3: Hospedar o Frontend Grátis na Vercel ou Cloudflare Pages

#### Opção A: Vercel (Recomendada - 2 Minutos)
1. Acesse [https://vercel.com](https://vercel.com) e faça login com sua conta do GitHub.
2. Clique em **"Add New..."** -> **"Project"**.
3. Selecione o repositório `previlacerda-invest`.
4. Em **Root Directory**, clique em **Edit** e selecione a pasta `frontend`.
5. Em **Framework Preset**, a Vercel detectará automaticamente **Vite**.
6. Clique em **"Deploy"**.
7. Em menos de 60 segundos, a Vercel gerará seu link público com HTTPS (exemplo: `https://previlacerda-invest.vercel.app`).
8. O arquivo `frontend/vercel.json` configurado neste projeto garante que a navegação interna e recarregamentos de página (F5) funcionem sem erros 404.

#### Opção B: Cloudflare Pages (Alternativa 100% Gratuita com Largura de Banda Ilimitada)
1. Acesse [https://pages.cloudflare.com](https://pages.cloudflare.com) e faça login.
2. Clique em **"Criar um aplicativo"** -> **"Pages"** -> **"Conectar ao Git"**.
3. Selecione o repositório.
4. Defina:
   - **Diretório raiz**: `frontend`
   - **Comando de compilação**: `npm run build`
   - **Diretório de saída da compilação**: `dist`
5. Clique em **"Salvar e implantar"**.

---

### 5. Passo 4: Automação Diária da CVM em Nuvem (Custo Zero)

O arquivo `.github/workflows/cvm-cron.yml` incluído neste repositório roda automaticamente:
- **Horário**: De segunda a sexta-feira às 21:00 BRT.
- **Operação**: Conecta ao portal oficial de Dados Abertos da CVM, baixa o informe diário de cotas, filtra os CNPJs do PREVI-LACERDA e atualiza o banco de dados no Supabase.
- **Sem necessidade de VPS ou servidor 24 horas ligado**: O GitHub Actions executa e desliga imediatamente, consumindo menos de 2 minutos por dia da cota gratuita de 2.000 minutos mensais do GitHub.

---

### 6. Acesso Seguro ao Sistema em Produção

Após o deploy, qualquer membro autorizado do município ou comitê poderá acessar o sistema pela URL pública (ex: `https://previlacerda-invest.vercel.app`):
- **Usuário Master**: `prof.jan100@gmail.com`
- **Senha Inicial**: `123456`
- **Comportamento no Primeiro Acesso**: O sistema solicita obrigatoriamente a troca da senha inicial por uma senha definitiva antes de liberar o acesso.
- **Painel Master**: No topo da página, o botão **"Gestão de Perfis"** permite cadastrar novos servidores, validar e-mails e delegar acessos de Diretoria, Comitê e Conselho Fiscal.
