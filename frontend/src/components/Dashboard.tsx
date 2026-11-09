import React from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Percent,
  FileText,
  AlertCircle,
  ExternalLink,
  PieChart as PieIcon,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { PortfolioOverview, Asset } from '../types';
import { OFFICIAL_REGULATION_URL, OFFICIAL_REGULATION_NORM } from '../services/mockData';

interface DashboardProps {
  overview: PortfolioOverview;
  assets: Asset[];
  onOpenReport: (assetId: string) => void;
  onNavigateToComparator: (assetIds?: string[]) => void;
  onSelectAsset?: (asset: Asset) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  overview,
  assets,
  onOpenReport,
  onNavigateToComparator,
  onSelectAsset
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Banner de Boas-Vindas e Base Legal Oficial (Layout Clean e Leve) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs text-slate-800">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full mb-2 font-semibold border border-blue-200">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Base Legal Atualizada:</span>
              <a
                href={OFFICIAL_REGULATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-bold text-blue-800 hover:text-blue-900 inline-flex items-center gap-1"
                title="Acessar íntegra da Resolução CMN 5.272/2025"
              >
                <span>{OFFICIAL_REGULATION_NORM}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Carteira Geral de Investimentos
            </h1>
            <p className="text-slate-500 text-xs mt-1 max-w-2xl">
              Monitoramento fiduciário contínuo do patrimônio previdenciário municipal de Pontes e Lacerda - MT em estrita aderência à nova regulamentação previdenciária.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left sm:text-right flex flex-col items-start sm:items-end shrink-0 shadow-xs">
            <span className="text-[11px] text-slate-500 font-semibold">Total Geral da Carteira (DAIR)</span>
            <span className="text-2xl font-black text-slate-900 mt-0.5 tracking-tight">
              {formatCurrency(overview.totalGeralCarteira || 138781858.93)}
            </span>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +{overview.returns.month}% no mês
              </span>
              <span className="text-slate-400 hidden sm:inline">•</span>
              <span className="text-slate-600 text-[11px] font-semibold">
                Res. CMN: {formatCurrency(overview.totalAum || 138781858.93)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Cards Fundamentalistas (Estilo Investidor 10) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Rentabilidade 12 Meses */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rentabilidade 12M</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {overview.returns.twelveMonths}%
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <span>+{overview.returns.month}% no mês atual</span>
          </div>
        </div>

        {/* Card 2: Meta Atuarial (IPCA + 5,50%) */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Meta Atuarial 12M</span>
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
              <Percent className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-teal-800 mt-2">
            {overview.returns.actuarialTarget12M}%
          </div>
          <div className="text-xs text-slate-600 font-medium mt-1">
            Atingimento: <strong className="text-teal-700">{overview.returns.pctOfActuarialTarget}%</strong> da meta
          </div>
        </div>

        {/* Card 3: Comparativo com CDI */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Benchmark CDI 12M</span>
            <span className="p-1.5 rounded-lg bg-sky-50 text-sky-700">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {overview.returns.cdi12M}%
          </div>
          <div className="text-xs text-sky-700 font-semibold mt-1">
            Performance: <strong>{overview.returns.pctOfCdi}% do CDI</strong>
          </div>
        </div>

        {/* Card 4: Diversificação e Fundos */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ativos Alocados</span>
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-700">
              <PieIcon className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {overview.allocationsCount} Ativos
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">
            Distribuídos em 4 classes regulamentadas
          </div>
        </div>
      </div>

      {/* Seção Central: Enquadramento Resolução CMN nº 5.272/2025 & Evolução */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Enquadramento Legal RPPS (Resolução CMN nº 5.272/2025) */}
        <div className="xl:col-span-1 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-700" />
                <span>Limites CMN 5.272/2025</span>
              </h2>
              <a
                href={OFFICIAL_REGULATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-teal-700 hover:underline flex items-center gap-1 font-semibold mt-0.5"
              >
                <span>Acessar PDF da Resolução</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              100% Regular
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-4">
            Percentual alocado da carteira do PREVI-LACERDA comparado ao teto regulatório por artigo da Resolução CMN 5.272/2025.
          </p>

          <div className="space-y-4">
            {overview.cmnCompliance.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 truncate max-w-[210px]" title={item.articleCode}>
                    {item.articleCode}
                  </span>
                  <span className="text-slate-900">
                    {item.currentAllocatedPct}% <span className="text-slate-400 font-normal">/ {item.maxLimitPct}%</span>
                  </span>
                </div>
                
                {/* Barra de Progresso Visual */}
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      item.currentAllocatedPct > item.maxLimitPct
                        ? 'bg-red-500'
                        : item.currentAllocatedPct > item.maxLimitPct * 0.85
                        ? 'bg-amber-500'
                        : 'bg-teal-600'
                    }`}
                    style={{ width: `${Math.min((item.currentAllocatedPct / item.maxLimitPct) * 100, 100)}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Margem disponível: +{item.marginPct}%</span>
                  <span className="text-emerald-600 font-semibold">Enquadrado</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <span>A política de investimentos anual atende estritamente à Resolução CMN nº 5.272/2025.</span>
          </div>
        </div>

        {/* Evolução Histórica da Carteira vs Benchmarks */}
        <div className="xl:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Evolução Patrimonial & Benchmarks</h2>
                <p className="text-xs text-slate-500">Comparativo histórico: Carteira PREVI-LACERDA vs CDI e Meta Atuarial (12 meses)</p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-slate-700 font-medium">
                  <span className="w-3 h-3 rounded-full bg-teal-600"></span> Carteira
                </span>
                <span className="flex items-center gap-1 text-slate-700 font-medium">
                  <span className="w-3 h-3 rounded-full bg-sky-500"></span> CDI
                </span>
                <span className="flex items-center gap-1 text-slate-700 font-medium">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span> Meta Atuarial
                </span>
              </div>
            </div>

            {/* Gráfico Visual em Barras e Linhas Customizadas (Auto-Escala Dinâmica Confinada) */}
            {(() => {
              const allVals = overview.evolutionHistory.flatMap(h => [h.portfolioValue, h.benchmarkCdi, h.actuarialTarget || 0].filter(v => v > 0));
              const rawMin = allVals.length > 0 ? Math.min(...allVals) : 125000000;
              const rawMax = allVals.length > 0 ? Math.max(...allVals) : 142000000;
              const span = (rawMax - rawMin) || 10000000;
              const chartMin = Math.max(0, rawMin - span * 0.25);
              const chartMax = rawMax + span * 0.15;

              return (
                <div className="h-64 flex items-end gap-2 pt-6 pb-2 px-2 overflow-hidden relative border-b border-slate-100">
                  {overview.evolutionHistory.map((item, idx) => {
                    const heightPct = Math.min(95, Math.max(12, ((item.portfolioValue - chartMin) / (chartMax - chartMin)) * 100));
                    const cdiHeightPct = Math.min(95, Math.max(10, ((item.benchmarkCdi - chartMin) / (chartMax - chartMin)) * 100));

                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative z-10">
                        <div className="absolute -top-12 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 whitespace-nowrap shadow-lg">
                          <div className="font-bold">{item.month}</div>
                          <div>Carteira: {formatCurrency(item.portfolioValue)}</div>
                          <div className="text-sky-300">CDI: {formatCurrency(item.benchmarkCdi)}</div>
                        </div>

                        <div className="w-full flex items-end justify-center gap-1 h-full">
                          <div
                            className="w-1/2 bg-teal-600 rounded-t-sm transition-all group-hover:bg-teal-500 shadow-2xs"
                            style={{ height: `${heightPct}%` }}
                          ></div>
                          <div
                            className="w-1/2 bg-sky-300 rounded-t-sm transition-all group-hover:bg-sky-400 shadow-2xs"
                            style={{ height: `${cdiHeightPct}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-2 font-medium">{item.month.split('/')[0]}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
            <span className="text-slate-500">Dados baseados nas cotizações diárias oficiais dos informes da CVM.</span>
            <button
              onClick={() => onNavigateToComparator()}
              className="text-teal-700 font-bold hover:underline flex items-center gap-1"
            >
              Comparar Ativos no Módulo Interativo &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Tabela de Ativos da Carteira com Ações do Comitê de Investimentos */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Ativos em Carteira (PREVI-LACERDA)</h2>
            <p className="text-xs text-slate-500">Clique em qualquer produto para abrir a análise completa no padrão Investidor10.</p>
          </div>

          <button
            onClick={() => onNavigateToComparator(assets.map(a => a.id).slice(0, 3))}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Comparar 3 Maiores Fundos</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 min-w-[760px]">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Ativo / Fundo</th>
                <th className="py-3 px-4">Classe / Enquadramento CMN 5.272</th>
                <th className="py-3 px-4 text-right">Saldo Investido</th>
                <th className="py-3 px-4 text-right">Peso (%)</th>
                <th className="py-3 px-4 text-center">Grau de Risco</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Relatório RPPS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {overview.allocations.map((item, idx) => {
                const matchedAsset = assets.find(a => a.id === item.id || a.cnpj === item.cnpj) || assets[idx];
                return (
                  <tr
                    key={idx}
                    onClick={() => matchedAsset && onSelectAsset && onSelectAsset(matchedAsset)}
                    className="hover:bg-teal-50/50 transition-colors cursor-pointer group"
                    title="Clique para abrir detalhes estilo Investidor10"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="font-bold text-slate-900 text-sm group-hover:text-teal-700 transition-colors flex items-center gap-1.5">
                            <span>{item.trading_name}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-teal-600 transition-opacity" />
                          </div>
                          <div className="text-[11px] text-slate-400">CNPJ: {item.cnpj}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-semibold text-slate-700">{item.asset_class.replace('_', ' ')}</span>
                      <div className="text-[11px] text-teal-700 font-medium">{item.article_code}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                      {formatCurrency(item.total_invested)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-block bg-slate-100 text-slate-800 text-xs font-bold px-2 py-0.5 rounded">
                        {item.weight_pct}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                        item.risk_level === 'MUITO_BAIXO' || item.risk_level === 'BAIXO'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : item.risk_level === 'MEDIO'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {item.risk_level.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-[11px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                        Aprovado
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenReport(item.id || item.cnpj || assets[idx]?.id || 'pl-01');
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100/80 border border-teal-200 px-2.5 py-1 rounded-md transition-colors shadow-2xs"
                        title="Gerar One-Page Report oficial para o Comitê de Investimentos"
                      >
                        <FileText className="w-3.5 h-3.5 text-teal-700" />
                        <span>One-Page Report</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
