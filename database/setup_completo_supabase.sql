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
(4, 'Resolução CMN nº 5.272/2025', 'https://www.gov.br/previdencia/pt-br/assuntos/rpps/legislacao-dos-rpps/arquivos/2025/ResoluoBCCMNn5.272de18dez2025.pdf', 'Art. 7º, IV', 'Fundos Renda Fixa Crédito Privado / Letras Financeiras', 20.00, 'RENDA_FIXA'),
(5, 'Resolução CMN nº 5.272/2025', 'https://www.gov.br/previdencia/pt-br/assuntos/rpps/legislacao-dos-rpps/arquivos/2025/ResoluoBCCMNn5.272de18dez2025.pdf', 'Art. 8º, I', 'Fundos de Investimento em Ações (FIA)', 30.00, 'RENDA_VARIAVEL'),
(6, 'Resolução CMN nº 5.272/2025', 'https://www.gov.br/previdencia/pt-br/assuntos/rpps/legislacao-dos-rpps/arquivos/2025/ResoluoBCCMNn5.272de18dez2025.pdf', 'Art. 9º, II', 'Fundos de Investimento no Exterior', 10.00, 'INVESTIMENTO_EXTERIOR'),
(7, 'Resolução CMN nº 5.272/2025', 'https://www.gov.br/previdencia/pt-br/assuntos/rpps/legislacao-dos-rpps/arquivos/2025/ResoluoBCCMNn5.272de18dez2025.pdf', 'Art. 10, I', 'Fundos Multimercado (FIM)', 10.00, 'MULTIMERCADO')
ON CONFLICT (article_code) DO NOTHING;

-- Usuário MASTER: prof.jan100@gmail.com (Senha autorizada: Capivaraalbin@01, acesso regular liberado)
INSERT INTO users (
    id, name, email, password_hash, role, cpf, registration_number, 
    is_active, is_email_verified, email_verified_at, must_change_password
) VALUES
('00000000-0000-0000-0000-000000000000', 'Prof. Jansen (Administrador Master)', 'prof.jan100@gmail.com', '$2a$10$7aJzZqU17s8m/xX6W5G4uOGhGkYgI92vB/7sW5p1u7a.QzQvR2rKi', 'MASTER_ADMIN', '559.218.411-53', 'MST-001', TRUE, TRUE, CURRENT_TIMESTAMP, FALSE)
ON CONFLICT (email) DO UPDATE SET 
    role = 'MASTER_ADMIN', 
    password_hash = '$2a$10$7aJzZqU17s8m/xX6W5G4uOGhGkYgI92vB/7sW5p1u7a.QzQvR2rKi',
    must_change_password = FALSE;

-- Carteira PREVI-LACERDA Oficial (Setembro/2026 - R$ 138.781.858,93)
INSERT INTO portfolios (id, code, name, entity_name, actuarial_rate_pct, base_benchmark) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'PREVI_LACERDA_2026', 'Carteira Geral Consolidada PREVI-LACERDA (Set/2026)', 'Instituto de Previdência de Pontes e Lacerda - MT', 5.50, 'IPCA')
ON CONFLICT (code) DO NOTHING;

