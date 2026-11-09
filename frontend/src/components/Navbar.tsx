import React from 'react';
import { 
  Shield, 
  ExternalLink, 
  Users, 
  LogIn, 
  LogOut,
  Menu, 
  UploadCloud, 
  Building2, 
  Layers, 
  Landmark, 
  PieChart,
  Briefcase
} from 'lucide-react';
import { UserRole, User } from '../types';
import { OFFICIAL_REGULATION_URL, OFFICIAL_REGULATION_NORM } from '../services/mockData';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: User | null;
  onOpenCvmModal: () => void;
  onOpenNewAssetModal: () => void;
  onOpenUserManagementModal: () => void;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  onOpenDairUpload: () => void;
  onToggleRightSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onOpenCvmModal,
  onOpenNewAssetModal,
  onOpenUserManagementModal,
  onOpenLoginModal,
  onLogout,
  onOpenDairUpload,
  onToggleRightSidebar
}) => {
  const getRoleBadge = (role?: UserRole) => {
    if (!role) return null;
    switch (role) {
      case 'MASTER_ADMIN':
        return { label: 'Master Admin', color: 'bg-emerald-500/10 text-emerald-700 border-emerald-300 font-bold' };
      case 'DIRETORIA_EXECUTIVA':
        return { label: 'Diretoria Executiva', color: 'bg-blue-500/10 text-blue-700 border-blue-300' };
      case 'COMITE_INVESTIMENTOS':
        return { label: 'Comitê Invest.', color: 'bg-indigo-500/10 text-indigo-700 border-indigo-300' };
      case 'AUDITORIA_CONSELHO_FISCAL':
        return { label: 'Conselho Fiscal (Read-Only)', color: 'bg-amber-500/10 text-amber-700 border-amber-300' };
      default:
        return { label: role, color: 'bg-slate-100 text-slate-700 border-slate-300' };
    }
  };

  const currentBadge = getRoleBadge(currentUser?.role);
  const isMaster = currentUser?.role === 'MASTER_ADMIN' || currentUser?.role === 'Administrador' || currentUser?.email === 'prof.jan100@gmail.com';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      {/* Top Banner Institucional - Base Legal CMN 5.272/2025 & Robô CVM */}
      <div className="bg-slate-100 text-slate-700 text-xs py-1.5 px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="font-bold text-emerald-700">PREVI-LACERDA (RPPS)</span>
          <span className="text-slate-400 hidden sm:inline">|</span>
          <span className="text-slate-600 text-[11px]">Base Legal Vigente:</span>
          <a
            href={OFFICIAL_REGULATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100 px-2 py-0.5 rounded text-[11px] font-semibold border border-blue-200 transition-colors"
            title="Acessar documento oficial da Resolução CMN nº 5.272/2025"
          >
            <span>{OFFICIAL_REGULATION_NORM}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Status Robô CVM & Sessão do Usuário */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCvmModal}
            className="flex items-center gap-1.5 text-[11px] bg-white hover:bg-slate-50 border border-slate-200 px-2.5 py-1 rounded text-slate-700 shadow-xs transition-colors"
            title="Ver telemetria do robô diário da CVM"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>CVM Automática: <strong className="text-emerald-700">Ativa (D-1)</strong></span>
          </button>

          {currentUser ? (
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 text-[11px] pl-2.5 pr-1 py-1 rounded shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="truncate max-w-[140px] font-semibold text-slate-800" title={currentUser.email}>
                {currentUser.name || currentUser.email}
              </span>
              <button
                type="button"
                onClick={onLogout}
                className="ml-1 text-slate-400 hover:text-rose-600 p-1 hover:bg-rose-50 rounded transition-colors"
                title="Encerrar sessão (Sair)"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenLoginModal}
              className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-xs transition-colors"
            >
              <LogIn className="w-3 h-3" />
              <span>Acessar</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile Menu Trigger & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleRightSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
              title="Abrir Menu"
            >
              <Menu className="w-5 h-5 text-slate-800" />
            </button>

            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
              <div className="w-9 h-9 rounded-xl bg-[#0066ff] flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                  <span>PREVI</span><span className="text-blue-600">LACERDA</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    RPPS
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium hidden sm:block">Previdência de Pontes e Lacerda</div>
              </div>
            </div>
          </div>

          {/* Module Selector Pill (Visual Hierárquico do Módulo) */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200">
            <Landmark className="w-4 h-4 text-blue-600" />
            <div className="text-left">
              <p className="text-[9px] uppercase font-bold text-slate-400 leading-none">MÓDULO ATUAL</p>
              <p className="text-xs font-bold text-slate-800 leading-tight">Gestão de Investimentos</p>
            </div>
          </div>

          {/* Botões de Ação na Direita */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Importar DAIR */}
            <button
              onClick={onOpenDairUpload}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-sm transition-all"
              title="Importar Demonstrativo DAIR em PDF"
            >
              <UploadCloud className="w-4 h-4" />
              <span className="hidden sm:inline">Importar DAIR</span>
            </button>

            {/* Carteira Ativa */}
            <button
              onClick={() => setCurrentTab('active_portfolio')}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border transition-all ${
                currentTab === 'active_portfolio'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-bold'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="Exibir todos os produtos da Carteira Ativa"
            >
              <Briefcase className={`w-4 h-4 ${currentTab === 'active_portfolio' ? 'text-white' : 'text-blue-600'}`} />
              <span className="hidden sm:inline">Carteira Ativa</span>
            </button>

            {/* Cadastro do Instituto */}
            <button
              onClick={() => setCurrentTab('institute')}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border transition-all ${
                currentTab === 'institute'
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="Visualizar e editar cadastro do Instituto PREVI-LACERDA"
            >
              <Building2 className="w-4 h-4 text-blue-600" />
              <span className="hidden md:inline">Instituto</span>
            </button>

            {/* Cadastrar Ativo */}
            {currentUser && currentUser.role !== 'AUDITORIA_CONSELHO_FISCAL' && (
              <button
                onClick={onOpenNewAssetModal}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
              >
                <span>+ Ativo</span>
              </button>
            )}

            {/* Trigger do Menu Lateral Mobile */}
            <button
              onClick={onToggleRightSidebar}
              className="lg:hidden flex items-center gap-1.5 bg-[#0b1626] hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-md transition-all border border-slate-700"
              title="Abrir Menu Lateral"
            >
              <Menu className="w-4 h-4 text-emerald-400" />
              <span>Menu</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
