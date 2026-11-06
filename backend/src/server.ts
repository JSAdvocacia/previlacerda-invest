import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import apiRoutes from './routes';
import { DailyScheduler } from './cron/dailyScheduler';

const app = express();

// ==============================================================================
// 1. REQUISITOS DE SEGURANÇA E CRIPTOGRAFIA
// ==============================================================================

// Helmet para proteção contra clickjacking, MIME sniffing, XSS e imposição de HTTPS (HSTS)
app.use(helmet({
  contentSecurityPolicy: false, // Permite visualização do One-Page Report em iframe/print
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS restrito aos domínios autorizados do município
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Limitador de requisições contra força bruta e DoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 300, // Limite por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'MUITAS_REQUISICOES',
    message: 'Muitas tentativas a partir deste IP. Tente novamente em 15 minutos.'
  }
});
app.use(limiter);

// Limite de tamanho de carga (Anti-DDoS)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Middleware customizado de sanitização básica contra injeções
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.body && typeof req.body === 'object') {
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === 'string') {
        // Remove tags perigosas para prevenir XSS
        req.body[key] = req.body[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      }
    }
  }
  next();
});

// ==============================================================================
// 2. ROTAS DA API
// ==============================================================================

app.use('/api/v1', apiRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    service: 'PREVI-LACERDA Investment Portfolio API',
    institution: 'Instituto de Previdência de Pontes e Lacerda - MT',
    timestamp: new Date().toISOString()
  });
});

// Tratamento de erro 404
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'ROTA_NAO_ENCONTRADA', path: req.originalUrl });
});

// Tratamento de erros global (sem vazar stack trace)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[UNHANDLED ERROR]', err);
  res.status(err.status || 500).json({
    error: 'ERRO_INTERNO_SERVIDOR',
    message: 'Ocorreu uma inconsistência no processamento da solicitação.'
  });
});

// ==============================================================================
// 3. INICIALIZAÇÃO DO SERVIDOR E AGENDADOR CRON CVM
// ==============================================================================

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`🚀 PREVI-LACERDA - Sistema de Gestão de Investimentos RPPS`);
  console.log(`📡 Backend ativo na porta: ${PORT}`);
  console.log(`🔒 Perfis RBAC: Diretoria Executiva | Comitê | Conselho Fiscal`);
  console.log(`🏛️ Governança: Resolução CMN 4.963/2021 & Instrução CVM 555/175`);
  console.log(`================================================================`);

  // Inicializa o serviço em background do robô CVM
  DailyScheduler.init();
});

export default app;
