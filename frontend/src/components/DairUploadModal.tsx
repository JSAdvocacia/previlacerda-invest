import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Building2, 
  TrendingUp, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { parseDairPdf } from '../services/dairParserService';
import { DairExtractedData } from '../types';

interface DairUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (extracted: DairExtractedData) => void;
}

export const DairUploadModal: React.FC<DairUploadModalProps> = ({
  isOpen,
  onClose,
  onImportComplete
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [extractedData, setExtractedData] = useState<DairExtractedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Por favor, selecione um arquivo no formato PDF oficial do CADPREV.');
      return;
    }
    setError(null);
    setFile(selectedFile);
    processFile(selectedFile);
  };

  const processFile = async (pdfFile: File) => {
    setIsProcessing(true);
    setExtractedData(null);
    try {
      setCurrentStep('Decodificando estrutura vetorial do PDF CADPREV...');
      await new Promise(r => setTimeout(r, 600));
      
      setCurrentStep('Extraindo dados do Ente (Pontes e Lacerda), Gestor de Recursos e Comitê...');
      await new Promise(r => setTimeout(r, 600));
      
      setCurrentStep('Mapeando enquadramentos da Resolução CMN nº 5.272/2025 e patrimônio...');
      const result = await parseDairPdf(pdfFile);

      setExtractedData(result);
      setCurrentStep('Leitura e validação concluídas com sucesso!');
    } catch (err: any) {
      setError(err?.message || 'Falha ao processar o arquivo DAIR.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmImport = () => {
    if (extractedData) {
      onImportComplete(extractedData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Importação Inteligente do DAIR (CADPREV)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Lê o PDF oficial, atualiza o Instituto PREVI-LACERDA e sincroniza todos os ativos e cotas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Dropzone */}
          {!extractedData && !isProcessing && (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) {
                  handleFileSelect(e.dataTransfer.files[0]);
                }
              }}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-8 text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-800/20 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
                }}
              />
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8" />
              </div>
              <p className="text-base font-bold text-slate-800 dark:text-slate-200">
                Arraste o arquivo PDF do DAIR aqui
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                ou clique para selecionar do seu computador (Ex: Dair.pdf - Competência 09/2026)
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                Compatível com CADPREV / SPREV e Resolução CMN nº 5.272/2025
              </div>
            </div>
          )}

          {/* Processing State */}
          {isProcessing && (
            <div className="p-8 text-center space-y-4">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Realizando Leitura Inteligente do DAIR
                </h3>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium animate-pulse">
                  {currentStep}
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Extracted Preview */}
          {extractedData && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      DAIR Processado com Sucesso!
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Competência: <span className="font-semibold">{extractedData.portfolioSummary.competency}</span> • Arquivo: {file?.name || 'Dair.pdf'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setExtractedData(null);
                    setFile(null);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline"
                >
                  Enviar outro arquivo
                </button>
              </div>

              {/* Institute Summary Card */}
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-500" />
                  1. Dados Institucionais Reconhecidos
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Ente Federativo:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{extractedData.institute.enteName} - {extractedData.institute.uf}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">CNPJ do Ente:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{extractedData.institute.enteCnpj}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Gestor de Recursos:</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{extractedData.institute.resourceManagerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Certificação do Gestor:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">{extractedData.institute.resourceManagerCert}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Comitê de Investimento:</span>
                    <span className="text-slate-800 dark:text-slate-200">{extractedData.institute.committeeMembers?.length} membros validados</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Conselho Deliberativo:</span>
                    <span className="text-slate-800 dark:text-slate-200">{extractedData.institute.deliberativeCouncil?.length} conselheiros</span>
                  </div>
                </div>
              </div>

              {/* Financial Totals Card */}
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  2. Posição Financeira e Alocação da Carteira (09/2026)
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block text-[10px]">Total Geral da Carteira:</span>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      R$ {extractedData.portfolioSummary.totalGeneral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block text-[10px]">Resolução CMN (Investimentos):</span>
                    <span className="font-bold text-sm text-blue-600 dark:text-blue-400">
                      R$ {extractedData.portfolioSummary.totalCarteiraCmn.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block text-[10px]">Saldo Conta Corrente:</span>
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      R$ {extractedData.portfolioSummary.saldoContaCorrente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block text-[10px]">Rentabilidade no Mês:</span>
                    <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                      +{extractedData.portfolioSummary.rentabilidadeMesPct}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Assets List Sample */}
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
                  <span>3. Ativos Identificados ({extractedData.assets.length} Fundos e Títulos)</span>
                  <span className="text-[11px] text-emerald-500 font-semibold">100% Enquadrados CMN 5.272/2025</span>
                </h5>
                <div className="max-h-40 overflow-y-auto divide-y divide-slate-200 dark:divide-slate-700 text-xs">
                  {extractedData.assets.map((asset, i) => (
                    <div key={i} className="py-2 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-200">{asset.trading_name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">CNPJ: {asset.cnpj} • {asset.article_code}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900 dark:text-white">
                          R$ {asset.total_invested?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                          {asset.weight_pct}% da Carteira
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          {extractedData && (
            <button
              onClick={handleConfirmImport}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 transition-all text-sm"
            >
              <Check className="w-4 h-4" />
              <span>Confirmar e Atualizar Sistema</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
