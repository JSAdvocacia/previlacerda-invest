import React, { useState } from 'react';
import { 
  Building2, 
  PieChart, 
  Briefcase, 
  Layers, 
  Sliders, 
  ShieldCheck, 
  FileUp, 
  PlusCircle, 
  Users, 
  ExternalLink, 
  ChevronDown, 
  ChevronRight, 
  LogOut, 
  FileCheck, 
  Eye, 
  Award, 
  MessageSquare,
  Landmark,
  Scale,
  PanelLeftClose
} from 'lucide-react';
import { User } from '../types';
import { OFFICIAL_REGULATION_URL } from '../services/mockData';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  currentUser: User | null;
  onOpenDairUpload: () => void;
  onOpenAssetRegister: () => void;
  onOpenUserManagement: () => void;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onOpenDairUpload,
  onOpenAssetRegister,
  onOpenUserManagement,
  onOpenLoginModal,
  onLogout,
  isOpen,
  onToggle
}) => {
  const [isInvestmentsExpanded, setIsInvestmentsExpanded] = useState(true);

  const isMaster = 
    currentUser?.role === 'Administrador' || 
    currentUser?.role === 'MASTER_ADMIN' || 
    currentUser?.email === 'prof.jan100@gmail.com';

  const userName = currentUser?.name?.includes('Jansen') 
    ? 'Jansen de Pinho e Silva' 
    : (currentUser?.name || 'Jansen de Pinho e Silva');

  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <>
      {/* Backdrop Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs"
          onClick={onToggle}
        />
      )}

      {/* Main Sidebar Container (Layout Clean e Leve) */}
      <aside 
        className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-slate-200 text-slate-700 z-50 flex flex-col shadow-sm transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header: Brasão / Bandeira e Nome do Instituto */}
        <div className="p-4 pb-3 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <img 
                src="/argosprevi-logo.png" 
                alt="ArgosPrevi" 
                className="w-10 h-10 object-contain drop-shadow-sm rounded-xl shrink-0" 
              />
              <div>
                <h1 className="text-sm font-black text-slate-900 leading-tight flex items-center gap-1">
                  <span>Argos</span><span className="text-teal-700">Previ</span>
                </h1>
                <p className="text-[10px] font-semibold text-slate-500 leading-tight">
                  Sistema de Gestão Previdenciária
                </p>
              </div>
            </div>

            <button
              onClick={onToggle}
              className="lg:hidden text-slate-400 hover:text-slate-600 p-1"
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100">
            {/* Bandeira Oficial de Pontes e Lacerda - MT */}
            <div className="w-8 h-6 rounded bg-white border border-slate-200 p-0.5 flex items-center justify-center shadow-xs shrink-0">
              <svg viewBox="0 0 40 28" className="w-full h-full rounded-xs shadow-xs overflow-hidden">
                <rect width="40" height="14" fill="#009b3a" />
                <rect y="14" width="40" height="14" fill="#ffdf00" />
                <polygon points="0,0 20,14 0,28" fill="#002776" />
                <polygon points="7,14 5.5,9.5 9.5,12 3.5,12 7.5,9.5" fill="#ffffff" />
              </svg>
            </div>

            <div>
              <span className="text-[11px] font-bold text-blue-700 leading-tight block">
                PREVI-LACERDA (RPPS)
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Pontes e Lacerda - MT</span>
            </div>
          </div>
        </div>

        {/* User Card (Padrão da Imagem do Cliente) */}
        <div className="p-3 bg-slate-50/50">
          <div className="bg-slate-100 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-800 font-black flex items-center justify-center text-xs shrink-0 border border-slate-300">
                {currentUser ? (currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U') : '?'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {currentUser ? (currentUser.name || currentUser.email) : 'Sessão Encerrada'}
                </p>
                {currentUser ? (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 transition-colors"
                    title="Encerrar sessão e sair totalmente"
                  >
                    <LogOut className="w-3 h-3 text-rose-500" />
                    <span>Sair</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onOpenLoginModal}
                    className="text-[11px] text-teal-700 hover:text-teal-800 font-bold flex items-center gap-1 transition-colors"
                  >
                    <span>Fazer Login</span>
                  </button>
                )}
              </div>
            </div>

            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 shrink-0">
              {currentUser ? (currentUser.role === 'Administrador' || currentUser.role === 'MASTER_ADMIN' ? 'Master' : 'Gestor') : 'Bloqueado'}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 text-xs custom-scrollbar">
          {/* 1º BOTÃO OBRIGATÓRIO: INSTITUTO */}
          <div>
            <button
              onClick={() => onSelectTab('institute')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all text-left ${
                currentTab === 'institute'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building2 className={`w-4 h-4 ${currentTab === 'institute' ? 'text-white' : 'text-blue-600'}`} />
                <span>Instituto</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 ${currentTab === 'institute' ? 'text-white' : 'text-slate-400'}`} />
            </button>
          </div>

          {/* 2º BOTÃO OBRIGATÓRIO: MÓDULO GESTÃO DE INVESTIMENTOS */}
          <div className="pt-1">
            <button
              onClick={() => setIsInvestmentsExpanded(!isInvestmentsExpanded)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-black text-slate-900 hover:bg-slate-100 transition-all text-left"
            >
              <div className="flex items-center gap-2.5">
                <Landmark className="w-4 h-4 text-emerald-600" />
                <span>Gestão de Investimentos</span>
              </div>
              {isInvestmentsExpanded ? (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Submenus da Gestão de Investimentos */}
            {isInvestmentsExpanded && (
              <div className="ml-4 pl-2 border-l-2 border-slate-200 space-y-1 mt-1 animate-fadeIn">
                <button
                  onClick={() => onSelectTab('dashboard')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all ${
                    currentTab === 'dashboard'
                      ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <PieChart className="w-3.5 h-3.5" />
                  <span>Dashboard da Carteira</span>
                </button>

                <button
                  onClick={() => onSelectTab('active_portfolio')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
                    currentTab === 'active_portfolio'
                      ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                    <span>Carteira Ativa</span>
                  </div>
                  <span className="text-[9px] bg-blue-100 text-blue-800 px-1 py-0.2 rounded font-bold">
                    Ativos
                  </span>
                </button>

                <button
                  onClick={() => onSelectTab('comparator')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all ${
                    currentTab === 'comparator'
                      ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Comparador de Fundos</span>
                </button>

                <button
                  onClick={() => onSelectTab('simulator')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all ${
                    currentTab === 'simulator'
                      ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Simulador Atuarial</span>
                </button>

                <button
                  onClick={() => onSelectTab('audit')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all ${
                    currentTab === 'audit'
                      ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Trilha de Auditoria</span>
                </button>

                <button
                  onClick={onOpenDairUpload}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-emerald-800 bg-emerald-50 hover:bg-emerald-100 font-bold text-left transition-all border border-emerald-200"
                >
                  <FileUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Importar DAIR (PDF)</span>
                </button>

                <button
                  onClick={onOpenAssetRegister}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-blue-700 hover:bg-blue-50 font-semibold text-left transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Cadastrar Novo Ativo</span>
                </button>
              </div>
            )}
          </div>

          {/* OUTROS MÓDULOS FUTUROS (Conforme Arquitetura Municipal do Modelo) */}
          <div className="pt-3">
            <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Outros Módulos
            </p>

            <div className="space-y-0.5 text-slate-500">
              <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 cursor-not-allowed opacity-75">
                <div className="flex items-center gap-2.5">
                  <Scale className="w-4 h-4 text-slate-400" />
                  <span>Auditoria</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </div>

              <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 cursor-not-allowed opacity-75">
                <div className="flex items-center gap-2.5">
                  <FileCheck className="w-4 h-4 text-slate-400" />
                  <span>Controladoria</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </div>

              <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 cursor-not-allowed opacity-75">
                <div className="flex items-center gap-2.5">
                  <Eye className="w-4 h-4 text-slate-400" />
                  <span>Transparência</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </div>

              <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 cursor-not-allowed opacity-75">
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-slate-400" />
                  <span>Integridade</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </div>

              <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 cursor-not-allowed opacity-75">
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  <span>Ouvidoria</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Painel Master */}
          {isMaster && (
            <div className="pt-2">
              <button
                onClick={onOpenUserManagement}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 font-bold transition-all"
              >
                <Users className="w-4 h-4 text-amber-700" />
                <span>Gestão de Usuários (Master)</span>
              </button>
            </div>
          )}
        </nav>

        {/* Rodapé da Barra Lateral: Base Legal & Slogan ArgosPrevi */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] space-y-1">
          <div className="text-[10px] font-bold text-teal-800 text-center">
            ArgosPrevi - olhar atento, gestão transparente
          </div>
          <div className="pt-1 border-t border-slate-200/80 flex items-center justify-between">
            <a
              href={OFFICIAL_REGULATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-700 hover:underline font-bold"
            >
              <span>Res. CMN 5.272/2025</span>
              <ExternalLink className="w-3 h-3 text-blue-600" />
            </a>
            <span className="text-[10px] text-slate-400">RPPS</span>
          </div>
        </div>
      </aside>
    </>
  );
};
