import { Pool } from 'pg';
import { config } from '../config';

export const pool = new Pool(config.database);

pool.on('error', (err) => {
  console.error('Erro inesperado no pool do PostgreSQL:', err);
});

export const db = {
  async query(text: string, params?: any[]) {
    const start = Date.now();
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      if (process.env.DEBUG_SQL) {
        console.log('Executou query:', { text, duration, rows: res.rowCount });
      }
      return res;
    } catch (error) {
      console.error('Falha na query SQL:', { text, error });
      throw error;
    }
  },

  async getClient() {
    return await pool.connect();
  }
};
