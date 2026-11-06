-- ==============================================================================
-- CARGA INICIAL (SEEDS) - PREVI-LACERDA
-- Base Legal Atualizada: Resolução CMN nº 5.272/2025 (de 18/12/2025)
-- Link Oficial: https://www.gov.br/previdencia/pt-br/assuntos/rpps/legislacao-dos-rpps/arquivos/2025/ResoluoBCCMNn5.272de18dez2025.pdf
-- ==============================================================================

-- 1. Resoluções CMN nº 5.272/2025 (Enquadramento Legal RPPS)
INSERT INTO cmn_regulations (id, regulation_norm, regulation_url, article_code, description, max_portfolio_limit_pct, asset_class) VALUES
(1, 'Resolução CMN nº 5.272/2025', 'https://www.gov.br/previdencia/pt-br/assuntos/rpps/legislacao-dos-rpps/arquivos/2025/ResoluoBCCMNn5.272de18dez2025.pdf', 'Art. 7º, I, "a"', 'Títulos do Tesouro Nacional - Registrados no Selic', 100.00, 'TITULO_PUBLICO_DIRETO'),
(2, 'Resolução CMN nº 5.272/2025', 'https://www.gov.br/previdencia/pt-br/assuntos/rpps/legislacao-dos-rpps/arquivos/2025/ResoluoBCCMNn5.272de18dez2025.pdf', 'Art. 7º, I, "b"', 'Fundos de Índice Referenciados em Títulos Públicos (100% TP)', 100.00, 'RENDA_FIXA'),
(3, 'Resolução CMN nº 5.272/2025', 'https://www.gov.br/previdencia/pt-br/assuntos/rpps/legislacao-dos-rpps/arquivos/2025/ResoluoBCCMNn5.272de18dez2025.pdf', 'Art. 7º, III, "a"', 'Fundos de Renda Fixa com Títulos Públicos e Privados Alto Risco de Crédito', 60.00, 'RENDA_FIXA'),
(4, 'Resolução CMN nº 5.272/2025', 'https://www.gov.br/previdencia/pt-br/assuntos/rpps/legislacao-dos-rpps/arquivos/2025/ResoluoBCCMNn5.272de18dez2025.pdf', 'Art. 7º, IV', 'Fundos Renda Fixa Crédito Privado', 20.00, 'RENDA_FIXA'),
(5, 'Resolução CMN nº 5.272/2025', 'https://www.gov.br/previdencia/pt-br/assuntos/rpps/legislacao-dos-rpps/arquivos/2025/ResoluoBCCMNn5.272de18dez2025.pdf', 'Art. 8º, I', 'Fundos de Investimento em Ações (FIA)', 30.00, 'RENDA_VARIAVEL'),
(6, 'Resolução CMN nº 5.272/2025', 'https://www.gov.br/previdencia/pt-br/assuntos/rpps/legislacao-dos-rpps/arquivos/2025/ResoluoBCCMNn5.272de18dez2025.pdf', 'Art. 9º, II', 'Fundos de Investimento no Exterior (BDR / Renda Fixa e Ações Exterior)', 10.00, 'INVESTIMENTO_EXTERIOR'),
(7, 'Resolução CMN nº 5.272/2025', 'https://www.gov.br/previdencia/pt-br/assuntos/rpps/legislacao-dos-rpps/arquivos/2025/ResoluoBCCMNn5.272de18dez2025.pdf', 'Art. 10, I', 'Fundos Multimercado (FIM)', 10.00, 'MULTIMERCADO')
ON CONFLICT (article_code) DO UPDATE SET
  regulation_norm = EXCLUDED.regulation_norm,
  regulation_url = EXCLUDED.regulation_url,
  description = EXCLUDED.description,
  max_portfolio_limit_pct = EXCLUDED.max_portfolio_limit_pct;

-- 2. Benchmarks de Mercado
INSERT INTO market_benchmarks (id, code, name, description) VALUES
(1, 'CDI', 'Certificado de Depósito Interbancário', 'Taxa média de juros interbancários diária'),
(2, 'IPCA', 'Índice de Preços ao Consumidor Amplo', 'Índice oficial de inflação apurado pelo IBGE'),
(3, 'IBOVESPA', 'Índice Bovespa', 'Principal indicador de ações da B3'),
(4, 'IMA_B', 'Índice de Mercado ANBIMA - Série B', 'Carteira de títulos públicos atrelados à inflação (NTN-B)'),
(5, 'META_ATUARIAL', 'Meta Atuarial PREVI-LACERDA', 'IPCA + 5,50% a.a.')
ON CONFLICT (code) DO NOTHING;