-- Inserção dos 32 Ativos Oficiais do Portfólio PREVI-LACERDA (R$ 138.781.858,93)
INSERT INTO assets (id, cnpj, cvm_code, name, trading_name, asset_class, cmn_regulation_id, administrator, manager, custodian, benchmark, risk_level, anbima_category, liquidity_days, admin_fee_pct, performance_fee_pct, status, approved_at) VALUES
('a0000001-0000-0000-0000-000000000001', '10.740.658/0001-93', '142839', 'CAIXA FI BRASIL IMA-B TIT PUBL RF', 'Caixa FI Brasil IMA-B TP RF', 'RENDA_FIXA', 2, 'CAIXA ECONÔMICA FEDERAL', 'CAIXA DTVM S.A.', 'CAIXA ECONÔMICA FEDERAL', 'IMA-B', 'MEDIO', 'Renda Fixa Indexados', 0, 0.20, 0.00, 'APROVADO', CURRENT_TIMESTAMP),
('a0000002-0000-0000-0000-000000000002', '07.442.078/0001-05', '114812', 'BB PREVIDENCIÁRIO RENDA FIXA IMA-B TP FI', 'BB Previdenciário RF IMA-B TP FI', 'RENDA_FIXA', 2, 'BB GESTÃO DE RECURSOS DTVM S.A.', 'BB GESTÃO DE RECURSOS DTVM S.A.', 'BANCO DO BRASIL S.A.', 'IMA-B', 'MEDIO', 'Renda Fixa Indexados', 1, 0.20, 0.00, 'APROVADO', CURRENT_TIMESTAMP),
('a0000003-0000-0000-0000-000000000003', '10.740.670/0001-06', '142820', 'CAIXA FI BRASIL IRF-M1 RF LP', 'Caixa FI Brasil IRF-M1 RF LP', 'RENDA_FIXA', 2, 'CAIXA ECONÔMICA FEDERAL', 'CAIXA DTVM S.A.', 'CAIXA ECONÔMICA FEDERAL', 'IRF-M 1', 'BAIXO', 'Renda Fixa Indexados', 0, 0.20, 0.00, 'APROVADO', CURRENT_TIMESTAMP),
('a0000004-0000-0000-0000-000000000004', '14.508.643/0001-55', '190454', 'CAIXA FI BRASIL DISPONIBILIDADES RF', 'Caixa FI Brasil Disponibilidades RF', 'RENDA_FIXA', 3, 'CAIXA ECONÔMICA FEDERAL', 'CAIXA DTVM S.A.', 'CAIXA ECONÔMICA FEDERAL', 'CDI', 'MUITO_BAIXO', 'Renda Fixa Soberano', 0, 0.30, 0.00, 'APROVADO', CURRENT_TIMESTAMP),
('a0000005-0000-0000-0000-000000000005', '13.077.415/0001-05', '180285', 'BB PREVIDENCIÁRIO RF FLUXO', 'BB Previdenciário RF Fluxo FI', 'RENDA_FIXA', 2, 'BB GESTÃO DE RECURSOS DTVM S.A.', 'BB GESTÃO DE RECURSOS DTVM S.A.', 'BANCO DO BRASIL S.A.', 'CDI', 'MUITO_BAIXO', 'Renda Fixa Soberano', 0, 0.15, 0.00, 'APROVADO', CURRENT_TIMESTAMP),
('a0000006-0000-0000-0000-000000000006', '13.058.816/0001-18', '180120', 'CAIXA FIC AÇÕES IBOVESPA', 'Caixa FIC Ações Ibovespa', 'RENDA_VARIAVEL', 5, 'CAIXA ECONÔMICA FEDERAL', 'CAIXA DTVM S.A.', 'CAIXA ECONÔMICA FEDERAL', 'IBOVESPA', 'ALTO', 'Ações Indexadas', 3, 1.00, 0.00, 'APROVADO', CURRENT_TIMESTAMP),
('a0000007-0000-0000-0000-000000000007', '10.577.503/0001-88', '142847', 'CAIXA FI BRASIL IRF-M1+ TP RF LP', 'Caixa FI Brasil IRF-M1+ TP RF LP', 'RENDA_FIXA', 2, 'CAIXA ECONÔMICA FEDERAL', 'CAIXA DTVM S.A.', 'CAIXA ECONÔMICA FEDERAL', 'IRF-M 1+', 'MEDIO', 'Renda Fixa Indexados', 0, 0.20, 0.00, 'APROVADO', CURRENT_TIMESTAMP),
('a0000008-0000-0000-0000-000000000008', '23.215.097/0001-55', '280912', 'CAIXA FIC BRASIL GESTÃO ESTRATÉGICA', 'Caixa FIC Brasil Gestão Estratégica RF', 'RENDA_FIXA', 3, 'CAIXA ECONÔMICA FEDERAL', 'CAIXA DTVM S.A.', 'CAIXA ECONÔMICA FEDERAL', 'CDI / IMA-Geral', 'MEDIO', 'Renda Fixa Duração Livre', 3, 0.40, 0.00, 'APROVADO', CURRENT_TIMESTAMP),
('a0000009-0000-0000-0000-000000000009', '13.397.466/0001-14', '180293', 'FI INSTITUCIONAL RF IRF-M LP', 'FI Institucional RF IRF-M LP', 'RENDA_FIXA', 2, 'BB GESTÃO DE RECURSOS DTVM S.A.', 'BB GESTÃO DE RECURSOS DTVM S.A.', 'BANCO DO BRASIL S.A.', 'IRF-M', 'MEDIO', 'Renda Fixa Indexados', 1, 0.20, 0.00, 'APROVADO', CURRENT_TIMESTAMP),
('a0000010-0000-0000-0000-000000000010', '13.081.159/0001-20', '180320', 'SICREDI FI RENDA FIXA LIQUIDEZ EMPRESARIAL', 'Sicredi FI RF Liquidez Empresarial', 'RENDA_FIXA', 2, 'BANCO COOPERATIVO SICREDI S.A.', 'SICREDI ASSET MANAGEMENT', 'BANCO COOPERATIVO SICREDI S.A.', 'CDI', 'BAIXO', 'Renda Fixa Soberano', 0, 0.20, 0.00, 'APROVADO', CURRENT_TIMESTAMP),
('a0000011-0000-0000-0000-000000000011', '14.386.926/0001-71', '190342', 'FI INSTITUCIONAL RF IRF-M1', 'FI Institucional RF IRF-M1', 'RENDA_FIXA', 2, 'CAIXA ECONÔMICA FEDERAL', 'CAIXA DTVM S.A.', 'CAIXA ECONÔMICA FEDERAL', 'IRF-M 1', 'BAIXO', 'Renda Fixa Indexados', 0, 0.18, 0.00, 'APROVADO', CURRENT_TIMESTAMP),
('a0000012-0000-0000-0000-000000000012', '13.322.202/0001-92', '180210', 'BB PREVID RF IDKA 2', 'BB Previdenciário RF IDKA 2 TP', 'RENDA_FIXA', 2, 'BB GESTÃO DE RECURSOS DTVM S.A.', 'BB GESTÃO DE RECURSOS DTVM S.A.', 'BANCO DO BRASIL S.A.', 'IDKA 2', 'BAIXO', 'Renda Fixa Indexados', 1, 0.20, 0.00, 'APROVADO', CURRENT_TIMESTAMP),
('a0000013-0000-0000-0000-000000000013', '42.318.981/0001-75', '450219', 'AÇÕES ESG GLOBAIS IS', 'Ações ESG Globais IS FIA', 'RENDA_VARIAVEL', 5, 'CAIXA ECONÔMICA FEDERAL', 'CAIXA DTVM S.A.', 'CAIXA ECONÔMICA FEDERAL', 'MSCI ESG', 'ALTO', 'Ações Sustentabilidade/ESG', 4, 0.90, 0.00, 'APROVADO', CURRENT_TIMESTAMP),
('a0000014-0000-0000-0000-000000000014', '11.328.882/0001-35', '150428', 'BB PREVID RF IRF-M TP', 'BB Previdenciário RF IRF-M TP FI', 'RENDA_FIXA', 2, 'BB GESTÃO DE RECURSOS DTVM S.A.', 'BB GESTÃO DE RECURSOS DTVM S.A.', 'BANCO DO BRASIL S.A.', 'IRF-M', 'MEDIO', 'Renda Fixa Indexados', 1, 0.20, 0.00, 'APROVADO', CURRENT_TIMESTAMP),
('a0000015-0000-0000-0000-000000000015', '14.218.835/0001-27', '190124', 'BB AÇÕES DIVIDENDOS MIDCAPS', 'BB Ações Dividendos Midcaps FIA', 'RENDA_VARIAVEL', 5, 'BB GESTÃO DE RECURSOS DTVM S.A.', 'BB GESTÃO DE RECURSOS DTVM S.A.', 'BANCO DO BRASIL S.A.', 'IDIV', 'ALTO', 'Ações Dividendos', 3, 1.00, 0.00, 'APROVADO', CURRENT_TIMESTAMP),
('a0000016-0000-0000-0000-000000000016', '10.742.584/0001-59', '142980', 'BB PREVIDENCIÁRIO RF IRF-M 1+ FI', 'BB Previdenciário RF IRF-M 1+ TP', 'RENDA_FIXA', 2, 'BB GESTÃO DE RECURSOS DTVM S.A.', 'BB GESTÃO DE RECURSOS DTVM S.A.', 'BANCO DO BRASIL S.A.', 'IRF-M 1+', 'MEDIO', 'Renda Fixa Indexados', 1, 0.20, 0.00, 'APROVADO', CURRENT_TIMESTAMP),
('a0000017-0000-0000-0000-000000000017', '21.838.144/0001-08', '260450', 'ITAÚ INSTITUCIONAL ALOCAÇÃO DINÂMICA RF FIF CIC RL', 'Itaú Institucional Alocação Dinâmica RF', 'RENDA_FIXA', 3, 'INTAG DTVM LTDA.', 'ITAÚ UNIBANCO ASSET MANAGEMENT', 'ITAÚ UNIBANCO S.A.', 'CDI / IMA-Geral', 'MEDIO', 'Renda Fixa Duração Livre', 1, 0.30, 0.00, 'APROVADO', CURRENT_TIMESTAMP),
('a0000018-0000-0000-0000-000000000018', '03.543.447/0001-03', '089450', 'SANTANDER RENDA FIXA REFERENCIADO DI INSTITUCIONAL PREMIUM', 'Santander RF Ref DI Institucional Premium', 'RENDA_FIXA', 3, 'BANCO SANTANDER (BRASIL) S.A.', 'SANTANDER ASSET MANAGEMENT DTVM', 'BANCO SANTANDER (BRASIL) S.A.', 'CDI', 'BAIXO', 'Renda Fixa Referenciado DI', 0, 0.15, 0.00, 'APROVADO', CURRENT_TIMESTAMP),
('a0000019-0000-0000-0000-000000000019', '05.164.356/0001-84', '100450', 'CAIXA FI BRASIL TÍTULOS PÚBLICOS RF', 'Caixa FI Brasil Títulos Públicos RF', 'RENDA_FIXA', 3, 'CAIXA ECONÔMICA FEDERAL', 'CAIXA DTVM S.A.', 'CAIXA ECONÔMICA FEDERAL', 'CDI', 'BAIXO', 'Renda Fixa Soberano', 0, 0.20, 0.00, 'APROVADO', CURRENT_TIMESTAMP),
('a0000020-0000-0000-0000-000000000020', '28.323.714/0001-87', '330150', 'TARPON GT INSTITUCIONAL FUNDO DE INVESTIMENTO EM COTAS', 'Tarpon GT Institucional FIC FIA', 'RENDA_VARIAVEL', 5, 'BNY MELLON SERVIÇOS FINANCEIROS DTVM S.A.', 'TARPON GESTORA DE RECURSOS LTDA.', 'BNY MELLON BANCO S.A.', 'IBOVESPA', 'ALTO', 'Ações Livre', 30, 1.50, 20.00, 'APROVADO', CURRENT_TIMESTAMP),
('a0000021-0000-0000-0000-000000000021', '14.508.605/0001-00', '190412', 'CAIXA ALIANÇA TÍTULOS PÚBLICOS FUNDO DE INVESTIMENTO FINANCEIRO', 'Caixa Aliança Títulos Públicos FIF', 'RENDA_FIXA', 2, 'CAIXA ECONÔMICA FEDERAL', 'CAIXA DTVM S.A.', 'CAIXA ECONÔMICA FEDERAL', 'IMA-Geral', 'BAIXO', 'Renda Fixa Soberano', 0, 0.18, 0.00, 'APROVADO', CURRENT_TIMESTAMP),
('a0000022-0000-0000-0000-000000000022', '21.986.074/0001-19', '270120', 'CAIXA BRASIL IPCA XVI FUNDO DE INVESTIMENTO FINANCEIRO RF CRÉDITO PRIVADO', 'Caixa Brasil IPCA XVI FIF RF CP', 'RENDA_FIXA', 4, 'CAIXA ECONÔMICA FEDERAL', 'CAIXA DTVM S.A.', 'CAIXA ECONÔMICA FEDERAL', 'IPCA', 'MEDIO', 'Renda Fixa Crédito Privado', 30, 0.40, 0.00, 'APROVADO', CURRENT_TIMESTAMP),
('a0000023-0000-0000-0000-000000000023', '30.075.696/0001-89', '340812', 'CAIXA INDEXA BOLSA AMERICANA MM LP RL', 'Caixa Indexa Bolsa Americana MM LP', 'MULTIMERCADO', 7, 'CAIXA ECONÔMICA FEDERAL', 'CAIXA DTVM S.A.', 'CAIXA ECONÔMICA FEDERAL', 'S&P 500 / USD', 'MEDIO', 'Multimercados Estruturados', 5, 0.60, 0.00, 'APROVADO', CURRENT_TIMESTAMP),
('a0000024-0000-0000-0000-000000000024', '35.651.712/0001-80', '380450', 'SICREDI FUNDO DE INVESTIMENTO FINANCEIRO OURO MULTIMERCADO RL', 'Sicredi FIF Ouro Multimercado RL', 'MULTIMERCADO', 7, 'BANCO COOPERATIVO SICREDI S.A.', 'SICREDI ASSET MANAGEMENT', 'BANCO COOPERATIVO SICREDI S.A.', 'Ouro BM&F', 'MEDIO', 'Multimercados Commodities', 5, 0.50, 0.00, 'APROVADO', CURRENT_TIMESTAMP),
('a0000025-0000-0000-0000-000000000025', '19.833.264/0001-49', '250140', 'SANTANDER CRESCIMENTO INSTITUCIONAL ADVANCED RF CP LP CIC FIF RL', 'Santander Crescimento Inst Adv RF CP', 'RENDA_FIXA', 4, 'BANCO SANTANDER (BRASIL) S.A.', 'SANTANDER ASSET MANAGEMENT DTVM', 'BANCO SANTANDER (BRASIL) S.A.', 'CDI', 'MEDIO', 'Renda Fixa Crédito Privado', 30, 0.35, 0.00, 'APROVADO', CURRENT_TIMESTAMP),
('a0000026-0000-0000-0000-000000000026', '08.246.333/0001-70', '124982', 'SANTANDER TÍTULOS PÚBLICOS PREMIUM RENDA FIXA REFERENCIADO DI - CIC FIF RL', 'Santander TP Premium RF Ref DI', 'RENDA_FIXA', 2, 'BANCO SANTANDER (BRASIL) S.A.', 'SANTANDER ASSET MANAGEMENT DTVM', 'BANCO SANTANDER (BRASIL) S.A.', 'CDI', 'BAIXO', 'Renda Fixa Referenciado DI', 0, 0.15, 0.00, 'APROVADO', CURRENT_TIMESTAMP),
('a0000027-0000-0000-0000-000000000027', '42.318.949/0001-90', '450120', 'ITAÚ AÇÕES S&P500® BRL FUNDO DE INVESTIMENTO FINANCEIRO DA CIC RL', 'Itaú Ações S&P 500 BRL FIF', 'RENDA_VARIAVEL', 5, 'INTAG DTVM LTDA.', 'ITAÚ UNIBANCO ASSET MANAGEMENT', 'ITAÚ UNIBANCO S.A.', 'S&P 500', 'ALTO', 'Ações BDR Nível I', 3, 0.50, 0.00, 'APROVADO', CURRENT_TIMESTAMP),
('a0000028-0000-0000-0000-000000000028', '14.188.162/0001-00', '190820', 'ITAÚ KINEA INSTITUCIONAL FIF DA CIC RENDA FIXA CRÉDITO PRIVADO LONGO PRAZO', 'Itaú Kinea Inst FIF RF CP LP', 'RENDA_FIXA', 4, 'INTAG DTVM LTDA.', 'KINEA INVESTIMENTOS LTDA.', 'ITAÚ UNIBANCO S.A.', 'CDI', 'MEDIO', 'Renda Fixa Crédito Privado', 30, 0.40, 0.00, 'APROVADO', CURRENT_TIMESTAMP),
('a0000029-0000-0000-0000-000000000029', '23.215.097/0001-50', '280918', 'CAIXA FI BRASIL MATRIZ RENDA FIXA', 'Caixa FI Brasil Matriz RF', 'RENDA_FIXA', 2, 'CAIXA ECONÔMICA FEDERAL', 'CAIXA DTVM S.A.', 'CAIXA ECONÔMICA FEDERAL', 'IMA-B / CDI', 'BAIXO', 'Renda Fixa Soberano', 0, 0.20, 0.00, 'APROVADO', CURRENT_TIMESTAMP),
('a0000030-0000-0000-0000-000000000030', '35.805.898/0001-60', '380910', 'BB PREV V ESP 2028', 'BB Previdenciário TP V Especial 2028 FI', 'RENDA_FIXA', 2, 'BB GESTÃO DE RECURSOS DTVM S.A.', 'BB GESTÃO DE RECURSOS DTVM S.A.', 'BANCO DO BRASIL S.A.', 'IMA-B 5', 'BAIXO', 'Renda Fixa Títulos Públicos', 0, 0.15, 0.00, 'APROVADO', CURRENT_TIMESTAMP),
('a0000031-0000-0000-0000-000000000031', '60.701.190/0001-04', NULL, 'LF Nº 3689056 - ITAU (SEM LIQUIDEZ)', 'Letra Financeira Itaú Unibanco nº 3689056', 'TITULO_PUBLICO_DIRETO', 4, 'BANCO ITAÚ UNIBANCO S.A.', 'BANCO ITAÚ UNIBANCO S.A.', 'BANCO ITAÚ UNIBANCO S.A. / B3', 'CDI', 'BAIXO', 'Letra Financeira', 0, 0.00, 0.00, 'APROVADO', CURRENT_TIMESTAMP),
('a0000032-0000-0000-0000-000000000032', '90.400.888/0001-42', NULL, 'LF Nº 260016951915 - SANTANDER', 'Letra Financeira Santander nº 260016951915', 'TITULO_PUBLICO_DIRETO', 4, 'BANCO SANTANDER (BRASIL) S.A.', 'BANCO SANTANDER (BRASIL) S.A.', 'BANCO SANTANDER (BRASIL) S.A. / B3', 'CDI', 'BAIXO', 'Letra Financeira', 0, 0.00, 0.00, 'APROVADO', CURRENT_TIMESTAMP)
ON CONFLICT (cnpj) DO UPDATE SET
    name = EXCLUDED.name,
    trading_name = EXCLUDED.trading_name,
    asset_class = EXCLUDED.asset_class,
    cmn_regulation_id = EXCLUDED.cmn_regulation_id,
    benchmark = EXCLUDED.benchmark,
    risk_level = EXCLUDED.risk_level;

