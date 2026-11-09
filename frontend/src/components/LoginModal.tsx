import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, ShieldAlert, KeyRound, Eye, EyeOff, User as UserIcon, UserCheck, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { User, UserRole } from '../types';

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
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Campos de Cadastro
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('Membro do Comitê');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialEmail) {
        setEmail(initialEmail);
      }
      setPassword('');
      setErrorMessage(null);
      setSuccessMessage(null);
      setIsRegisterMode(false);
    }
  }, [isOpen, initialEmail]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
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

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('As senhas digitadas não coincidem.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage('A senha deve conter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.registerUser({
        name,
        email: regEmail,
        password: regPassword,
        cpf,
        role: regRole
      });
      setSuccessMessage('Usuário cadastrado com sucesso! Acessando o sistema...');
      setTimeout(() => {
        onLoginSuccess(res.user, false);
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha ao realizar cadastro.');
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
        {/* Cabeçalho - Layout Claro com Logo ArgosPrevi substituindo "Login no PREVI-LACERDA" */}
        <div className="bg-slate-50 border-b border-slate-200 p-6 relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-800 shadow-2xs">
              {isRegisterMode ? <UserCheck className="w-3.5 h-3.5" /> : <KeyRound className="w-3.5 h-3.5" />}
            </div>
            <div>
              <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">
                {isRegisterMode ? 'Credenciamento RPPS' : 'Acesso Seguro RPPS'}
              </span>
              <span className="text-xs font-semibold text-slate-600">ArgosPrevi - Sistema de Gestão Previdenciária</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 my-2.5 p-2 bg-white rounded-xl border border-slate-100 shadow-2xs">
            <img 
              src="/argosprevi-logo.png" 
              alt="ArgosPrevi Logo" 
              className="w-14 h-14 object-contain drop-shadow-sm rounded-xl shrink-0" 
            />
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-1">
                {isRegisterMode ? (
                  'Novo Usuário'
                ) : (
                  <>
                    <span>Argos</span><span className="text-teal-700">Previ</span>
                  </>
                )}
              </h2>
              <p className="text-[11px] font-bold text-teal-800 uppercase tracking-wide mt-1">
                {isRegisterMode ? 'Cadastro no Sistema' : 'Sistema de Gestão Previdenciária'}
              </p>
              <p className="text-[10px] text-slate-500 italic mt-0.5">
                olhar atento, gestão transparente
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-1">
            {isRegisterMode
              ? 'Informe seus dados funcionais para solicitar credenciamento fiduciário.'
              : 'Informe suas credenciais institucionais para acesso à gestão previdenciária.'}
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

        {/* Mensagens */}
        <div className="px-6 pt-4">
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-xl font-medium flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl font-medium flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        {!isRegisterMode ? (
          /* Formulário de Autenticação */
          <form onSubmit={handleLoginSubmit} className="p-6 pt-2 space-y-4">
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
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Digite sua senha de acesso"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none focus:bg-white text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-teal-700 p-0.5 transition-colors"
                  title={showPassword ? 'Ocultar senha' : 'Visualizar senha'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4 text-teal-700" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-bold py-2.5 rounded-lg transition-colors shadow-sm mt-2"
            >
              {loading ? 'Autenticando...' : 'Entrar no Sistema'}
            </button>

            {/* OPÇÃO: NOVO USUÁRIO, CADASTRE-SE */}
            <div className="pt-3 border-t border-slate-100 text-center">
              <span className="text-xs text-slate-500">Novo usuário? </span>
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(true);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="text-xs font-bold text-teal-700 hover:text-teal-900 hover:underline transition-colors"
              >
                Novo usuário, cadastre-se
              </button>
            </div>
          </form>
        ) : (
          /* Formulário de Cadastro de Novo Usuário */
          <form onSubmit={handleRegisterSubmit} className="p-6 pt-2 space-y-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Nome Completo *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Nome do servidor/conselheiro"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none focus:bg-white text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  CPF *
                </label>
                <input
                  type="text"
                  required
                  value={cpf}
                  onChange={e => setCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Função no RPPS *
                </label>
                <select
                  value={regRole}
                  onChange={e => setRegRole(e.target.value as UserRole)}
                  className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                >
                  <option value="Membro do Comitê">Comitê de Investimentos</option>
                  <option value="Diretoria Executiva">Diretoria Executiva</option>
                  <option value="Conselho Fiscal">Conselho Fiscal</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                E-mail Institucional *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  placeholder="seu.email@previlacerda.mt.gov.br"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none focus:bg-white text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Senha de Acesso (mínimo 6 dígitos) *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  required
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  placeholder="Crie sua senha"
                  className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none focus:bg-white text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-teal-700 p-0.5"
                  title={showRegPassword ? 'Ocultar senha' : 'Visualizar senha'}
                >
                  {showRegPassword ? <EyeOff className="w-4 h-4 text-teal-700" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Confirmar Senha *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type={showRegConfirmPassword ? 'text' : 'password'}
                  required
                  value={regConfirmPassword}
                  onChange={e => setRegConfirmPassword(e.target.value)}
                  placeholder="Repita sua senha"
                  className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none focus:bg-white text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-teal-700 p-0.5"
                  title={showRegConfirmPassword ? 'Ocultar senha' : 'Visualizar senha'}
                >
                  {showRegConfirmPassword ? <EyeOff className="w-4 h-4 text-teal-700" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-bold py-2.5 rounded-lg transition-colors shadow-sm mt-2"
            >
              {loading ? 'Cadastrando...' : 'Cadastrar e Entrar no Sistema'}
            </button>

            <div className="pt-2.5 border-t border-slate-100 text-center">
              <span className="text-xs text-slate-500">Já possui cadastro? </span>
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(false);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="text-xs font-bold text-teal-700 hover:text-teal-900 hover:underline transition-colors"
              >
                Voltar ao Login
              </button>
            </div>
          </form>
        )}

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
