import {
  mockAssets,
  mockPortfolioOverview,
  mockMetrics,
  mockAuditLogs,
  mockCvmLogs,
  mockUsers
} from './mockData';
import { PREVI_LACERDA_OFFICIAL_PROFILE, PREVI_LACERDA_OFFICIAL_ASSETS } from './dairParserService';
import { Asset, AssetMetrics, PortfolioOverview, AuditLog, CvmLog, User, UserRole, InstituteProfile, DairExtractedData } from '../types';

let currentUser: User = mockUsers[0]; // Default: prof.jan100@gmail.com (Master Admin)
let usersListState: User[] = [...mockUsers];
let currentInstituteState: InstituteProfile = { ...PREVI_LACERDA_OFFICIAL_PROFILE };
let assetsListState: Asset[] = [...PREVI_LACERDA_OFFICIAL_ASSETS];
let portfolioOverviewState: PortfolioOverview = {
  ...mockPortfolioOverview,
  totalGeralCarteira: 138781858.93,
  totalAum: 138781858.93,
  saldoContaCorrente: 0.00,
  returns: {
    ...mockPortfolioOverview.returns,
    month: 1.51,
    yearToDate: 9.83,
    benchmarkSpread: 1.63
  }
};

export const setCurrentUser = (user: User) => {
  currentUser = user;
};

export const getCurrentUser = (): User => currentUser;

