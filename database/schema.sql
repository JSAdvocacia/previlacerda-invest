-- ==============================================================================
-- SISTEMA DE GESTÃO DA CARTEIRA DE INVESTIMENTOS - PREVI-LACERDA
-- Instituto de Previdência dos Servidores Públicos do Município de Pontes e Lacerda - MT
-- Modelagem Relacional PostgreSQL (Compatível com Normativos RPPS e CVM)
-- Base Legal Atualizada: Resolução CMN nº 5.272/2025 (de 18/12/2025)
-- Link Oficial: https://www.gov.br/previdencia/pt-br/assuntos/rpps/legislacao-dos-rpps/arquivos/2025/ResoluoBCCMNn5.272de18dez2025.pdf
-- ==============================================================================

-- 1. EXTENSÕES & DOMÍNIOS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. MÓDULO DE SEGURANÇA, CONTROLE DE ACESSO (RBAC) E AUDITORIA
-- ==============================================================================

CREATE TYPE user_role_enum AS ENUM (
    'MASTER_ADMIN',             -- Usuário Master com acesso total e atribuição de perfis
    'DIRETORIA_EXECUTIVA',      -- Acesso total, dashboards, aprovação de ativos e risco
    'COMITE_INVESTIMENTOS',     -- Simulador, comparador, gráficos, cadastro pendente de aprovação
    'AUDITORIA_CONSELHO_FISCAL' -- Read-Only irrestrito de dados e acesso à trilha de auditoria
);

CREATE TYPE asset_status_enum AS ENUM (
    'PENDENTE_APROVACAO',
    'APROVADO',
    'REJEITADO',
    'INATIVO'
);

CREATE TYPE risk_level_enum AS ENUM (
    'MUITO_BAIXO',
    'BAIXO',
    'MEDIO',
    'ALTO',
    'MUITO_ALTO'
);

CREATE TYPE asset_class_enum AS ENUM (
    'RENDA_FIXA',
    'RENDA_VARIAVEL',
    'INVESTIMENTO_EXTERIOR',
    'MULTIMERCADO',
    'IMOVEIS_FII',
    'TITULO_PUBLICO_DIRETO'
);

-- Tabela de Usuários com hashing seguro de senha (Argon2 / bcrypt)
-- Suporte a validação prévia de e-mail e troca obrigatória no primeiro acesso
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(180) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'COMITE_INVESTIMENTOS',
    cpf VARCHAR(14) UNIQUE,
    registration_number VARCHAR(50), -- Matrícula PREVI-LACERDA
    is_active BOOLEAN DEFAULT TRUE,
    is_email_verified BOOLEAN DEFAULT FALSE, -- Validação de e-mail obrigatória antes do 1º acesso
    email_verification_token VARCHAR(255),
    email_verified_at TIMESTAMPTZ,
    must_change_password BOOLEAN DEFAULT FALSE, -- Força troca de senha no 1º acesso (obrigatório para Master)
    password_changed_at TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    last_login_ip VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Auditoria Imutável (Append-Only Audit Trail)
-- Exigência expressa de Compliance RPPS / TCE-MT
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_email VARCHAR(180),
    user_role VARCHAR(50),
    action VARCHAR(50) NOT NULL,            -- e.g. 'CREATE_ASSET', 'APPROVE_ASSET', 'ASSIGN_ROLE'
    resource VARCHAR(100) NOT NULL,          -- e.g. 'assets', 'users', 'risk_parameters'
    record_id VARCHAR(100),                 -- ID do registro afetado
    ip_address VARCHAR(45) NOT NULL,        -- IPv4 ou IPv6
    user_agent TEXT,
    old_data JSONB,                         -- Estado anterior para rollback ou inspeção
    new_data JSONB,                         -- Novo estado
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    integrity_hash VARCHAR(64)              -- Hash SHA-256 encadeado para prova de não violação
);

CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource, record_id);

-- Restrição de integridade: tabela de auditoria não permite DELETE nem UPDATE via trigger
CREATE OR REPLACE FUNCTION prevent_audit_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Operação não permitida: A trilha de auditoria (audit_logs) é estritamente imutável!';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_protect_audit_logs
BEFORE UPDATE OR DELETE ON audit_logs
FOR EACH ROW EXECUTE FUNCTION prevent_audit_modification();

-- ==============================================================================
-- 3. MÓDULO DE PARAMETRIZAÇÃO LEGAL E ENQUADRAMENTO (RESOLUÇÃO CMN Nº 5.272/2025)
-- Link Oficial: https://www.gov.br/previdencia/pt-br/assuntos/rpps/legislacao-dos-rpps/arquivos/2025/ResoluoBCCMNn5.272de18dez2025.pdf
-- ==============================================================================

