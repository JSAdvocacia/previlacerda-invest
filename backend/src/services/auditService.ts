import crypto from 'crypto';
import { db } from '../database/connection';

export interface AuditEntry {
  userId?: string;
  userEmail?: string;
  userRole?: string;
  action: string;
  resource: string;
  recordId?: string;
  ipAddress: string;
  userAgent?: string;
  oldData?: any;
  newData?: any;
}

export class AuditService {
  /**
   * Registra uma ação de forma atômica e imutável na trilha de auditoria
   */
  public static async log(entry: AuditEntry): Promise<void> {
    try {
      const timestamp = new Date().toISOString();
      
      // Gera hash de integridade criptográfica SHA-256
      const payloadString = JSON.stringify({
        userId: entry.userId,
        action: entry.action,
        resource: entry.resource,
        recordId: entry.recordId,
        ipAddress: entry.ipAddress,
        timestamp,
        newData: entry.newData,
      });

      const integrityHash = crypto.createHash('sha256').update(payloadString).digest('hex');

      const query = `
        INSERT INTO audit_logs (
          user_id, user_email, user_role, action, resource,
          record_id, ip_address, user_agent, old_data, new_data,
          timestamp, integrity_hash
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `;

      const values = [
        entry.userId || null,
        entry.userEmail || 'ANONYMOUS',
        entry.userRole || 'PUBLIC',
        entry.action,
        entry.resource,
        entry.recordId || null,
        entry.ipAddress,
        entry.userAgent || 'UNKNOWN',
        entry.oldData ? JSON.stringify(entry.oldData) : null,
        entry.newData ? JSON.stringify(entry.newData) : null,
        timestamp,
        integrityHash
      ];

      await db.query(query, values);
      console.log(`[AUDIT] Ação registrada: ${entry.action} em ${entry.resource} por ${entry.userEmail} (IP: ${entry.ipAddress})`);
    } catch (error) {
      console.error('[AUDIT ERROR] Falha ao registrar log de auditoria:', error);
      // Em governança de alta segurança, falhas de auditoria devem alertar o monitoramento
    }
  }

  /**
   * Consulta registros de auditoria com paginação e filtros
   */
  public static async getLogs(filters: {
    resource?: string;
    action?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }) {
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.resource) {
      whereClause += ` AND resource = $${paramIndex++}`;
      params.push(filters.resource);
    }
    if (filters.action) {
      whereClause += ` AND action = $${paramIndex++}`;
      params.push(filters.action);
    }
    if (filters.userId) {
      whereClause += ` AND user_id = $${paramIndex++}`;
      params.push(filters.userId);
    }
    if (filters.startDate) {
      whereClause += ` AND timestamp >= $${paramIndex++}`;
      params.push(filters.startDate);
    }
    if (filters.endDate) {
      whereClause += ` AND timestamp <= $${paramIndex++}`;
      params.push(filters.endDate);
    }

    const limit = filters.limit || 50;
    const offset = filters.offset || 0;

    const countQuery = `SELECT COUNT(*) FROM audit_logs ${whereClause}`;
    const countResult = await db.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count, 10);

    const query = `
      SELECT id, user_id, user_email, user_role, action, resource,
             record_id, ip_address, user_agent, old_data, new_data,
             timestamp, integrity_hash
      FROM audit_logs
      ${whereClause}
      ORDER BY timestamp DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;
    params.push(limit, offset);

    const result = await db.query(query, params);

    return {
      total,
      limit,
      offset,
      data: result.rows
    };
  }
}
