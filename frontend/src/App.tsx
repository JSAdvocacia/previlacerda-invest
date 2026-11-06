import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { ActivePortfolioView } from './components/ActivePortfolioView';
import { InstituteProfileView } from './components/InstituteProfileView';
import { AssetComparator } from './components/AssetComparator';
import { InvestmentSimulator } from './components/InvestmentSimulator';
import { AuditTrailView } from './components/AuditTrailView';
import { AssetRegistrationModal } from './components/AssetRegistrationModal';
import { OnePageReportModal } from './components/OnePageReportModal';
import { CvmStatusModal } from './components/CvmStatusModal';
import { LoginModal } from './components/LoginModal';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { UserManagementModal } from './components/UserManagementModal';
import { DairUploadModal } from './components/DairUploadModal';
import { User, Asset, AssetMetrics, PortfolioOverview, InstituteProfile, DairExtractedData } from './types';
import { api, getCurrentUser, setCurrentUser } from './services/api';
import { PREVI_LACERDA_OFFICIAL_PROFILE } from './services/dairParserService';
import { OFFICIAL_REGULATION_URL, OFFICIAL_REGULATION_NORM } from './services/mockData';
import { 
  ChevronRight, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle,
  FileCheck2,
  Calendar,
  CheckCircle2,
  Clock
} from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [currentUserState, setCurrentUserState] = useState<User>(getCurrentUser());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [institute, setInstitute] = useState<InstituteProfile>(PREVI_LACERDA_OFFICIAL_PROFILE);
  const [overview, setOverview] = useState<PortfolioOverview | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [comparatorSelectedIds, setComparatorSelectedIds] = useState<string[]>([]);

  // Modals state
  const [isNewAssetModalOpen, setIsNewAssetModalOpen] = useState(false);
  const [isDairUploadOpen, setIsDairUploadOpen] = useState(false);
  const [isCvmModalOpen, setIsCvmModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportAsset, setReportAsset] = useState<Asset | null>(null);
  const [reportMetrics, setReportMetrics] = useState<AssetMetrics | null>(null);

  // Auth Modals state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isUserManagementModalOpen, setIsUserManagementModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ovData, assetsData, instData] = await Promise.all([
        api.getPortfolioDashboard(),
        api.getAssets(),
        api.getInstituteProfile()
      ]);
      setOverview(ovData);
      setAssets(assetsData);
      setInstitute(instData);
      if (assetsData.length >= 2) {
        setComparatorSelectedIds([assetsData[0].id, assetsData[1].id]);
      }
    } catch (err) {
      console.error('Falha ao carregar dados da carteira', err);
    }
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUserState(user);
    setCurrentUser(user);
    setIsChangePasswordModalOpen(false);
  };

  const handlePasswordChanged = () => {
    setIsChangePasswordModalOpen(false);
    setCurrentUserState(prev => ({ ...prev, must_change_password: false }));
  };

  const handleOpenReport = async (assetId: string) => {
    const foundAsset = assets.find(a => a.id === assetId) || assets[0];
    const metrics = await api.getAssetMetrics(assetId);
    setReportAsset(foundAsset);
    setReportMetrics(metrics);
    setIsReportModalOpen(true);
  };

  const handleNavigateToComparator = (ids?: string[]) => {
    if (ids && ids.length >= 2) {
      setComparatorSelectedIds(ids);
    }
    setCurrentTab('comparator');
  };

  const handleAssetCreated = (newAsset: Asset) => {
    setAssets([newAsset, ...assets]);
  };

  const handleDairImportComplete = async (extracted: DairExtractedData) => {
    await api.importDairData(extracted);
    if (extracted.institute) {
      setInstitute(prev => ({ ...prev, ...extracted.institute }));
    }
    if (extracted.assets && extracted.assets.length > 0) {
      setAssets(extracted.assets);
      if (extracted.assets.length >= 2) {
        setComparatorSelectedIds([extracted.assets[0].id, extracted.assets[1].id]);
      }
    }
    if (extracted.portfolioSummary && overview) {
      setOverview({
        ...overview,
        totalGeralCarteira: extracted.portfolioSummary.totalGeneral,
        totalAum: extracted.portfolioSummary.totalCarteiraCmn,
        saldoContaCorrente: extracted.portfolioSummary.saldoContaCorrente,
        returns: {
          ...overview.returns,
          month: extracted.portfolioSummary.rentabilidadeMesPct
        }
      });
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getFormattedDate = () => {
    const now = new Date();
    const str = new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }).format(now);
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'institute': return 'Instituto (Cadastro & Dados Gerais)';
      case 'active_portfolio': return 'Gestão de Investimentos > Carteira Ativa';
      case 'comparator': return 'Gestão de Investimentos > Comparador de Fundos';
      case 'simulator': return 'Gestão de Investimentos > Simulador Atuarial';
      case 'audit': return 'Gestão de Investimentos > Trilha de Auditoria';
      default: return 'Gestão de Investimentos > Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] dark:bg-[#070e19] text-slate-800 dark:text-slate-100 flex flex-col font-sans">
      {/* Barra Lateral Padrão Municipal (Identica ao Modelo Enviado) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setIsSidebarOpen(false);
        }}
        currentUser={currentUserState}
        onOpenDairUpload={() => setIsDairUploadOpen(true)}
        onOpenAssetRegister={() => setIsNewAssetModalOpen(true)}
        onOpenUserManagement={() => setIsUserManagementModalOpen(true)}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Conteúdo Principal (Recuado à esquerda para acomodar a Sidebar) */}
      <div className="flex-1 flex flex-col lg:pl-72 transition-all duration-300">
        {/* Top Navbar com Breadcrumbs e Botão Mobile */}
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          currentUser={currentUserState}
          onOpenCvmModal={() => setIsCvmModalOpen(true)}
          onOpenNewAssetModal={() => setIsNewAssetModalOpen(true)}
          onOpenUserManagementModal={() => setIsUserManagementModalOpen(true)}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
          onOpenDairUpload={() => setIsDairUploadOpen(true)}
          onToggleRightSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Banner de Boas-Vindas Padrão do Sistema Municipal */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-5">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb de Localização */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
              <span>Localização</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span>Início</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-blue-600 dark:text-blue-400 font-bold">
                {getTabLabel(currentTab)}
              </span>
            </div>

            {/* Saudação ao Jansen */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {getGreeting()}, Jansen
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {getFormattedDate()}. Gestão fiduciária do Regime Próprio de Previdência Social.
                </p>
              </div>

              {/* Badges de Destaque Rápido */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <a
                  href={OFFICIAL_REGULATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-900 font-bold hover:bg-blue-100 transition-colors shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Resolução CMN nº 5.272/2025</span>
                  <ExternalLink className="w-3 h-3 text-blue-400" />
                </a>

                <button
                  onClick={() => setIsCvmModalOpen(true)}
                  className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-900 font-bold hover:bg-emerald-100 transition-colors shadow-xs"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Robô CVM: Ativo (D-1)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Área Principal de Conteúdo */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentTab === 'dashboard' && overview && (
            <Dashboard
              overview={overview}
              assets={assets}
              onOpenReport={handleOpenReport}
              onNavigateToComparator={handleNavigateToComparator}
            />
          )}

          {currentTab === 'active_portfolio' && (
            <ActivePortfolioView
              assets={assets}
              onOpenReport={handleOpenReport}
              onNavigateToComparator={handleNavigateToComparator}
              onOpenDairUpload={() => setIsDairUploadOpen(true)}
            />
          )}

          {currentTab === 'institute' && (
            <InstituteProfileView
              institute={institute}
              onUpdateInstitute={(updated) => {
                setInstitute(updated);
                api.updateInstituteProfile(updated);
              }}
              onOpenDairUpload={() => setIsDairUploadOpen(true)}
              currentUser={currentUserState}
            />
          )}

          {currentTab === 'comparator' && (
            <AssetComparator
              allAssets={assets}
              initialSelectedIds={comparatorSelectedIds}
              onOpenReport={handleOpenReport}
            />
          )}

          {currentTab === 'simulator' && (
            <InvestmentSimulator />
          )}

          {currentTab === 'audit' && (
            <AuditTrailView />
          )}
        </main>

        {/* Rodapé Fiduciário */}
        <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <span className="font-bold text-white">PREVI-LACERDA</span> - Instituto de Previdência dos Servidores Públicos de Pontes e Lacerda - MT
              <div className="text-[11px] text-slate-500 mt-0.5">
                Módulo 1: Instituto • Módulo 2: Gestão de Investimentos RPPS • Resolução CMN nº 5.272/2025.
              </div>
            </div>
            <div className="text-right text-[11px] text-slate-500">
              Usuário: <strong className="text-slate-300">{currentUserState.email}</strong> ({currentUserState.role})
            </div>
          </div>
        </footer>
      </div>

      {/* Modals Operacionais */}
      <DairUploadModal
        isOpen={isDairUploadOpen}
        onClose={() => setIsDairUploadOpen(false)}
        onImportComplete={handleDairImportComplete}
      />

      <AssetRegistrationModal
        isOpen={isNewAssetModalOpen}
        onClose={() => setIsNewAssetModalOpen(false)}
        userRole={currentUserState.role}
        onSuccess={handleAssetCreated}
        onOpenDairUpload={() => setIsDairUploadOpen(true)}
      />

      <OnePageReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        asset={reportAsset}
        metrics={reportMetrics}
      />

      <CvmStatusModal
        isOpen={isCvmModalOpen}
        onClose={() => setIsCvmModalOpen(false)}
        userRole={currentUserState.role}
      />

      {/* Modals de Autenticação e Gestão Master */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        userEmail={currentUserState.email}
        onPasswordChanged={handlePasswordChanged}
      />

      <UserManagementModal
        isOpen={isUserManagementModalOpen}
        onClose={() => setIsUserManagementModalOpen(false)}
        currentUser={currentUserState}
      />
    </div>
  );
}

export default App;
