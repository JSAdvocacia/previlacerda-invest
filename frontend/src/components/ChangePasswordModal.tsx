import React, { useState } from 'react';
import { Lock, ShieldAlert, CheckCircle2, KeyRound } from 'lucide-react';
import { api } from '../services/api';

interface ChangePasswordModalProps {
  isOpen: boolean;
  userEmail: string;
  onPasswordChanged: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  userEmail,
  onPasswordChanged
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword.length < 6) {
      setErrorMessage('A nova senha deve possuir pelo menos 6 caracteres.');
      return;
    }

    if (newPassword === '123456') {
      setErrorMessage('Por segurança, a nova senha não pode ser a senha provisória padrão (123456).');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('A confirmação da senha não coincide com a nova senha digitada.');
      return;
    }

    setLoading(true);
    try {
      await api.changePassword(newPassword);
      onPasswordChanged();
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha ao alterar senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        <div className="bg-amber-600 text-white p-6">
          <div className="flex items-center gap-2 mb-1">
            <KeyRound className="w-5 h-5 text-amber-200" />
            <span className="text-xs font-black uppercase tracking-wider text-amber-100">
              Primeiro Acesso Obrigatório
            </span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">Alteração Obrigatória de Senha</h2>
          <p className="text-xs text-amber-100 mt-1">
            Identificamos o primeiro acesso do usuário <strong>{userEmail}</strong>. Por política de segurança RPPS, defina sua senha definitiva.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-xl font-medium flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-800">Diretrizes de Segurança da Senha:</div>
            <div>• Mínimo de 6 caracteres</div>
            <div>• Diferente da senha inicial provisória (123456)</div>
            <div>• Armazenamento criptografado em hash irreversível (bcrypt)</div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Nova Senha Definitiva *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Digite a nova senha segura"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Confirme a Nova Senha *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-bold py-2.5 rounded-lg transition-colors shadow-sm"
          >
            {loading ? 'Salvando nova senha...' : 'Confirmar e Acessar o Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
};
