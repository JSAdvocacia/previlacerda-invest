import React, { useState } from 'react';
import { 
  Building2, 
  UserCheck, 
  ShieldCheck, 
  FileText, 
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
  PlusCircle,
  Trash2,
  Edit2,
  Check,
  Scale
} from 'lucide-react';
import { InstituteProfile, User, GovernanceMember, ProGestaoLevel } from '../types';

interface InstituteProfileViewProps {
  institute: InstituteProfile;
  onUpdateInstitute: (updated: InstituteProfile) => void;
  onOpenDairUpload: () => void;
  currentUser: User | null;
  currentSubTab?: string;
}

export const InstituteProfileView: React.FC<InstituteProfileViewProps> = ({
  institute,
  onUpdateInstitute,
  onOpenDairUpload,
  currentUser,
  currentSubTab = 'institute'
}) => {
  const [formData, setFormData] = useState<InstituteProfile>(institute);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  // Formulário de Cadastro / Edição de Membro
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [memberName, setMemberName] = useState('');
  const [memberCpf, setMemberCpf] = useState('');
  const [memberRole, setMemberRole] = useState('');
  const [memberStartDate, setMemberStartDate] = useState('');
  const [memberTermEnd, setMemberTermEnd] = useState('');
  const [memberCertRequired, setMemberCertRequired] = useState('');
  const [memberCertAcquired, setMemberCertAcquired] = useState('');
  const [memberCertNumber, setMemberCertNumber] = useState('');
  const [memberCertValidity, setMemberCertValidity] = useState('');
  const [memberCertStatus, setMemberCertStatus] = useState<'VIGENTE' | 'A_VENCER' | 'VENCIDO' | 'PENDENTE'>('VIGENTE');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPhone, setMemberPhone] = useState('');

  const membersList: GovernanceMember[] = formData.governanceMembers || [];

  const handleSaveMainInstitute = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateInstitute(formData);
    setFeedbackText('Dados do Instituto PREVI-LACERDA e Município atualizados com sucesso!');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const openAddMemberModal = (defaultCategory: GovernanceMember['category'], defaultCertReq: string, defaultRole: string) => {
    setEditingMemberId(null);
    setMemberName('');
    setMemberCpf('');
    setMemberRole(defaultRole);
    setMemberStartDate('01/01/2025');
    setMemberTermEnd('31/12/2026');
    setMemberCertRequired(defaultCertReq);
    setMemberCertAcquired(defaultCertReq);
    setMemberCertNumber('');
    setMemberCertValidity('31/12/2026');
    setMemberCertStatus('VIGENTE');
    setMemberEmail('');
    setMemberPhone('');
    setShowMemberModal(true);
  };

  const openEditMemberModal = (member: GovernanceMember) => {
    setEditingMemberId(member.id);
    setMemberName(member.name);
    setMemberCpf(member.cpf);
    setMemberRole(member.role);
    setMemberStartDate(member.startDate);
    setMemberTermEnd(member.termEndDate || '');
    setMemberCertRequired(member.certificationRequired);
    setMemberCertAcquired(member.certificationAcquired);
    setMemberCertNumber(member.certificationNumber || '');
    setMemberCertValidity(member.certificationValidity);
    setMemberCertStatus(member.certificationStatus);
    setMemberEmail(member.email || '');
    setMemberPhone(member.phone || '');
    setShowMemberModal(true);
  };

  const handleSaveMember = (category: GovernanceMember['category']) => {
    if (!memberName.trim()) {
      alert('Por favor, informe o nome completo do membro.');
      return;
    }

    const currentMembers = [...membersList];

    if (editingMemberId) {
      // Editar existente
      const idx = currentMembers.findIndex(m => m.id === editingMemberId);
      if (idx !== -1) {
        currentMembers[idx] = {
          ...currentMembers[idx],
          name: memberName.trim(),
          cpf: memberCpf.trim(),
          role: memberRole.trim(),
          startDate: memberStartDate,
          termEndDate: memberTermEnd,
          certificationRequired: memberCertRequired,
          certificationAcquired: memberCertAcquired,
          certificationNumber: memberCertNumber,
          certificationValidity: memberCertValidity,
          certificationStatus: memberCertStatus,
          email: memberEmail,
          phone: memberPhone
        };
      }
    } else {
      // Novo membro
      const newMem: GovernanceMember = {
        id: `gov_${Date.now()}`,
        name: memberName.trim(),
        cpf: memberCpf.trim(),
        role: memberRole.trim() || 'Membro Titular',
        startDate: memberStartDate || '01/01/2025',
        termEndDate: memberTermEnd,
        category,
        certificationRequired: memberCertRequired,
        certificationAcquired: memberCertAcquired,
        certificationNumber: memberCertNumber,
        certificationValidity: memberCertValidity,
        certificationStatus: memberCertStatus,
        email: memberEmail,
        phone: memberPhone
      };
      currentMembers.push(newMem);
    }

    const updatedProfile = {
      ...formData,
      governanceMembers: currentMembers
    };
    setFormData(updatedProfile);
    onUpdateInstitute(updatedProfile);
    setShowMemberModal(false);
    setFeedbackText('Membro e certificações fiduciárias atualizados com sucesso!');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleDeleteMember = (id: string, name: string) => {
    if (confirm(`Deseja remover o cadastro de ${name}?`)) {
      const updatedMembers = membersList.filter(m => m.id !== id);
      const updatedProfile = {
        ...formData,
        governanceMembers: updatedMembers
      };
      setFormData(updatedProfile);
      onUpdateInstitute(updatedProfile);
      setFeedbackText(`Cadastro de ${name} removido com sucesso.`);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  // Helper para renderizar tabela de membros de uma categoria
  const renderMembersTable = (
    title: string,
    subtitle: string,
    category: GovernanceMember['category'],
    defaultCertRequired: string,
    defaultRole: string,
    legalRequirementText: string
  ) => {
    const categoryMembers = membersList.filter(m => m.category === category);

    return (
      <div className="space-y-5">
        {/* Top Header da Categoria */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                Instituto • Governança RPPS
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {title}
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              {subtitle}
            </p>
          </div>

          <button
            onClick={() => openAddMemberModal(category, defaultCertRequired, defaultRole)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm transition-all self-start sm:self-auto shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Cadastrar Membro</span>
          </button>
        </div>

        {/* Alerta de Exigência Legal da Certificação */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-xs text-blue-900 flex items-start gap-3">
          <Award className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-blue-950 mb-0.5">Certificação Fiduciária Obrigatória:</span>
            <p className="text-blue-800">{legalRequirementText}</p>
          </div>
        </div>

        {/* Tabela de Membros Cadastrados */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Membros Homologados ({categoryMembers.length})
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Dados extraídos do CADPREV / DAIR e certificados oficiais
            </span>
          </div>

          {categoryMembers.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              Nenhum membro cadastrado nesta categoria. Clique no botão acima para adicionar.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Nome / CPF</th>
                    <th className="py-3 px-3">Cargo / Função</th>
                    <th className="py-3 px-4">Certificação Possuída</th>
                    <th className="py-3 px-3 text-center">Validade do Certificado</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {categoryMembers.map(m => (
                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{m.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">CPF: {m.cpf}</div>
                        {m.email && <div className="text-[10px] text-slate-400">{m.email}</div>}
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="text-slate-800 font-semibold">{m.role}</span>
                        <div className="text-[10px] text-slate-400">Desde: {m.startDate}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-blue-900 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{m.certificationAcquired}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Exigido: {m.certificationRequired}
                        </div>
                        {m.certificationNumber && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            Reg: {m.certificationNumber}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-center font-mono text-xs font-semibold text-slate-800">
                        {m.certificationValidity}
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                          m.certificationStatus === 'VIGENTE'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : m.certificationStatus === 'A_VENCER'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{m.certificationStatus}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => openEditMemberModal(m)}
                            className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar dados e certificação"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMember(m.id, m.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Excluir membro"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal de Cadastro / Edição */}
        {showMemberModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
              <div className="bg-[#0b1626] text-white p-5 flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <Award className="w-5 h-5 text-teal-400" />
                  <h3 className="font-bold text-sm">
                    {editingMemberId ? 'Editar Membro & Certificação' : 'Cadastrar Membro na Governança'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMemberModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nome Completo *</label>
                    <input
                      type="text"
                      required
                      value={memberName}
                      onChange={e => setMemberName(e.target.value)}
                      placeholder="Ex: Jansen de Pinho e Silva"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">CPF *</label>
                    <input
                      type="text"
                      required
                      value={memberCpf}
                      onChange={e => setMemberCpf(e.target.value)}
                      placeholder="000.000.000-00"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Cargo / Função *</label>
                    <input
                      type="text"
                      value={memberRole}
                      onChange={e => setMemberRole(e.target.value)}
                      placeholder="Ex: Membro Titular"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Início do Mandato</label>
                    <input
                      type="text"
                      value={memberStartDate}
                      onChange={e => setMemberStartDate(e.target.value)}
                      placeholder="DD/MM/AAAA"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Fim do Mandato</label>
                    <input
                      type="text"
                      value={memberTermEnd}
                      onChange={e => setMemberTermEnd(e.target.value)}
                      placeholder="DD/MM/AAAA"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block mb-2">
                    Certificação Profissional Vinculada
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Certificação Exigida por Lei</label>
                      <input
                        type="text"
                        value={memberCertRequired}
                        onChange={e => setMemberCertRequired(e.target.value)}
                        placeholder="Ex: CP RPPS CGINV I"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium focus:ring-1 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Certificação Possuída</label>
                      <input
                        type="text"
                        value={memberCertAcquired}
                        onChange={e => setMemberCertAcquired(e.target.value)}
                        placeholder="Ex: CP RPPS CGINV I (APIMEC)"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-blue-900 focus:ring-1 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Número do Registro / Certificado</label>
                      <input
                        type="text"
                        value={memberCertNumber}
                        onChange={e => setMemberCertNumber(e.target.value)}
                        placeholder="Ex: CGINV-2022-1940"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono focus:ring-1 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Validade do Certificado *</label>
                      <input
                        type="text"
                        value={memberCertValidity}
                        onChange={e => setMemberCertValidity(e.target.value)}
                        placeholder="DD/MM/AAAA"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono font-bold text-emerald-800 focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowMemberModal(false)}
                    className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveMember(category)}
                    className="px-4 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-sm"
                  >
                    Salvar Informações
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 shadow-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackText || 'Dados atualizados com sucesso!'}</span>
        </div>
      )}

      {/* RENDERIZAÇÃO ESPECÍFICA DO SUBMENU SELECIONADO */}
      
      {/* 1. DADOS DO INSTITUTO E DO MUNICÍPIO */}
      {currentSubTab === 'institute' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                    Dados Cadastrais Oficiais
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Dados do Instituto & Município
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Apresentação exclusiva dos dados cadastrais do Ente Federativo e da Unidade Gestora PREVI-LACERDA.
                </p>
              </div>

              <button
                type="button"
                onClick={onOpenDairUpload}
                className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold px-3.5 py-2 rounded-lg shadow-2xs transition-colors self-start sm:self-auto shrink-0"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Importar Cadastro do DAIR</span>
              </button>
            </div>

            <form onSubmit={handleSaveMainInstitute} className="space-y-5">
              {/* Seção 1: Dados do Município (Ente Federativo) */}
              <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>Ente Federativo (Município Vinculado)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Município (Ente) *</label>
                    <input
                      type="text"
                      required
                      value={formData.enteName}
                      onChange={e => setFormData({ ...formData, enteName: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">CNPJ do Ente *</label>
                    <input
                      type="text"
                      required
                      value={formData.enteCnpj}
                      onChange={e => setFormData({ ...formData, enteCnpj: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Estado (UF) *</label>
                    <input
                      type="text"
                      required
                      value={formData.uf}
                      onChange={e => setFormData({ ...formData, uf: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Representante Legal do Ente (Prefeito Municipal)</label>
                    <input
                      type="text"
                      value={formData.enteRepresentativeName}
                      onChange={e => setFormData({ ...formData, enteRepresentativeName: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">CPF do Prefeito</label>
                    <input
                      type="text"
                      value={formData.enteRepresentativeCpf}
                      onChange={e => setFormData({ ...formData, enteRepresentativeCpf: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Seção 2: Dados do Instituto (Unidade Gestora) */}
              <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Unidade Gestora Previdenciária (PREVI-LACERDA)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Razão Social / Nome da Unidade *</label>
                    <input
                      type="text"
                      required
                      value={formData.gestoraUnitName}
                      onChange={e => setFormData({ ...formData, gestoraUnitName: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">CNPJ da Unidade Gestora</label>
                    <input
                      type="text"
                      value={formData.enteCnpj}
                      readOnly
                      className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2 font-mono text-slate-600 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block font-bold text-slate-700 mb-1">Endereço Oficial da Sede</label>
                    <input
                      type="text"
                      value={formData.address || 'Av. Marechal Rondon, 522, Centro, Pontes e Lacerda/MT, CEP 78.250-000'}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Telefone Institucional</label>
                    <input
                      type="text"
                      value={formData.phone || '(65) 3266-2534'}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">E-mail Institucional</label>
                    <input
                      type="email"
                      value={formData.email || 'contato@previlacerda.mt.gov.br'}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Seção 3: Certificação Pró-Gestão */}
              <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Programa de Certificação Institucional (Pró-Gestão RPPS)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nível de Certificação Atual</label>
                    <select
                      value={formData.proGestaoLevel}
                      onChange={e => setFormData({ ...formData, proGestaoLevel: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    >
                      <option value="SEM_PRO_GESTAO">Sem Pró-Gestão (Prazo de Adequação: 31/12/2026)</option>
                      <option value="NIVEL_I">Pró-Gestão Nível I</option>
                      <option value="NIVEL_II">Pró-Gestão Nível II</option>
                      <option value="NIVEL_III">Pró-Gestão Nível III</option>
                      <option value="NIVEL_IV">Pró-Gestão Nível IV</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Prazo de Adequação / Validade</label>
                    <input
                      type="text"
                      value={formData.proGestaoDeadline || '31/12/2026'}
                      onChange={e => setFormData({ ...formData, proGestaoDeadline: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-sm transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Dados do Instituto & Município</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. GESTOR DO RPPS */}
      {currentSubTab === 'institute_gestor_rpps' && renderMembersTable(
        'Gestor do RPPS',
        'Cadastro do dirigente máximo responsável pela unidade gestora do Regime Próprio.',
        'GESTOR_RPPS',
        'CP RPPS CDIR I (Portaria MTP nº 1.467/2022)',
        'Gestor Titular do RPPS',
        'O Gestor do RPPS deve comprovar Certificação Profissional para Dirigentes de RPPS (CP RPPS CDIR I, II ou III).'
      )}

      {/* 3. PRESIDENTE DO INSTITUTO */}
      {currentSubTab === 'institute_presidente' && renderMembersTable(
        'Presidente do Instituto',
        'Cadastro da Presidência do Instituto PREVI-LACERDA.',
        'PRESIDENTE_INSTITUTO',
        'CP RPPS CDIR I / Gestão Superior de RPPS',
        'Presidente do Instituto',
        'O Presidente do Instituto deve possuir certificação profissional de Dirigente de Unidade Gestora de RPPS válida.'
      )}

      {/* 4. GESTOR DE RECURSOS */}
      {currentSubTab === 'institute_gestor_recursos' && renderMembersTable(
        'Gestor de Recursos',
        'Responsável técnico fiduciário pela gestão e alocação da carteira de investimentos do RPPS.',
        'GESTOR_RECURSOS',
        'CP RPPS CGINV I / CGRPPS (Resolução CMN nº 5.272/2025)',
        'Gestor Oficial de Recursos Fiduciários',
        'A Resolução CMN nº 5.272/2025 e Portaria MTP nº 1.467/2022 exigem certificação profissional específica de Gestão de Recursos (CP RPPS CGINV ou CGRPPS / CGA).'
      )}

      {/* 5. MEMBROS DO COMITÊ DE INVESTIMENTOS */}
      {currentSubTab === 'institute_comite' && renderMembersTable(
        'Membros do Comitê de Investimentos',
        'Colegiado fiduciário responsável pela análise técnica, deliberações e propostas de alocação da carteira de investimentos.',
        'COMITE_INVESTIMENTOS',
        'CP RPPS CGINV I (Certificação de Investimentos)',
        'Membro do Comitê de Investimentos',
        'A Resolução CMN nº 5.272/2025 exige que a maioria dos membros do Comitê de Investimentos possua Certificação Profissional CP RPPS CGINV I (ou superior).'
      )}

      {/* 6. MEMBROS DO CONSELHO DELIBERATIVO */}
      {currentSubTab === 'institute_deliberativo' && renderMembersTable(
        'Membros do Conselho Deliberativo',
        'Órgão colegiado superior de deliberação e fixação das diretrizes gerais do PREVI-LACERDA.',
        'CONSELHO_DELIBERATIVO',
        'CP RPPS Conselheiro I (Portaria MTP nº 1.467/2022)',
        'Conselheiro Titular',
        'Conforme a Portaria MTP nº 1.467/2022, os membros do Conselho Deliberativo devem possuir Certificação Profissional para Conselheiros de RPPS.'
      )}

      {/* 7. MEMBROS DO CONSELHO FISCAL */}
      {currentSubTab === 'institute_fiscal' && renderMembersTable(
        'Membros do Conselho Fiscal',
        'Órgão permanente de controle interno e fiscalização financeira, contábil e fiduciária do RPPS.',
        'CONSELHO_FISCAL',
        'CP RPPS CCF I (Conselho Fiscal RPPS)',
        'Membro do Conselho Fiscal',
        'Os conselheiros fiscais devem comprovar aprovação em exame de Certificação Profissional para Membros de Conselho Fiscal de RPPS (CP RPPS CCF).'
      )}

      {/* 8. DIRETOR EXECUTIVO */}
      {currentSubTab === 'institute_diretor_executivo' && renderMembersTable(
        'Diretor Executivo',
        'Diretoria Executiva da Unidade Gestora responsável pelos atos de gestão administrativa e fiduciária.',
        'DIRETOR_EXECUTIVO',
        'CP RPPS CDIR I (Dirigente RPPS)',
        'Diretor Executivo da Unidade Gestora',
        'A Diretoria Executiva deve possuir Certificação Profissional de Dirigente (CP RPPS CDIR I).'
      )}

    </div>
  );
};
