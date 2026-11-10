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
  FileText,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Database
} from 'lucide-react';
import { Asset, AssetMetrics } from '../types';
import { api } from '../services/api';
import { analyzedFundsRepository } from '../services/analyzedFundsRepository';

interface AssetComparatorProps {
  allAssets: Asset[];
  initialSelectedIds?: string[];
  studiedAsset?: Asset | null;
  onOpenReport: (assetId: string) => void;
}

export const AssetComparator: React.FC<AssetComparatorProps> = ({
  allAssets,
  initialSelectedIds,
  studiedAsset,
  onOpenReport
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    initialSelectedIds && initialSelectedIds.length >= 2
      ? initialSelectedIds
      : [allAssets[0]?.id || '', allAssets[1]?.id || '']
  );

  const [comparedMetrics, setComparedMetrics] = useState<AssetMetrics[]>([]);
  const [loading, setLoading] = useState(false);

  // Sincroniza quando os IDs selecionados iniciais mudarem (ex: vindo do Analisador de Fundos)
  useEffect(() => {
    if (initialSelectedIds && initialSelectedIds.length >= 2) {
      setSelectedIds(initialSelectedIds);
    }
  }, [initialSelectedIds]);

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
    if (!val || isNaN(val)) return 'R$ 0,00';
    if (val >= 1_000_000_000) {
      return `R$ ${(val / 1_000_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bi`;
    }
    return `R$ ${(val / 1_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} M`;
  };

  const studiedRepoList = analyzedFundsRepository.getAll();
  const studiedAssetsInComparison = comparedMetrics.filter(m => 
    m.assetId.startsWith('studied_') || (studiedAsset && m.assetId === studiedAsset.id)
  );

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* BANNER INFORMATIVO SE HOUVER ATIVO EM ESTUDO SENDO COMPARADO COM A CARTEIRA */}
      {studiedAssetsInComparison.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 via-indigo-50/60 to-purple-50 border-2 border-purple-300 rounded-2xl p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-purple-200 text-purple-900 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Database className="w-3 h-3 text-purple-700" />
                  Ativo em Estudo vs. Carteira Oficial
                </span>
                <span className="text-[10px] font-bold text-slate-500 bg-white/80 border border-slate-200 px-2 py-0.5 rounded-full">
                  Resolução CMN nº 5.272/2025 • Portaria MTP nº 1.467/2022
                </span>
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Comparação Técnica por Classe e Artigo Regulamentar
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed max-w-3xl">
                Você está comparando o ativo candidato{' '}
                <strong className="text-purple-950 font-black">
                  {studiedAssetsInComparison.map(s => s.tradingName).join(', ')}
                </strong>{' '}
                com os ativos oficiais da carteira do PREVI-LACERDA de mesma classe e/ou artigo da Resolução CMN nº 5.272/2025.
                <span className="block mt-1 font-semibold text-purple-900">
                  * Regra de Isolamento: Este ativo <u>NÃO foi salvo na carteira oficial</u>. Ele pertence exclusivamente ao <strong>Repositório de Fundos Estudados</strong> para análises e pareceres do Comitê de Investimentos.
                </span>
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="text-[11px] font-extrabold text-purple-900 bg-white px-3 py-1.5 rounded-xl border border-purple-200 shadow-2xs flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              Repositório Isolado
            </span>
          </div>
        </div>
      )}

      {/* Header do Comparador */}
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
              Compare rentabilidade histórica, volatilidade, índice Sharpe e custos fiduciários lado a lado.
            </p>
          </div>

          {/* Adicionar Fundo Selector com Optgroups (Oficiais vs Estudados) */}
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
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-lg px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
            >
              <option value="">+ Selecionar outro fundo...</option>
              
              <optgroup label="── CARTEIRA OFICIAL PREVI-LACERDA ──">
                {allAssets
                  .filter(a => !selectedIds.includes(a.id))
                  .map(a => (
                    <option key={a.id} value={a.id}>
                      {a.trading_name} ({a.asset_class.replace('_', ' ')})
                    </option>
                  ))}
              </optgroup>

              {studiedRepoList.length > 0 && (
                <optgroup label="── FUNDOS EM ESTUDO (REPOSITÓRIO) ──">
                  {studiedRepoList
                    .filter(s => !selectedIds.includes(s.id))
                    .map(s => (
                      <option key={s.id} value={s.id}>
                        [EM ESTUDO] {s.tradingName} ({s.articleCode})
                      </option>
                    ))}
                </optgroup>
              )}
            </select>
          </div>
        </div>

        {/* Chips de Ativos Selecionados */}
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <span className="text-xs text-slate-400 font-bold uppercase mr-1">Comparando ({selectedIds.length}/4):</span>
          {comparedMetrics.map((m, idx) => {
            const isStudied = m.assetId.startsWith('studied_') || (studiedAsset && m.assetId === studiedAsset.id);
            return (
              <div
                key={m.assetId}
                className={`inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full font-bold border transition-colors ${
                  isStudied 
                    ? 'bg-purple-50 text-purple-900 border-purple-300 shadow-2xs' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${
                  isStudied ? 'bg-purple-600' :
                  idx === 0 ? 'bg-teal-600' : idx === 1 ? 'bg-sky-600' : idx === 2 ? 'bg-amber-600' : 'bg-indigo-600'
                }`}></span>
                <span>{m.tradingName}</span>
                {isStudied && (
                  <span className="text-[9px] bg-purple-200 text-purple-900 px-1.5 py-0.2 rounded font-extrabold uppercase">
                    Em Estudo
                  </span>
                )}
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
            );
          })}
        </div>
      </div>

      {/* Cards Comparativos Principais (Lado a Lado) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {comparedMetrics.map((m, idx) => {
          const isStudied = m.assetId.startsWith('studied_') || (studiedAsset && m.assetId === studiedAsset.id);
          const colorBorder = isStudied 
            ? 'border-purple-600' 
            : idx === 0 ? 'border-teal-500' : idx === 1 ? 'border-sky-500' : idx === 2 ? 'border-amber-500' : 'border-indigo-500';
          const badgeBg = isStudied
            ? 'bg-purple-100 text-purple-900 border border-purple-300'
            : idx === 0 ? 'bg-teal-50 text-teal-700' : idx === 1 ? 'bg-sky-50 text-sky-700' : idx === 2 ? 'bg-amber-50 text-amber-700' : 'bg-indigo-50 text-indigo-700';

          return (
            <div 
              key={m.assetId} 
              className={`bg-white rounded-xl p-5 border-t-4 ${colorBorder} border-x border-b border-slate-200 shadow-sm relative flex flex-col justify-between ${
                isStudied ? 'ring-2 ring-purple-400/30 bg-purple-50/10' : ''
              }`}
            >
              <div>
                <div className="flex justify-between items-start gap-2">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded flex items-center gap-1 ${badgeBg}`}>
                    {isStudied && <Sparkles className="w-3 h-3 text-purple-600" />}
                    {isStudied ? `Ativo ${idx + 1} (Em Estudo)` : `Ativo ${idx + 1} (Oficial)`}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isStudied ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {m.assetClass.replace('_', ' ')}
                  </span>
                </div>

                <h2 className="text-base font-extrabold text-slate-900 mt-2 line-clamp-1" title={m.tradingName}>
                  {m.tradingName}
                </h2>
                <div className="text-[11px] text-slate-400 font-medium">CNPJ: {m.cnpj}</div>

                {isStudied ? (
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-800 border border-purple-200 rounded text-[10px] font-extrabold">
                    <span>{m.cmnRegulation?.articleCode || 'Res. CMN 5.272/2025'}</span>
                  </div>
                ) : (
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-semibold">
                    <span>DAIR PREVI-LACERDA</span>
                  </div>
                )}

                {/* Destaque: Retorno 12M */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-end">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Rentabilidade 12M</div>
                    <div className="text-2xl font-black text-slate-900 mt-0.5">
                      {m.returns.twelveMonths.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-400">% do CDI</div>
                    <div className="text-sm font-extrabold text-teal-700">
                      {m.benchmarkComparisonTwelveMonths.pctOfCdi.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
                    </div>
                  </div>
                </div>

                {/* Linha adicional com PL e Volatilidade */}
                <div className="mt-3 pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">PATRIMÔNIO</span>
                    <strong className="text-slate-800 text-[11px]">{formatCurrencyM(m.currentNetEquity)}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-semibold">VOLATILIDADE</span>
                    <strong className="text-slate-800 text-[11px]">{m.volatilityTwelveMonths}%</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2">
                <button
                  onClick={() => onOpenReport(m.assetId)}
                  className={`w-full text-center text-xs font-bold py-1.5 rounded-lg border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    isStudied 
                      ? 'bg-purple-50 hover:bg-purple-100 text-purple-900 border-purple-200'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <FileText className={`w-3.5 h-3.5 ${isStudied ? 'text-purple-600' : 'text-teal-600'}`} />
                  <span>{isStudied ? 'Ver Parecer do Comitê' : 'Gerar One-Page Report'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gráfico Comparativo Normalizado (Base 100) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Evolução Comparativa da Cota (Base 100)</h2>
            <p className="text-xs text-slate-500">Desempenho histórico relativo dos ativos selecionados vs. CDI acumulado.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-t-2 border-dashed border-slate-400"></span>
              <span className="text-slate-500">CDI (10,75%)</span>
            </span>
            {comparedMetrics.map((m, idx) => {
              const dotColor = idx === 0 ? 'bg-teal-600' : idx === 1 ? 'bg-sky-600' : idx === 2 ? 'bg-amber-600' : 'bg-purple-600';
              return (
                <span key={m.assetId} className="flex items-center gap-1.5">
                  <span className={`w-3 h-3 rounded-full ${dotColor}`}></span>
                  <span className="text-slate-700">{m.tradingName}</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Gráfico Dinâmico SVG baseado no Retorno Real de Cada Ativo */}
        <div className="h-56 bg-slate-50/60 rounded-xl border border-slate-200 p-4 flex flex-col justify-between">
          <div className="flex justify-between text-[11px] text-slate-500 font-semibold border-b border-slate-200/60 pb-1.5">
            <span>Base 100 (Início)</span>
            <span>1º Trimestre</span>
            <span>Semestre</span>
            <span>3º Trimestre</span>
            <span>Atual (12M)</span>
          </div>

          <div className="relative h-36 flex items-center">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
              {/* Linha Guia Horizontal Base 100 */}
              <line x1="0" y1="45" x2="100" y2="45" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="2 2" />

              {/* Linha Referência CDI (10.75%) */}
              <path
                d="M 0 45 Q 25 41, 50 35 T 75 29 T 100 23"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="3 2"
              />

              {/* Curvas Dinâmicas dos Ativos */}
              {comparedMetrics.map((m, idx) => {
                const strokeColor = idx === 0 ? '#0f766e' : idx === 1 ? '#0284c7' : idx === 2 ? '#d97706' : '#9333ea';
                const ret = m.returns.twelveMonths;
                const y0 = 45;
                const y1 = Math.max(5, 45 - (ret * 0.25 * 1.5));
                const y2 = Math.max(5, 45 - (ret * 0.50 * 1.5));
                const y3 = Math.max(5, 45 - (ret * 0.75 * 1.5));
                const y4 = Math.max(5, 45 - (ret * 1.00 * 1.5));

                return (
                  <g key={m.assetId}>
                    <path
                      d={`M 0 ${y0.toFixed(1)} Q 25 ${y1.toFixed(1)}, 50 ${y2.toFixed(1)} T 75 ${y3.toFixed(1)} T 100 ${y4.toFixed(1)}`}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="2.5"
                    />
                    <circle cx="100" cy={y4.toFixed(1)} r="2.5" fill={strokeColor} />
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
            <span>Mês -12</span>
            <span>Mês -9</span>
            <span>Mês -6</span>
            <span>Mês -3</span>
            <span>Mês Atual</span>
          </div>
        </div>
      </div>

      {/* Tabela de Indicadores Fundamentalistas Comparativa */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-teal-400" />
            <h2 className="text-base font-bold">Matriz de Indicadores Fundamentalistas</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">ArgosPrevi Benchmarking Engine</span>
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
                  Taxas, Liquidez, Regulação & Status
                </td>
              </tr>
              <tr>
                <td className="py-3 px-5 text-slate-600 font-semibold">Origem e Status Fiduciário</td>
                {comparedMetrics.map(m => {
                  const isStudied = m.assetId.startsWith('studied_') || (studiedAsset && m.assetId === studiedAsset.id);
                  return (
                    <td key={m.assetId} className="py-3 px-4 text-center">
                      {isStudied ? (
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-purple-100 text-purple-900 border border-purple-300 inline-block shadow-2xs">
                          EM ESTUDO (REPOSITÓRIO)
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 inline-block">
                          CARTEIRA OFICIAL
                        </span>
                      )}
                    </td>
                  );
                })}
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
                <td className="py-3 px-5 text-slate-600">Enquadramento Res. CMN nº 5.272/2025</td>
                {comparedMetrics.map(m => {
                  const isStudied = m.assetId.startsWith('studied_') || (studiedAsset && m.assetId === studiedAsset.id);
                  return (
                    <td key={m.assetId} className="py-3 px-4 text-center">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded border inline-block ${
                        isStudied 
                          ? 'text-purple-900 bg-purple-50 border-purple-200'
                          : 'text-teal-800 bg-teal-50 border-teal-200'
                      }`}>
                        {m.cmnRegulation ? m.cmnRegulation.articleCode : 'Art. 7º'}
                      </span>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
