import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export type UserRole = 
  | 'MASTER_ADMIN'              // Acesso total irrestrito + Gestão e atribuição de perfis
  | 'DIRETORIA_EXECUTIVA'       // Acesso total operacional, aprovação de ativos e risco
  | 'COMITE_INVESTIMENTOS'      // Simulador, comparador, gráficos, cadastro pendente
  | 'AUDITORIA_CONSELHO_FISCAL';// Read-Only estrito + Trilha de auditoria

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  cpf?: string;
  mustChangePassword?: boolean;
  isEmailVerified?: boolean;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({
      error: 'ACESSO_NAO_AUTORIZADO',
      message: 'Token de autenticação JWT não fornecido.'
    });
    return;
  }

  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) {
      res.status(403).json({
        error: 'TOKEN_INVALIDO',
        message: 'Token expirado ou inválido. Efetue login novamente.'
      });
      return;
    }
    req.user = decoded as AuthenticatedUser;
    next();
  });
};
