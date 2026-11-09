import React from 'react';
import { 
  Building2, 
  Landmark, 
  LogOut, 
  LogIn, 
  Menu
} from 'lucide-react';
import { UserRole, User } from '../types';

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
  const isMaster = currentUser?.role === 'MASTER_ADMIN' || currentUser?.role === 'Administrador' || currentUser?.email === 'prof.jan100@gmail.com';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Lado Esquerdo: Mobile Trigger e Indicador do Módulo Ativo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleRightSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
              title="Abrir Menu"
            >
              <Menu className="w-5 h-5 text-slate-800" />
            </button>

            {/* Módulo Atual */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100/80 border border-slate-200">
              <Landmark className="w-4 h-4 text-blue-700 shrink-0" />
              <div className="text-left">
                <p className="text-[9px] uppercase font-bold text-slate-400 leading-none">MÓDULO ATUAL</p>
                <p className="text-xs font-bold text-slate-800 leading-tight">Gestão de Investimentos</p>
              </div>
            </div>
          </div>

          {/* Lado Direito: CVM, Instituto, + Ativo e Usuário com opção Sair */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Status Telemetria CVM */}
            <button
              onClick={onOpenCvmModal}
              className="hidden sm:flex items-center gap-1.5 text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg text-slate-700 shadow-2xs transition-colors"
              title="Ver telemetria do robô diário da CVM"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px]">CVM: <strong className="text-emerald-700">Ativa (D-1)</strong></span>
            </button>

            {/* Cadastro do Instituto */}
            <button
              onClick={() => setCurrentTab('institute')}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                currentTab === 'institute'
                  ? 'bg-blue-50 text-blue-700 border-blue-300 font-bold'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="Visualizar cadastro do Instituto PREVI-LACERDA"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden md:inline">Instituto</span>
            </button>

            {/* Cadastrar Ativo */}
            {currentUser && currentUser.role !== 'AUDITORIA_CONSELHO_FISCAL' && (
              <button
                onClick={onOpenNewAssetModal}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                title="Cadastrar novo produto fiduciário"
              >
                <span>+ Ativo</span>
              </button>
            )}

            {/* USUÁRIO ACOPLADO À OPÇÃO SAIR NA PARTE SUPERIOR DIREITA */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl pl-2.5 pr-1.5 py-1 shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-900 border border-teal-200 font-black text-xs flex items-center justify-center shrink-0">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="min-w-0 hidden md:block">
                  <p className="text-xs font-bold text-slate-900 truncate max-w-[150px]">
                    {currentUser.name || currentUser.email}
                  </p>
                  <span className="text-[9px] font-black uppercase text-blue-700 bg-blue-50 px-1 py-0.2 rounded border border-blue-200">
                    {isMaster ? 'Master' : currentUser.role}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  className="ml-1 text-slate-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                  title="Encerrar sessão e sair do sistema"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span className="hidden sm:inline text-rose-600 font-bold">Sair</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenLoginModal}
                className="flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Entrar</span>
              </button>
            )}

            {/* Menu Lateral Mobile Trigger */}
            <button
              onClick={onToggleRightSidebar}
              className="lg:hidden flex items-center gap-1.5 bg-[#0b1626] hover:bg-slate-800 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-md transition-all border border-slate-700"
              title="Abrir Menu Lateral"
            >
              <Menu className="w-3.5 h-3.5 text-emerald-400" />
              <span>Menu</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
