import React from 'react';
import { 
  PieChart, 
  Layers, 
  Sliders, 
  ShieldCheck, 
  Building2, 
  FileUp, 
  Users, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Landmark,
  FileText
} from 'lucide-react';
import { User } from '../types';
import { OFFICIAL_REGULATION_URL, OFFICIAL_REGULATION_NORM } from '../services/mockData';

interface RightSidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  currentUser: User | null;
  onOpenDairUpload: () => void;
  onOpenAssetRegister: () => void;
  onOpenUserManagement: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onOpenDairUpload,
  onOpenAssetRegister,
  onOpenUserManagement,
  isOpen,
  onToggle
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onToggle}
        />
      )}

      {/* Right Sidebar Container */}
      <aside 
        className={`fixed top-0 right-0 h-full w-72 bg-[#0b1626] border-l border-slate-800 text-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header / Module Indicator */}
        <div className="p-4 border-b border-slate-800/80 bg-[#070e19]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
              RPPS Online
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              v2.5 (2026)
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">MÓDULO ATIVO</p>
              <h2 className="text-sm font-bold text-white leading-tight">Gestão de Investimentos</h2>
            </div>
          </div>
        </div>

        {/* Institution Quick Info */}
        <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span className="font-semibold text-slate-200">PREVI-LACERDA</span>
            <span className="text-[10px] bg-blue-900/50 text-blue-300 px-1.5 py-0.5 rounded border border-blue-700/50">
              MT
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">CNPJ: 15.023.989/0001-26</p>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Competência 09/2026 Ativa</span>
          </div>
        </div>

        {/* Menu Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-sm custom-scrollbar">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Menu do Módulo
          </div>

          <button
            onClick={() => onSelectTab('dashboard')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all ${
              currentTab === 'dashboard'
                ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <PieChart className="w-4 h-4" />
              <span>Dashboard da Carteira</span>
            </div>
            {currentTab === 'dashboard' && <ChevronRight className="w-4 h-4 text-blue-200" />}
          </button>

          <button
            onClick={() => onSelectTab('active_portfolio')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all ${
              currentTab === 'active_portfolio'
                ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4 text-blue-400" />
              <span className="font-semibold text-white">Carteira Ativa</span>
            </div>
            <span className="text-[10px] bg-blue-900/60 text-blue-300 border border-blue-700/60 px-1.5 py-0.5 rounded font-mono">
              Todos Ativos
            </span>
          </button>

          <button
            onClick={() => onSelectTab('institute')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all ${
              currentTab === 'institute'
                ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Building2 className="w-4 h-4" />
              <span>Cadastro do Instituto</span>
            </div>
            <span className="text-[10px] bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded font-mono">
              RPPS
            </span>
          </button>

          <button
            onClick={() => onSelectTab('comparator')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all ${
              currentTab === 'comparator'
                ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4" />
              <span>Comparador de Fundos</span>
            </div>
            {currentTab === 'comparator' && <ChevronRight className="w-4 h-4 text-blue-200" />}
          </button>

          <button
            onClick={() => onSelectTab('simulator')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all ${
              currentTab === 'simulator'
                ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sliders className="w-4 h-4" />
              <span>Simulador Atuarial</span>
            </div>
            {currentTab === 'simulator' && <ChevronRight className="w-4 h-4 text-blue-200" />}
          </button>

          <button
            onClick={() => onSelectTab('audit')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all ${
              currentTab === 'audit'
                ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4" />
              <span>Trilha de Auditoria</span>
            </div>
            {currentTab === 'audit' && <ChevronRight className="w-4 h-4 text-blue-200" />}
          </button>

          {/* Quick Actions / Integration */}
          <div className="pt-4 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Ações Rápidas & CADPREV
          </div>

          <button
            onClick={onOpenDairUpload}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/50 transition-all font-medium"
          >
            <FileUp className="w-4 h-4 text-emerald-400" />
            <div className="flex-1">
              <p className="leading-tight">Importar DAIR (PDF)</p>
              <p className="text-[10px] text-emerald-300/70 font-normal">Leitura Inteligente CADPREV</p>
            </div>
          </button>

          <button
            onClick={onOpenAssetRegister}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all"
          >
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span>Cadastrar Novo Ativo</span>
          </button>

          {(currentUser?.role === 'Administrador' || currentUser?.role === 'MASTER_ADMIN' || currentUser?.email === 'prof.jan100@gmail.com') && (
            <button
              onClick={onOpenUserManagement}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-amber-300 hover:bg-amber-950/40 hover:text-amber-200 border border-amber-900/40 transition-all"
            >
              <Users className="w-4 h-4 text-amber-400" />
              <span>Gestão de Usuários (Master)</span>
            </button>
          )}

          {/* Legal Compliance Block */}
          <div className="pt-4 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Conformidade Legal RPPS
          </div>

          <a
            href={OFFICIAL_REGULATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 transition-all group"
          >
            <div className="flex items-center justify-between text-blue-400 mb-1">
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">Resolução CMN</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <p className="text-xs text-white font-medium">Nº 5.272/2025</p>
            <p className="text-[10px] text-slate-400 mt-1">
              Base normativa vigente dos investimentos do RPPS.
            </p>
          </a>
        </nav>

        {/* Footer / User Session */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <span className="truncate font-medium">{currentUser ? currentUser.email : 'Sessão Encerrada'}</span>
            <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded">
              {currentUser ? (currentUser.role === 'MASTER_ADMIN' || currentUser.role === 'Administrador' ? 'MASTER' : 'GESTOR') : 'DESCONECTADO'}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
