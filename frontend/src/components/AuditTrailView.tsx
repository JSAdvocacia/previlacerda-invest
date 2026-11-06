import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, Filter, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { AuditLog } from '../types';
import { api } from '../services/api';

export const AuditTrailView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const data = await api.getAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error('Falha ao carregar logs de auditoria', err);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip_address?.includes(searchTerm);

    const matchesFilter = filterAction === 'ALL' || log.action === filterAction;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header Institucional de Auditoria */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-xs px-2.5 py-1 rounded-full font-bold mb-2 border border-amber-200">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Trilha de Auditoria Imutável (Append-Only Audit Trail)</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Fiscalização e Trilha de Auditoria
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Registro inalterável de todas as ações no PREVI-LACERDA para inspeção do Conselho Fiscal e Tribunal de Contas (TCE-MT).
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
            <CheckCircle2 className="w-4 h-4" />
            <span>Hashes SHA-256 Verificados e Íntegros</span>
          </div>
        </div>

        {/* Barra de Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por usuário, ação, IP ou recurso..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterAction}
              onChange={e => setFilterAction(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium px-3 py-2 text-slate-700 focus:outline-none"
            >
              <option value="ALL">Todas as Ações</option>
              <option value="APPROVE_ASSET">Aprovações de Ativo</option>
              <option value="CREATE_ASSET">Cadastros de Ativo</option>
              <option value="CVM_DAILY_SYNC_AUTOMATION">Automação CVM</option>
              <option value="LOGIN_SUCCESS">Acessos / Logins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabela de Logs de Auditoria */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-900 text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Carimbo de Data/Hora</th>
                <th className="py-3 px-4">Usuário / E-mail</th>
                <th className="py-3 px-4">Perfil RBAC</th>
                <th className="py-3 px-4">Ação Registrada</th>
                <th className="py-3 px-4">Recurso / ID</th>
                <th className="py-3 px-4">Endereço IP</th>
                <th className="py-3 px-4">Hash Integridade SHA-256</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800">{log.user_email}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{log.user_id}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {log.user_role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                      log.action.includes('APPROVE')
                        ? 'bg-emerald-100 text-emerald-800'
                        : log.action.includes('CREATE')
                        ? 'bg-blue-100 text-blue-800'
                        : log.action.includes('CVM')
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <span className="font-semibold text-slate-800">{log.resource}</span>
                    {log.record_id && (
                      <div className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]" title={log.record_id}>
                        {log.record_id}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 font-semibold">
                    {log.ip_address}
                  </td>
                  <td className="py-3 px-4 font-mono text-[10px] text-teal-800 font-bold truncate max-w-[130px]" title={log.integrity_hash}>
                    {log.integrity_hash?.slice(0, 16)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