-- 3. Usuários do Sistema com Perfis RBAC
-- Usuário MASTER: prof.jan100@gmail.com com senha 'Capivaraalbin@01'
-- Demais usuários removidos conforme instrução fiduciária do RPPS
INSERT INTO users (
    id, name, email, password_hash, role, cpf, registration_number, 
    is_active, is_email_verified, email_verified_at, must_change_password
) VALUES
('00000000-0000-0000-0000-000000000000', 'Prof. Jansen (Administrador Master)', 'prof.jan100@gmail.com', '$2a$10$7aJzZqU17s8m/xX6W5G4uOGhGkYgI92vB/7sW5p1u7a.QzQvR2rKi', 'MASTER_ADMIN', '559.218.411-53', 'MST-001', TRUE, TRUE, CURRENT_TIMESTAMP, FALSE)
ON CONFLICT (email) DO UPDATE SET
  password_hash = '$2a$10$7aJzZqU17s8m/xX6W5G4uOGhGkYgI92vB/7sW5p1u7a.QzQvR2rKi',
  role = 'MASTER_ADMIN',
  must_change_password = FALSE,
  is_email_verified = TRUE;

-- 4. Carteira Consolidada do PREVI-LACERDA
INSERT INTO portfolios (id, code, name, entity_name, actuarial_rate_pct, base_benchmark) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'PREVI_LACERDA_2026', 'Carteira Geral Consolidada PREVI-LACERDA', 'Instituto de Previdência de Pontes e Lacerda - MT', 5.50, 'IPCA')
ON CONFLICT (code) DO NOTHING;

-- 5. Cadastro de Ativos Financeiros do RPPS
INSERT INTO assets (id, cnpj, cvm_code, name, trading_name, asset_class, cmn_regulation_id, administrator, manager, custodian, benchmark, risk_level, anbima_category, liquidity_days, admin_fee_pct, performance_fee_pct, status, registered_by, approved_by, approved_at) VALUES
('b1111111-1111-1111-1111-111111111111', '13.397.466/0001-14', '180293', 'BB PREVIDENCIÁRIO RENDA FIXA ALOCAÇÃO ATIVA FIC FI', 'BB Previdência RF Alocação Ativa', 'RENDA_FIXA', 2, 'BB GESTÃO DE RECURSOS DTVM S.A.', 'BB GESTÃO DE RECURSOS DTVM S.A.', 'BANCO DO BRASIL S.A.', 'IMA-B / CDI', 'BAIXO', 'Renda Fixa Duração Livre Soberano', 1, 0.20, 0.00, 'APROVADO', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP),

('b2222222-2222-2222-2222-222222222222', '11.060.940/0001-65', '142839', 'CAIXA BRASIL IMA-B 5+ TÍTULOS PÚBLICOS FI RENDA FIXA LP', 'Caixa Brasil IMA-B 5+ TP RF LP', 'RENDA_FIXA', 2, 'CAIXA ECONÔMICA FEDERAL', 'CAIXA DTVM S.A.', 'CAIXA ECONÔMICA FEDERAL', 'IMA-B 5+', 'MEDIO', 'Renda Fixa Indexados', 0, 0.20, 0.00, 'APROVADO', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP),

('b3333333-3333-3333-3333-333333333333', '10.742.584/0001-59', '124982', 'SANTANDER INSTITUCIONAL TITULOS PUBLICOS FI RENDA FIXA', 'Santander Institucional TP RF', 'RENDA_FIXA', 2, 'BANCO SANTANDER (BRASIL) S.A.', 'SANTANDER ASSET MANAGEMENT DTVM', 'BANCO SANTANDER S.A.', 'CDI', 'MUITO_BAIXO', 'Renda Fixa Soberano', 0, 0.15, 0.00, 'APROVADO', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP),

('b4444444-4444-4444-4444-444444444444', '03.922.311/0001-98', '089201', 'ITAÚ IBOVESPA ATIVO INSTITUCIONAL FIA', 'Itaú Institucional FIA Ações', 'RENDA_VARIAVEL', 5, 'BANCO ITAÚ CARTEIRAS S.A.', 'ITAÚ ASSET MANAGEMENT LTDA', 'BANCO ITAÚ UNIBANCO S.A.', 'IBOVESPA', 'ALTO', 'Ações Indexadas', 3, 1.00, 0.00, 'APROVADO', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP),

