import React, { useState, useMemo } from 'react';
import { 
  Briefcase, 
  Search, 
  Filter, 
  ArrowUpDown, 
  ExternalLink, 
  FileText, 
  Layers, 
  TrendingUp, 
  ShieldCheck, 
  Building2, 
  Copy, 
  Check, 
  Download, 
  UploadCloud,
  ChevronRight,
  PieChart
} from 'lucide-react';
import { Asset, AssetClass, RiskLevel } from '../types';
import { OFFICIAL_REGULATION_URL, OFFICIAL_REGULATION_NORM } from '../services/mockData';

interface ActivePortfolioViewProps {
  assets: Asset[];
  onOpenReport: (assetId: string) => void;
  onNavigateToComparator: (assetIds?: string[]) => void;
  onOpenDairUpload: () => void;
}

export const ActivePortfolioView: React.FC<ActivePortfolioViewProps> = ({
  assets,
  onOpenReport,
  onNavigateToComparator,
  onOpenDairUpload
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'weight' | 'balance' | 'return' | 'name'>('weight');
  const [copiedCnpj, setCopiedCnpj] = useState<string | null>(null);

  const formatCurrency = (val?: number) => {
    if (val === undefined || isNaN(val)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleCopy = (cnpj: string) => {
    navigator.clipboard.writeText(cnpj);
    setCopiedCnpj(cnpj);
    setTimeout(() => setCopiedCnpj(null), 2000);
  };

  // Totals calculations
  const totalBalance = useMemo(() => {
    return assets.reduce((acc, a) => acc + (a.total_invested || 0), 0);
  }, [assets]);

  // Filtered & Sorted Assets
  const filteredAssets = useMemo(() => {
    return assets
      .filter(asset => {
        const matchesSearch = 
          asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.trading_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.cnpj.includes(searchTerm) ||
          asset.administrator.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (asset.article_code && asset.article_code.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesClass = selectedClass === 'ALL' || asset.asset_class === selectedClass;
        const matchesRisk = selectedRisk === 'ALL' || asset.risk_level === selectedRisk;

        return matchesSearch && matchesClass && matchesRisk;
      })
      .sort((a, b) => {
        if (sortBy === 'weight') return (b.weight_pct || 0) - (a.weight_pct || 0);
        if (sortBy === 'balance') return (b.total_invested || 0) - (a.total_invested || 0);
        if (sortBy === 'return') return (b.monthly_return_pct || 0) - (a.monthly_return_pct || 0);
        if (sortBy === 'name') return a.trading_name.localeCompare(b.trading_name);
        return 0;
      });
  }, [assets, searchTerm, selectedClass, selectedRisk, sortBy]);

  const getClassBadge = (cls: AssetClass) => {
    switch (cls) {
      case 'RENDA_FIXA':
        return { label: 'Renda Fixa', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'RENDA_VARIAVEL':
        return { label: 'Renda Variável', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'MULTIMERCADO':
        return { label: 'Multimercado', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'INVESTIMENTO_EXTERIOR':
        return { label: 'Exterior', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'EMPRESTIMOS_CONSIGNADOS':
        return { label: 'Consignados', color: 'bg-teal-50 text-teal-700 border-teal-200' };
      default:
        return { label: cls, color: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'MUITO_BAIXO':
      case 'BAIXO':
        return { label: 'Baixo Risco', color: 'bg-emerald-100 text-emerald-800' };
      case 'MEDIO':
        return { label: 'Médio Risco', color: 'bg-amber-100 text-amber-800' };
      case 'ALTO':
      case 'MUITO_ALTO':
        return { label: 'Alto Risco', color: 'bg-rose-100 text-rose-800' };
      default:
        return { label: risk, color: 'bg-slate-100 text-slate-800' };
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner da Carteira Ativa */}
      <div className="bg-gradient-to-r from-[#0b1626] via-slate-900 to-[#0b1626] border border-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-blue-600/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-900/60 text-blue-300 border border-blue-700/60 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Menu: Carteira Ativa</span>
              <span className="text-slate-400">•</span>
              <span>PREVI-LACERDA</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Produtos da Carteira Ativa
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Detalhamento de todos os fundos de investimentos, títulos e carteiras registradas com seus limites de enquadramento pela Resolução CMN nº 5.272/2025.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenDairUpload}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-emerald-600/20 transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Atualizar via DAIR</span>
            </button>
          </div>
        </div>

        {/* Resumo Numérico Rápido */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Total Alocado em Ativos:</span>
            <span className="text-lg font-black text-white">{formatCurrency(totalBalance)}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Total de Ativos Ativos:</span>
            <span className="text-lg font-black text-blue-400">{assets.length} Produtos</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Enquadramento CMN:</span>
            <span className="text-lg font-black text-emerald-400">100% Regular</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Competência Vigente:</span>
            <span className="text-lg font-black text-slate-200">09/2026 (DAIR)</span>
          </div>
        </div>
      </div>

      {/* Barra de Filtros e Pesquisa */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Campo de Pesquisa */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por nome do ativo, CNPJ, administrador ou artigo CMN..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
            />
          </div>

          {/* Filtro por Classe */}
          <div className="w-full md:w-52">
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="ALL">Todas as Classes</option>
              <option value="RENDA_FIXA">Renda Fixa</option>
              <option value="RENDA_VARIAVEL">Renda Variável</option>
              <option value="MULTIMERCADO">Multimercado</option>
              <option value="INVESTIMENTO_EXTERIOR">Investimento no Exterior</option>
              <option value="EMPRESTIMOS_CONSIGNADOS">Empréstimos Consignados</option>
            </select>
          </div>

          {/* Filtro por Risco */}
          <div className="w-full md:w-44">
            <select
              value={selectedRisk}
              onChange={e => setSelectedRisk(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="ALL">Todos os Riscos</option>
              <option value="BAIXO">Baixo Risco</option>
              <option value="MEDIO">Médio Risco</option>
              <option value="ALTO">Alto Risco</option>
            </select>
          </div>

          {/* Ordenação */}
          <div className="w-full md:w-48">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="weight">Maior % da Carteira</option>
              <option value="balance">Maior Saldo Aplicado</option>
              <option value="return">Maior Rentabilidade no Mês</option>
              <option value="name">Ordem Alfabética</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>Exibindo <strong>{filteredAssets.length}</strong> de <strong>{assets.length}</strong> produtos da carteira</span>
          <span className="text-[11px] text-slate-400">Clique em qualquer ativo para ver o relatório individual (One-Page Report)</span>
        </div>
      </div>

      {/* Tabela Principal de Ativos (Estilo Investidor10) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#0b1626] text-white text-[11px] font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Ativo / CNPJ</th>
                <th className="py-3.5 px-4">Enquadramento CMN</th>
                <th className="py-3.5 px-4">Gestor / Admin</th>
                <th className="py-3.5 px-4 text-center">Benchmark</th>
                <th className="py-3.5 px-4 text-center">Risco</th>
                <th className="py-3.5 px-4 text-right">Saldo Aplicado</th>
                <th className="py-3.5 px-4 text-right">% Carteira</th>
                <th className="py-3.5 px-4 text-right">Rentab. Mês</th>
                <th className="py-3.5 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredAssets.map(asset => {
                const classBadge = getClassBadge(asset.asset_class);
                const riskBadge = getRiskBadge(asset.risk_level);

                return (
                  <tr key={asset.id} className="hover:bg-blue-50/40 transition-colors group">
                    {/* Ativo / CNPJ */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {asset.trading_name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-normal truncate max-w-xs mt-0.5" title={asset.name}>
                        {asset.name}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {asset.cnpj}
                        </span>
                        <button
                          onClick={() => handleCopy(asset.cnpj)}
                          className="text-slate-400 hover:text-slate-600"
                          title="Copiar CNPJ"
                        >
                          {copiedCnpj === asset.cnpj ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Enquadramento CMN */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full border bg-slate-50 text-slate-800 border-slate-300">
                        {asset.article_code || 'Art. 7º'}
                      </span>
                      <div className="mt-1">
                        <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.2 rounded border ${classBadge.color}`}>
                          {classBadge.label}
                        </span>
                      </div>
                    </td>

                    {/* Gestor / Admin */}
                    <td className="py-3.5 px-4 text-[11px]">
                      <div className="font-semibold text-slate-800 truncate max-w-[180px]" title={asset.manager}>
                        {asset.manager}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[180px]" title={asset.administrator}>
                        Admin: {asset.administrator}
                      </div>
                    </td>

                    {/* Benchmark */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-bold text-xs text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        {asset.benchmark}
                      </span>
                    </td>

                    {/* Risco */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${riskBadge.color}`}>
                        {riskBadge.label}
                      </span>
                    </td>

                    {/* Saldo Aplicado */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-black text-slate-900 text-sm">
                        {formatCurrency(asset.total_invested)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Cota: {asset.latest_quota?.toFixed(6) || '1.000000'}
                      </div>
                    </td>

                    {/* % Carteira */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-extrabold text-blue-600 text-sm">
                        {asset.weight_pct ? `${asset.weight_pct.toFixed(2)}%` : '0,00%'}
                      </div>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full ml-auto mt-1 overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full" 
                          style={{ width: `${Math.min(100, (asset.weight_pct || 0) * 5)}%` }}
                        />
                      </div>
                    </td>

                    {/* Rentab. Mês */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-bold text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        +{asset.monthly_return_pct ? asset.monthly_return_pct.toFixed(2) : '1.45'}%
                      </span>
                    </td>

                    {/* Ações */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onOpenReport(asset.id)}
                          className="p-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-lg transition-colors border border-blue-200"
                          title="Gerar Relatório One-Page deste Ativo"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onNavigateToComparator([asset.id])}
                          className="p-1.5 bg-slate-50 hover:bg-slate-800 text-slate-600 hover:text-white rounded-lg transition-colors border border-slate-200"
                          title="Comparar este Ativo no Comparador de Fundos"
                        >
                          <Layers className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredAssets.length === 0 && (
          <div className="p-12 text-center text-slate-400 text-xs">
            Nenhum produto da carteira encontrado para os critérios pesquisados.
          </div>
        )}
      </div>
    </div>
  );
};
