import React, { useState, useEffect } from 'react';
import { X, Users, UserPlus, Shield, CheckCircle2, AlertTriangle, MailCheck } from 'lucide-react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Formulário para novo usuário
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('COMITE_INVESTIMENTOS');
  const [preVerify, setPreVerify] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await api.listUsers();
      setUsers(data);
    } catch (err) {
      console.error('Erro ao listar usuários', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await api.assignUserRole(userId, newRole);
      setFeedbackMsg(`Perfil atualizado com sucesso para [${newRole}].`);
      await loadUsers();
    } catch (err: any) {
      setFeedbackMsg(err.message || 'Erro ao alterar perfil.');
    }
  };

  const handleToggleEmailVerify = async (email: string) => {
    try {
      await api.verifyEmail(email);
      setFeedbackMsg(`E-mail ${email} marcado como verificado.`);
      await loadUsers();
    } catch (err: any) {
      setFeedbackMsg('Falha ao validar e-mail.');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createUser({
        name: newUserName,
        email: newUserEmail,
        role: newUserRole,
        is_email_verified: preVerify
      });
      setFeedbackMsg(`Usuário ${newUserEmail} criado com sucesso!`);
      setShowAddForm(false);
      setNewUserName('');
      setNewUserEmail('');
      await loadUsers();
    } catch (err: any) {
      setFeedbackMsg(err.message || 'Erro ao criar usuário.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Cabeçalho */}
        <div className="bg-slate-900 text-white p-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-600/30 flex items-center justify-center text-teal-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Gestão de Usuários & Perfis (RBAC)</h2>
                <span className="text-[10px] font-black bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded">
                  PAINEL MASTER
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Exclusivo para o Usuário Master (<strong>prof.jan100@gmail.com</strong>) para atribuição e controle de acessos.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div className="bg-teal-50 border-b border-teal-200 px-6 py-3 flex items-center gap-2 text-xs text-teal-900 font-bold">
            <CheckCircle2 className="w-4 h-4 text-teal-700" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Usuários Registrados ({users.length})
            </span>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-xs bg-teal-700 hover:bg-teal-800 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{showAddForm ? 'Fechar Formulário' : '+ Novo Usuário'}</span>
            </button>
          </div>

          {/* Formulário de Adicionar Usuário */}
          {showAddForm && (
            <form onSubmit={handleCreateUser} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
              <div className="text-xs font-bold text-slate-800">Cadastrar Novo Usuário Institucional</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={e => setNewUserName(e.target.value)}
                    placeholder="Ex: João da Silva"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-medium focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">E-mail Institucional</label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={e => setNewUserEmail(e.target.value)}
                    placeholder="servidor@previlacerda.mt.gov.br"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-medium focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Perfil Inicial</label>
                  <select
                    value={newUserRole}
                    onChange={e => setNewUserRole(e.target.value as UserRole)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-medium focus:ring-1 focus:ring-teal-600"
                  >
                    <option value="COMITE_INVESTIMENTOS">Comitê de Investimentos</option>
                    <option value="DIRETORIA_EXECUTIVA">Diretoria Executiva</option>
                    <option value="AUDITORIA_CONSELHO_FISCAL">Conselho Fiscal (Read-Only)</option>
                    <option value="MASTER_ADMIN">Master Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-700 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preVerify}
                    onChange={e => setPreVerify(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span>Pré-validar e-mail institucional para acesso imediato</span>
                </label>

                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg"
                >
                  Salvar Usuário
                </button>
              </div>
            </form>
          )}

          {/* Tabela de Usuários e Atribuição de Perfis */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase">
                <tr>
                  <th className="py-3 px-4">Nome / E-mail</th>
                  <th className="py-3 px-4 text-center">Validação de E-mail</th>
                  <th className="py-3 px-4">Perfil Atribuído (RBAC)</th>
                  <th className="py-3 px-4 text-center">Troca de Senha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{u.name}</span>
                        {u.role === 'MASTER_ADMIN' && (
                          <span className="text-[9px] bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded font-black">MASTER</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      {u.is_email_verified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Validado</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleToggleEmailVerify(u.email)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200 transition-colors"
                          title="Clique para validar este e-mail"
                        >
                          <MailCheck className="w-3 h-3" />
                          <span>Pendente (Validar)</span>
                        </button>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={u.role}
                        onChange={e => handleRoleChange(u.id, e.target.value as UserRole)}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-600"
                      >
                        <option value="MASTER_ADMIN">Master Admin (Acesso Total)</option>
                        <option value="DIRETORIA_EXECUTIVA">Diretoria Executiva</option>
                        <option value="COMITE_INVESTIMENTOS">Comitê de Investimentos</option>
                        <option value="AUDITORIA_CONSELHO_FISCAL">Conselho Fiscal (Read-Only)</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 text-center">
                      {u.must_change_password ? (
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                          Exigida no 1º Acesso
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Regular</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
