import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  ShieldAlert, 
  KeyRound, 
  ShieldCheck, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  User as UserIcon, 
  UserCheck,
  Clock,
  CheckCircle2,
  Send,
  RotateCcw
} from 'lucide-react';
import { api } from '../services/api';
import { User, UserRole } from '../types';
import { OFFICIAL_REGULATION_URL, OFFICIAL_REGULATION_NORM } from '../services/mockData';

interface LoginScreenProps {
  onLoginSuccess: (user: User, mustChangePassword: boolean) => void;
  defaultEmail?: string;
}

type ViewStep = 'login' | 'register' | 'verify_email' | 'pending_approval';

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  defaultEmail = 'prof.jan100@gmail.com'
}) => {
  const [viewStep, setViewStep] = useState<ViewStep>('login');
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

  // Confirmação de E-mail
  const [pendingEmail, setPendingEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCodeHint, setGeneratedCodeHint] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setErrorCode(null);
    setLoading(true);

    try {
      const res = await api.login(email, password);
      setPassword('');
      onLoginSuccess(res.user, res.mustChangePassword);
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha na autenticação. Verifique os dados informados.');
      setErrorCode(err.code || null);
      if (err.code === 'EMAIL_NOT_VERIFIED') {
        setPendingEmail(email);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setErrorCode(null);

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
      setPendingEmail(regEmail.toLowerCase().trim());
      setGeneratedCodeHint(res.verificationCode);
      setVerificationCode(res.verificationCode); // Pré-preenche para conveniência no teste
      setSuccessMessage('Cadastro recebido! Enviamos um código de confirmação para o seu e-mail institucional.');
      setViewStep('verify_email');
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha ao realizar cadastro.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      await api.confirmUserEmail(pendingEmail, verificationCode);
      setSuccessMessage('E-mail institucional confirmado com sucesso!');
      setViewStep('pending_approval');
    } catch (err: any) {
      setErrorMessage(err.message || 'Código de verificação incorreto.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      const newCode = await api.resendVerificationCode(pendingEmail);
      setGeneratedCodeHint(newCode);
      setVerificationCode(newCode);
      setSuccessMessage(`Novo código enviado para ${pendingEmail}: ${newCode}`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage('Falha ao reenviar código.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 flex flex-col justify-between font-sans">
      {/* Área Central: Card de Login / Cadastro / Verificação Fiduciária */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 my-6">
        <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-slate-200 overflow-hidden">
          
          {/* Cabeçalho do Card - Logo ArgosPrevi no lugar de "Login no PREVI-LACERDA" */}
          <div className="bg-slate-50 border-b border-slate-200 p-6 sm:p-8">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-800 shadow-2xs shrink-0">
                {viewStep === 'register' && <UserCheck className="w-4 h-4" />}
                {viewStep === 'verify_email' && <Mail className="w-4 h-4" />}
                {viewStep === 'pending_approval' && <Clock className="w-4 h-4" />}
                {viewStep === 'login' && <KeyRound className="w-4 h-4" />}
              </div>
              <div>
                <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">
                  {viewStep === 'register' && 'Credenciamento RPPS'}
                  {viewStep === 'verify_email' && 'Validação de E-mail'}
                  {viewStep === 'pending_approval' && 'Homologação Pendente'}
                  {viewStep === 'login' && 'Acesso Seguro RPPS'}
                </span>
                <span className="text-xs font-semibold text-slate-600">ArgosPrevi - Sistema de Gestão Previdenciária</span>
              </div>
            </div>

            {/* Logotipo Oficial ArgosPrevi em substituição direta a "Login no PREVI-LACERDA" */}
            <div className="flex items-center gap-4 my-2.5 p-2 bg-white rounded-xl border border-slate-100 shadow-2xs">
              <img 
                src="/argosprevi-logo.png" 
                alt="ArgosPrevi" 
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-sm rounded-xl shrink-0"
              />
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-1">
                  {viewStep === 'register' && 'Novo Usuário'}
                  {viewStep === 'verify_email' && 'Validar E-mail'}
                  {viewStep === 'pending_approval' && 'Homologação'}
                  {viewStep === 'login' && (
                    <>
                      <span>Argos</span><span className="text-teal-700">Previ</span>
                    </>
                  )}
                </h2>
                <p className="text-[11px] font-bold text-teal-800 uppercase tracking-wide mt-1">
                  Sistema de Gestão Previdenciária
                </p>
                <p className="text-[10px] text-slate-500 italic mt-0.5">
                  olhar atento, gestão transparente
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              {viewStep === 'register' && 'Preencha seus dados para solicitar credenciamento fiduciário no sistema.'}
              {viewStep === 'verify_email' && `Digite o código de 6 dígitos enviado para ${pendingEmail}.`}
              {viewStep === 'pending_approval' && 'Seu e-mail foi confirmado e o acesso aguarda homologação do Administrador.'}
              {viewStep === 'login' && 'Informe suas credenciais institucionais para acesso à gestão previdenciária.'}
            </p>
          </div>

          {/* Mensagens de Sucesso / Erro / Alertas de Governança */}
          <div className="px-6 sm:px-8 pt-4 space-y-2">
            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-xl font-medium flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div>{errorMessage}</div>
                  {errorCode === 'EMAIL_NOT_VERIFIED' && (
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMessage(null);
                        setViewStep('verify_email');
                      }}
                      className="mt-2 text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 px-2.5 py-1 rounded transition-colors inline-flex items-center gap-1"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Confirmar meu e-mail agora</span>
                    </button>
                  )}
                  {errorCode === 'PENDING_ADMIN_APPROVAL' && (
                    <div className="mt-2 text-[11px] text-amber-800 bg-amber-50 border border-amber-200 p-2 rounded">
                      <strong>Orientações:</strong> Solicite ao Administrador Master (prof.jan100@gmail.com) ou ao responsável pelo RPPS que acesse a aba <strong>Gestão de Usuários</strong> para liberar seu perfil.
                    </div>
                  )}
                </div>
              </div>
            )}

            {successMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-xl font-medium flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}
          </div>

          {/* 1. FORMULÁRIO DE LOGIN */}
          {viewStep === 'login' && (
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
                  Acesso fiduciário restrito a servidores credenciados e homologados.
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
                    setViewStep('register');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 hover:underline transition-colors"
                >
                  Novo usuário, cadastre-se
                </button>
              </div>
            </form>
          )}

          {/* 2. FORMULÁRIO DE CADASTRO */}
          {viewStep === 'register' && (
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
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Será enviado um código de 6 dígitos para este e-mail.
                </span>
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
                    <span>Registrando...</span>
                  </>
                ) : (
                  <span>Avançar para Confirmação de E-mail</span>
                )}
              </button>

              <div className="pt-3 border-t border-slate-100 text-center">
                <span className="text-xs text-slate-500">Já possui cadastro? </span>
                <button
                  type="button"
                  onClick={() => {
                    setViewStep('login');
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

          {/* 3. CONFIRMAÇÃO DE E-MAIL */}
          {viewStep === 'verify_email' && (
            <form onSubmit={handleConfirmEmailSubmit} className="p-6 sm:p-8 pt-2 space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-xs text-blue-900">
                <div className="font-bold flex items-center gap-1.5 mb-1 text-blue-800">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>Confirmação de Segurança Institucional</span>
                </div>
                <p>
                  Enviamos um código de confirmação para o e-mail: <strong className="font-mono text-blue-950">{pendingEmail || email}</strong>.
                </p>
                {generatedCodeHint && (
                  <div className="mt-2.5 pt-2 border-t border-blue-200/70 flex items-center justify-between">
                    <span className="text-[11px] text-blue-700">Código de verificação:</span>
                    <span className="font-mono font-black text-sm text-blue-900 tracking-wider bg-white px-2 py-0.5 rounded border border-blue-300">
                      {generatedCodeHint}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 text-center">
                  Digite o Código de 6 Dígitos *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={verificationCode}
                  onChange={e => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full text-center tracking-[0.5em] font-mono text-xl font-black py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600 focus:outline-none focus:bg-white text-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={loading || verificationCode.length < 6}
                className="w-full bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-bold py-3 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Validando Código...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmar E-mail</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1 hover:underline"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reenviar código</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setViewStep('login');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-teal-700 hover:text-teal-900 font-bold hover:underline"
                >
                  Voltar ao Login
                </button>
              </div>
            </form>
          )}

          {/* 4. AGUARDANDO LIBERAÇÃO DO ADMINISTRADOR */}
          {viewStep === 'pending_approval' && (
            <div className="p-6 sm:p-8 pt-4 space-y-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900">
                  E-mail Confirmado com Sucesso!
                </h3>
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mt-1">
                  Aguardando Liberação do Administrador
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs text-slate-600 text-left space-y-2">
                <p>
                  O seu e-mail institucional (<strong>{pendingEmail || email}</strong>) foi validado no sistema.
                </p>
                <p>
                  Por regras de governança e conformidade fiduciária do RPPS, o acesso inicial precisa ser <strong>homologado e liberado pelo Usuário Master</strong> (<strong>prof.jan100@gmail.com</strong>) ou por um Administrador credenciado.
                </p>
                <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                  Assim que o Administrador liberar seu perfil no painel de gestão, você poderá entrar normalmente com seu e-mail e senha cadastrados.
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setViewStep('login');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="w-full bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold py-3 rounded-lg transition-colors shadow-sm"
              >
                Voltar à Tela de Login
              </button>
            </div>
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
