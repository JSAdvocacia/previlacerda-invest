import React, { useState } from 'react';
import { Lock, Mail, ShieldAlert, KeyRound, ShieldCheck, ExternalLink, Eye, EyeOff, User as UserIcon, UserCheck } from 'lucide-react';
import { api } from '../services/api';
import { User, UserRole } from '../types';
import { OFFICIAL_REGULATION_URL, OFFICIAL_REGULATION_NORM } from '../services/mockData';

interface LoginScreenProps {
  onLoginSuccess: (user: User, mustChangePassword: boolean) => void;
  defaultEmail?: string;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  defaultEmail = 'prof.jan100@gmail.com'
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState(defaultEmail);
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

  const handleLoginSubmit = async (e: React.FormEvent) => {
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
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha ao realizar cadastro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 flex flex-col justify-between font-sans">
      {/* Área Central: Card de Login / Cadastro Fiduciário com Logo ArgosPrevi */}
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
                {isRegisterMode ? <UserCheck className="w-4 h-4" /> : <KeyRound className="w-4 h-4" />}
              </div>
              <div>
                <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">
                  {isRegisterMode ? 'Credenciamento RPPS' : 'Acesso Seguro RPPS'}
                </span>
                <span className="text-xs font-semibold text-slate-600">ArgosPrevi - Sistema de Gestão Previdenciária</span>
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              {isRegisterMode ? 'Novo Usuário • Cadastro' : 'Login no PREVI-LACERDA'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {isRegisterMode
                ? 'Preencha seus dados para credenciamento no sistema previdenciário.'
                : 'Informe suas credenciais institucionais para acesso à gestão previdenciária.'}
            </p>
          </div>

          {/* Mensagens de Sucesso / Erro */}
          <div className="px-6 sm:px-8 pt-4">
            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-xl font-medium flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-xl font-medium flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}
          </div>

          {!isRegisterMode ? (
            /* FORMULÁRIO DE LOGIN */
            <form onSubmit={handleLoginSubmit} className="p-6 sm:p-8 pt-2 space-y-4">
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
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Digite sua senha de acesso"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none focus:bg-white text-slate-900 transition-all"
                  />
                  {/* BOTÃO DO "OLHO" PARA VISUALIZAR A SENHA */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-teal-700 transition-colors p-0.5"
                    title={showPassword ? 'Ocultar senha' : 'Visualizar senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-teal-700" /> : <Eye className="w-4 h-4" />}
                  </button>
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

              {/* OPÇÃO: NOVO USUÁRIO, CADASTRE-SE */}
              <div className="pt-4 mt-2 border-t border-slate-100 text-center">
                <span className="text-xs text-slate-500">Ainda não tem acesso? </span>
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
            /* FORMULÁRIO DE CADASTRO DE NOVO USUÁRIO */
            <form onSubmit={handleRegisterSubmit} className="p-6 sm:p-8 pt-2 space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nome Completo *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ex: Jansen de Pinho e Silva"
                    className="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none focus:bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Perfil no RPPS *
                  </label>
                  <select
                    value={regRole}
                    onChange={e => setRegRole(e.target.value as UserRole)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  >
                    <option value="Membro do Comitê">Comitê de Investimentos</option>
                    <option value="Diretoria Executiva">Diretoria Executiva</option>
                    <option value="Conselho Fiscal">Conselho Fiscal</option>
                    <option value="Administrador">Administrador Fiduciário</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  E-mail Institucional *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="seu.nome@previlacerda.mt.gov.br"
                    className="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Senha de Acesso (mínimo 6 dígitos) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="Crie uma senha segura"
                    className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none focus:bg-white text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-teal-700 p-0.5"
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
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showRegConfirmPassword ? 'text' : 'password'}
                    required
                    value={regConfirmPassword}
                    onChange={e => setRegConfirmPassword(e.target.value)}
                    placeholder="Repita a senha"
                    className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none focus:bg-white text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-teal-700 p-0.5"
                    title={showRegConfirmPassword ? 'Ocultar senha' : 'Visualizar senha'}
                  >
                    {showRegConfirmPassword ? <EyeOff className="w-4 h-4 text-teal-700" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-bold py-2.5 rounded-lg transition-colors shadow-sm mt-3 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Cadastrando...</span>
                  </>
                ) : (
                  <span>Cadastrar e Entrar no Sistema</span>
                )}
              </button>

              <div className="pt-3 border-t border-slate-100 text-center">
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
