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
  Shield, 
  FileCheck, 
  Eye, 
  Award, 
  MessageSquare,
  Landmark,
  Scale,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { User } from '../types';
import { OFFICIAL_REGULATION_URL, OFFICIAL_REGULATION_NORM } from '../services/mockData';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  currentUser: User | null;
  onOpenDairUpload: () => void;
  onOpenAssetRegister: () => void;
  onOpenUserManagement: () => void;
  onOpenLoginModal: () => void;
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
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={onToggle}
        />
      )}

      {/* Main Sidebar Container (Matching Reference UI) */}
      <aside 
        className={`fixed top-0 left-0 h-full w-72 bg-[#f8fafc] dark:bg-[#0b1626] border-r border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 z-50 flex flex-col shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header: Brasão / Bandeira e Nome do Instituto */}
        <div className="p-4 pb-3 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Bandeira Oficial de Pontes e Lacerda - MT */}
            <div className="w-12 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 flex items-center justify-center shadow-sm shrink-0">
              <svg viewBox="0 0 40 28" className="w-10 h-7 rounded shadow-xs overflow-hidden">
                <rect width="40" height="14" fill="#009b3a" />
                <rect y="14" width="40" height="14" fill="#ffdf00" />
                <polygon points="0,0 20,14 0,28" fill="#002776" />
                <polygon points="7,14 5.5,9.5 9.5,12 3.5,12 7.5,9.5" fill="#ffffff" />
              </svg>
            </div>

            <div>
              <h1 className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                Prefeitura de Pontes e Lacerda
              </h1>
              <p className="text-[11px] font-bold text-blue-700 dark:text-blue-400 leading-tight">
                PREVI-LACERDA (RPPS)
              </p>
              <span className="text-[10px] text-slate-400 font-medium">Adm 2025-2028</span>
            </div>
          </div>

          <button
            onClick={onToggle}
            className="lg:hidden text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>

        {/* User Card (Padrão do Sistema do Cliente) */}
        <div className="p-3">
          <div className="bg-slate-200/70 dark:bg-slate-800/80 border border-slate-300/60 dark:border-slate-700 rounded-xl p-2.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                {userInitial}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {userName}
                </p>
                <button
                  onClick={onOpenLoginModal}
                  className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sair</span>
                </button>
              </div>
            </div>

            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shrink-0">
              {currentUser?.role === 'Administrador' ? 'Master' : 'Gestor'}
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
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-800 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building2 className={`w-4 h-4 ${currentTab === 'institute' ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                <span>Instituto</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 ${currentTab === 'institute' ? 'text-white' : 'text-slate-400'}`} />
            </button>
          </div>

          {/* 2º BOTÃO OBRIGATÓRIO: MÓDULO GESTÃO DE INVESTIMENTOS */}
          <div className="pt-1">
            <button
              onClick={() => setIsInvestmentsExpanded(!isInvestmentsExpanded)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-black text-slate-900 dark:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/80 transition-all text-left"
            >
              <div className="flex items-center gap-2.5">
                <Landmark className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Gestão de Investimentos</span>
              </div>
              {isInvestmentsExpanded ? (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Submenus da Gestão de Investimentos (Estilo Estúdio de Documentos da Imagem) */}
            {isInvestmentsExpanded && (
              <div className="ml-4 pl-2 border-l-2 border-slate-200 dark:border-slate-800 space-y-1 mt-1 animate-fadeIn">
                <button
                  onClick={() => onSelectTab('dashboard')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all ${
                    currentTab === 'dashboard'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-900'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <PieChart className="w-3.5 h-3.5" />
                  <span>Dashboard da Carteira</span>
                </button>

                <button
                  onClick={() => onSelectTab('active_portfolio')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
                    currentTab === 'active_portfolio'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-900'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                    <span>Carteira Ativa</span>
                  </div>
                  <span className="text-[9px] bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-1 py-0.2 rounded font-bold">
                    Ativos
                  </span>
                </button>

                <button
                  onClick={() => onSelectTab('comparator')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all ${
                    currentTab === 'comparator'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-900'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Comparador de Fundos</span>
                </button>

                <button
                  onClick={() => onSelectTab('simulator')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all ${
                    currentTab === 'simulator'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-900'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Simulador Atuarial</span>
                </button>

                <button
                  onClick={() => onSelectTab('audit')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all ${
                    currentTab === 'audit'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-900'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Trilha de Auditoria</span>
                </button>

                <button
                  onClick={onOpenDairUpload}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-emerald-700 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 font-bold text-left transition-all"
                >
                  <FileUp className="w-3.5 h-3.5" />
                  <span>Importar DAIR (PDF)</span>
                </button>

                <button
                  onClick={onOpenAssetRegister}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 font-semibold text-left transition-all"
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

            <div className="space-y-0.5 text-slate-500 dark:text-slate-400">
              <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/40 cursor-not-allowed opacity-70">
                <div className="flex items-center gap-2.5">
                  <Scale className="w-4 h-4 text-slate-400" />
                  <span>Auditoria</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </div>

              <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/40 cursor-not-allowed opacity-70">
                <div className="flex items-center gap-2.5">
                  <FileCheck className="w-4 h-4 text-slate-400" />
                  <span>Controladoria</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </div>

              <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/40 cursor-not-allowed opacity-70">
                <div className="flex items-center gap-2.5">
                  <Eye className="w-4 h-4 text-slate-400" />
                  <span>Transparência</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </div>

              <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/40 cursor-not-allowed opacity-70">
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-slate-400" />
                  <span>Integridade</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </div>

              <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/40 cursor-not-allowed opacity-70">
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
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-900/60 font-bold transition-all"
              >
                <Users className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Gestão de Usuários (Master)</span>
              </button>
            </div>
          )}
        </nav>

        {/* Rodapé da Barra Lateral: Base Legal */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-[11px]">
          <a
            href={OFFICIAL_REGULATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            <span>Res. CMN 5.272/2025</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <p className="text-[10px] text-slate-400 mt-0.5">Regulamentação Previdenciária</p>
        </div>
      </aside>
    </>
  );
};
