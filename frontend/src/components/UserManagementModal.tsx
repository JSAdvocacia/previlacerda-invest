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
  Lock
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
  const [newUserRole, setNewUserRole] = useState<UserRole>('Membro do Comitê');
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
      setTimeout(() => setFeedbackMsg(null), 3000);
    } catch (err: any) {
      setFeedbackMsg(err.message || 'Erro ao alterar perfil.');
    }
  };

  const handleToggleEmailVerify = async (email: string) => {
    try {
      await api.verifyEmail(email);
      setFeedbackMsg(`E-mail ${email} marcado como verificado.`);
      await loadUsers();
      setTimeout(() => setFeedbackMsg(null), 3000);
    } catch (err: any) {
      setFeedbackMsg('Falha ao validar e-mail.');
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
        role: newUserRole,
        is_email_verified: preVerify
      });
      setFeedbackMsg(`Usuário ${newUserEmail} criado com sucesso como [${newUserRole}]!`);
      setShowAddForm(false);
      setNewUserName('');
      setNewUserEmail('');
      await loadUsers();
      setTimeout(() => setFeedbackMsg(null), 3000);
    } catch (err: any) {
      setFeedbackMsg(err.message || 'Erro ao criar usuário.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Cabeçalho */}
        <div className="bg-[#0b1626] text-white p-6 flex justify-between items-center shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-md">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Gestão de Usuários & Perfis</h2>
                <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
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
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-3 flex items-center gap-2 text-xs text-emerald-900 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Usuários Registrados ({users.length})
              </span>
              <span className="text-[11px] text-slate-400">
                Acesso habilitado para o usuário master. Novos servidores podem ser adicionados e gerenciados abaixo.
              </span>
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
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
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={e => setNewUserName(e.target.value)}
                    placeholder="Ex: Samir Gilberto Castro"
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-medium focus:ring-1 focus:ring-blue-600"
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
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-medium focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Atribuir Perfil *</label>
                  <select
                    value={newUserRole}
                    onChange={e => setNewUserRole(e.target.value as UserRole)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-medium focus:ring-1 focus:ring-blue-600 font-bold"
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

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-700 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preVerify}
                    onChange={e => setPreVerify(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Pré-validar e-mail institucional para acesso imediato</span>
                </label>

                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg"
                >
                  Salvar e Criar Usuário
                </button>
              </div>
            </form>
          )}

          {/* Tabela de Usuários, Atribuição de Perfis e Exclusão */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase">
                <tr>
                  <th className="py-3 px-4">Nome / E-mail</th>
                  <th className="py-3 px-4 text-center">Status do E-mail</th>
                  <th className="py-3 px-4">Atribuir Perfil</th>
                  <th className="py-3 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {users.map(u => {
                  const isMasterUser = u.email.toLowerCase() === 'prof.jan100@gmail.com';
                  return (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{u.name}</span>
                          {isMasterUser && (
                            <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-black border border-blue-200">
                              MASTER
                            </span>
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
                            <span>Validar E-mail</span>
                          </button>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={u.role}
                          onChange={e => handleRoleChange(u.id, e.target.value as UserRole)}
                          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
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

                      <td className="py-3 px-4 text-center">
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
  );
};