-- Alocações Oficiais da Carteira (R$ 138.781.858,93 - Setembro/2026)
INSERT INTO portfolio_allocations (portfolio_id, asset_id, quantity_quotas, acquisition_average_price, total_invested, weight_pct, last_valuation_date) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a0000001-0000-0000-0000-000000000001', 1730001.19434500,  5.40388900,  9348734.43,  6.74, '2026-09-30'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a0000002-0000-0000-0000-000000000002',  664517.73167000,  9.55935947,  6352363.87,  4.58, '2026-09-30'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a0000003-0000-0000-0000-000000000003', 3445091.18742800,  4.68154900, 16128363.19, 11.62, '2026-09-30'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a0000004-0000-0000-0000-000000000004', 2526690.12950600,  3.26789400,  8256958.63,  5.95, '2026-09-30'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a0000005-0000-0000-0000-000000000005', 3174904.69041400,  3.70674831, 11768573.27,  8.48, '2026-09-30'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a0000006-0000-0000-0000-000000000006',  269874.06596500,  9.22126600,  2488580.55,  1.79, '2026-09-30'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a0000007-0000-0000-0000-000000000007', 2271979.58490000,  3.94903600,  8972129.17,  6.46, '2026-09-30'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a0000008-0000-0000-0000-000000000008', 1340618.12454400,  2.50052200,  3352245.11,  2.42, '2026-09-30'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a0000009-0000-0000-0000-000000000009', 1627934.14821800,  4.80108230,  7815845.82,  5.63, '2026-09-30'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a0000010-0000-0000-0000-000000000010', 4579349.42122900,  1.92331140,  8807514.93,  6.35, '2026-09-30'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a0000011-0000-0000-0000-000000000011', 1071439.45335300,  3.34150390,  3580219.11,  2.58, '2026-09-30'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a0000012-0000-0000-0000-000000000012',  156069.86713400,  4.85119911,   757126.00,  0.55, '2026-09-30'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a0000013-0000-0000-0000-000000000013',  228508.34869700,  4.09362100,   935426.56,  0.67, '2026-09-30'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a0000014-0000-0000-0000-000000000014',   87591.42079900,  9.89219004,   866470.98,  0.62, '2026-09-30'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a0000015-0000-0000-0000-000000000015',  262967.30587400,  3.54598185,   932477.29,  0.67, '2026-09-30'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a0000016-0000-0000-0000-000000000016',  557199.51447500,  1.81485992,  1011239.07,  0.73, '2026-09-30'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a0000017-0000-0000-0000-000000000017',  204123.68920500, 30.85604400,  6298449.53,  4.54, '2026-09-30'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a0000018-0000-0000-0000-000000000018',   14898.75999100, 353.04935940, 5259997.67,  3.79, '2026-09-30'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a0000019-0000-0000-0000-000000000019', 1127732.88456400,  7.48090300,  8436460.32,  6.08, '2026-09-30'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a0000020-0000-0000-0000-000000000020',  686425.67688900,  2.85533814,  1959977.42,  1.41, '2026-09-30'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a0000021-0000-0000-0000-000000000021',  316244.32329200,  7.81601700,  2471771.01,  1.78, '2026-09-30'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a0000022-0000-0000-0000-000000000022',  352709.88918700,  3.12159700,  1101018.13,  0.79, '2026-09-30'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a0000023-0000-0000-0000-000000000023',  407969.33576900,  3.97802100,  1622910.59,  1.17, '2026-09-30'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a0000024-0000-0000-0000-000000000024', 1172731.74961000,  1.28098930,  1502256.82,  1.08, '2026-09-30'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a0000025-0000-0000-0000-000000000025',  128134.04228600, 13.38470270,  1715036.06,  1.24, '2026-09-30'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a0000026-0000-0000-0000-000000000026',   47063.98980600, 52.55639640,  2473513.70,  1.78, '2026-09-30'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a0000027-0000-0000-0000-000000000027',   34049.91300000, 55.56969400,  1892143.24,  1.36, '2026-09-30'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a0000028-0000-0000-0000-000000000028',  282765.49496500,  1.28042718,   362060.57,  0.26, '2026-09-30'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a0000029-0000-0000-0000-000000000029', 2094225.09950000,  2.72215500,  5700805.33,  4.11, '2026-09-30'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a0000030-0000-0000-0000-000000000030',    1434.39991800, 1165.473350,  1671754.88,  1.20, '2026-09-30'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a0000031-0000-0000-0000-000000000031',       1.00000000, 2473289.5700, 2473289.57,  1.78, '2026-09-30'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a0000032-0000-0000-0000-000000000032',       1.00000000, 2466146.1100, 2466146.11,  1.78, '2026-09-30')
ON CONFLICT (portfolio_id, asset_id) DO UPDATE SET
    quantity_quotas = EXCLUDED.quantity_quotas,
    acquisition_average_price = EXCLUDED.acquisition_average_price,
    total_invested = EXCLUDED.total_invested,
    weight_pct = EXCLUDED.weight_pct,
    last_valuation_date = EXCLUDED.last_valuation_date;
