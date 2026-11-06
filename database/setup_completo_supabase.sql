-- ==============================================================================
-- SETUP COMPLETO SUPABASE - PREVI-LACERDA
-- Copie e cole todo este script no SQL Editor do Supabase e clique em RUN
-- Base Legal: Resolução CMN nº 5.272/2025 (de 18/12/2025)
-- ==============================================================================

-- 1. EXTENSÕES & DOMÍNIOS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM (
        'MASTER_ADMIN',
        'DIRETORIA_EXECUTIVA',
        'COMITE_INVESTIMENTOS',
        'AUDITORIA_CONSELHO_FISCAL'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE asset_status_enum AS ENUM (
        'PENDENTE_APROVACAO',
        'APROVADO',
        'REJEITADO',
        'INATIVO'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE risk_level_enum AS ENUM (
        'MUITO_BAIXO',
        'BAIXO',
        'MEDIO',
        'ALTO',
        'MUITO_ALTO'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE asset_class_enum AS ENUM (
        'RENDA_FIXA',
        'RENDA_VARIAVEL',
        'INVESTIMENTO_EXTERIOR',
        'MULTIMERCADO',
        'IMOVEIS_FII',
        'TITULO_PUBLICO_DIRETO'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. TABELA DE USUÁRIOS
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(180) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'COMITE_INVESTIMENTOS',
    cpf VARCHAR(14) UNIQUE,
    registration_number VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    email_verified_at TIMESTAMPTZ,
    must_change_password BOOLEAN DEFAULT FALSE,
    password_changed_at TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    last_login_ip VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. TRILHA DE AUDITORIA IMUTÁVEL
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_email VARCHAR(180),
    user_role VARCHAR(50),
    action VARCHAR(50) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    record_id VARCHAR(100),
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    old_data JSONB,
    new_data JSONB,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    integrity_hash VARCHAR(64)
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);

CREATE OR REPLACE FUNCTION prevent_audit_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Operação não permitida: A trilha de auditoria (audit_logs) é estritamente imutável!';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_protect_audit_logs ON audit_logs;
CREATE TRIGGER trg_protect_audit_logs
BEFORE UPDATE OR DELETE ON audit_logs
FOR EACH ROW EXECUTE FUNCTION prevent_audit_modification();

-- 4. REGULAMENTAÇÃO CMN Nº 5.272/2025
CREATE TABLE IF NOT EXISTS cmn_regulations (
    id SERIAL PRIMARY KEY,
    regulation_norm VARCHAR(100) DEFAULT 'Resolução CMN nº 5.272/2025',
    regulation_url TEXT DEFAULT 'https://www.gov.br/previdencia/pt-br/assuntos/rpps/legislacao-dos-rpps/arquivos/2025/ResoluoBCCMNn5.272de18dez2025.pdf',
    article_code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    max_portfolio_limit_pct NUMERIC(5,2) NOT NULL,
    asset_class asset_class_enum NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. ATIVOS FINANCEIROS
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cnpj VARCHAR(18) UNIQUE,
    cvm_code VARCHAR(20),
    name VARCHAR(255) NOT NULL,
    trading_name VARCHAR(150),
    asset_class asset_class_enum NOT NULL,
    cmn_regulation_id INT REFERENCES cmn_regulations(id),
    administrator VARCHAR(200) NOT NULL,
    administrator_cnpj VARCHAR(18),
    manager VARCHAR(200) NOT NULL,
    custodian VARCHAR(200),
    benchmark VARCHAR(50) DEFAULT 'CDI',
    risk_level risk_level_enum NOT NULL,
    anbima_category VARCHAR(100),
    liquidity_days INT DEFAULT 0,
    admin_fee_pct NUMERIC(5,2) DEFAULT 0.00,
    performance_fee_pct NUMERIC(5,2) DEFAULT 0.00,
    maturity_date DATE,
    inception_date DATE,
    is_qualified_investor BOOLEAN DEFAULT FALSE,
    status asset_status_enum DEFAULT 'PENDENTE_APROVACAO',
    registered_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. HISTÓRICO DE COTAS E ROBÔ CVM
CREATE TABLE IF NOT EXISTS asset_daily_quotes (
    id BIGSERIAL PRIMARY KEY,
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    reference_date DATE NOT NULL,
    quota_value NUMERIC(18, 8) NOT NULL,
    net_equity NUMERIC(18, 2) NOT NULL,
    shareholders_count INT DEFAULT 0,
    daily_inflow NUMERIC(18, 2) DEFAULT 0,
    daily_outflow NUMERIC(18, 2) DEFAULT 0,
    daily_return_pct NUMERIC(10, 6),
    source VARCHAR(50) DEFAULT 'CVM_OPEN_DATA',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_asset_quote_date UNIQUE (asset_id, reference_date)
);

CREATE TABLE IF NOT EXISTS cvm_ingestion_logs (
    id BIGSERIAL PRIMARY KEY,
    job_identifier VARCHAR(100) NOT NULL,
    target_date DATE NOT NULL,
    file_processed VARCHAR(150),
    total_records_read INT DEFAULT 0,
    assets_updated INT DEFAULT 0,
    execution_time_seconds NUMERIC(8,2),
    status VARCHAR(30) NOT NULL,
    error_message TEXT,
    executed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. CARTEIRA PREVI-LACERDA
CREATE TABLE IF NOT EXISTS portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    entity_name VARCHAR(200) DEFAULT 'Instituto de Previdência dos Servidores Públicos de Pontes e Lacerda',
    actuarial_rate_pct NUMERIC(5,2) DEFAULT 5.50,
    base_benchmark VARCHAR(50) DEFAULT 'IPCA',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS portfolio_allocations (
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
-- CARGA DE DADOS INICIAIS (SEEDS)
-- ==============================================================================

-- Enquadramentos CMN 5.272/2025
INSERT INTO cmn_regulations (id, regulation_norm, regulation_url, article_code, description, max_portfolio_limit_pct, asset_class) VALUES
(1, 'Resolução CMN nº 5.272/2025', 'https://www.gov.br/previdencia/pt-br/assuntos/rpps/legislacao-dos-rpps/arquivos/2025/ResoluoBCCMNn5.272de18dez2025.pdf', 'Art. 7º, I, "a"', 'Títulos do Tesouro Nacional - Registrados no Selic', 100.00, 'TITULO_PUBLICO_DIRETO'),
(2, 'Resolução CMN nº 5.272/2025', 'https://www.gov.br/previdencia/pt-br/assuntos/rpps/legislacao-dos-rpps/arquivos/2025/ResoluoBCCMNn5.272de18dez2025.pdf', 'Art. 7º, I, "b"', 'Fundos de Índice Referenciados em Títulos Públicos (100% TP)', 100.00, 'RENDA_FIXA'),
(3, 'Resolução CMN nº 5.272/2025', 'https://www.gov.br/previdencia/pt-br/assuntos/rpps/legislacao-dos-rpps/arquivos/2025/ResoluoBCCMNn5.272de18dez2025.pdf', 'Art. 7º, III, "a"', 'Fundos de Renda Fixa com Títulos Públicos e Privados Alto Risco de Crédito', 60.00, 'RENDA_FIXA'),
(4, 'Resolução CMN nº 5.272/2025', 'https://www.gov.br/previdencia/pt-br/assuntos/rpps/legislacao-dos-rpps/arquivos/2025/ResoluoBCCMNn5.272de18dez2025.pdf', 'Art. 7º, IV', 'Fundos Renda Fixa Crédito Privado', 20.00, 'RENDA_FIXA'),
(5, 'Resolução CMN nº 5.272/2025', 'https://www.gov.br/previdencia/pt-br/assuntos/rpps/legislacao-dos-rpps/arquivos/2025/ResoluoBCCMNn5.272de18dez2025.pdf', 'Art. 8º, I', 'Fundos de Investimento em Ações (FIA)', 30.00, 'RENDA_VARIAVEL'),
(6, 'Resolução CMN nº 5.272/2025', 'https://www.gov.br/previdencia/pt-br/assuntos/rpps/legislacao-dos-rpps/arquivos/2025/ResoluoBCCMNn5.272de18dez2025.pdf', 'Art. 9º, II', 'Fundos de Investimento no Exterior (BDR / Renda Fixa e Ações Exterior)', 10.00, 'INVESTIMENTO_EXTERIOR'),
(7, 'Resolução CMN nº 5.272/2025', 'https://www.gov.br/previdencia/pt-br/assuntos/rpps/legislacao-dos-rpps/arquivos/2025/ResoluoBCCMNn5.272de18dez2025.pdf', 'Art. 10, I', 'Fundos Multimercado (FIM)', 10.00, 'MULTIMERCADO')
ON CONFLICT (article_code) DO NOTHING;

-- Usuário MASTER: prof.jan100@gmail.com (Senha inicial: 123456, troca forçada no 1º acesso)
INSERT INTO users (
    id, name, email, password_hash, role, cpf, registration_number, 
    is_active, is_email_verified, email_verified_at, must_change_password
) VALUES
('00000000-0000-0000-0000-000000000000', 'Prof. Jansen (Administrador Master)', 'prof.jan100@gmail.com', '$2a$10$wT3WlG5J1o001.XU93c0yej0p8j84RnmWJ6yK7f7W87gK94NgeH2y', 'MASTER_ADMIN', '000.111.222-33', 'MST-001', TRUE, TRUE, CURRENT_TIMESTAMP, TRUE),
('11111111-1111-1111-1111-111111111111', 'Dr. Carlos Eduardo Guimarães', 'diretoria@previlacerda.mt.gov.br', '$2a$10$wT3WlG5J1o001.XU93c0yej0p8j84RnmWJ6yK7f7W87gK94NgeH2y', 'DIRETORIA_EXECUTIVA', '123.456.789-01', 'DIR-001', TRUE, TRUE, CURRENT_TIMESTAMP, FALSE),
('22222222-2222-2222-2222-222222222222', 'Mariana Alencar Souza', 'comite@previlacerda.mt.gov.br', '$2a$10$wT3WlG5J1o001.XU93c0yej0p8j84RnmWJ6yK7f7W87gK94NgeH2y', 'COMITE_INVESTIMENTOS', '234.567.890-12', 'COM-014', TRUE, TRUE, CURRENT_TIMESTAMP, FALSE),
('33333333-3333-3333-3333-333333333333', 'Roberto Mendonça (Auditor Fiscal)', 'auditoria@previlacerda.mt.gov.br', '$2a$10$wT3WlG5J1o001.XU93c0yej0p8j84RnmWJ6yK7f7W87gK94NgeH2y', 'AUDITORIA_CONSELHO_FISCAL', '345.678.901-23', 'AUD-007', TRUE, TRUE, CURRENT_TIMESTAMP, FALSE)
ON CONFLICT (email) DO NOTHING;

-- Carteira PREVI-LACERDA
INSERT INTO portfolios (id, code, name, entity_name, actuarial_rate_pct, base_benchmark) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'PREVI_LACERDA_2026', 'Carteira Geral Consolidada PREVI-LACERDA', 'Instituto de Previdência de Pontes e Lacerda - MT', 5.50, 'IPCA')
ON CONFLICT (code) DO NOTHING;

-- Ativos da Carteira
INSERT INTO assets (id, cnpj, cvm_code, name, trading_name, asset_class, cmn_regulation_id, administrator, manager, custodian, benchmark, risk_level, anbima_category, liquidity_days, admin_fee_pct, performance_fee_pct, status, approved_at) VALUES
('b1111111-1111-1111-1111-111111111111', '13.397.466/0001-14', '180293', 'BB PREVIDENCIÁRIO RENDA FIXA ALOCAÇÃO ATIVA FIC FI', 'BB Previdência RF Alocação Ativa', 'RENDA_FIXA', 2, 'BB GESTÃO DE RECURSOS DTVM S.A.', 'BB GESTÃO DE RECURSOS DTVM S.A.', 'BANCO DO BRASIL S.A.', 'IMA-B / CDI', 'BAIXO', 'Renda Fixa Duração Livre Soberano', 1, 0.20, 0.00, 'APROVADO', CURRENT_TIMESTAMP),
('b2222222-2222-2222-2222-222222222222', '11.060.940/0001-65', '142839', 'CAIXA BRASIL IMA-B 5+ TÍTULOS PÚBLICOS FI RENDA FIXA LP', 'Caixa Brasil IMA-B 5+ TP RF LP', 'RENDA_FIXA', 2, 'CAIXA ECONÔMICA FEDERAL', 'CAIXA DTVM S.A.', 'CAIXA ECONÔMICA FEDERAL', 'IMA-B 5+', 'MEDIO', 'Renda Fixa Indexados', 0, 0.20, 0.00, 'APROVADO', CURRENT_TIMESTAMP),
('b3333333-3333-3333-3333-333333333333', '10.742.584/0001-59', '124982', 'SANTANDER INSTITUCIONAL TITULOS PUBLICOS FI RENDA FIXA', 'Santander Institucional TP RF', 'RENDA_FIXA', 2, 'BANCO SANTANDER (BRASIL) S.A.', 'SANTANDER ASSET MANAGEMENT DTVM', 'BANCO SANTANDER S.A.', 'CDI', 'MUITO_BAIXO', 'Renda Fixa Soberano', 0, 0.15, 0.00, 'APROVADO', CURRENT_TIMESTAMP),
('b4444444-4444-4444-4444-444444444444', '03.922.311/0001-98', '089201', 'ITAÚ IBOVESPA ATIVO INSTITUCIONAL FIA', 'Itaú Institucional FIA Ações', 'RENDA_VARIAVEL', 5, 'BANCO ITAÚ CARTEIRAS S.A.', 'ITAÚ ASSET MANAGEMENT LTDA', 'BANCO ITAÚ UNIBANCO S.A.', 'IBOVESPA', 'ALTO', 'Ações Indexadas', 3, 1.00, 0.00, 'APROVADO', CURRENT_TIMESTAMP),
('b5555555-5555-5555-5555-555555555555', '35.651.712/0001-80', '321940', 'WESTERN ASSET GLOBAL BOND BDR NÍVEL I FI RENDA FIXA EXTERIOR', 'Western Asset Global Bond Exterior', 'INVESTIMENTO_EXTERIOR', 6, 'BEM DTVM LTDA', 'WESTERN ASSET MANAGEMENT DTVM', 'BANCO BRADESCO S.A.', 'Global Aggregate USD', 'MEDIO', 'Renda Fixa Exterior', 5, 0.60, 0.00, 'APROVADO', CURRENT_TIMESTAMP),
('b6666666-6666-6666-6666-666666666666', '00.000.000/0001-00', NULL, 'NOTA DO TESOURO NACIONAL - SÉRIE B (NTN-B 2035)', 'NTN-B 2035 (Tesouro IPCA+)', 'TITULO_PUBLICO_DIRETO', 1, 'SECRETARIA DO TESOURO NACIONAL', 'TESOURO DIRETO / SELIC', 'BANCO CENTRAL DO BRASIL', 'IPCA + 5,85% a.a.', 'MUITO_BAIXO', 'Título Público Federal', 0, 0.00, 0.00, 'APROVADO', CURRENT_TIMESTAMP)
ON CONFLICT (cnpj) DO NOTHING;

-- Alocação da Carteira (R$ 68,5 Milhões)
INSERT INTO portfolio_allocations (portfolio_id, asset_id, quantity_quotas, acquisition_average_price, total_invested, weight_pct, last_valuation_date) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b1111111-1111-1111-1111-111111111111', 5840212.45000000, 3.85000000, 24500000.00, 35.77, '2026-11-05'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b2222222-2222-2222-2222-222222222222', 2950140.12000000, 5.20000000, 16800000.00, 24.53, '2026-11-05'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b3333333-3333-3333-3333-333333333333', 3800450.80000000, 3.10000000, 12200000.00, 17.81, '2026-11-05'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b4444444-4444-4444-4444-444444444444', 1205000.00000000, 4.15000000,  5200000.00,  7.59, '2026-11-05'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b5555555-5555-5555-5555-555555555555',  980000.00000000, 3.88000000,  3800000.00,  5.55, '2026-11-05'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b6666666-6666-6666-6666-666666666666',    1420.00000000, 4225.35000000, 6000000.00,  8.75, '2026-11-05')
ON CONFLICT (portfolio_id, asset_id) DO NOTHING;
