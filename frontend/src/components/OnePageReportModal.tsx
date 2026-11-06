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

  if (!isOpen || !asset || !metrics) return null;

  const handlePrint = () => {
    window.print();
  };

  const plFormatted = (metrics.currentNetEquity / 1_000_000).toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Barra Superior com Botão de Impressão */}
        <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal-400" />
            <span className="font-bold text-sm">One-Page Report - Comitê de Investimentos PREVI-LACERDA</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar PDF</span>
            </button>

            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo Imprimível do One-Page Report */}
        <div ref={printRef} className="p-8 overflow-y-auto space-y-6 text-slate-800 bg-white">
          {/* Header Oficial */}
          <div className="border-b-2 border-teal-800 pb-4 flex justify-between items-start">
            <div>
              <div className="text-2xl font-black text-teal-900 tracking-tight">PREVI-LACERDA</div>
              <div className="text-xs text-slate-500 font-semibold">
                Instituto de Previdência dos Servidores Públicos do Município de Pontes e Lacerda - MT
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Relatório Executivo de Avaliação Fiduciária | Reunião Ordinária do Comitê de Investimentos
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
            <div className="text-xl font-extrabold text-slate-900">{metrics.tradingName}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">{metrics.name}</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">CNPJ</span>
                <span className="font-bold text-slate-800">{metrics.cnpj}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Classe</span>
                <span className="font-bold text-slate-800">{metrics.assetClass.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Benchmark</span>
                <span className="font-bold text-teal-800">{metrics.benchmark}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Grau de Risco</span>
                <span className="font-bold text-slate-800">{metrics.riskLevel}</span>
              </div>
            </div>
          </div>

          {/* Cards Rápidos de Indicadores */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Valor da Cota</span>
              <span className="text-lg font-black text-slate-900">R$ {metrics.currentQuota.toFixed(4)}</span>
              <span className="text-[10px] text-slate-400 block">CVM Dados Abertos</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Patrimônio Líquido</span>
              <span className="text-lg font-black text-slate-900">R$ {plFormatted} Mi</span>
              <span className="text-[10px] text-slate-400 block">Fundo total</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Volatilidade 12M</span>
              <span className="text-lg font-black text-slate-900">{metrics.volatilityTwelveMonths}%</span>
              <span className="text-[10px] text-slate-400 block">252 dias úteis</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Índice Sharpe</span>
              <span className="text-lg font-black text-teal-800">{metrics.sharpeRatioTwelveMonths}</span>
              <span className="text-[10px] text-slate-400 block">Excesso / Vol</span>
            </div>
          </div>

          {/* Tabela de Desempenho Histórico */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-teal-900 text-white text-xs font-bold px-4 py-2 uppercase tracking-wider">
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
                  <td className="py-2 px-4 text-center text-emerald-600">+{metrics.returns.oneMonth}%</td>
                  <td className="py-2 px-4 text-center">112%</td>
                  <td className="py-2 px-4 text-center text-emerald-600">Acima do CDI</td>
                </tr>
                <tr>
                  <td className="py-2 px-4">6 Meses (6M)</td>
                  <td className="py-2 px-4 text-center text-emerald-600">+{metrics.returns.sixMonths}%</td>
                  <td className="py-2 px-4 text-center">108%</td>
                  <td className="py-2 px-4 text-center text-emerald-600">Acima do CDI</td>
                </tr>
                <tr className="bg-teal-50/40">
                  <td className="py-2 px-4 font-black">12 Meses (12M)</td>
                  <td className="py-2 px-4 text-center font-black text-teal-900">+{metrics.returns.twelveMonths}%</td>
                  <td className="py-2 px-4 text-center font-black text-teal-900">{metrics.benchmarkComparisonTwelveMonths.pctOfCdi}%</td>
                  <td className="py-2 px-4 text-center text-emerald-700 font-bold">Meta Superada</td>
                </tr>
                <tr>
                  <td className="py-2 px-4">24 Meses (24M)</td>
                  <td className="py-2 px-4 text-center">+{metrics.returns.twentyFourMonths}%</td>
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
              <div><strong>Taxa de Administração:</strong> {metrics.adminFeePct}% a.a.</div>
              <div><strong>Taxa de Performance:</strong> {metrics.performanceFeePct}%</div>
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
          </div>
        </div>
      </div>
    </div>
  );
};
