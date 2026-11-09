import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, ShieldAlert, KeyRound } from 'lucide-react';
import { api } from '../services/api';
import { User } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User, mustChangePassword: boolean) => void;
  initialEmail?: string;
  isDismissible?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialEmail = '',
  isDismissible = true
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialEmail) {
        setEmail(initialEmail);
      }
      setPassword('');
      setErrorMessage(null);
    }
  }, [isOpen, initialEmail]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await api.login(email, password);
      onLoginSuccess(res.user, res.mustChangePassword);
      setPassword('');
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha na autenticação. Verifique os dados informados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && isDismissible) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Cabeçalho - Layout Claro com Logo ArgosPrevi */}
        <div className="bg-slate-50 border-b border-slate-200 p-6 relative">
          <div className="flex items-center gap-3 mb-2">
            <img 
              src="/argosprevi-logo.png" 
              alt="ArgosPrevi Logo" 
              className="w-10 h-10 object-contain drop-shadow-sm rounded-xl shrink-0" 
            />
            <div>
              <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">Acesso Seguro RPPS</span>
              <span className="text-xs font-semibold text-slate-600">ArgosPrevi - Sistema de Gestão Previdenciária</span>
            </div>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">Login no PREVI-LACERDA</h2>
          <p className="text-xs text-slate-500 mt-1">
            Informe suas credenciais institucionais para acesso à carteira fiduciária.
          </p>

          {isDismissible && (
            <button 
              type="button"
              onClick={onClose} 
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Formulário de Autenticação */}
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
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none focus:bg-white text-slate-900"
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
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Digite sua senha de acesso"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none focus:bg-white text-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-bold py-2.5 rounded-lg transition-colors shadow-sm mt-2"
          >
            {loading ? 'Autenticando...' : 'Entrar no Sistema'}
          </button>
        </form>

        {/* Rodapé com Slogan Oficial */}
        <div className="bg-slate-50 border-t border-slate-200 py-2.5 px-4 text-center">
          <p className="text-[11px] font-bold text-teal-800">
            ArgosPrevi - olhar atento, gestão transparente
          </p>
        </div>
      </div>
    </div>
  );
};
