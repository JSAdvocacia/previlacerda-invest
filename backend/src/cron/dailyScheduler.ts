import cron from 'node-cron';
import { CvmIngestionService } from '../services/cvmIngestionService';
import { config } from '../config';

export class DailyScheduler {
  public static init() {
    console.log(`[CRON DAEMON] Inicializando agendador de tarefas em background...`);
    console.log(`[CRON DAEMON] Frequência configurada da CVM: ${config.cvm.cronSchedule}`);

    // Agenda a execução automática noturna dos dados abertos da CVM
    cron.schedule(config.cvm.cronSchedule, async () => {
      console.log(`[CRON DAEMON] Disparando rotina noturna automática de sincronização CVM...`);
      try {
        const result = await CvmIngestionService.executeDailySync();
        console.log(`[CRON DAEMON] Rotina CVM concluída com status: ${result.status}`);
      } catch (error) {
        console.error(`[CRON DAEMON ERROR] Falha no agendador diário da CVM:`, error);
      }
    }, {
      timezone: 'America/Cuiaba' // Fuso horário do Mato Grosso (Pontes e Lacerda - MT)
    });

    console.log(`[CRON DAEMON] Agendador ativo e monitorando fuso América/Cuiabá.`);
  }
}
