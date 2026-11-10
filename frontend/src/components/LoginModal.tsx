import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  ShieldAlert, 
  KeyRound, 
  Eye, 
  EyeOff, 
  User as UserIcon, 
  UserCheck, 
  ShieldCheck,
  Clock,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';
import { api } from '../services/api';
import { User, UserRole } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User, mustChangePassword: boolean) => void;
  initialEmail?: string;
  isDismissible?: boolean;
}

type ViewStep = 'login' | 'register' | 'verify_email' | 'pending_approval';

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialEmail = '',
  isDismissible = true
}) => {
  const [viewStep, setViewStep] = useState<ViewStep>('login');
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

  // Confirmação de E-mail
  const [pendingEmail, setPendingEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCodeHint, setGeneratedCodeHint] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialEmail) {
        setEmail(initialEmail);
      }
      setPassword('');
      setErrorMessage(null);
      setErrorCode(null);
      setSuccessMessage(null);
      setViewStep('login');
    }
  }, [isOpen, initialEmail]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setErrorCode(null);
    setLoading(true);

    try {
      const res = await api.login(email, password);
      onLoginSuccess(res.user, res.mustChangePassword);
      setPassword('');
      onClose();
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
      setVerificationCode(res.verificationCode);
      setSuccessMessage('Cadastro realizado! Enviamos um código de confirmação para seu e-mail institucional.');
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
      setErrorMessage(err.message || 'Código incorreto.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      const newCode = await api.resendVerificationCode(pendingEmail);
      setGeneratedCodeHint(newCode);
      setVerificationCode(newCode);
      setSuccessMessage(`Novo código: ${newCode}`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage('Falha ao reenviar código.');
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
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-8 relative">
        {/* Cabeçalho com Logo ArgosPrevi */}
        <div className="bg-slate-50 border-b border-slate-200 p-6 relative">
          <div className="flex items-center gap-3.5 my-1 p-2 bg-white rounded-xl border border-slate-100 shadow-2xs">
            <img 
              src="/argosprevi-logo.png" 
              alt="ArgosPrevi Logo" 
              className="w-14 h-14 object-contain drop-shadow-sm rounded-xl shrink-0" 
            />
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-1">
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

          <p className="text-xs text-slate-500 mt-1">
            {viewStep === 'register' && 'Informe seus dados para solicitar credenciamento fiduciário.'}
            {viewStep === 'verify_email' && `Digite o código enviado para ${pendingEmail}.`}
            {viewStep === 'pending_approval' && 'E-mail validado. Aguardando liberação do Administrador.'}
            {viewStep === 'login' && 'Informe suas credenciais institucionais para acesso à gestão previdenciária.'}
          </p>

          {isDismissible && (
            <button 
              type="button"
              onClick={onClose} 
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mensagens de Feedback */}
        <div className="px-6 pt-3 space-y-2">
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-xl font-medium flex items-start gap-2">
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
                    className="mt-1 text-[11px] font-bold text-blue-700 underline"
                  >
                    Confirmar meu e-mail agora
                  </button>
                )}
              </div>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl font-medium flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        {/* 1. FORMULÁRIO DE LOGIN */}
        {viewStep === 'login' && (
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                E-mail Institucional *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu.email@previlacerda.mt.gov.br"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none focus:bg-white text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Senha de Acesso *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none focus:bg-white text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-teal-700"
                  title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4 text-teal-700" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-bold py-2.5 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
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

            <div className="pt-3 border-t border-slate-100 text-center">
              <span className="text-xs text-slate-500">Novo por aqui? </span>
              <button
                type="button"
                onClick={() => {
                  setViewStep('register');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="text-xs font-bold text-teal-700 hover:text-teal-900 hover:underline"
              >
                Cadastre-se
              </button>
            </div>
          </form>
        )}

        {/* 2. FORMULÁRIO DE CADASTRO */}
        {viewStep === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="p-6 space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Nome Completo *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: Jansen de Pinho e Silva"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none focus:bg-white text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">CPF *</label>
                <input
                  type="text"
                  required
                  value={cpf}
                  onChange={e => setCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Perfil RPPS *</label>
                <select
                  value={regRole}
                  onChange={e => setRegRole(e.target.value as UserRole)}
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                >
                  <option value="Membro do Comitê">Comitê Invest.</option>
                  <option value="Diretoria Executiva">Diretoria</option>
                  <option value="Conselho Fiscal">Cons. Fiscal</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">E-mail Institucional *</label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                placeholder="seu.email@previlacerda.mt.gov.br"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none focus:bg-white text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Senha (min. 6) *</label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="Senha"
                    className="w-full px-2.5 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-teal-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-2 top-2 text-slate-400"
                  >
                    {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Confirmar *</label>
                <div className="relative">
                  <input
                    type={showRegConfirmPassword ? 'text' : 'password'}
                    required
                    value={regConfirmPassword}
                    onChange={e => setRegConfirmPassword(e.target.value)}
                    placeholder="Repita"
                    className="w-full px-2.5 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-teal-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                    className="absolute right-2 top-2 text-slate-400"
                  >
                    {showRegConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-bold py-2 rounded-lg transition-colors shadow-sm mt-2"
            >
              {loading ? 'Cadastrando...' : 'Avançar para Confirmação de E-mail'}
            </button>

            <div className="pt-2 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => setViewStep('login')}
                className="text-xs font-bold text-teal-700 hover:underline"
              >
                Voltar ao Login
              </button>
            </div>
          </form>
        )}

        {/* 3. CONFIRMAÇÃO DE E-MAIL */}
        {viewStep === 'verify_email' && (
          <form onSubmit={handleConfirmEmailSubmit} className="p-6 space-y-4">
            <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-xl text-xs text-blue-900">
              <p className="font-bold mb-1">Código de Confirmação Institucional</p>
              <p>Enviado para: <strong className="font-mono">{pendingEmail}</strong></p>
              {generatedCodeHint && (
                <div className="mt-2 pt-2 border-t border-blue-200 flex items-center justify-between">
                  <span className="text-[11px]">Código gerado:</span>
                  <span className="font-mono font-black text-xs bg-white px-2 py-0.5 rounded border border-blue-300">
                    {generatedCodeHint}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 text-center">
                Código de 6 Dígitos *
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={verificationCode}
                onChange={e => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full text-center tracking-[0.4em] font-mono text-lg font-black py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600 focus:outline-none focus:bg-white text-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading || verificationCode.length < 6}
              className="w-full bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-bold py-2.5 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirmar E-mail</span>
            </button>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={handleResendCode}
                className="text-slate-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reenviar código</span>
              </button>
              <button
                type="button"
                onClick={() => setViewStep('login')}
                className="text-teal-700 hover:underline font-bold"
              >
                Voltar ao Login
              </button>
            </div>
          </form>
        )}

        {/* 4. AGUARDANDO LIBERAÇÃO DO ADMINISTRADOR */}
        {viewStep === 'pending_approval' && (
          <div className="p-6 space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
              <Clock className="w-7 h-7 animate-pulse" />
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900">
                E-mail Confirmado!
              </h3>
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mt-0.5">
                Aguardando Homologação do Administrador
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-600 text-left space-y-1.5">
              <p>O e-mail <strong>{pendingEmail}</strong> foi validado com sucesso.</p>
              <p>Para sua segurança, o acesso fiduciário agora aguarda a liberação pelo Usuário Master (<strong>prof.jan100@gmail.com</strong>) ou Administrador credenciado.</p>
            </div>

            <button
              type="button"
              onClick={() => setViewStep('login')}
              className="w-full bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold py-2.5 rounded-lg transition-colors shadow-sm"
            >
              Voltar ao Login
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
