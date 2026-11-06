import React, { useState, useEffect } from 'react';
import {
  ArrowLeftRight,
  Plus,
  X,
  TrendingUp,
  Percent,
  AlertTriangle,
  Award,
  Layers,
  FileText
} from 'lucide-react';
import { Asset, AssetMetrics } from '../types';
import { api } from '../services/api';

interface AssetComparatorProps {
  allAssets: Asset[];
  initialSelectedIds?: string[];
  onOpenReport: (assetId: string) => void;
}

export const AssetComparator: React.FC<AssetComparatorProps> = ({
  allAssets,
  initialSelectedIds,
  onOpenReport
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    initialSelectedIds && initialSelectedIds.length >= 2
      ? initialSelectedIds
      : [allAssets[0]?.id || '', allAssets[1]?.id || '']
  );

  const [comparedMetrics, setComparedMetrics] = useState<AssetMetrics[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedIds.length >= 2) {
      loadComparison();
    }
  }, [selectedIds]);

  const loadComparison = async () => {
    setLoading(true);
    try {
      const data = await api.compareAssets(selectedIds);
      setComparedMetrics(data);
    } catch (err) {
      console.error('Falha ao comparar ativos', err);
    } finally {
      setLoading(false);
    }
  };

  const addAssetToCompare = (id: string) => {
    if (!selectedIds.includes(id) && selectedIds.length < 4) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const removeAssetFromCompare = (id: string) => {
    if (selectedIds.length > 2) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    }
  };

  const formatCurrencyM = (val: number) => {
    return `R$ ${(val / 1_000_000).toFixed(1)} M`;
  };

  return (
    <div className="space-y-6">
      {/* Header do Comparador estilo Investidor10 */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-700 text-xs px-2.5 py-1 rounded-full font-bold mb-2">
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Ferramenta de Comparação Direta</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Comparador de Fundos e Ativos Financeiros
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Compare rentabilidade histórica, volatilidade, índice Sharpe e taxas lado a lado.
            </p>
          </div>

          {/* Adicionar Fundo Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Adicionar fundo:</span>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  addAssetToCompare(e.target.value);
                  e.target.value = '';
                }
              }}
              disabled={selectedIds.length >= 4}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
            >
              <option value="">+ Selecionar outro fundo...</option>
              {allAssets
                .filter(a => !selectedIds.includes(a.id))
                .map(a => (
                  <option key={a.id} value={a.id}>
                    {a.trading_name} ({a.asset_class.replace('_', ' ')})
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Chips de Ativos Selecionados */}
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <span className="text-xs text-slate-400 font-bold uppercase mr-1">Comparando ({selectedIds.length}/4):</span>
          {comparedMetrics.map((m, idx) => (
            <div
              key={m.assetId}
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs px-3 py-1.5 rounded-full font-bold border border-slate-200 transition-colors"
            >
              <span className={`w-2.5 h-2.5 rounded-full ${
                idx === 0 ? 'bg-teal-600' : idx === 1 ? 'bg-sky-600' : idx === 2 ? 'bg-amber-600' : 'bg-purple-600'
              }`}></span>
              <span>{m.tradingName}</span>
              {selectedIds.length > 2 && (
                <button
                  onClick={() => removeAssetFromCompare(m.assetId)}
                  className="text-slate-400 hover:text-slate-700 ml-1"
                  title="Remover da comparação"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Cards Comparativos Principais (Lado a Lado) */}
      <div className={`grid grid-cols-1 md:grid-cols-${comparedMetrics.length} gap-4`}>
        {comparedMetrics.map((m, idx) => {
          const colorBorder = idx === 0 ? 'border-teal-500' : idx === 1 ? 'border-sky-500' : idx === 2 ? 'border-amber-500' : 'border-purple-500';
          const badgeBg = idx === 0 ? 'bg-teal-50 text-teal-700' : idx === 1 ? 'bg-sky-50 text-sky-700' : idx === 2 ? 'bg-amber-50 text-amber-700' : 'bg-purple-50 text-purple-700';

          return (
            <div key={m.assetId} className={`bg-white rounded-xl p-5 border-t-4 ${colorBorder} border-x border-b border-slate-200 shadow-sm relative`}>
              <div className="flex justify-between items-start gap-2">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${badgeBg}`}>
                  Ativo {idx + 1}
                </span>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {m.assetClass.replace('_', ' ')}
                </span>
              </div>

              <h2 className="text-base font-extrabold text-slate-900 mt-2 line-clamp-1" title={m.tradingName}>
                {m.tradingName}
              </h2>
              <div className="text-[11px] text-slate-400 font-medium">CNPJ: {m.cnpj}</div>

              {/* Destaque Investidor 10: Retorno 12M */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-end">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Rentabilidade 12M</div>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">
                    {m.returns.twelveMonths}%
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-400">% do CDI</div>
                  <div className="text-sm font-extrabold text-teal-700">
                    {m.benchmarkComparisonTwelveMonths.pctOfCdi}%
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2">
                <button
                  onClick={() => onOpenReport(m.assetId)}
                  className="w-full text-center text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 py-1.5 rounded-lg border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-teal-600" />
                  <span>Gerar One-Page Report</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gráfico Comparativo Normalizado (Base 100) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Evolução Comparativa da Cota (Base 100)</h2>
            <p className="text-xs text-slate-500">Desempenho relativo normalizado nos últimos 120 dias para comparação precisa.</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            {comparedMetrics.map((m, idx) => (
              <span key={m.assetId} className="flex items-center gap-1.5">
                <span className={`w-3 h-3 rounded-full ${
                  idx === 0 ? 'bg-teal-600' : idx === 1 ? 'bg-sky-600' : idx === 2 ? 'bg-amber-600' : 'bg-purple-600'
                }`}></span>
                <span className="text-slate-700">{m.tradingName}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Simulação Visual do Gráfico Comparativo */}
        <div className="h-48 bg-slate-50/50 rounded-xl border border-slate-100 p-4 flex flex-col justify-between">
          <div className="flex justify-between text-[11px] text-slate-400 font-medium">
            <span>Base 100 (Início da Série)</span>
            <span>+3,5%</span>
            <span>+7,2%</span>
            <span>+11,8% (Atual)</span>
          </div>

          <div className="relative h-28 flex items-center">
            {/* Linha Fundo 1 */}
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
              <path
                d="M 0 45 Q 25 38, 50 28 T 100 12"
                fill="none"
                stroke="#0f766e"
                strokeWidth="2.5"
              />
              {/* Linha Fundo 2 */}
              <path
                d="M 0 45 Q 25 42, 50 20 T 100 8"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.5"
                strokeDasharray="4 2"
              />
              {comparedMetrics.length > 2 && (
                <path
                  d="M 0 45 Q 25 44, 50 35 T 100 22"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="2.5"
                />
              )}
            </svg>
          </div>

          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Julho</span>
            <span>Agosto</span>
            <span>Setembro</span>
            <span>Outubro</span>
            <span>Novembro / 2026</span>
          </div>
        </div>
      </div>

      {/* Tabela de Indicadores Fundamentalistas Comparativa (Investidor10 Style) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-teal-400" />
            <h2 className="text-base font-bold">Matriz de Indicadores Fundamentalistas</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">Investidor10 Benchmarking Engine</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-5 w-1/3">Indicador / Métrica</th>
                {comparedMetrics.map((m) => (
                  <th key={m.assetId} className="py-3 px-4 text-center font-extrabold text-slate-900">
                    {m.tradingName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {/* SEÇÃO RENTABILIDADE */}
              <tr className="bg-slate-50/50">
                <td colSpan={comparedMetrics.length + 1} className="py-2 px-5 text-xs font-black text-teal-800 uppercase tracking-wider">
                  Desempenho Histórico
                </td>
              </tr>
              <tr>
                <td className="py-3 px-5 text-slate-600">Rentabilidade no Mês (1M)</td>
                {comparedMetrics.map(m => (
                  <td key={m.assetId} className="py-3 px-4 text-center font-bold">
                    <span className={m.returns.oneMonth >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                      {m.returns.oneMonth}%
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-5 text-slate-600">Rentabilidade 6 Meses (6M)</td>
                {comparedMetrics.map(m => (
                  <td key={m.assetId} className="py-3 px-4 text-center font-bold text-emerald-600">
                    {m.returns.sixMonths}%
                  </td>
                ))}
              </tr>
              <tr className="bg-teal-50/30">
                <td className="py-3 px-5 font-bold text-slate-900">Rentabilidade 12 Meses (12M)</td>
                {comparedMetrics.map(m => (
                  <td key={m.assetId} className="py-3 px-4 text-center font-black text-base text-teal-800">
                    {m.returns.twelveMonths}%
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-5 text-slate-600">Rentabilidade 24 Meses (24M)</td>
                {comparedMetrics.map(m => (
                  <td key={m.assetId} className="py-3 px-4 text-center font-bold">
                    {m.returns.twentyFourMonths}%
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-5 text-slate-600">No Ano (YTD)</td>
                {comparedMetrics.map(m => (
                  <td key={m.assetId} className="py-3 px-4 text-center font-bold text-slate-900">
                    {m.returns.yearToDate}%
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-5 text-slate-600">% do CDI (12 Meses)</td>
                {comparedMetrics.map(m => (
                  <td key={m.assetId} className="py-3 px-4 text-center font-black text-sky-700">
                    {m.benchmarkComparisonTwelveMonths.pctOfCdi}%
                  </td>
                ))}
              </tr>

              {/* SEÇÃO RISCO */}
              <tr className="bg-slate-50/50">
                <td colSpan={comparedMetrics.length + 1} className="py-2 px-5 text-xs font-black text-teal-800 uppercase tracking-wider">
                  Risco, Volatilidade & Eficiência
                </td>
              </tr>
              <tr>
                <td className="py-3 px-5 text-slate-600">Volatilidade Anualizada 12M</td>
                {comparedMetrics.map(m => (
                  <td key={m.assetId} className="py-3 px-4 text-center font-bold">
                    {m.volatilityTwelveMonths}%
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-5 text-slate-600">Índice Sharpe 12M</td>
                {comparedMetrics.map(m => (
                  <td key={m.assetId} className="py-3 px-4 text-center font-extrabold text-slate-900">
                    {m.sharpeRatioTwelveMonths}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-5 text-slate-600">Queda Máxima 12M (Drawdown)</td>
                {comparedMetrics.map(m => (
                  <td key={m.assetId} className="py-3 px-4 text-center font-bold text-rose-600">
                    -{m.maxDrawdownTwelveMonths}%
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-5 text-slate-600">Classificação de Risco RPPS</td>
                {comparedMetrics.map(m => (
                  <td key={m.assetId} className="py-3 px-4 text-center">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                      {m.riskLevel.replace('_', ' ')}
                    </span>
                  </td>
                ))}
              </tr>

              {/* SEÇÃO CUSTOS & ESTRUTURA */}
              <tr className="bg-slate-50/50">
                <td colSpan={comparedMetrics.length + 1} className="py-2 px-5 text-xs font-black text-teal-800 uppercase tracking-wider">
                  Taxas, Liquidez & Porte
                </td>
              </tr>
              <tr>
                <td className="py-3 px-5 text-slate-600">Taxa de Administração</td>
                {comparedMetrics.map(m => (
                  <td key={m.assetId} className="py-3 px-4 text-center font-bold text-slate-800">
                    {m.adminFeePct}% a.a.
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-5 text-slate-600">Taxa de Performance</td>
                {comparedMetrics.map(m => (
                  <td key={m.assetId} className="py-3 px-4 text-center">
                    {m.performanceFeePct > 0 ? `${m.performanceFeePct}%` : 'Não possui'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-5 text-slate-600">Patrimônio Líquido (PL)</td>
                {comparedMetrics.map(m => (
                  <td key={m.assetId} className="py-3 px-4 text-center font-extrabold text-slate-900">
                    {formatCurrencyM(m.currentNetEquity)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-5 text-slate-600">Quantidade de Cotistas</td>
                {comparedMetrics.map(m => (
                  <td key={m.assetId} className="py-3 px-4 text-center font-medium">
                    {m.shareholdersCount.toLocaleString('pt-BR')}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-5 text-slate-600">Enquadramento CMN 4.963</td>
                {comparedMetrics.map(m => (
                  <td key={m.assetId} className="py-3 px-4 text-center">
                    <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {m.cmnRegulation ? m.cmnRegulation.articleCode : 'Artigo 7º'}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
