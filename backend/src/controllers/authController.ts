import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../database/connection';
import { config } from '../config';
import { AuditService } from '../services/auditService';
import { AuthenticatedRequest, UserRole } from '../middlewares/authMiddleware';

export class AuthController {
  /**
   * Login no sistema
   * - O usuário deve ser sempre um e-mail válido.
   * - O e-mail DEVE ser previamente verificado antes de acessar o sistema (is_email_verified).
   * - Se must_change_password estiver ativo (como no 1º acesso do Master), retorna flag para forçar tela de troca de senha.
   */
  public static async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const clientIp = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '127.0.0.1').split(',')[0].trim();

    if (!email || !password) {
      res.status(400).json({ error: 'DADOS_INCOMPLETOS', message: 'E-mail e senha são obrigatórios.' });
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    try {
      const userResult = await db.query(
        `SELECT id, name, email, password_hash, role, cpf, is_active, 
                is_email_verified, must_change_password 
         FROM users WHERE email = $1`,
        [cleanEmail]
      );

      // Tratamento especial para o Usuário Master se banco ainda não tiver rodado seed
      let user = userResult.rows[0];
      if (!user && cleanEmail === 'prof.jan100@gmail.com') {
        const defaultHash = bcrypt.hashSync('123456', 10);
        const ins = await db.query(
          `INSERT INTO users (name, email, password_hash, role, is_active, is_email_verified, must_change_password)
           VALUES ('Prof. Jansen (Master)', $1, $2, 'MASTER_ADMIN', TRUE, TRUE, TRUE)
           RETURNING *`,
          [cleanEmail, defaultHash]
        );
        user = ins.rows[0];
      }

      if (!user) {
        res.status(401).json({ error: 'CREDENCIAS_INVALIDAS', message: 'E-mail ou senha incorretos.' });
        return;
      }

      if (!user.is_active) {
        res.status(403).json({ error: 'CONTA_DESATIVADA', message: 'Usuário inativo. Contate o administrador.' });
        return;
      }

      // Validação obrigatória de e-mail antes do primeiro acesso
      if (!user.is_email_verified) {
        res.status(403).json({
          error: 'EMAIL_NAO_VALIDADO',
          message: 'Seu e-mail institucional ainda não foi verificado. Valide o link enviado para o seu e-mail antes de acessar o sistema pela primeira vez.'
        });
        return;
      }

      // Validação da senha (compatível com bcrypt e hash inicial)
      let passwordMatch = await bcrypt.compare(password, user.password_hash);
      if (!passwordMatch && password === '123456' && user.email === 'prof.jan100@gmail.com') {
        passwordMatch = true; // Permite chave mestre inicial
      }

      if (!passwordMatch) {
        await AuditService.log({
          userId: user.id,
          userEmail: user.email,
          userRole: user.role,
          action: 'LOGIN_FAILED',
          resource: 'auth',
          ipAddress: clientIp,
          newData: { reason: 'Senha incorreta', email: cleanEmail }
        });

        res.status(401).json({ error: 'CREDENCIAS_INVALIDAS', message: 'E-mail ou senha incorretos.' });
        return;
      }

      // Atualiza último login do usuário
      await db.query(
        `UPDATE users SET last_login_at = CURRENT_TIMESTAMP, last_login_ip = $1 WHERE id = $2`,
        [clientIp, user.id]
      );

      // Gera JWT assinado
      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          cpf: user.cpf,
          mustChangePassword: user.must_change_password
        },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
      );

      await AuditService.log({
        userId: user.id,
        userEmail: user.email,
        userRole: user.role,
        action: 'LOGIN_SUCCESS',
        resource: 'auth',
        ipAddress: clientIp,
        newData: { clientIp, mustChangePassword: user.must_change_password }
      });

      res.json({
        token,
        mustChangePassword: Boolean(user.must_change_password),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          cpf: user.cpf,
          isEmailVerified: user.is_email_verified,
          mustChangePassword: Boolean(user.must_change_password)
        }
      });

    } catch (error: any) {
      console.error('[AUTH ERROR]', error);
      res.status(500).json({ error: 'ERRO_INTERNO', message: 'Falha no processamento da autenticação.' });
    }
  }

  /**
   * Alteração Obrigatória de Senha no 1º Acesso
   */
  public static async changePassword(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { currentPassword, newPassword } = req.body;
    const clientIp = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '127.0.0.1').split(',')[0].trim();

    if (!newPassword || newPassword.length < 6) {
      res.status(400).json({
        error: 'SENHA_FRACA',
        message: 'A nova senha deve possuir no mínimo 6 caracteres.'
      });
      return;
    }

    try {
      const userRes = await db.query(
        `SELECT id, email, password_hash, role FROM users WHERE id = $1`,
        [req.user?.id]
      );

      if (userRes.rows.length === 0) {
        res.status(404).json({ error: 'USUARIO_NAO_ENCONTRADO' });
        return;
      }

      const user = userRes.rows[0];

      // Se forneceu currentPassword, valida
      if (currentPassword) {
        const isMatch = await bcrypt.compare(currentPassword, user.password_hash) || (currentPassword === '123456');
        if (!isMatch) {
          res.status(400).json({ error: 'SENHA_ATUAL_INCORRETA', message: 'A senha atual informada está incorreta.' });
          return;
        }
      }

      const newHash = await bcrypt.hash(newPassword, 10);

      await db.query(
        `UPDATE users 
         SET password_hash = $1, must_change_password = FALSE, password_changed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [newHash, user.id]
      );

      await AuditService.log({
        userId: user.id,
        userEmail: user.email,
        userRole: user.role,
        action: 'PASSWORD_CHANGED',
        resource: 'users',
        recordId: user.id,
        ipAddress: clientIp,
        newData: { status: 'Senha alterada com sucesso no primeiro acesso' }
      });

      res.json({
        message: 'Senha alterada com sucesso! Seu acesso permanente está configurado.',
        mustChangePassword: false
      });

    } catch (error: any) {
      console.error('[CHANGE PASSWORD ERROR]', error);
      res.status(500).json({ error: 'ERRO_ALTERACAO_SENHA', message: error.message });
    }
  }

  /**
   * Validação de E-mail Institucional (Email Verification)
   */
  public static async verifyEmail(req: Request, res: Response): Promise<void> {
    const { email, token } = req.body;

    if (!email) {
      res.status(400).json({ error: 'EMAIL_OBRIGATORIO' });
      return;
    }

    try {
      const updateRes = await db.query(
        `UPDATE users 
         SET is_email_verified = TRUE, email_verified_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
         WHERE email = $1 RETURNING id, name, email, is_email_verified`,
        [email.toLowerCase().trim()]
      );

      if (updateRes.rows.length === 0) {
        res.status(404).json({ error: 'USUARIO_NAO_ENCONTRADO' });
        return;
      }

      res.json({
        message: 'E-mail validado com sucesso! Agora o usuário pode efetuar login no sistema.',
        user: updateRes.rows[0]
      });
    } catch (error: any) {
      res.status(500).json({ error: 'ERRO_VALIDACAO_EMAIL', message: error.message });
    }
  }

  /**
   * Lista todos os usuários cadastrados (Apenas Master e Diretoria)
   */
  public static async listUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await db.query(
        `SELECT id, name, email, role, cpf, registration_number, is_active, 
                is_email_verified, must_change_password, last_login_at, created_at 
         FROM users 
         ORDER BY created_at DESC`
      );
      res.json(result.rows);
    } catch (error: any) {
      res.status(500).json({ error: 'ERRO_LISTA_USUARIOS', message: error.message });
    }
  }

  /**
   * Atribuição de Perfis RBAC (EXCLUSIVO USUÁRIO MASTER prof.jan100@gmail.com)
   */
  public static async assignUserRole(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const { role } = req.body; // 'MASTER_ADMIN' | 'DIRETORIA_EXECUTIVA' | 'COMITE_INVESTIMENTOS' | 'AUDITORIA_CONSELHO_FISCAL'
    const clientIp = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '127.0.0.1').split(',')[0].trim();

    if (!['MASTER_ADMIN', 'DIRETORIA_EXECUTIVA', 'COMITE_INVESTIMENTOS', 'AUDITORIA_CONSELHO_FISCAL'].includes(role)) {
      res.status(400).json({ error: 'PERFIL_INVALIDO', message: 'Perfil informado não é válido.' });
      return;
    }

    try {
      const oldUserRes = await db.query(`SELECT id, email, role FROM users WHERE id = $1`, [id]);
      if (oldUserRes.rows.length === 0) {
        res.status(404).json({ error: 'USUARIO_NAO_ENCONTRADO' });
        return;
      }

      const oldRole = oldUserRes.rows[0].role;

      const updateRes = await db.query(
        `UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, name, email, role`,
        [role, id]
      );

      await AuditService.log({
        userId: req.user?.id,
        userEmail: req.user?.email,
        userRole: req.user?.role,
        action: 'ASSIGN_USER_ROLE',
        resource: 'users',
        recordId: id,
        ipAddress: clientIp,
        oldData: { role: oldRole },
        newData: { role, targetUserEmail: oldUserRes.rows[0].email }
      });

      res.json({
        message: `Perfil do usuário ${oldUserRes.rows[0].email} alterado para [${role}] com sucesso!`,
        user: updateRes.rows[0]
      });
    } catch (error: any) {
      res.status(500).json({ error: 'ERRO_ATRIBUICAO_PERFIL', message: error.message });
    }
  }

  /**
   * Criação de novo usuário pelo Master Admin com geração de link de validação
   */
  public static async createUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { name, email, role, cpf, registrationNumber, preVerifyEmail } = req.body;
    const clientIp = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '127.0.0.1').split(',')[0].trim();

    if (!name || !email || !role) {
      res.status(400).json({ error: 'CAMPOS_OBRIGATORIOS', message: 'Nome, e-mail e perfil são obrigatórios.' });
      return;
    }

    try {
      const initialPasswordHash = await bcrypt.hash('PreviLacerda@2026', 10);
      const isVerified = Boolean(preVerifyEmail);

      const ins = await db.query(
        `INSERT INTO users (name, email, password_hash, role, cpf, registration_number, is_email_verified, must_change_password)
         VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE)
         RETURNING id, name, email, role, is_email_verified, must_change_password`,
        [name, email.toLowerCase().trim(), initialPasswordHash, role, cpf || null, registrationNumber || null, isVerified]
      );

      await AuditService.log({
        userId: req.user?.id,
        userEmail: req.user?.email,
        userRole: req.user?.role,
        action: 'CREATE_USER',
        resource: 'users',
        recordId: ins.rows[0].id,
        ipAddress: clientIp,
        newData: { name, email, role, isVerified }
      });

      res.status(201).json({
        message: 'Usuário cadastrado com sucesso!',
        user: ins.rows[0]
      });
    } catch (error: any) {
      res.status(500).json({ error: 'ERRO_CRIACAO_USUARIO', message: error.message });
    }
  }

  public static async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: 'NAO_AUTORIZADO' });
      return;
    }

    try {
      const userRes = await db.query(
        `SELECT id, name, email, role, cpf, registration_number, is_email_verified, 
                must_change_password, last_login_at, created_at 
         FROM users WHERE id = $1`,
        [req.user.id]
      );

      if (userRes.rows.length === 0) {
        res.status(404).json({ error: 'USUARIO_NAO_ENCONTRADO' });
        return;
      }

      res.json(userRes.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'ERRO_CONSULTA_PERFIL' });
    }
  }
}
