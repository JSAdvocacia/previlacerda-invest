import React, { useState, useEffect } from 'react';
import { X, RefreshCw, CheckCircle2, Clock, FileArchive, Zap } from 'lucide-react';
import { CvmLog, UserRole } from '../types';
import { api } from '../services/api';

interface CvmStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
}

export const CvmStatusModal: React.FC<CvmStatusModalProps> = ({
  isOpen,
  onClose,
  userRole
}) => {
  const [logs, setLogs] = useState<CvmLog[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadCvmLogs();
    }
  }, [isOpen]);

  const loadCvmLogs = async () => {
    try {
      const data = await api.getCvmLogs();
      setLogs(data);
    } catch (err) {
      console.error('Falha ao obter logs CVM', err);
    }
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    setFeedbackMsg(null);
    try {
      const res = await api.triggerCvmSync();
      setFeedbackMsg(res.message || 'Sincronização executada com sucesso!');
      await loadCvmLogs();
    } catch (err) {
      setFeedbackMsg('Erro ao disparar sincronização.');
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Topo do Modal */}
        <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-600/30 flex items-center justify-center text-teal-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">Serviço de Background - Robô CVM</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Ingestão automática diária do Portal de Dados Abertos da CVM (Informes Diários).
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informações da Automação */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Frequência CRON</div>
              <div className="text-sm font-black text-slate-900 mt-1">Diário às 21:00 BRT</div>
              <div className="text-[11px] text-teal-700 font-semibold mt-0.5">Segunda a Sexta-feira</div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Origem dos Dados</div>
              <div className="text-sm font-black text-slate-900 mt-1">dados.cvm.gov.br</div>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">inf_diario_fi_YYYYMM.zip</div>
            </div>
          </div>

          {feedbackMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-lg font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{feedbackMsg}</span>
            </div>
          )}

          {/* Histórico das Últimas Execuções */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase">Histórico de Execuções</span>
              <span className="text-[11px] text-slate-400">Total: {logs.length} execuções</span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Data / Hora</th>
                    <th className="py-2.5 px-3">Arquivo CVM</th>
                    <th className="py-2.5 px-3 text-center">Registros Lidos</th>
                    <th className="py-2.5 px-3 text-center">Ativos Atualizados</th>
                    <th className="py-2.5 px-3 text-right">Tempo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {logs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-semibold text-slate-800">
                        {log.executed_at}
                      </td>
                      <td className="py-2 px-3 font-mono text-[11px] text-teal-800">
                        {log.file_processed}
                      </td>
                      <td className="py-2 px-3 text-center">
                        {log.total_records_read.toLocaleString('pt-BR')}
                      </td>
                      <td className="py-2 px-3 text-center font-bold text-emerald-600">
                        {log.assets_updated}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-500">
                        {log.execution_time_seconds}s
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Botão de Disparo Manual */}
          <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
            <span className="text-xs text-slate-400">
              Robô executando de forma 100% autônoma sem necessidade de intervenção.
            </span>

            {userRole !== 'AUDITORIA_CONSELHO_FISCAL' ? (
              <button
                onClick={handleManualSync}
                disabled={isSyncing}
                className="bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Sincronizando...' : 'Disparar Sincronização Agora'}</span>
              </button>
            ) : (
              <span className="text-xs text-slate-400 italic">Disparo manual restrito à gestão</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
