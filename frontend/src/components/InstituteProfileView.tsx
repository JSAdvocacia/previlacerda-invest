import React, { useState } from 'react';
import { 
  Building2, 
  UserCheck, 
  ShieldCheck, 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail, 
  Award,
  Save,
  Users,
  Calendar,
  AlertTriangle,
  Clock,
  Info,
  Check,
  ChevronRight,
  TrendingUp,
  Percent
} from 'lucide-react';
import { InstituteProfile, User, ProGestaoLevel } from '../types';
import { OFFICIAL_REGULATION_URL, OFFICIAL_REGULATION_NORM } from '../services/mockData';

interface InstituteProfileViewProps {
  institute: InstituteProfile;
  onUpdateInstitute: (updated: InstituteProfile) => void;
  onOpenDairUpload: () => void;
  currentUser: User | null;
}

export const InstituteProfileView: React.FC<InstituteProfileViewProps> = ({
  institute,
  onUpdateInstitute,
  onOpenDairUpload,
  currentUser
}) => {
  const [formData, setFormData] = useState<InstituteProfile>(institute);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateInstitute(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleProGestaoChange = (newLevel: string) => {
    setFormData(prev => ({
      ...prev,
      proGestaoLevel: newLevel,
      proGestaoDeadline: newLevel === 'SEM_PRO_GESTAO' ? '31/12/2026' : undefined
    }));
  };

  const isSemProGestao = 
    formData.proGestaoLevel === 'SEM_PRO_GESTAO' || 
    !formData.proGestaoLevel || 
    formData.proGestaoLevel.toLowerCase().includes('sem');

  // Limites regulamentares conforme Pró-Gestão (Resolução CMN nº 5.272/2025 e Portaria MTP 1.467/2022)
  const limitsByLevel = {
    SEM_PRO_GESTAO: {
      label: 'Sem Pró-Gestão (Não Certificado)',
      rendaVariavel: 15.0,
      exterior: 5.0,
      multimercado: 5.0,
      creditoPrivado: 5.0,
      rendaFixaGeral: 40.0,
      prazoAdequacao: '31/12/2026'
    },
    NIVEL_I: {
      label: 'Pró-Gestão Nível I',
      rendaVariavel: 20.0,
      exterior: 7.0,
      multimercado: 7.0,
      creditoPrivado: 10.0,
      rendaFixaGeral: 40.0,
      prazoAdequacao: 'Certificado Válido'
    },
    NIVEL_II: {
      label: 'Pró-Gestão Nível II',
      rendaVariavel: 30.0,
      exterior: 10.0,
      multimercado: 10.0,
      creditoPrivado: 20.0,
      rendaFixaGeral: 40.0,
      prazoAdequacao: 'Certificado Válido'
    },
    NIVEL_III: {
      label: 'Pró-Gestão Nível III',
      rendaVariavel: 35.0,
      exterior: 10.0,
      multimercado: 10.0,
      creditoPrivado: 20.0,
      rendaFixaGeral: 40.0,
      prazoAdequacao: 'Certificado Válido'
    },
    NIVEL_IV: {
      label: 'Pró-Gestão Nível IV',
      rendaVariavel: 35.0,
      exterior: 10.0,
      multimercado: 10.0,
      creditoPrivado: 20.0,
      rendaFixaGeral: 40.0,
      prazoAdequacao: 'Certificado Válido'
    }
  };

  const currentLimits = isSemProGestao 
    ? limitsByLevel.SEM_PRO_GESTAO 
    : (limitsByLevel[formData.proGestaoLevel as keyof typeof limitsByLevel] || limitsByLevel.SEM_PRO_GESTAO);

  return (
    <div className="space-y-5 animate-fadeIn pb-12 text-slate-800">
      {/* 1. Top Banner Compacto e Confortável (Visual Clean e Leve) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 leading-tight">
                  {formData.gestoraUnitName || 'PREVI LACERDA - FUNDO MUNICIPAL DE PREVIDENCIA SOCIAL'}
                </h1>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md">
                  RPPS Regular
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {formData.enteName} - {formData.uf} • CNPJ: <span className="font-mono font-semibold text-slate-700">{formData.enteCnpj}</span>
                {formData.lastDairImportAt && (
                  <span className="ml-2 text-[11px] text-slate-400">
                    • Sincronizado via DAIR CADPREV: {formData.lastDairImportAt}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onOpenDairUpload}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-lg text-xs shadow-xs transition-colors"
              title="Importar dados e cotas diretamente do DAIR PDF"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Atualizar via DAIR (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 shadow-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Dados do Instituto PREVI-LACERDA e configurações de Pró-Gestão atualizados com sucesso!</span>
        </div>
      )}

      {/* 2. Formulário Principal e Cards Informativos */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Coluna Esquerda (2 colunas): Identificação, Gestão e Conselhos */}
        <div className="lg:col-span-2 space-y-5">
          {/* Identificação do Ente & Unidade Gestora */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Identificação Institucional</span>
              </h2>
              <span className="text-[11px] text-slate-400">Campos editáveis</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ente Federativo *</label>
                <input
                  type="text"
                  required
                  value={formData.enteName}
                  onChange={(e) => setFormData({ ...formData, enteName: e.target.value })}
                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">CNPJ do Ente / RPPS *</label>
                <input
                  type="text"
                  required
                  value={formData.enteCnpj}
                  onChange={(e) => setFormData({ ...formData, enteCnpj: e.target.value })}
                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg px-3 py-2 font-mono text-slate-800 font-medium focus:outline-none transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Unidade Gestora Previdenciária *</label>
                <input
                  type="text"
                  required
                  value={formData.gestoraUnitName}
                  onChange={(e) => setFormData({ ...formData, gestoraUnitName: e.target.value })}
                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg px-3 py-2 font-semibold text-slate-900 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Representante Legal do Ente (Prefeito)</label>
                <input
                  type="text"
                  value={formData.enteRepresentativeName}
                  onChange={(e) => setFormData({ ...formData, enteRepresentativeName: e.target.value })}
                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-none transition-colors"
                />
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400">CPF:</span>
                  <input
                    type="text"
                    value={formData.enteRepresentativeCpf}
                    onChange={(e) => setFormData({ ...formData, enteRepresentativeCpf: e.target.value })}
                    className="w-32 bg-transparent text-[11px] font-mono text-slate-600 focus:outline-none border-b border-dashed border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Diretor Executivo da Unidade Gestora</label>
                <input
                  type="text"
                  value={formData.gestoraRepresentativeName}
                  onChange={(e) => setFormData({ ...formData, gestoraRepresentativeName: e.target.value })}
                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-none transition-colors"
                />
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400">CPF:</span>
                  <input
                    type="text"
                    value={formData.gestoraRepresentativeCpf}
                    onChange={(e) => setFormData({ ...formData, gestoraRepresentativeCpf: e.target.value })}
                    className="w-32 bg-transparent text-[11px] font-mono text-slate-600 focus:outline-none border-b border-dashed border-slate-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Gestor Oficial de Recursos & Comitê de Investimentos */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3.5 border-b border-slate-100 pb-3">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Gestor de Recursos & Comitê de Investimentos</span>
            </h2>

            {/* Destaque do Gestor de Recursos */}
            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                    Gestor Oficial de Recursos
                  </span>
                  <div className="mt-1">
                    <input
                      type="text"
                      value={formData.resourceManagerName}
                      onChange={(e) => setFormData({ ...formData, resourceManagerName: e.target.value })}
                      className="text-sm font-bold text-slate-900 bg-transparent border-b border-slate-300 focus:outline-none focus:border-blue-600 w-full"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-mono mt-0.5">
                    <span>CPF:</span>
                    <input
                      type="text"
                      value={formData.resourceManagerCpf}
                      onChange={(e) => setFormData({ ...formData, resourceManagerCpf: e.target.value })}
                      className="bg-transparent text-xs font-mono focus:outline-none border-b border-slate-300 w-32"
                    />
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200 inline-block">
                    {formData.resourceManagerCert}
                  </span>
                </div>
              </div>
            </div>

            {/* Membros do Comitê de Investimentos */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  Membros do Comitê de Investimentos ({formData.committeeMembers.length})
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {formData.committeeMembers.map((member, idx) => (
                  <div 
                    key={idx}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => {
                        const newMembers = [...formData.committeeMembers];
                        newMembers[idx].name = e.target.value;
                        setFormData({ ...formData, committeeMembers: newMembers });
                      }}
                      className="font-bold text-slate-800 w-full bg-transparent focus:outline-none border-b border-transparent focus:border-blue-400"
                    />
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">CPF: {member.cpf}</p>
                    <p className="text-[10px] text-blue-600 font-medium mt-1">Início: {member.startDate}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Conselhos Deliberativo e Fiscal */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Conselho Deliberativo (10 Conselheiros)</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
              {formData.deliberativeCouncil.map((m, i) => (
                <div key={i} className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-semibold text-slate-800 block truncate" title={m.name}>{m.name}</span>
                  <span className="text-[10px] text-slate-400 block">{m.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna Direita (1 coluna): Governança & Pró-Gestão, Prazos e Salvar */}
        <div className="space-y-5">
          {/* 3. Card Governança & Pró-Gestão (Com Seletor e Análise de Enquadramento) */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Governança & Pró-Gestão</span>
              </h2>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                CMN 5.272/2025
              </span>
            </div>

            {/* Seletor Interativo de Nível de Pró-Gestão */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nível do Programa Pró-Gestão RPPS:
              </label>
              <select
                value={formData.proGestaoLevel}
                onChange={(e) => handleProGestaoChange(e.target.value)}
                className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-blue-500 rounded-lg p-2.5 text-xs font-bold text-slate-800 focus:outline-none transition-colors"
              >
                <option value="SEM_PRO_GESTAO">Sem Pró-Gestão (Não Certificado)</option>
                <option value="NIVEL_I">Pró-Gestão - Nível I</option>
                <option value="NIVEL_II">Pró-Gestão - Nível II</option>
                <option value="NIVEL_III">Pró-Gestão - Nível III</option>
                <option value="NIVEL_IV">Pró-Gestão - Nível IV</option>
              </select>
            </div>

            {/* Alerta Legal de Prazo de Adequação do Município */}
            {isSemProGestao ? (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-amber-900 leading-tight">
                      Atenção: RPPS Sem Certificação Pró-Gestão
                    </p>
                    <p className="text-[11px] text-amber-800 mt-1">
                      O PREVI-LACERDA opera atualmente sob os limites básicos fiduciários da Resolução CMN nº 5.272/2025.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-amber-200/80">
                  <p className="text-[11px] font-bold text-amber-950 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>Prazo Limite para Adequação: <strong>31/12/2026</strong></span>
                  </p>
                  <p className="text-[10px] text-amber-800 mt-0.5">
                    Conforme Art. 248 da Portaria MTP nº 1.467/2022, o município tem até <strong>31 de dezembro de 2026</strong> para obter a certificação Pró-Gestão Nível II para manter e realizar novos aportes nos limites ampliados de Renda Variável, Multimercado e BDR.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
                <p className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Certificação Ativa: {currentLimits.label}</span>
                </p>
                <p className="text-[11px] text-emerald-700">
                  Limites ampliados de investimentos plenamente autorizados e enquadrados na Resolução CMN 5.272/2025.
                </p>
              </div>
            )}

            {/* Tabela de Impacto nos Limites de Alocação da Carteira */}
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2.5">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Limites Conforme Pró-Gestão Atual:
              </span>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="text-slate-600">Renda Variável (Ações - Art. 8º):</span>
                  <span className="font-bold text-slate-800">{currentLimits.rendaVariavel}%</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="text-slate-600">Investimento Exterior (Art. 8º, III):</span>
                  <span className="font-bold text-slate-800">{currentLimits.exterior}%</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="text-slate-600">Multimercado (Art. 10, I):</span>
                  <span className="font-bold text-slate-800">{currentLimits.multimercado}%</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="text-slate-600">Crédito Privado (Art. 7º, VII):</span>
                  <span className="font-bold text-slate-800">{currentLimits.creditoPrivado}%</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-600">Renda Fixa Sem Sufixo CP (Art. 7º, V):</span>
                  <span className="font-bold text-slate-800">{currentLimits.rendaFixaGeral}%</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 pt-1 italic">
                Posição atual do PREVI-LACERDA: Renda Variável (5,21%), Multimercado (2,24%), Exterior (0,67%) — <strong>100% enquadrados</strong> dentro dos limites básicos.
              </div>
            </div>
          </div>

          {/* Dados de Contato e Sede */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900 mb-2">Sede e Contato</h2>
            <div className="space-y-2.5 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Endereço
                </label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Telefone
                </label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  E-mail Oficial
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Botão de Salvar Alterações */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl shadow-xs transition-colors text-xs"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Alterações do Instituto</span>
          </button>
        </div>
      </form>
    </div>
  );
};
