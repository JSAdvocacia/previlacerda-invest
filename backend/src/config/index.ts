import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  jwtSecret: process.env.JWT_SECRET || 'previlacerda_rpps_jwt_secret_key_2026_super_secure',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  database: {
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/previlacerda_invest',
    ssl: process.env.DATABASE_URL?.includes('supabase.co') || 
         process.env.DATABASE_URL?.includes('neon.tech') || 
         process.env.DATABASE_URL?.includes('sslmode=require') || 
         process.env.NODE_ENV === 'production' 
         ? { rejectUnauthorized: false } 
         : false,
  },
  cvm: {
    // Portal de Dados Abertos da CVM - Informes Diários de Fundos
    openDataDailyUrl: 'https://dados.cvm.gov.br/dados/FI/DOC/INF_DIARIO/DADOS/',
    cronSchedule: process.env.CVM_CRON_SCHEDULE || '0 21 * * 1-5', // Seg a Sex às 21:00 BRT
    maxRetries: 3,
    retryDelayMs: 5000,
  },
  rpps: {
    entityName: 'PREVI-LACERDA - Pontes e Lacerda MT',
    defaultActuarialSpread: 0.055, // 5.50% a.a. acima do IPCA
  }
};