('b5555555-5555-5555-5555-555555555555', '35.651.712/0001-80', '321940', 'WESTERN ASSET GLOBAL BOND BDR NÍVEL I FI RENDA FIXA EXTERIOR', 'Western Asset Global Bond BDR Exterior', 'INVESTIMENTO_EXTERIOR', 6, 'BEM DTVM LTDA', 'WESTERN ASSET MANAGEMENT DTVM', 'BANCO BRADESCO S.A.', 'Global Aggregate USD', 'MEDIO', 'Renda Fixa Exterior', 5, 0.60, 0.00, 'APROVADO', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP),

('b6666666-6666-6666-6666-666666666666', '00.000.000/0001-00', NULL, 'NOTA DO TESOURO NACIONAL - SÉRIE B (NTN-B 2035)', 'NTN-B 2035 (Tesouro IPCA+)', 'TITULO_PUBLICO_DIRETO', 1, 'SECRETARIA DO TESOURO NACIONAL', 'TESOURO DIRETO / SELIC', 'BANCO CENTRAL DO BRASIL', 'IPCA + 5,85% a.a.', 'MUITO_BAIXO', 'Título Público Federal', 0, 0.00, 0.00, 'APROVADO', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP)
ON CONFLICT (cnpj) DO NOTHING;

-- 6. Posição Atual do PREVI-LACERDA (R$ 68,5 Milhões sob gestão)
INSERT INTO portfolio_allocations (portfolio_id, asset_id, quantity_quotas, acquisition_average_price, total_invested, weight_pct, last_valuation_date) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b1111111-1111-1111-1111-111111111111', 5840212.45000000, 3.85000000, 24500000.00, 35.77, '2026-11-05'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b2222222-2222-2222-2222-222222222222', 2950140.12000000, 5.20000000, 16800000.00, 24.53, '2026-11-05'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b3333333-3333-3333-3333-333333333333', 3800450.80000000, 3.10000000, 12200000.00, 17.81, '2026-11-05'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b4444444-4444-4444-4444-444444444444', 1205000.00000000, 4.15000000,  5200000.00,  7.59, '2026-11-05'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b5555555-5555-5555-5555-555555555555',  980000.00000000, 3.88000000,  3800000.00,  5.55, '2026-11-05'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b6666666-6666-6666-6666-666666666666',    1420.00000000, 4225.35000000, 6000000.00,  8.75, '2026-11-05')
ON CONFLICT (portfolio_id, asset_id) DO NOTHING;

-- 7. Histórico Recente de Cotas
INSERT INTO asset_daily_quotes (asset_id, reference_date, quota_value, net_equity, shareholders_count, daily_return_pct) VALUES
('b1111111-1111-1111-1111-111111111111', '2026-11-05', 4.19502100, 1845200000.00, 14200, 0.0450),
('b1111111-1111-1111-1111-111111111111', '2026-11-04', 4.19313400, 1842100000.00, 14195, 0.0520),
('b2222222-2222-2222-2222-222222222222', '2026-11-05', 5.69465000, 2150000000.00, 18900, 0.0620),
('b2222222-2222-2222-2222-222222222222', '2026-11-04', 5.69112000, 2148000000.00, 18880, 0.0710),
('b3333333-3333-3333-3333-333333333333', '2026-11-05', 3.21045000, 3450000000.00, 25400, 0.0420),
('b4444444-4444-4444-4444-444444444444', '2026-11-05', 4.31520000,  890000000.00,  8200, 0.4200),
('b5555555-5555-5555-5555-555555555555', '2026-11-05', 3.87750000,  450000000.00,  3100, -0.1500)
ON CONFLICT (asset_id, reference_date) DO NOTHING;

-- 8. Trilha de Auditoria Inicial
INSERT INTO audit_logs (user_id, user_email, user_role, action, resource, record_id, ip_address, new_data) VALUES
('00000000-0000-0000-0000-000000000000', 'prof.jan100@gmail.com', 'MASTER_ADMIN', 'SYSTEM_INIT', 'system', 'CMN_5272_UPDATE', '189.44.120.15', '{"event": "Atualização da base legal para Resolução CMN nº 5.272/2025 e provisionamento do usuário Master", "regulation_url": "https://www.gov.br/previdencia/pt-br/assuntos/rpps/legislacao-dos-rpps/arquivos/2025/ResoluoBCCMNn5.272de18dez2025.pdf"}');
