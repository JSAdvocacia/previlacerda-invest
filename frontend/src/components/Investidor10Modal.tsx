import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  TrendingUp, 
  Shuffle, 
  BarChart3, 
  Building2, 
  Calendar, 
  Percent, 
  Briefcase, 
  FileText, 
  Home, 
  Copy, 
  Check, 
  HelpCircle, 
  ShieldCheck, 
  ExternalLink,
  ArrowUpRight,
  Wallet
} from 'lucide-react';
import { Asset } from '../types';
import { fundDataService, FundDetails } from '../services/fundDataService';
import { OFFICIAL_REGULATION_NORM, OFFICIAL_REGULATION_URL } from '../services/mockData';

interface Investidor10ModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null;
}

export const Investidor10Modal: React.FC<Investidor10ModalProps> = ({
  isOpen,
  onClose,
  asset
}) => {
  const [activeTab, setActiveTab] = useState<'rentabilidade' | 'evolucao' | 'volatilidade' | 'sobre'>('rentabilidade');
  const [selectedPeriod, setSelectedPeriod] = useState<'1A' | '2A' | '5A' | '10A'>('2A');
  const [fundDetails, setFundDetails] = useState<FundDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedCnpj, setCopiedCnpj] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<{ date: string; assetReturn: number; cdiReturn: number } | null>(null);

  useEffect(() => {
    if (asset && isOpen) {
      setLoading(true);
      fundDataService.getFundDetails(asset)
        .then(details => {
          setFundDetails(details);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [asset, isOpen]);

  if (!isOpen || !asset) return null;

  const handleCopyCnpj = () => {
    if (asset?.cnpj) {
      navigator.clipboard.writeText(asset.cnpj);
      setCopiedCnpj(true);
      setTimeout(() => setCopiedCnpj(false), 2000);
    }
  };

  const formatPl = (val?: number) => {
    if (!val) return 'R$ 0,00 M';
    if (val >= 1_000_000_000) {
      return `R$ ${(val / 1_000_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bi`;
    }
    return `R$ ${(val / 1_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} M`;
  };

  const chartData = fundDetails?.history[selectedPeriod] || [];

  // Cálculos do gráfico SVG
  const maxReturn = Math.max(...chartData.map(d => Math.max(d.assetReturn, d.cdiReturn)), 25);
  const minReturn = Math.min(...chartData.map(d => Math.min(d.assetReturn, d.cdiReturn)), 0);
  const range = maxReturn - minReturn || 30;

  // Gerar linhas de grade
  const gridSteps = [0, 5, 10, 15, 20, 25, 30].filter(v => v <= maxReturn + 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#f8fafc] rounded-2xl max-w-5xl w-full shadow-2xl border border-slate-300 overflow-hidden my-4 max-h-[96vh] flex flex-col">
        
        {/* CABEÇALHO OFICIAL ESTILO INVESTIDOR10 (Conforme imagem enviada pelo usuário) */}
        <div className="bg-[#1a2332] text-white px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/80 shrink-0">
          <div className="flex items-center gap-3">
            {/* Ícone Carteira / Produto com borda arredondada */}
            <div className="w-12 h-12 rounded-xl bg-white text-slate-800 flex items-center justify-center shadow-md shrink-0">
              <Wallet className="w-6 h-6 text-slate-800" />
            </div>

            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-extrabold text-white tracking-wide uppercase truncate max-w-xl">
                {fundDetails?.name || asset.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs sm:text-sm font-semibold text-sky-400">
                  {fundDetails?.cnpj || asset.cnpj}
                </span>
                <button
                  onClick={handleCopyCnpj}
                  className="p-1 hover:bg-slate-700/60 rounded text-slate-400 hover:text-white transition-colors"
                  title="Copiar CNPJ"
                >
                  {copiedCnpj ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Abas Superiores estilo Investidor10 */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setActiveTab('rentabilidade')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'rentabilidade'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Rentabilidade</span>
            </button>

            <button
              onClick={() => setActiveTab('evolucao')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'evolucao'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Shuffle className="w-4 h-4" />
              <span>Evolução</span>
            </button>

            <button
              onClick={() => setActiveTab('volatilidade')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'volatilidade'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Volatilidade</span>
            </button>

            <button
              onClick={() => setActiveTab('sobre')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'sobre'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Sobre</span>
            </button>

            {/* Botão de Fechar */}
            <button
              onClick={onClose}
              className="p-2 ml-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Fechar Detalhes"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CORPO DO MODAL */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs font-bold text-slate-600">Consultando bases oficiais da CVM e Investidor10...</p>
            </div>
          ) : (
            <>
              {/* 1. CINCO CARDS DE MÉTRICAS FUNDAMENTAIS (Imagem 3 do Usuário) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {/* 1. PATRIMÔNIO LÍQUIDO */}
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="bg-[#1f2937] px-3.5 py-2 text-center">
                    <span className="text-[10px] sm:text-[11px] font-black tracking-wider text-[#e6b96e] uppercase">
                      PATRIMÔNIO LÍQUIDO
                    </span>
                  </div>
                  <div className="p-4 text-center">
                    <span className="text-lg sm:text-xl font-black text-slate-900 block leading-tight">
                      {formatPl(fundDetails?.netEquity)}
                    </span>
                  </div>
                </div>

                {/* 2. RENTABILIDADE (12M) */}
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="bg-[#1f2937] px-3.5 py-2 text-center">
                    <span className="text-[10px] sm:text-[11px] font-black tracking-wider text-[#e6b96e] uppercase">
                      RENTABILIDADE (12M)
                    </span>
                  </div>
                  <div className="p-4 text-center">
                    <span className="text-lg sm:text-xl font-black text-slate-900 block leading-tight">
                      {fundDetails?.return12M.toFixed(2).replace('.', ',')}%
                    </span>
                  </div>
                </div>

                {/* 3. RENTABILIDADE (24M) */}
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="bg-[#1f2937] px-3.5 py-2 text-center">
                    <span className="text-[10px] sm:text-[11px] font-black tracking-wider text-[#e6b96e] uppercase">
                      RENTABILIDADE (24M)
                    </span>
                  </div>
                  <div className="p-4 text-center">
                    <span className="text-lg sm:text-xl font-black text-slate-900 block leading-tight">
                      {fundDetails?.return24M.toFixed(2).replace('.', ',')}%
                    </span>
                  </div>
                </div>

                {/* 4. VOLATILIDADE (12M) */}
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="bg-[#1f2937] px-3.5 py-2 text-center">
                    <span className="text-[10px] sm:text-[11px] font-black tracking-wider text-[#e6b96e] uppercase">
                      VOLATILIDADE (12M)
                    </span>
                  </div>
                  <div className="p-4 text-center">
                    <span className="text-lg sm:text-xl font-black text-slate-900 block leading-tight">
                      {fundDetails?.volatility12M > 100 
                        ? `${fundDetails?.volatility12M.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
                        : `${fundDetails?.volatility12M.toFixed(2).replace('.', ',')}%`}
                    </span>
                  </div>
                </div>

                {/* 5. ÍNDICE DE SHARPE (12M) */}
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow col-span-2 sm:col-span-1">
                  <div className="bg-[#1f2937] px-3.5 py-2 text-center">
                    <span className="text-[10px] sm:text-[11px] font-black tracking-wider text-[#e6b96e] uppercase">
                      ÍNDICE DE SHARPE (12M)
                    </span>
                  </div>
                  <div className="p-4 text-center">
                    <span className="text-lg sm:text-xl font-black text-slate-900 block leading-tight">
                      {fundDetails?.sharpeRatio12M.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              </div>

              {/* ABA RENTABILIDADE: GRÁFICO E INFORMAÇÕES COMPLETAS */}
              {activeTab === 'rentabilidade' && (
                <div className="space-y-6">
                  {/* 2. GRÁFICO DE RENTABILIDADE (Imagem 4 do Usuário) */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-[#1a2332] text-white px-5 py-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-amber-400" />
                        <span className="text-xs sm:text-sm font-black tracking-wider uppercase">
                          GRÁFICO DE RENTABILIDADE
                        </span>
                      </div>

                      {/* Seletor de Período: 1A, 2A, 5A, 10A */}
                      <div className="flex items-center gap-1 bg-[#0f172a] p-1 rounded-full border border-slate-700">
                        {(['1A', '2A', '5A', '10A'] as const).map(p => (
                          <button
                            key={p}
                            onClick={() => setSelectedPeriod(p)}
                            className={`px-3 py-1 rounded-full text-xs font-black transition-all ${
                              selectedPeriod === p
                                ? 'bg-slate-700 text-white shadow-xs'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {p.replace('A', ' A')}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-5">
                      {/* Legenda do Gráfico */}
                      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-600 mb-6">
                        <span className="flex items-center gap-1.5 text-slate-800">
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-rose-600 bg-white"></span>
                          <span>{fundDetails?.tradingName || 'Fundo'}</span>
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-800">
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-800 bg-white"></span>
                          <span>CDI</span>
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <span className="w-3 h-3 rounded-full border border-slate-300 bg-white"></span>
                          <span>IPCA</span>
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <span className="w-3 h-3 rounded-full border border-slate-300 bg-white"></span>
                          <span>IBOV</span>
                        </span>
                      </div>

                      {/* Gráfico SVG de Rentabilidade Interativo */}
                      <div className="relative w-full h-72 sm:h-80 select-none">
                        <svg viewBox="0 0 800 260" className="w-full h-full overflow-visible">
                          {/* Linhas de Grade Horizontais */}
                          {gridSteps.map((step, idx) => {
                            const y = 220 - ((step - minReturn) / range) * 200;
                            return (
                              <g key={idx}>
                                <line x1="50" y1={y} x2="790" y2={y} stroke="#e2e8f0" strokeDasharray="2,2" />
                                <text x="42" y={y + 4} fill="#64748b" fontSize="10" textAnchor="end" fontWeight="bold">
                                  {step}%
                                </text>
                              </g>
                            );
                          })}

                          {/* Curva CDI (Linha Azul Escuro/Slate) */}
                          {chartData.length > 1 && (
                            <polyline
                              fill="none"
                              stroke="#1e293b"
                              strokeWidth="2.5"
                              points={chartData
                                .map((d, i) => {
                                  const x = 60 + (i / (chartData.length - 1)) * 720;
                                  const y = 220 - ((d.cdiReturn - minReturn) / range) * 200;
                                  return `${x},${y}`;
                                })
                                .join(' ')}
                            />
                          )}

                          {/* Curva do Fundo (Linha Vermelha / Rose) */}
                          {chartData.length > 1 && (
                            <polyline
                              fill="none"
                              stroke="#e11d48"
                              strokeWidth="2.5"
                              points={chartData
                                .map((d, i) => {
                                  const x = 60 + (i / (chartData.length - 1)) * 720;
                                  const y = 220 - ((d.assetReturn - minReturn) / range) * 200;
                                  return `${x},${y}`;
                                })
                                .join(' ')}
                            />
                          )}

                          {/* Pontos Interativos e Rótulos do Eixo X */}
                          {chartData.map((d, i) => {
                            const x = 60 + (i / (chartData.length - 1)) * 720;
                            const yAsset = 220 - ((d.assetReturn - minReturn) / range) * 200;
                            const yCdi = 220 - ((d.cdiReturn - minReturn) / range) * 200;

                            return (
                              <g key={i}>
                                {/* Ponto CDI */}
                                <circle
                                  cx={x}
                                  cy={yCdi}
                                  r="3"
                                  fill="#ffffff"
                                  stroke="#1e293b"
                                  strokeWidth="2"
                                />

                                {/* Ponto Fundo */}
                                <circle
                                  cx={x}
                                  cy={yAsset}
                                  r="3.5"
                                  fill="#ffffff"
                                  stroke="#e11d48"
                                  strokeWidth="2"
                                  className="cursor-pointer hover:r-5 transition-all"
                                  onMouseEnter={() => setHoveredPoint(d)}
                                  onMouseLeave={() => setHoveredPoint(null)}
                                />

                                {/* Data no Eixo X */}
                                <text
                                  x={x}
                                  y="245"
                                  fill="#64748b"
                                  fontSize="10"
                                  textAnchor="middle"
                                  fontWeight="bold"
                                >
                                  {d.date}
                                </text>
                              </g>
                            );
                          })}
                        </svg>

                        {/* Tooltip Flutuante */}
                        {hoveredPoint && (
                          <div className="absolute top-2 right-4 bg-slate-900 text-white text-xs p-3 rounded-xl shadow-xl border border-slate-700 pointer-events-none z-30">
                            <div className="font-extrabold text-amber-300 border-b border-slate-700 pb-1 mb-1">
                              Mês: {hoveredPoint.date}
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-rose-300 font-bold">Fundo:</span>
                              <span className="font-mono font-black">+{hoveredPoint.assetReturn.toFixed(2)}%</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-sky-300 font-bold">CDI:</span>
                              <span className="font-mono font-black">+{hoveredPoint.cdiReturn.toFixed(2)}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 3. QUADRO INFORMAÇÕES SOBRE O PRODUTO (Imagem 5 do Usuário) */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-[#1a2332] text-white px-5 py-3.5 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-amber-400" />
                      <span className="text-xs sm:text-sm font-black tracking-wider uppercase">
                        INFORMAÇÕES SOBRE {fundDetails?.name || asset.name}
                      </span>
                    </div>

                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {/* 1. Nome do Fundo */}
                      <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Nome do Fundo</span>
                          <span className="text-xs font-black text-slate-900 block leading-tight mt-0.5">
                            {fundDetails?.name || asset.name}
                          </span>
                        </div>
                      </div>

                      {/* 2. CNPJ */}
                      <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">CNPJ</span>
                          <span className="text-xs font-black text-slate-900 block leading-tight mt-0.5 font-mono">
                            {fundDetails?.cnpj || asset.cnpj}
                          </span>
                        </div>
                      </div>

                      {/* 3. DATA INICIAL */}
                      <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">DATA INICIAL</span>
                          <span className="text-xs font-black text-slate-900 block leading-tight mt-0.5">
                            {fundDetails?.inceptionDate || '22/03/2013'}
                          </span>
                        </div>
                      </div>

                      {/* 4. Benchmark */}
                      <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                          <Percent className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Benchmark</span>
                          <span className="text-xs font-black text-slate-900 block leading-tight mt-0.5">
                            {fundDetails?.benchmark || 'DI DE UM DIA'}
                          </span>
                        </div>
                      </div>

                      {/* 5. CLASSE */}
                      <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">CLASSE</span>
                          <span className="text-xs font-black text-slate-900 block leading-tight mt-0.5">
                            {fundDetails?.assetClassDisplay || 'FUNDOS DE RENDA FIXA'}
                          </span>
                        </div>
                      </div>

                      {/* 6. COMPOSIÇÃO DO FUNDO */}
                      <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">COMPOSIÇÃO DO FUNDO</span>
                          <span className="text-xs font-black text-slate-900 block leading-tight mt-0.5">
                            {fundDetails?.composition || 'FI'}
                          </span>
                        </div>
                      </div>

                      {/* 7. GESTOR DO FUNDO */}
                      <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">GESTOR DO FUNDO</span>
                          <span className="text-xs font-black text-slate-900 block leading-tight mt-0.5">
                            {fundDetails?.manager || 'SANTANDER BRASIL GESTÃO DE RECURSOS LTDA'}
                          </span>
                        </div>
                      </div>

                      {/* 8. ADMINISTRADOR DO FUNDO */}
                      <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">ADMINISTRADOR DO FUNDO</span>
                          <span className="text-xs font-black text-slate-900 block leading-tight mt-0.5">
                            {fundDetails?.administrator || 'BANCO SANTANDER (BRASIL) S.A.'}
                          </span>
                        </div>
                      </div>

                      {/* 9. TAXA DE ADMINISTRAÇÃO */}
                      <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                          <Percent className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">TAXA DE ADMINISTRAÇÃO</span>
                          <span className="text-xs font-black text-slate-900 block leading-tight mt-0.5">
                            {fundDetails?.adminFeePct ? `${fundDetails.adminFeePct.toFixed(2).replace('.', ',')}%` : '0,30%'}
                          </span>
                        </div>
                      </div>

                      {/* 10. TAXA DE PERFORMANCE */}
                      <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                          <Percent className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">TAXA DE PERFORMANCE</span>
                          <span className="text-xs font-black text-slate-900 block leading-tight mt-0.5">
                            {fundDetails?.performanceFeePct ? `${fundDetails.performanceFeePct.toFixed(2).replace('.', ',')}%` : 'Não há'}
                          </span>
                        </div>
                      </div>

                      {/* 11. CONDOMÍNIO */}
                      <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 flex items-start gap-3 col-span-1 md:col-span-2">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                          <Home className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">CONDOMÍNIO</span>
                          <span className="text-xs font-black text-slate-900 block leading-tight mt-0.5">
                            {fundDetails?.condominium || 'ABERTO'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ABA EVOLUÇÃO */}
              {activeTab === 'evolucao' && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                  <h3 className="text-sm font-black text-slate-900 uppercase">Evolução Patrimonial e Cotização</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Competência</th>
                          <th className="py-2.5 px-3 text-right">Rentab. Fundo</th>
                          <th className="py-2.5 px-3 text-right">CDI</th>
                          <th className="py-2.5 px-3 text-right">Spread vs CDI</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {chartData.map((item, idx) => {
                          const spread = item.assetReturn - item.cdiReturn;
                          return (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="py-2 px-3 font-semibold text-slate-800">{item.date}</td>
                              <td className="py-2 px-3 text-right font-black text-rose-600">+{item.assetReturn.toFixed(2)}%</td>
                              <td className="py-2 px-3 text-right font-bold text-slate-700">+{item.cdiReturn.toFixed(2)}%</td>
                              <td className={`py-2 px-3 text-right font-bold ${spread >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {spread >= 0 ? `+${spread.toFixed(2)}%` : `${spread.toFixed(2)}%`}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ABA VOLATILIDADE */}
              {activeTab === 'volatilidade' && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
                  <h3 className="text-sm font-black text-slate-900 uppercase">Análise de Risco & Volatilidade</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Volatilidade Anualizada</span>
                      <span className="text-xl font-black text-slate-900 block mt-1">
                        {fundDetails?.volatility12M > 100 
                          ? `${fundDetails?.volatility12M.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
                          : `${fundDetails?.volatility12M.toFixed(2).replace('.', ',')}%`}
                      </span>
                      <span className="text-[11px] text-slate-500 mt-1 block">Desvio-padrão dos retornos diários</span>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Índice de Sharpe</span>
                      <span className="text-xl font-black text-slate-900 block mt-1">
                        {fundDetails?.sharpeRatio12M.toFixed(2).replace('.', ',')}
                      </span>
                      <span className="text-[11px] text-slate-500 mt-1 block">Excesso de retorno sobre a taxa livre de risco</span>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Grau de Risco RPPS</span>
                      <span className="text-xl font-black text-teal-700 block mt-1">
                        {asset.risk_level || 'BAIXO'}
                      </span>
                      <span className="text-[11px] text-slate-500 mt-1 block">Classificação de Risco Fiduciário</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ABA SOBRE */}
              {activeTab === 'sobre' && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                  <h3 className="text-sm font-black text-slate-900 uppercase">Regulamentação e Conformidade Fiduciária</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs space-y-2">
                    <div className="font-bold text-blue-900">Enquadramento CMN nº 5.272/2025:</div>
                    <p className="text-blue-800">
                      Este produto está devidamente enquadrado no <strong>{asset.article_code || 'Art. 7º'}</strong> da nova regulamentação previdenciária nacional.
                    </p>
                    <div className="pt-2">
                      <a
                        href={OFFICIAL_REGULATION_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-blue-700 underline"
                      >
                        <span>Consultar texto integral da {OFFICIAL_REGULATION_NORM}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* RODAPÉ DO MODAL */}
        <div className="bg-slate-100 border-t border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
          <div className="text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Dados sincronizados com o Portal CVM e Investidor10 • Gestão PREVI-LACERDA</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg transition-colors text-xs"
            >
              Fechar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
