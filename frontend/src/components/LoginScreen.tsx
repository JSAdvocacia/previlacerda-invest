import React, { useState } from 'react';
import { Lock, Mail, ShieldAlert, KeyRound, ShieldCheck, ExternalLink } from 'lucide-react';
import { api } from '../services/api';
import { User } from '../types';
import { OFFICIAL_REGULATION_URL, OFFICIAL_REGULATION_NORM } from '../services/mockData';

interface LoginScreenProps {
  onLoginSuccess: (user: User, mustChangePassword: boolean) => void;
  defaultEmail?: string;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  defaultEmail = 'prof.jan100@gmail.com'
}) => {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await api.login(email, password);
      setPassword('');
      onLoginSuccess(res.user, res.mustChangePassword);
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha na autenticação. Verifique os dados informados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 flex flex-col justify-between font-sans">
      {/* Top Bar Institucional Municipal */}
      <header className="bg-white border-b border-slate-200 py-3 px-4 sm:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-3">
            {/* Bandeira de Pontes e Lacerda */}
            <div className="w-10 h-7 rounded border border-slate-200 overflow-hidden shadow-2xs shrink-0">
              <svg viewBox="0 0 40 28" className="w-full h-full">
                <rect width="40" height="14" fill="#009b3a" />
                <rect y="14" width="40" height="14" fill="#ffdf00" />
                <polygon points="0,0 20,14 0,28" fill="#002776" />
                <polygon points="7,14 5.5,9.5 9.5,12 3.5,12 7.5,9.5" fill="#ffffff" />
              </svg>
            </div>
            <div>
              <span className="font-black text-slate-900 block leading-tight">Prefeitura de Pontes e Lacerda - MT</span>
              <span className="text-[11px] text-blue-700 font-bold">PREVI-LACERDA • Regime Próprio de Previdência Social</span>
            </div>
          </div>

          <a
            href={OFFICIAL_REGULATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>{OFFICIAL_REGULATION_NORM}</span>
            <ExternalLink className="w-3 h-3 text-blue-400" />
          </a>
        </div>
      </header>

      {/* Área Central: Card de Login Fiduciário com Logo ArgosPrevi */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 my-6">
        {/* Logotipo Oficial ArgosPrevi */}
        <div className="flex flex-col items-center mb-6 text-center">
          <img 
            src="/argosprevi-logo.png" 
            alt="ArgosPrevi - Olhar atento, gestão transparente" 
            className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-md mb-2 rounded-2xl"
          />
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
            <span>Argos</span><span className="text-teal-700">Previ</span>
          </h1>
          <p className="text-xs font-semibold text-teal-800 tracking-wide uppercase mt-0.5">
            Sistema de Gestão Previdenciária
          </p>
          <p className="text-[11px] text-slate-500 italic mt-0.5">
            ArgosPrevi - olhar atento, gestão transparente
          </p>
        </div>

        <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-slate-200 overflow-hidden">
          {/* Cabeçalho do Card */}
          <div className="bg-slate-50 border-b border-slate-200 p-6 sm:p-8">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-800 shadow-2xs">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">Acesso Seguro RPPS</span>
                <span className="text-xs font-semibold text-slate-600">ArgosPrevi - Sistema de Gestão Previdenciária</span>
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Login no PREVI-LACERDA
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Informe suas credenciais institucionais para acesso à gestão previdenciária.
            </p>
          </div>

          {/* Formulário de Acesso */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-xl font-medium flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                E-mail Institucional *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu.email@previlacerda.mt.gov.br"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none focus:bg-white text-slate-900 transition-all"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Usuário cadastrado com autorização fiduciária.
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Senha de Acesso *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Digite sua senha de acesso"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none focus:bg-white text-slate-900 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-bold py-3 rounded-lg transition-colors shadow-sm mt-3 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Autenticando...</span>
                </>
              ) : (
                <span>Entrar no Sistema</span>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Rodapé Fiduciário com Slogan ArgosPrevi */}
      <footer className="bg-white border-t border-slate-200 text-slate-500 text-xs py-4 px-4 text-center">
        <p className="font-bold text-teal-800 text-xs">
          ArgosPrevi - olhar atento, gestão transparente
        </p>
        <p className="font-semibold text-slate-700 mt-1">
          PREVI-LACERDA — Fundo Municipal de Previdência Social dos Servidores de Pontes e Lacerda - MT
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          CNPJ: 15.023.989/0001-26 • Carteira Fiduciária Regulamentada pela {OFFICIAL_REGULATION_NORM}
        </p>
      </footer>
    </div>
  );
};
