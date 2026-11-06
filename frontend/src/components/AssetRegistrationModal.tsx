import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, Lock } from 'lucide-react';
import { UserRole, AssetClass, RiskLevel } from '../types';

interface AssetRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
  onSuccess: (newAsset: any) => void;
}

export const AssetRegistrationModal: React.FC<AssetRegistrationModalProps> = ({
  isOpen,
  onClose,
  userRole,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    cnpj: '',
    cvmCode: '',
    name: '',
    tradingName: '',
    assetClass: 'RENDA_FIXA' as AssetClass,
    cmnArticle: 'Art. 7º, I, "b"',
    administrator: '',
    manager: '',
    custodian: '',
    benchmark: 'CDI',
    riskLevel: 'BAIXO' as RiskLevel,
    liquidityDays: 0,
    adminFeePct: 0.20,
    performanceFeePct: 0.00
  });

  if (!isOpen) return null;

  const isReadOnly = userRole === 'AUDITORIA_CONSELHO_FISCAL';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    // Simula criação e salva
    const createdAsset = {
      id: `asset_${Date.now()}`,
      cnpj: formData.cnpj,
      name: formData.name,
      trading_name: formData.tradingName || formData.name,
      asset_class: formData.assetClass,
      article_code: formData.cmnArticle,
      administrator: formData.administrator,
      manager: formData.manager,
      custodian: formData.custodian,
      benchmark: formData.benchmark,
      risk_level: formData.riskLevel,
      liquidity_days: Number(formData.liquidityDays),
      admin_fee_pct: Number(formData.adminFeePct),
      performance_fee_pct: Number(formData.performanceFeePct),
      status: userRole === 'DIRETORIA_EXECUTIVA' ? 'APROVADO' : 'PENDENTE_APROVACAO',
      total_invested: 0,
      weight_pct: 0
    };

    onSuccess(createdAsset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Cabeçalho do Modal */}
        <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">Cadastro de Ativo Financeiro (RPPS)</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Registro de fundo de investimento ou título em conformidade com a Resolução CMN 4.963/2021.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerta de Governança e RBAC */}
        <div className="px-6 pt-4">
          {isReadOnly ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2 text-xs text-amber-800 font-medium">
              <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>Atenção: O perfil de Auditoria / Conselho Fiscal possui acesso exclusivamente para leitura (Read-Only). O envio de novos cadastros está bloqueado.</span>
            </div>
          ) : userRole === 'COMITE_INVESTIMENTOS' ? (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2 text-xs text-blue-800 font-medium">
              <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>Governança RPPS: Ativos cadastrados pelo Comitê de Investimentos serão submetidos com status <strong>"PENDENTE DE APROVAÇÃO"</strong> até homologação pela Diretoria Executiva.</span>
            </div>
          ) : (
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 flex items-start gap-2 text-xs text-teal-800 font-medium">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>Perfil Diretoria Executiva: Ativos cadastrados terão homologação direta na carteira do PREVI-LACERDA.</span>
            </div>
          )}
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">CNPJ do Fundo / Emissor *</label>
              <input
                type="text"
                required
                disabled={isReadOnly}
                placeholder="00.000.000/0001-00"
                value={formData.cnpj}
                onChange={e => setFormData({ ...formData, cnpj: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Código CVM</label>
              <input
                type="text"
                disabled={isReadOnly}
                placeholder="Ex: 180293"
                value={formData.cvmCode}
                onChange={e => setFormData({ ...formData, cvmCode: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Razão Social Completa *</label>
            <input
              type="text"
              required
              disabled={isReadOnly}
              placeholder="Ex: CAIXA BRASIL IMA-B 5+ TÍTULOS PÚBLICOS FI RENDA FIXA LP"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Nome Fantasia Comercial (Exibição)</label>
            <input
              type="text"
              disabled={isReadOnly}
              placeholder="Ex: Caixa Brasil IMA-B 5+"
              value={formData.tradingName}
              onChange={e => setFormData({ ...formData, tradingName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Classe do Ativo *</label>
              <select
                value={formData.assetClass}
                disabled={isReadOnly}
                onChange={e => setFormData({ ...formData, assetClass: e.target.value as AssetClass })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none"
              >
                <option value="RENDA_FIXA">Renda Fixa</option>
                <option value="RENDA_VARIAVEL">Renda Variável (Ações)</option>
                <option value="INVESTIMENTO_EXTERIOR">Investimento no Exterior</option>
                <option value="MULTIMERCADO">Multimercado</option>
                <option value="TITULO_PUBLICO_DIRETO">Título Público Direto</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Enquadramento CMN 4.963 *</label>
              <select
                value={formData.cmnArticle}
                disabled={isReadOnly}
                onChange={e => setFormData({ ...formData, cmnArticle: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none"
              >
                <option value='Art. 7º, I, "a"'>Art. 7º, I, "a" (Títulos Tesouro Selic)</option>
                <option value='Art. 7º, I, "b"'>Art. 7º, I, "b" (Fundos 100% Títulos Públicos)</option>
                <option value='Art. 7º, III, "a"'>Art. 7º, III, "a" (Renda Fixa Diversificado)</option>
                <option value='Art. 8º, I'>Art. 8º, I (Fundos de Ações FIA)</option>
                <option value='Art. 9º, II'>Art. 9º, II (Exterior)</option>
                <option value='Art. 10, I'>Art. 10, I (Multimercado FIM)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Administrador Fiduciário *</label>
              <input
                type="text"
                required
                disabled={isReadOnly}
                placeholder="Ex: BB Gestão de Recursos DTVM"
                value={formData.administrator}
                onChange={e => setFormData({ ...formData, administrator: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Gestor de Recursos *</label>
              <input
                type="text"
                required
                disabled={isReadOnly}
                placeholder="Ex: Santander Asset Management"
                value={formData.manager}
                onChange={e => setFormData({ ...formData, manager: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Grau de Risco *</label>
              <select
                value={formData.riskLevel}
                disabled={isReadOnly}
                onChange={e => setFormData({ ...formData, riskLevel: e.target.value as RiskLevel })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none"
              >
                <option value="MUITO_BAIXO">Muito Baixo</option>
                <option value="BAIXO">Baixo</option>
                <option value="MEDIO">Médio</option>
                <option value="ALTO">Alto</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Taxa Adm (% a.a.)</label>
              <input
                type="number"
                step="0.05"
                disabled={isReadOnly}
                value={formData.adminFeePct}
                onChange={e => setFormData({ ...formData, adminFeePct: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Prazo Resgate (D+X)</label>
              <input
                type="number"
                disabled={isReadOnly}
                value={formData.liquidityDays}
                onChange={e => setFormData({ ...formData, liquidityDays: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:ring-2 focus:ring-teal-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Botões */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isReadOnly}
              className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 transition-colors shadow-sm"
            >
              {userRole === 'DIRETORIA_EXECUTIVA' ? 'Cadastrar e Homologar' : 'Submeter para Aprovação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