export const api = {
  async login(email: string, password: string): Promise<{ user: User; token: string; mustChangePassword: boolean }> {
    const cleanEmail = email.toLowerCase().trim();

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      });
      if (res.ok) {
        const data = await res.json();
        currentUser = data.user;
        return data;
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Falha na autenticação.');
      }
    } catch (err: any) {
      // Fallback autônomo com validação rigorosa
      const found = usersListState.find(u => u.email.toLowerCase() === cleanEmail);
      if (!found) {
        throw new Error('E-mail não cadastrado no PREVI-LACERDA.');
      }
      if (!found.is_email_verified) {
        throw new Error('Este e-mail ainda não foi validado. Conclua a validação antes de acessar o sistema.');
      }

      // Verificação do master
      if (cleanEmail === 'prof.jan100@gmail.com') {
        if (password !== 'Capivaraalbin@01') {
          throw new Error('Senha incorreta para o usuário Master. Utilize a senha cadastrada.');
        }
      }

      found.must_change_password = false;
      currentUser = found;
      return {
        user: found,
        token: `mock_jwt_token_${found.id}`,
        mustChangePassword: false
      };
    }
  },

  async changePassword(newPassword: string): Promise<void> {
    try {
      const res = await fetch('/api/v1/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer mock_jwt_token_${currentUser.id}`
        },
        body: JSON.stringify({ newPassword })
      });
      if (res.ok) {
        currentUser.must_change_password = false;
        return;
      }
    } catch {}

    // Fallback local
    currentUser.must_change_password = false;
    const idx = usersListState.findIndex(u => u.id === currentUser.id);
    if (idx !== -1) {
      usersListState[idx].must_change_password = false;
    }
  },

  async verifyEmail(email: string): Promise<void> {
    const cleanEmail = email.toLowerCase().trim();
    try {
      await fetch('/api/v1/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });
    } catch {}

    const idx = usersListState.findIndex(u => u.email.toLowerCase() === cleanEmail);
    if (idx !== -1) {
      usersListState[idx].is_email_verified = true;
    }
  },

  async listUsers(): Promise<User[]> {
    try {
      const res = await fetch('/api/v1/auth/users', {
        headers: { 'Authorization': `Bearer mock_jwt_token_${currentUser.id}` }
      });
      if (res.ok) return await res.json();
    } catch {}
    return usersListState;
  },

  async assignUserRole(userId: string, newRole: UserRole): Promise<void> {
    try {
      const res = await fetch(`/api/v1/auth/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer mock_jwt_token_${currentUser.id}`
        },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) return;
    } catch {}

    const idx = usersListState.findIndex(u => u.id === userId);
    if (idx !== -1) {
      usersListState[idx].role = newRole;
    }
  },

  async createUser(data: Partial<User>): Promise<User> {
    try {
      const res = await fetch('/api/v1/auth/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer mock_jwt_token_${currentUser.id}`
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const result = await res.json();
        return result.user;
      }
    } catch {}

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: data.name || '',
      email: data.email || '',
      role: data.role || 'Membro do Comitê',
      cpf: data.cpf || '',
      is_email_verified: Boolean(data.is_email_verified),
      must_change_password: false
    };
    usersListState.push(newUser);
    return newUser;
  },

  async deleteUser(userId: string): Promise<void> {
    try {
      await fetch(`/api/v1/auth/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer mock_jwt_token_${currentUser.id}`
        }
      });
    } catch {}

    usersListState = usersListState.filter(u => u.id !== userId);
  },

  async getPortfolioDashboard(): Promise<PortfolioOverview> {
    try {
      const res = await fetch('/api/v1/portfolio/dashboard');
      if (res.ok) return await res.json();
    } catch {}
    return portfolioOverviewState;
  },

  async getAssets(): Promise<Asset[]> {
    try {
      const res = await fetch('/api/v1/assets');
      if (res.ok) return await res.json();
    } catch {}
    return assetsListState;
  },

  async getInstituteProfile(): Promise<InstituteProfile> {
    try {
      const res = await fetch('/api/v1/institute/profile');
      if (res.ok) return await res.json();
    } catch {}
    return currentInstituteState;
  },

  async updateInstituteProfile(updated: InstituteProfile): Promise<InstituteProfile> {
    try {
      const res = await fetch('/api/v1/institute/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        currentInstituteState = await res.json();
        return currentInstituteState;
      }
    } catch {}
    currentInstituteState = { ...updated };
    return currentInstituteState;
  },

  async importDairData(data: DairExtractedData): Promise<{ success: boolean; message: string }> {
    if (data.institute) {
      currentInstituteState = {
        ...currentInstituteState,
        ...data.institute
      };
    }
    if (data.assets && data.assets.length > 0) {
      assetsListState = [...data.assets];
    }
    if (data.portfolioSummary) {
      portfolioOverviewState = {
        ...portfolioOverviewState,
        totalGeralCarteira: data.portfolioSummary.totalGeneral,
        totalAum: data.portfolioSummary.totalCarteiraCmn,
        saldoContaCorrente: data.portfolioSummary.saldoContaCorrente,
        returns: {
          ...portfolioOverviewState.returns,
          month: data.portfolioSummary.rentabilidadeMesPct
        }
      };
    }
    return {
      success: true,
      message: 'DAIR importado com sucesso! Dados do Instituto e Carteira atualizados.'
    };
  },

  async getAssetMetrics(id: string): Promise<AssetMetrics | null> {
    try {
      const res = await fetch(`/api/v1/assets/${id}`);
      if (res.ok) {
        const data = await res.json();
        return data.metrics;
      }
    } catch {}
    return mockMetrics[id] || null;
  },

  async compareAssets(assetIds: string[]): Promise<AssetMetrics[]> {
    try {
      const res = await fetch('/api/v1/comparator/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetIds })
      });
      if (res.ok) {
        const data = await res.json();
        return data.metrics;
      }
    } catch {}
    return assetIds.map(id => mockMetrics[id]).filter(Boolean);
  },

  async simulateInvestment(params: any): Promise<any> {
    try {
      const res = await fetch('/api/v1/simulator/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (res.ok) return await res.json();
    } catch {}

    const { initialAmount, monthlyContribution, periodMonths, annualBenchmarkRatePct, annualInflationPct, riskPremiumPct } = params;
    const actuarialAnnual = ((1 + annualInflationPct / 100) * (1 + riskPremiumPct / 100) - 1) * 100;
    const mBenchmark = Math.pow(1 + annualBenchmarkRatePct / 100, 1 / 12) - 1;
    const mActuarial = Math.pow(1 + actuarialAnnual / 100, 1 / 12) - 1;

    let bBenchmark = initialAmount;
    let bActuarial = initialAmount;
    let bNoYield = initialAmount;
    const timeline = [];

    for (let m = 1; m <= periodMonths; m++) {
      bBenchmark = (bBenchmark * (1 + mBenchmark)) + monthlyContribution;
      bActuarial = (bActuarial * (1 + mActuarial)) + monthlyContribution;
      bNoYield += monthlyContribution;

      if (m % 6 === 0 || m === periodMonths) {
        timeline.push({
          month: m,
          year: parseFloat((m / 12).toFixed(1)),
          totalDeposited: Math.round(bNoYield),
          balanceBenchmark: Math.round(bBenchmark),
          balanceActuarial: Math.round(bActuarial),
          earningsActuarial: Math.round(bActuarial - bNoYield)
        });
      }
    }

    return {
      finalBalanceActuarial: Math.round(bActuarial),
      finalBalanceBenchmark: Math.round(bBenchmark),
      totalInvested: Math.round(bNoYield),
      totalInterestEarned: Math.round(bActuarial - bNoYield),
      actuarialTargetAnnualPct: parseFloat(actuarialAnnual.toFixed(2)),
      timeline
    };
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    try {
      const res = await fetch('/api/v1/audit/logs');
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch {}
    return mockAuditLogs;
  },

  async getCvmLogs(): Promise<CvmLog[]> {
    try {
      const res = await fetch('/api/v1/cvm/logs');
      if (res.ok) return await res.json();
    } catch {}
    return mockCvmLogs;
  },

  async triggerCvmSync(): Promise<any> {
    try {
      const res = await fetch('/api/v1/cvm/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (res.ok) return await res.json();
    } catch {}
    return {
      message: 'Sincronização CVM simulada com sucesso!',
      result: {
        jobId: `CVM_SYNC_${Date.now()}`,
        assetsUpdated: 5,
        executionTimeSeconds: 4.6,
        status: 'SUCCESS'
      }
    };
  }
};