CREATE TABLE cmn_regulations (
    id SERIAL PRIMARY KEY,
    regulation_norm VARCHAR(100) DEFAULT 'Resolução CMN nº 5.272/2025',
    regulation_url TEXT DEFAULT 'https://www.gov.br/previdencia/pt-br/assuntos/rpps/legislacao-dos-rpps/arquivos/2025/ResoluoBCCMNn5.272de18dez2025.pdf',
    article_code VARCHAR(50) NOT NULL UNIQUE, -- e.g. 'Art. 7º, I, "a"', 'Art. 8º, I'
    description TEXT NOT NULL,
    max_portfolio_limit_pct NUMERIC(5,2) NOT NULL, -- Limite máximo de alocação da carteira (%)
    asset_class asset_class_enum NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 4. CADASTRO DE ATIVOS FINANCEIROS
-- ==============================================================================

CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cnpj VARCHAR(18) UNIQUE, -- CNPJ do fundo ou emissor
    cvm_code VARCHAR(20),    -- Código CVM do fundo para integração automatizada
    name VARCHAR(255) NOT NULL, -- Razão Social / Nome completo
    trading_name VARCHAR(150),  -- Nome Fantasia comercial (exibição Investidor10)
    asset_class asset_class_enum NOT NULL,
    cmn_regulation_id INT REFERENCES cmn_regulations(id),
    
    -- Participantes do Ativo
    administrator VARCHAR(200) NOT NULL, -- Administrador Fiduciário
    administrator_cnpj VARCHAR(18),
    manager VARCHAR(200) NOT NULL,       -- Gestor de Recursos
    custodian VARCHAR(200),             -- Custodiante
    
    -- Características Operacionais e Risco
    benchmark VARCHAR(50) DEFAULT 'CDI', -- e.g. 'CDI', 'IPCA + 5,50%', 'IMA-B', 'IBOV'
    risk_level risk_level_enum NOT NULL,
    anbima_category VARCHAR(100),
    liquidity_days INT DEFAULT 0,       -- Prazo de resgate cotização + liquidação (D+X)
    admin_fee_pct NUMERIC(5,2) DEFAULT 0.00, -- Taxa de administração a.a.
    performance_fee_pct NUMERIC(5,2) DEFAULT 0.00, -- Taxa de performance
    maturity_date DATE,                 -- Data de vencimento (para títulos)
    inception_date DATE,                -- Data de início do fundo
    is_qualified_investor BOOLEAN DEFAULT FALSE,
    
    -- Status e Aprovação (Fluxo RPPS)
    status asset_status_enum DEFAULT 'PENDENTE_APROVACAO',
    registered_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assets_cnpj ON assets(cnpj);
CREATE INDEX idx_assets_cvm_code ON assets(cvm_code);
CREATE INDEX idx_assets_class ON assets(asset_class);
CREATE INDEX idx_assets_status ON assets(status);

-- ==============================================================================
-- 5. HISTÓRICO DE COTAS E DADOS DA CVM (ALIMENTAÇÃO AUTOMATIZADA)
-- ==============================================================================

CREATE TABLE asset_daily_quotes (
    id BIGSERIAL PRIMARY KEY,
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    reference_date DATE NOT NULL,
    quota_value NUMERIC(18, 8) NOT NULL, -- Valor da Cota diária
    net_equity NUMERIC(18, 2) NOT NULL,  -- Patrimônio Líquido do Fundo (PL)
    shareholders_count INT DEFAULT 0,    -- Quantidade de Cotistas
    daily_inflow NUMERIC(18, 2) DEFAULT 0,  -- Captação no dia
    daily_outflow NUMERIC(18, 2) DEFAULT 0, -- Resgates no dia
    daily_return_pct NUMERIC(10, 6),        -- Retorno diário calculado (%)
    source VARCHAR(50) DEFAULT 'CVM_OPEN_DATA',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_asset_quote_date UNIQUE (asset_id, reference_date)
);

CREATE INDEX idx_asset_quotes_date ON asset_daily_quotes(reference_date DESC);
CREATE INDEX idx_asset_quotes_asset_date ON asset_daily_quotes(asset_id, reference_date DESC);

-- Log de Execução dos Jobs da CVM (CRON)
CREATE TABLE cvm_ingestion_logs (
    id BIGSERIAL PRIMARY KEY,
    job_identifier VARCHAR(100) NOT NULL,
    target_date DATE NOT NULL,
    file_processed VARCHAR(150),
    total_records_read INT DEFAULT 0,
    assets_updated INT DEFAULT 0,
    execution_time_seconds NUMERIC(8,2),
    status VARCHAR(30) NOT NULL, -- 'SUCCESS', 'WARNING', 'FAILED'
    error_message TEXT,
    executed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 6. CARTEIRA DE INVESTIMENTOS DO PREVI-LACERDA
-- ==============================================================================

CREATE TABLE portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    entity_name VARCHAR(200) DEFAULT 'Instituto de Previdência dos Servidores Públicos de Pontes e Lacerda',
    actuarial_rate_pct NUMERIC(5,2) DEFAULT 5.50, -- Spread da Meta Atuarial (IPCA + 5.50% a.a.)
    base_benchmark VARCHAR(50) DEFAULT 'IPCA',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE portfolio_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE RESTRICT,
    quantity_quotas NUMERIC(18, 8) NOT NULL,
    acquisition_average_price NUMERIC(18, 8) NOT NULL,
    total_invested NUMERIC(18, 2) NOT NULL,
    weight_pct NUMERIC(6, 3),
    last_valuation_date DATE,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_portfolio_asset UNIQUE (portfolio_id, asset_id)
);

-- ==============================================================================
-- 7. BENCHMARKS E SÉRIES HISTÓRICAS DO MERCADO FINANCEIRO
-- ==============================================================================

CREATE TABLE market_benchmarks (
    id SERIAL PRIMARY KEY,
    code VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255)
);

CREATE TABLE benchmark_rates (
    id BIGSERIAL PRIMARY KEY,
    benchmark_id INT REFERENCES market_benchmarks(id) ON DELETE CASCADE,
    reference_date DATE NOT NULL,
    daily_rate_pct NUMERIC(10, 6) NOT NULL,
    accumulated_index NUMERIC(18, 8),
    CONSTRAINT uq_benchmark_date UNIQUE (benchmark_id, reference_date)
);

CREATE INDEX idx_benchmark_rates_date ON benchmark_rates(reference_date DESC);
