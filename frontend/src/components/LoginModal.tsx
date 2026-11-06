import React, { useState } from 'react';
import { X, Lock, Mail, ShieldAlert, KeyRound, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { User } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User, mustChangePassword: boolean) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [email, setEmail] = useState('prof.jan100@gmail.com');
  const [password, setPassword] = useState('Capivaraalbin@01');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await api.login(email, password);
      onLoginSuccess(res.user, res.mustChangePassword);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha na autenticação.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Cabeçalho */}
        <div className="bg-slate-900 text-white p-6 relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600/30 flex items-center justify-center text-teal-400">
              <KeyRound className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Acesso Seguro RPPS</span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">Login no PREVI-LACERDA</h2>
          <p className="text-xs text-slate-400 mt-1">
            Informe suas credenciais institucionais para acesso à carteira fiduciária.
          </p>

          <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-xl font-medium flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">E-mail Institucional *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu.email@previlacerda.mt.gov.br"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              O usuário deve ser sempre um e-mail previamente validado.
            </span>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Senha de Acesso *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-bold py-2.5 rounded-lg transition-colors shadow-sm"
          >
            {loading ? 'Autenticando...' : 'Entrar no Sistema'}
          </button>

          {/* Credencial Master Autorizada */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-2">
              Usuário Master Habilitado:
            </span>
            <button
              type="button"
              onClick={() => handleQuickLogin('prof.jan100@gmail.com', 'Capivaraalbin@01')}
              className="w-full text-left bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 p-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-1.5 text-blue-800">
                  <span>👑 Administrador Master</span>
                  <span className="text-[10px] bg-blue-200/60 px-1.5 py-0.5 rounded text-blue-900">Acesso Total</span>
                </div>
                <div className="text-[11px] font-normal text-blue-700 mt-0.5">prof.jan100@gmail.com</div>
              </div>
              <div className="text-[11px] font-mono text-blue-600 bg-white/80 px-2 py-1 rounded border border-blue-200">
                Capivaraalbin@01
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
