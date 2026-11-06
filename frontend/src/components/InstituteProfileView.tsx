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
  Calendar
} from 'lucide-react';
import { InstituteProfile, User } from '../types';

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

  const canEdit = currentUser?.role === 'MASTER_ADMIN' || currentUser?.role === 'DIRETORIA_EXECUTIVA';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateInstitute(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner / Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-blue-500/5 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  {formData.gestoraUnitName}
                </h1>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
                  RPPS Regular
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1">
                {formData.enteName} - {formData.uf} • CNPJ: <span className="font-mono text-white">{formData.enteCnpj}</span>
              </p>
              {formData.lastDairImportAt && (
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Última sincronização via DAIR CADPREV: <span className="text-slate-200">{formData.lastDairImportAt}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={onOpenDairUpload}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all text-sm"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Atualizar via DAIR (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-800 text-emerald-200 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Dados cadastrais do Instituto PREVI-LACERDA salvos com sucesso! Trilha de auditoria registrada.</span>
        </div>
      )}

      {/* Main Form & Cards */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Core Details & Governance */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identificação Institucional */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              Identificação do Ente & Unidade Gestora
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Ente Federativo
                </label>
                <input
                  type="text"
                  value={formData.enteName}
                  disabled={!canEdit}
                  onChange={(e) => setFormData({ ...formData, enteName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  CNPJ do Ente / Unidade
                </label>
                <input
                  type="text"
                  value={formData.enteCnpj}
                  disabled={!canEdit}
                  onChange={(e) => setFormData({ ...formData, enteCnpj: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Unidade Gestora Previdenciária
                </label>
                <input
                  type="text"
                  value={formData.gestoraUnitName}
                  disabled={!canEdit}
                  onChange={(e) => setFormData({ ...formData, gestoraUnitName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Representante Legal do Ente (Prefeito/Representante)
                </label>
                <input
                  type="text"
                  value={formData.enteRepresentativeName}
                  disabled={!canEdit}
                  onChange={(e) => setFormData({ ...formData, enteRepresentativeName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                />
                <p className="text-[11px] text-slate-500 mt-0.5">CPF: {formData.enteRepresentativeCpf}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Representante da Unidade Gestora (Diretor Executivo)
                </label>
                <input
                  type="text"
                  value={formData.gestoraRepresentativeName}
                  disabled={!canEdit}
                  onChange={(e) => setFormData({ ...formData, gestoraRepresentativeName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                />
                <p className="text-[11px] text-slate-500 mt-0.5">CPF: {formData.gestoraRepresentativeCpf}</p>
              </div>
            </div>
          </div>

          {/* Gestão de Recursos & Comitê de Investimento */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-emerald-500" />
              Gestor de Recursos & Comitê de Investimentos
            </h2>

            {/* Destaque do Gestor de Recursos */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/80 dark:to-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded">
                    GESTOR OFICIAL DE RECURSOS RPPS
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {formData.resourceManagerName}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-mono">
                    CPF: {formData.resourceManagerCpf}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-300 dark:border-emerald-800">
                    {formData.resourceManagerCert}
                  </span>
                </div>
              </div>
            </div>

            {/* Membros do Comitê de Investimentos */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-400" />
                Membros do Comitê de Investimentos (CADPREV)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {formData.committeeMembers.map((member, idx) => (
                  <div 
                    key={idx}
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl text-xs"
                  >
                    <p className="font-bold text-slate-900 dark:text-white truncate">{member.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">CPF: {member.cpf}</p>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Início: {member.startDate}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Conselhos Deliberativo e Fiscal */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-indigo-500" />
              Conselho Deliberativo (10 Membros Cadastrados)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              {formData.deliberativeCouncil.map((m, i) => (
                <div key={i} className="p-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-lg">
                  <span className="font-medium text-slate-800 dark:text-slate-200">{m.name}</span>
                  <span className="block text-[10px] text-slate-400">{m.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Contato, Certificações & Save */}
        <div className="space-y-6">
          {/* Status & Certificações */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Governança & Pró-Gestão
            </h2>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
                <p className="font-semibold text-emerald-800 dark:text-emerald-300">Programa Pró-Gestão RPPS</p>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">{formData.proGestaoLevel}</p>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50">
                <p className="font-semibold text-blue-800 dark:text-blue-300">Resolução CMN Aplicável</p>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-0.5">Resolução CMN nº 5.272/2025</p>
              </div>
            </div>
          </div>

          {/* Dados de Contato */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Sede e Contato
            </h2>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Endereço
                </label>
                <input
                  type="text"
                  value={formData.address || ''}
                  disabled={!canEdit}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Telefone Institucional
                </label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  disabled={!canEdit}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  E-mail Oficial
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  disabled={!canEdit}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Botão de Salvar Alterações */}
          {canEdit && (
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/30 transition-all text-sm"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações Cadastrais</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
