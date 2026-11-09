import React, { useState, useEffect } from 'react';
import { 
  X, 
  Users, 
  UserPlus, 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  MailCheck, 
  Trash2,
  Lock,
  UserCheck,
  Clock,
  ShieldCheck,
  ShieldAlert,
  RotateCcw
} from 'lucide-react';
import { User, UserRole, USER_ROLES_LIST } from '../types';
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
  const [newUserCpf, setNewUserCpf] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('Membro do Comitê');
  const [preVerify, setPreVerify] = useState(true);
  const [preApprove, setPreApprove] = useState(true);

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
      setTimeout(() => setFeedbackMsg(null), 3000);
    } catch (err: any) {
      setFeedbackMsg(err.message || 'Erro ao alterar perfil.');
    }
  };

  const handleToggleEmailVerify = async (email: string) => {
    try {
      await api.verifyEmail(email);
      setFeedbackMsg(`E-mail ${email} confirmado pelo Administrador.`);
      await loadUsers();
      setTimeout(() => setFeedbackMsg(null), 3000);
    } catch (err: any) {
      setFeedbackMsg('Falha ao validar e-mail.');
    }
  };

  const handleApproveUser = async (userId: string, userName: string) => {
    try {
      await api.approveUser(userId, currentUser.name);
      setFeedbackMsg(`Acesso do servidor ${userName} homologado e liberado com sucesso!`);
      await loadUsers();
      setTimeout(() => setFeedbackMsg(null), 3500);
    } catch (err: any) {
      setFeedbackMsg(err.message || 'Erro ao liberar usuário.');
    }
  };

  const handleRevokeApproval = async (userId: string, userName: string) => {
    if (confirm(`Deseja revogar o acesso de ${userName}? O usuário não conseguirá efetuar login até ser liberado novamente.`)) {
      try {
        await api.revokeUserApproval(userId);
        setFeedbackMsg(`Acesso de ${userName} revogado.`);
        await loadUsers();
        setTimeout(() => setFeedbackMsg(null), 3500);
      } catch (err: any) {
        setFeedbackMsg(err.message || 'Erro ao revogar acesso.');
      }
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (userEmail.toLowerCase() === 'prof.jan100@gmail.com') {
      alert('O Usuário Master prof.jan100@gmail.com não pode ser excluído.');
      return;
    }

    if (confirm(`Tem certeza que deseja excluir o usuário ${userEmail}? Esta ação registrará log de auditoria.`)) {
      try {
        await api.deleteUser(userId);
        setFeedbackMsg(`Usuário ${userEmail} excluído com sucesso.`);
        await loadUsers();
        setTimeout(() => setFeedbackMsg(null), 3000);
      } catch (err: any) {
        setFeedbackMsg('Erro ao excluir usuário.');
      }
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createUser({
        name: newUserName,
        email: newUserEmail,
        cpf: newUserCpf,
        role: newUserRole,
        is_email_verified: preVerify,
        is_approved: preApprove
      });
      setFeedbackMsg(`Usuário ${newUserEmail} criado com sucesso como [${newUserRole}]!`);
      setShowAddForm(false);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserCpf('');
      await loadUsers();
      setTimeout(() => setFeedbackMsg(null), 3000);
    } catch (err: any) {
      setFeedbackMsg(err.message || 'Erro ao criar usuário.');
    }
  };

  const pendingApprovals = users.filter(u => !u.is_approved && u.email.toLowerCase() !== 'prof.jan100@gmail.com');
  const pendingEmails = users.filter(u => !u.is_email_verified);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Cabeçalho */}
        <div className="bg-[#0b1626] text-white p-6 flex justify-between items-center shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600/30 border border-teal-500/40 flex items-center justify-center text-teal-400 shadow-md">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Gestão de Usuários & Controle de Acessos RPPS</h2>
                <span className="text-[10px] font-black bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded">
                  PAINEL ADMINISTRATIVO
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Liberação de acessos fiduciários, confirmação de e-mails institucionais e atribuição de perfis de governança.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-3 flex items-center gap-2 text-xs text-emerald-900 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Alerta de Usuários Aguardando Homologação */}
        {pendingApprovals.length > 0 && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2.5 font-bold">
              <Clock className="w-4 h-4 text-amber-700 animate-pulse shrink-0" />
              <span>
                Atenção: Há {pendingApprovals.length} novo(s) usuário(s) aguardando homologação e liberação de acesso pelo Administrador.
              </span>
            </div>
            <span className="text-[11px] bg-amber-200/70 text-amber-900 font-black px-2 py-0.5 rounded">
              Ação Requerida
            </span>
          </div>
        )}

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Servidores & Usuários Registrados ({users.length})
              </span>
              <span className="text-[11px] text-slate-500">
                Novos usuários só acessam a carteira após confirmação de e-mail e homologação pelo Master ou Administrador.
              </span>
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-xs bg-teal-700 hover:bg-teal-800 text-white font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm self-start sm:self-auto shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{showAddForm ? 'Fechar Formulário' : '+ Novo Usuário'}</span>
            </button>
          </div>

          {/* Formulário de Adicionar Usuário pelo Admin */}
          {showAddForm && (
            <form onSubmit={handleCreateUser} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 shadow-inner">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-teal-700" />
                <span>Cadastrar Usuário Direto pelo Administrador</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Nome Completo *</label>
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
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">CPF</label>
                  <input
                    type="text"
                    value={newUserCpf}
                    onChange={e => setNewUserCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-medium focus:ring-1 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">E-mail Institucional *</label>
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
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Atribuir Perfil *</label>
                  <select
                    value={newUserRole}
                    onChange={e => setNewUserRole(e.target.value as UserRole)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-teal-600"
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Diretor Executivo">Diretor Executivo</option>
                    <option value="Membro do Comitê">Membro do Comitê</option>
                    <option value="Gestor de Recursos">Gestor de Recursos</option>
                    <option value="Membro de Conselho">Membro de Conselho</option>
                    <option value="Presidente do Conselho">Presidente do Conselho</option>
                    <option value="Membro do Conselho Fiscal">Membro do Conselho Fiscal</option>
                    <option value="Presidente do Comitê">Presidente do Comitê</option>
                    <option value="Presidente do C. Fiscal">Presidente do C. Fiscal</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/60">
                <div className="flex items-center gap-4 text-xs text-slate-700 font-semibold">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preVerify}
                      onChange={e => setPreVerify(e.target.checked)}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span>E-mail validado</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preApprove}
                      onChange={e => setPreApprove(e.target.checked)}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span>Acesso liberado imediatamente</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg"
                >
                  Salvar e Criar Usuário
                </button>
              </div>
            </form>
          )}

          {/* Tabela de Usuários, Atribuição de Perfis e Homologação de Acessos */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Servidor / E-mail</th>
                    <th className="py-3 px-3 text-center">Status E-mail</th>
                    <th className="py-3 px-4 text-center">Homologação / Acesso</th>
                    <th className="py-3 px-4">Perfil RBAC</th>
                    <th className="py-3 px-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {users.map(u => {
                    const isMasterUser = u.email.toLowerCase() === 'prof.jan100@gmail.com';
                    const isEmailOk = Boolean(u.is_email_verified);
                    const isApproved = Boolean(u.is_approved || isMasterUser);

                    return (
                      <tr key={u.id} className={`transition-colors ${!isApproved ? 'bg-amber-50/40 hover:bg-amber-50/70' : 'hover:bg-slate-50'}`}>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {isMasterUser && (
                              <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-black border border-blue-200">
                                MASTER
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">{u.email}</div>
                          {u.cpf && (
                            <div className="text-[10px] text-slate-400">CPF: {u.cpf}</div>
                          )}
                        </td>

                        {/* Status do E-mail */}
                        <td className="py-3.5 px-3 text-center">
                          {isEmailOk ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200" title="E-mail confirmado pelo usuário">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Confirmado</span>
                            </span>
                          ) : (
                            <div className="flex flex-col items-center gap-1">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                <Clock className="w-3 h-3 text-amber-600" />
                                <span>Pendente</span>
                              </span>
                              <button
                                onClick={() => handleToggleEmailVerify(u.email)}
                                className="text-[10px] text-blue-700 hover:underline font-bold"
                                title="Confirmar manualmente como Administrador"
                              >
                                Validar
                              </button>
                            </div>
                          )}
                        </td>

                        {/* Homologação / Liberação pelo Administrador */}
                        <td className="py-3.5 px-4 text-center">
                          {isMasterUser ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Acesso Total Master</span>
                            </span>
                          ) : isApproved ? (
                            <div className="inline-flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Liberado</span>
                              </span>
                              <button
                                onClick={() => handleRevokeApproval(u.id, u.name)}
                                className="text-[10px] text-rose-600 hover:text-rose-800 hover:underline font-bold"
                                title="Revogar acesso temporariamente"
                              >
                                Revogar
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleApproveUser(u.id, u.name)}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg shadow-sm transition-all transform active:scale-95"
                              title="Clique para homologar e liberar o acesso deste usuário"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Liberar Acesso</span>
                            </button>
                          )}
                        </td>

                        {/* Perfil RBAC */}
                        <td className="py-3.5 px-4">
                          <select
                            value={u.role}
                            onChange={e => handleRoleChange(u.id, e.target.value as UserRole)}
                            disabled={isMasterUser}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-600 disabled:opacity-75"
                          >
                            <option value="Administrador">Administrador</option>
                            <option value="Diretor Executivo">Diretor Executivo</option>
                            <option value="Membro do Comitê">Membro do Comitê</option>
                            <option value="Gestor de Recursos">Gestor de Recursos</option>
                            <option value="Membro de Conselho">Membro de Conselho</option>
                            <option value="Presidente do Conselho">Presidente do Conselho</option>
                            <option value="Membro do Conselho Fiscal">Membro do Conselho Fiscal</option>
                            <option value="Presidente do Comitê">Presidente do Comitê</option>
                            <option value="Presidente do C. Fiscal">Presidente do C. Fiscal</option>
                          </select>
                        </td>

                        {/* Ações */}
                        <td className="py-3.5 px-3 text-center">
                          {isMasterUser ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-100 px-2 py-1 rounded" title="Usuário Master protegido">
                              <Lock className="w-3 h-3" />
                              <span>Protegido</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => handleDeleteUser(u.id, u.email)}
                              className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-200 transition-colors font-semibold"
                              title="Excluir este usuário"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Excluir</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
