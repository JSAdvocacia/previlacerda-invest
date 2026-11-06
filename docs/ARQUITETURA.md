# Arquitetura e Engenharia do Sistema de Gestão de Investimentos
## PREVI-LACERDA — Instituto de Previdência dos Servidores de Pontes e Lacerda - MT

---

### 1. Base Legal Vigente e Contexto Regulatório (RPPS)

A política de investimentos e o enquadramento de ativos do **PREVI-LACERDA** estão fundamentados na:
- **Resolução CMN nº 5.272/2025** (de 18 de dezembro de 2025): Nova norma que dispõe sobre a aplicação dos recursos dos regimes próprios de previdência social instituídos pela União, pelos Estados, pelo Distrito Federal e pelos Municípios.
- **Link Oficial de Acesso ao Documento (Ministério da Previdência)**:  
  [https://www.gov.br/previdencia/pt-br/assuntos/rpps/legislacao-dos-rpps/arquivos/2025/ResoluoBCCMNn5.272de18dez2025.pdf](https://www.gov.br/previdencia/pt-br/assuntos/rpps/legislacao-dos-rpps/arquivos/2025/ResoluoBCCMNn5.272de18dez2025.pdf)
- **Instruções CVM nº 555 / Resolução CVM nº 175** e normativos de fiscalização fiduciária do **Tribunal de Contas do Estado de Mato Grosso (TCE-MT)**.

---

### 2. Autenticação, Usuário Master e Governança de Perfis (RBAC)

#### A. Regras de Acesso e Validação de E-mail
- **Identificador de Usuário**: O usuário deve ser obrigatoriamente um **e-mail** válido.
- **Validação Prévia de E-mail (`is_email_verified`)**: Todo usuário precisa ter seu e-mail institucional validado antes de realizar o primeiro acesso ao sistema. O acesso é categoricamente bloqueado caso o e-mail não esteja com status de verificação ativo.

#### B. Usuário Master (`prof.jan100@gmail.com`)
- **Papel**: `MASTER_ADMIN` (Acesso Total e Irrestrito ao Sistema).
- **Senha Inicial Provisória**: `123456`.
- **Troca Obrigatória no Primeiro Acesso (`must_change_password: true`)**: No primeiro login do usuário master, o sistema intercepta e exibe uma tela obrigatória e bloqueante exigindo a definição de uma nova senha pessoal definitiva (criptografada em bcrypt).
- **Atribuição de Perfis**: O usuário master possui um painel exclusivo (`UserManagementModal`) para:
  1. Atribuir e alterar papéis de outros usuários (`DIRETORIA_EXECUTIVA`, `COMITE_INVESTIMENTOS`, `AUDITORIA_CONSELHO_FISCAL`, `MASTER_ADMIN`).
  2. Cadastrar novos servidores e validar e-mails institucionais.

| Perfil de Usuário | Atribuições no PREVI-LACERDA |
| :--- | :--- |
| **MASTER_ADMIN** (`prof.jan100@gmail.com`) | Acesso total universal, gestão de contas, validação de e-mails e atribuição de perfis RBAC. |
| **DIRETORIA_EXECUTIVA** | Homologação final, aprovação de ativos, parametrização de limites e governança perante o TCE-MT. |
| **COMITE_INVESTIMENTOS** | Análise técnica, comparador, simulador, pareceres e cadastro de ativos (*status Pendente de Aprovação*). |
| **AUDITORIA_CONSELHO_FISCAL** | **Somente Leitura (Read-Only)** a todas as telas e acesso total à Trilha de Auditoria imutável. |

---

### 3. Trilha de Auditoria Imutável (Audit Trail)

Tabela `audit_logs` no PostgreSQL com trigger que impede `UPDATE` e `DELETE`.
Cada ação de alteração de perfil de usuário, cadastro de ativo ou execução de rotina CVM registra:
- `user_id`, `user_email`, `user_role`
- `action` (ex: `ASSIGN_USER_ROLE`, `PASSWORD_CHANGED`, `APPROVE_ASSET`)
- `resource` e `record_id`
- `ip_address` e `timestamp`
- `integrity_hash` (SHA-256 encadeado)

---

### 4. Guia de Inicialização

#### Backend
```bash
cd backend
npm install
npm run dev
# API REST disponível em http://localhost:3001
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
# Aplicação disponível em http://localhost:3000
```
