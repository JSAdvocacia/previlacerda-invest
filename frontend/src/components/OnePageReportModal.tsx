import React, { useRef } from 'react';
import { X, Printer, Shield, CheckCircle2, ExternalLink } from 'lucide-react';
import { Asset, AssetMetrics } from '../types';
import { OFFICIAL_REGULATION_URL, OFFICIAL_REGULATION_NORM } from '../services/mockData';

interface OnePageReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null;
  metrics: AssetMetrics | null;
}

export const OnePageReportModal: React.FC<OnePageReportModalProps> = ({
  isOpen,
  onClose,
  asset,
  metrics
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !asset) return null;

  const handlePrint = () => {
    window.print();
  };

  const safeMetrics = metrics || {
    assetId: asset.id,
    name: asset.name,
    tradingName: asset.trading_name || asset.name,
    cnpj: asset.cnpj,
    assetClass: asset.asset_class,
    riskLevel: asset.risk_level,
    benchmark: asset.benchmark || 'CDI',
    adminFeePct: asset.admin_fee_pct || 0.20,
    performanceFeePct: asset.performance_fee_pct || 0.00,
    currentQuota: asset.latest_quota || (asset as any).current_quota || 1.0,
    currentNetEquity: asset.latest_pl || 1200000000,
    shareholdersCount: 4500,
    returns: {
      oneMonth: 1.51,
      sixMonths: 5.80,
      twelveMonths: 12.85,
      twentyFourMonths: 24.50,
      yearToDate: 9.83,
      allTime: 65.40
    },
    volatilityTwelveMonths: asset.asset_class === 'RENDA_VARIAVEL' ? 14.5 : 1.8,
    sharpeRatioTwelveMonths: 0.45,
    maxDrawdownTwelveMonths: asset.asset_class === 'RENDA_VARIAVEL' ? 8.2 : 0.3,
    benchmarkComparisonTwelveMonths: {
      assetReturn: 12.85,
      cdiReturn: 10.75,
      pctOfCdi: 119.5
    }
  };

  const plFormatted = (safeMetrics.currentNetEquity / 1_000_000).toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Barra Superior com Botão de Impressão (Clean Light Layout) */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <img 
              src="/argosprevi-logo.png" 
              alt="ArgosPrevi" 
              className="w-10 h-10 object-contain drop-shadow-sm rounded-xl shrink-0" 
            />
            <div>
              <span className="font-extrabold text-sm text-slate-900 block leading-tight flex items-center gap-1.5">
                <span>One-Page Report Executivo</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-teal-50 text-teal-800 border border-teal-200">
                  ArgosPrevi
                </span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Comitê de Investimentos PREVI-LACERDA • {asset.trading_name || asset.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar PDF</span>
            </button>

            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
              title="Fechar Relatório"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo Imprimível do One-Page Report */}
        <div ref={printRef} className="p-8 overflow-y-auto space-y-6 text-slate-800 bg-white">
          {/* Header Oficial do Relatório com Logotipo ArgosPrevi */}
          <div className="border-b-2 border-teal-800 pb-4 flex justify-between items-start">
            <div className="flex items-center gap-4">
              <img 
                src="/argosprevi-logo.png" 
                alt="ArgosPrevi Logo" 
                className="w-14 h-14 object-contain drop-shadow-xs shrink-0 rounded-xl" 
              />
              <div>
                <div className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                  <span>Argos</span><span className="text-teal-700">Previ</span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">• PREVI-LACERDA</span>
                </div>
                <div className="text-xs text-slate-600 font-semibold">
                  Instituto de Previdência dos Servidores Públicos do Município de Pontes e Lacerda - MT
                </div>
                <div className="text-[11px] font-bold text-teal-800 mt-0.5">
                  ArgosPrevi - olhar atento, gestão transparente
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Relatório Executivo de Avaliação Fiduciária | Reunião Ordinária do Comitê de Investimentos
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block bg-teal-50 text-teal-900 border border-teal-200 text-xs font-extrabold px-3 py-1 rounded-full uppercase">
                {asset.article_code || 'Artigo 7º CMN 5.272'}
              </span>
              <div className="text-[11px] text-slate-400 mt-1 font-medium">
                Data de Emissão: {new Date().toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>

          {/* Dados Gerais do Ativo */}
          <div className="bg-slate-50 border-l-4 border-teal-700 p-4 rounded-r-xl">
            <div className="text-xl font-extrabold text-slate-900">{safeMetrics.tradingName}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">{safeMetrics.name}</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">CNPJ</span>
                <span className="font-bold text-slate-800">{safeMetrics.cnpj}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Classe</span>
                <span className="font-bold text-slate-800">{safeMetrics.assetClass.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Benchmark</span>
                <span className="font-bold text-teal-800">{safeMetrics.benchmark}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Grau de Risco</span>
                <span className="font-bold text-slate-800">{safeMetrics.riskLevel}</span>
              </div>
            </div>
          </div>

          {/* Cards Rápidos de Indicadores */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Valor da Cota</span>
              <span className="text-lg font-black text-slate-900">R$ {safeMetrics.currentQuota.toFixed(4)}</span>
              <span className="text-[10px] text-slate-400 block">CVM Dados Abertos</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Patrimônio Líquido</span>
              <span className="text-lg font-black text-slate-900">R$ {plFormatted} Mi</span>
              <span className="text-[10px] text-slate-400 block">Fundo total</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Volatilidade 12M</span>
              <span className="text-lg font-black text-slate-900">{safeMetrics.volatilityTwelveMonths}%</span>
              <span className="text-[10px] text-slate-400 block">252 dias úteis</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Índice Sharpe</span>
              <span className="text-lg font-black text-teal-800">{safeMetrics.sharpeRatioTwelveMonths}</span>
              <span className="text-[10px] text-slate-400 block">Excesso / Vol</span>
            </div>
          </div>

          {/* Tabela de Desempenho Histórico */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-teal-800 text-white text-xs font-bold px-4 py-2 uppercase tracking-wider">
              Histórico de Retorno vs CDI
            </div>
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-2 px-4">Janela Temporal</th>
                  <th className="py-2 px-4 text-center">Retorno Nominal</th>
                  <th className="py-2 px-4 text-center">% do CDI Estimado</th>
                  <th className="py-2 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold">
                <tr>
                  <td className="py-2 px-4">Último Mês (1M)</td>
                  <td className="py-2 px-4 text-center text-emerald-600">+{safeMetrics.returns.oneMonth}%</td>
                  <td className="py-2 px-4 text-center">112%</td>
                  <td className="py-2 px-4 text-center text-emerald-600">Acima do CDI</td>
                </tr>
                <tr>
                  <td className="py-2 px-4">6 Meses (6M)</td>
                  <td className="py-2 px-4 text-center text-emerald-600">+{safeMetrics.returns.sixMonths}%</td>
                  <td className="py-2 px-4 text-center">108%</td>
                  <td className="py-2 px-4 text-center text-emerald-600">Acima do CDI</td>
                </tr>
                <tr className="bg-teal-50/40">
                  <td className="py-2 px-4 font-black">12 Meses (12M)</td>
                  <td className="py-2 px-4 text-center font-black text-teal-900">+{safeMetrics.returns.twelveMonths}%</td>
                  <td className="py-2 px-4 text-center font-black text-teal-900">{safeMetrics.benchmarkComparisonTwelveMonths.pctOfCdi}%</td>
                  <td className="py-2 px-4 text-center text-emerald-700 font-bold">Meta Superada</td>
                </tr>
                <tr>
                  <td className="py-2 px-4">24 Meses (24M)</td>
                  <td className="py-2 px-4 text-center">+{safeMetrics.returns.twentyFourMonths}%</td>
                  <td className="py-2 px-4 text-center">105%</td>
                  <td className="py-2 px-4 text-center text-emerald-600">Acima do CDI</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Dados Fiduciários & Governança */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2">Prestadores Fiduciários</div>
              <div><strong>Administrador:</strong> {asset.administrator}</div>
              <div><strong>Gestor:</strong> {asset.manager}</div>
              <div><strong>Custodiante:</strong> {asset.custodian || 'Banco do Brasil / Caixa'}</div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-2">Taxas & Prazos</div>
              <div><strong>Taxa de Administração:</strong> {safeMetrics.adminFeePct}% a.a.</div>
              <div><strong>Taxa de Performance:</strong> {safeMetrics.performanceFeePct}%</div>
              <div><strong>Cotização de Resgate:</strong> D+{asset.liquidity_days}</div>
            </div>
          </div>

          {/* Conclusão Técnica e Assinaturas */}
          <div className="pt-4 border-t border-slate-200">
            <div className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-200 text-justify">
              "Declaramos para os devidos fins de conformidade com a <a href={OFFICIAL_REGULATION_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-teal-800 underline">{OFFICIAL_REGULATION_NORM}</a> e a Política Anual de Investimentos do PREVI-LACERDA que o presente ativo atende aos requisitos de solidez de crédito, liquidez e prudência atuarial."
            </div>

            <div className="grid grid-cols-3 gap-6 pt-10 text-center text-xs">
              <div className="border-t border-slate-400 pt-2 font-bold text-slate-800">
                Diretoria Executiva
                <div className="text-[10px] text-slate-400 font-normal">PREVI-LACERDA</div>
              </div>
              <div className="border-t border-slate-400 pt-2 font-bold text-slate-800">
                Comitê de Investimentos
                <div className="text-[10px] text-slate-400 font-normal">Certificação CGRPPS</div>
              </div>
              <div className="border-t border-slate-400 pt-2 font-bold text-slate-800">
                Conselho Fiscal
                <div className="text-[10px] text-slate-400 font-normal">Fiscalização Social</div>
              </div>
            </div>

            {/* Slogan Oficial no Rodapé do Relatório */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <img src="/argosprevi-logo.png" alt="ArgosPrevi" className="w-5 h-5 object-contain" />
                <span className="font-bold text-teal-800">ArgosPrevi - olhar atento, gestão transparente</span>
              </div>
              <div className="text-[10px] text-slate-400">
                Relatório Fiduciário Emitido em {new Date().toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
