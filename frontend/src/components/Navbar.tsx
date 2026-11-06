import React from 'react';
import { Shield, BarChart3, Sliders, ArrowLeftRight, CheckCircle2, ExternalLink, Users, LogIn, KeyRound } from 'lucide-react';
import { UserRole, User } from '../types';
import { OFFICIAL_REGULATION_URL, OFFICIAL_REGULATION_NORM } from '../services/mockData';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: User;
  onOpenCvmModal: () => void;
  onOpenNewAssetModal: () => void;
  onOpenUserManagementModal: () => void;
  onOpenLoginModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onOpenCvmModal,
  onOpenNewAssetModal,
  onOpenUserManagementModal,
  onOpenLoginModal
}) => {
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'MASTER_ADMIN':
        return { label: 'Usuário Master (Acesso Total)', color: 'bg-teal-500 text-white border-teal-600 font-extrabold' };
      case 'DIRETORIA_EXECUTIVA':
        return { label: 'Diretoria Executiva', color: 'bg-emerald-500/10 text-emerald-700 border-emerald-300' };
      case 'COMITE_INVESTIMENTOS':
        return { label: 'Comitê de Investimentos', color: 'bg-blue-500/10 text-blue-700 border-blue-300' };
      case 'AUDITORIA_CONSELHO_FISCAL':
        return { label: 'Conselho Fiscal (Read-Only)', color: 'bg-amber-500/10 text-amber-700 border-amber-300' };
    }
  };

  const currentBadge = getRoleBadge(currentUser.role);
  const isMaster = currentUser.role === 'MASTER_ADMIN' || currentUser.email === 'prof.jan100@gmail.com';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      {/* Top Banner Institucional com Link Oficial da Resolução CMN 5.272/2025 */}
      <div className="bg-slate-900 text-white text-xs py-1.5 px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="font-bold text-teal-400">PREVI-LACERDA (RPPS)</span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-300">Base Legal Vigente:</span>
          <a
            href={OFFICIAL_REGULATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 bg-teal-800/80 hover:bg-teal-700 text-teal-200 hover:text-white px-2 py-0.5 rounded text-[11px] font-bold border border-teal-600 transition-colors"
            title="Acessar documento oficial da Resolução CMN nº 5.272/2025 no Ministério da Previdência"
          >
            <span>{OFFICIAL_REGULATION_NORM}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Status Robô CVM & Sessão do Usuário */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCvmModal}
            className="flex items-center gap-1.5 text-[11px] bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded text-teal-300 transition-colors"
            title="Clique para ver o status da integração CVM"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Robô CVM: <strong>Ativo (D-1)</strong></span>
          </button>

          <button
            onClick={onOpenLoginModal}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] px-2.5 py-1 rounded transition-colors"
            title="Trocar usuário autenticado"
          >
            <LogIn className="w-3 h-3 text-teal-400" />
            <span className="truncate max-w-[140px] font-medium">{currentUser.email}</span>
          </button>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo e Nome */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <div className="w-10 h-10 rounded-lg bg-teal-700 flex items-center justify-center text-white shadow-md shadow-teal-700/20">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>PREVI</span><span className="text-teal-700">LACERDA</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-200">
                  CMN 5.272/2025
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">Gestão Fiduciária RPPS - Pontes e Lacerda MT</div>
            </div>
          </div>

          {/* Navegação Principal */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-teal-50 text-teal-800 border border-teal-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Visão Geral</span>
            </button>

            <button
              onClick={() => setCurrentTab('comparator')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentTab === 'comparator'
                  ? 'bg-teal-50 text-teal-800 border border-teal-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Comparador de Ativos</span>
              <span className="text-[10px] bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded font-bold">Investidor10</span>
            </button>

            <button
              onClick={() => setCurrentTab('simulator')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentTab === 'simulator'
                  ? 'bg-teal-50 text-teal-800 border border-teal-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Simulador Atuarial</span>
            </button>

            <button
              onClick={() => setCurrentTab('audit')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentTab === 'audit'
                  ? 'bg-teal-50 text-teal-800 border border-teal-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Trilha de Auditoria</span>
            </button>
          </nav>

          {/* Botões de Ação e Painel Master */}
          <div className="flex items-center gap-2.5">
            {/* Botão Especial Master: Gestão de Usuários & Perfis */}
            {isMaster && (
              <button
                onClick={onOpenUserManagementModal}
                className="bg-slate-900 hover:bg-slate-800 text-teal-300 text-xs font-bold px-3 py-2 rounded-lg shadow-sm border border-slate-700 flex items-center gap-1.5 transition-colors"
                title="Atribuir e gerenciar perfis RBAC de usuários"
              >
                <Users className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Gestão de Perfis</span>
                <span className="lg:hidden">Perfis</span>
              </button>
            )}

            <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${currentBadge.color}`}>
              {currentBadge.label}
            </span>

            {currentUser.role !== 'AUDITORIA_CONSELHO_FISCAL' && (
              <button
                onClick={onOpenNewAssetModal}
                className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
              >
                <span>+ Cadastrar Ativo</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
