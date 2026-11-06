import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { RightSidebar } from './components/RightSidebar';
import { Dashboard } from './components/Dashboard';
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

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [currentUserState, setCurrentUserState] = useState<User>(getCurrentUser());
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

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
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(
    Boolean(currentUserState.must_change_password)
  );
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

  const handleLoginSuccess = (user: User, mustChangePassword: boolean) => {
    setCurrentUserState(user);
    setCurrentUser(user);
    if (mustChangePassword) {
      setIsChangePasswordModalOpen(true);
    }
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

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUserState}
        onOpenCvmModal={() => setIsCvmModalOpen(true)}
        onOpenNewAssetModal={() => setIsNewAssetModalOpen(true)}
        onOpenUserManagementModal={() => setIsUserManagementModalOpen(true)}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenDairUpload={() => setIsDairUploadOpen(true)}
        onToggleRightSidebar={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
      />

      {/* Main Content Area with Right Padding for the Right-Side Menu */}
      <div className="flex-1 flex flex-col lg:pr-72 transition-all duration-300">
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentTab === 'dashboard' && overview && (
            <Dashboard
              overview={overview}
              assets={assets}
              onOpenReport={handleOpenReport}
              onNavigateToComparator={handleNavigateToComparator}
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

        {/* Footer Fiduciário */}
        <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <span className="font-bold text-white">PREVI-LACERDA</span> - Instituto de Previdência dos Servidores Públicos de Pontes e Lacerda - MT
              <div className="text-[11px] text-slate-500 mt-0.5">
                Módulo: Gestão de Investimentos RPPS • Resolução CMN nº 5.272/2025.
              </div>
            </div>
            <div className="text-right text-[11px] text-slate-500">
              Usuário: <strong className="text-slate-300">{currentUserState.email}</strong> ({currentUserState.role})
            </div>
          </div>
        </footer>
      </div>

      {/* Menus na Lateral Direita (Right-hand Sidebar) */}
      <RightSidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setIsRightSidebarOpen(false);
        }}
        currentUser={currentUserState}
        onOpenDairUpload={() => setIsDairUploadOpen(true)}
        onOpenAssetRegister={() => setIsNewAssetModalOpen(true)}
        onOpenUserManagement={() => setIsUserManagementModalOpen(true)}
        isOpen={isRightSidebarOpen}
        onToggle={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
      />

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

      {/* Modals de Autenticação, Troca de Senha e Gestão Master */}
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
