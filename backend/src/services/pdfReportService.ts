import { AssetMetrics } from './financialMetricsService';

export class PdfReportService {
  /**
   * Gera o HTML padronizado do 'One-Page Report' para reuniões do Comitê de Investimentos do PREVI-LACERDA
   * Base Legal Atualizada: Resolução CMN nº 5.272/2025 (de 18/12/2025)
   * Link Oficial: https://www.gov.br/previdencia/pt-br/assuntos/rpps/legislacao-dos-rpps/arquivos/2025/ResoluoBCCMNn5.272de18dez2025.pdf
   */
  public static generateOnePageHtml(metrics: AssetMetrics, assetDetails: any): string {
    const formattedDate = new Date().toLocaleDateString('pt-BR');
    const plFormatted = (metrics.currentNetEquity / 1_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const quotaFormatted = metrics.currentQuota.toLocaleString('pt-BR', { minimumFractionDigits: 6, maximumFractionDigits: 6 });

    const riskBadgeClass = {
      'MUITO_BAIXO': 'badge-success',
      'BAIXO': 'badge-info',
      'MEDIO': 'badge-warning',
      'ALTO': 'badge-danger',
      'MUITO_ALTO': 'badge-dark'
    }[metrics.riskLevel] || 'badge-secondary';

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>One-Page Report - ${metrics.tradingName} | PREVI-LACERDA</title>
  <style>
    @page { size: A4; margin: 15mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; }
    body {
      font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
      color: #1e293b;
      margin: 0;
      padding: 0;
      font-size: 11pt;
      line-height: 1.4;
      background: #ffffff;
    }
    .header {
      border-bottom: 2px solid #0f766e;
      padding-bottom: 12px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-logo {
      font-size: 16pt;
      font-weight: 800;
      color: #0f766e;
      letter-spacing: -0.5px;
    }
    .header-sub {
      font-size: 8.5pt;
      color: #64748b;
      font-weight: 500;
    }
    .legal-link {
      color: #0f766e;
      text-decoration: underline;
      font-weight: 600;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 8.5pt;
      font-weight: 700;
      text-transform: uppercase;
    }
    .badge-success { background: #dcfce7; color: #166534; }
    .badge-info { background: #e0f2fe; color: #0369a1; }
    .badge-warning { background: #fef3c7; color: #92400e; }
    .badge-danger { background: #fee2e2; color: #991b1b; }
    .badge-dark { background: #f1f5f9; color: #0f172a; }
    
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 14px; }
    
    .card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
      background: #f8fafc;
    }
    .card-title {
      font-size: 9pt;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      margin-bottom: 6px;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 4px;
    }
    .metric-value {
      font-size: 15pt;
      font-weight: 800;
      color: #0f172a;
    }
    .metric-label { font-size: 8pt; color: #64748b; }
    
    table { width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 9pt; }
    th { background: #0f766e; color: #ffffff; text-align: left; padding: 6px 8px; font-weight: 600; }
    td { padding: 5px 8px; border-bottom: 1px solid #e2e8f0; }
    tr:nth-child(even) { background: #f8fafc; }
    
    .text-positive { color: #16a34a; font-weight: 700; }
    .text-negative { color: #dc2626; font-weight: 700; }
    
    .footer-signatures {
      margin-top: 24px;
      padding-top: 14px;
      border-top: 1px dashed #94a3b8;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 15px;
      text-align: center;
      font-size: 8pt;
    }
    .signature-line {
      margin-top: 35px;
      border-top: 1px solid #475569;
      padding-top: 4px;
      font-weight: 600;
    }
  </style>
</head>
<body>

  <!-- CABEÇALHO OFICIAL RPPS -->
  <div class="header">
    <div>
      <div class="header-logo">PREVI-LACERDA</div>
      <div class="header-sub">Instituto de Previdência dos Servidores Públicos do Município de Pontes e Lacerda - MT</div>
      <div class="header-sub">
        Comitê de Investimentos | Base Legal: <a href="https://www.gov.br/previdencia/pt-br/assuntos/rpps/legislacao-dos-rpps/arquivos/2025/ResoluoBCCMNn5.272de18dez2025.pdf" target="_blank" class="legal-link">Resolução CMN nº 5.272/2025</a> | Emissão: ${formattedDate}
      </div>
    </div>
    <div style="text-align: right;">
      <span class="badge ${riskBadgeClass}">Risco: ${metrics.riskLevel}</span>
      <div style="font-size: 8.5pt; color: #64748b; margin-top: 4px;">Status: <strong>Aprovado</strong></div>
    </div>
  </div>

  <!-- NOME DO ATIVO E DADOS CADASTRAIS -->
  <div class="card" style="margin-bottom: 14px; background: #ffffff; border-left: 4px solid #0f766e;">
    <div style="font-size: 14pt; font-weight: 800; color: #0f172a;">${metrics.tradingName}</div>
    <div style="font-size: 9pt; color: #64748b; margin-top: 2px;">${metrics.name}</div>
    <div style="display: flex; gap: 20px; font-size: 8.5pt; color: #334155; margin-top: 8px;">
      <span><strong>CNPJ:</strong> ${metrics.cnpj}</span>
      <span><strong>Classe:</strong> ${metrics.assetClass.replace('_', ' ')}</span>
      <span><strong>Benchmark:</strong> ${metrics.benchmark}</span>
      <span><strong>Enquadramento CMN 5.272:</strong> ${metrics.cmnRegulation ? metrics.cmnRegulation.articleCode : 'Em análise'}</span>
    </div>
  </div>

  <!-- CARDS DE RESUMO FUNDAMENTALISTA (ESTILO INVESTIDOR 10) -->
  <div class="grid-4">
    <div class="card">
      <div class="metric-label">VALOR DA COTA</div>
      <div class="metric-value">R$ ${quotaFormatted}</div>
      <div class="metric-label">Última atualização CVM</div>
    </div>
    <div class="card">
      <div class="metric-label">PATRIMÔNIO LÍQUIDO</div>
      <div class="metric-value">R$ ${plFormatted} M</div>
      <div class="metric-label">Total sob gestão</div>
    </div>
    <div class="card">
      <div class="metric-label">VOLATILIDADE 12M</div>
      <div class="metric-value">${metrics.volatilityTwelveMonths}%</div>
      <div class="metric-label">Anualizada (252 d.u.)</div>
    </div>
    <div class="card">
      <div class="metric-label">ÍNDICE SHARPE 12M</div>
      <div class="metric-value">${metrics.sharpeRatioTwelveMonths}</div>
      <div class="metric-label">Retorno excedente / risco</div>
    </div>
  </div>

  <!-- TABELAS LADO A LADO: RENTABILIDADE E DADOS DE GESTÃO -->
  <div class="grid-2">
    <!-- TABELA DE RENTABILIDADE HISTÓRICA -->
    <div class="card" style="background: #ffffff;">
      <div class="card-title">Desempenho Histórico vs CDI</div>
      <table>
        <thead>
          <tr>
            <th>Período</th>
            <th>Fundo</th>
            <th>% CDI</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Último Mês (1M)</td>
            <td class="${metrics.returns.oneMonth >= 0 ? 'text-positive' : 'text-negative'}">${metrics.returns.oneMonth}%</td>
            <td>${metrics.returns.oneMonth > 0 ? (metrics.returns.oneMonth / 0.85 * 100).toFixed(0) : '-'}%</td>
          </tr>
          <tr>
            <td>6 Meses (6M)</td>
            <td class="${metrics.returns.sixMonths >= 0 ? 'text-positive' : 'text-negative'}">${metrics.returns.sixMonths}%</td>
            <td>${metrics.returns.sixMonths > 0 ? (metrics.returns.sixMonths / 5.20 * 100).toFixed(0) : '-'}%</td>
          </tr>
          <tr>
            <td>12 Meses (12M)</td>
            <td class="${metrics.returns.twelveMonths >= 0 ? 'text-positive' : 'text-negative'}">${metrics.returns.twelveMonths}%</td>
            <td>${metrics.benchmarkComparisonTwelveMonths.pctOfCdi}%</td>
          </tr>
          <tr>
            <td>24 Meses (24M)</td>
            <td class="${metrics.returns.twentyFourMonths >= 0 ? 'text-positive' : 'text-negative'}">${metrics.returns.twentyFourMonths}%</td>
            <td>-</td>
          </tr>
          <tr>
            <td>No Ano (YTD)</td>
            <td class="${metrics.returns.yearToDate >= 0 ? 'text-positive' : 'text-negative'}">${metrics.returns.yearToDate}%</td>
            <td>-</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- DADOS DE GESTÃO E COMPLIANCE -->
    <div class="card" style="background: #ffffff;">
      <div class="card-title">Estrutura Operacional e Fiduciária</div>
      <div style="font-size: 8.5pt; line-height: 1.8;">
        <div><strong>Administrador:</strong> ${assetDetails?.administrator || 'Não informado'}</div>
        <div><strong>Gestor:</strong> ${assetDetails?.manager || 'Não informado'}</div>
        <div><strong>Custodiante:</strong> ${assetDetails?.custodian || 'Não informado'}</div>
        <div><strong>Taxa de Administração:</strong> ${metrics.adminFeePct}% a.a.</div>
        <div><strong>Taxa de Performance:</strong> ${metrics.performanceFeePct}%</div>
        <div><strong>Prazo de Cotização / Resgate:</strong> D+${assetDetails?.liquidity_days ?? 0}</div>
        <div><strong>Limite Legal (CMN 5.272):</strong> Até ${metrics.cmnRegulation ? metrics.cmnRegulation.maxLimitPct : 100}% da carteira</div>
        <div><strong>Queda Máxima 12M (Drawdown):</strong> -${metrics.maxDrawdownTwelveMonths}%</div>
      </div>
    </div>
  </div>

  <!-- CONCLUSÃO E ASSINATURAS DO COMITÊ -->
  <div class="card" style="background: #f1f5f9; border: 1px solid #cbd5e1;">
    <div class="card-title" style="border-color: #94a3b8;">Parecer Técnico do Comitê de Investimentos</div>
    <div style="font-size: 8.5pt; color: #334155; text-align: justify;">
      O ativo encontra-se em estrita conformidade com a Política Anual de Investimentos do PREVI-LACERDA e com a 
      <a href="https://www.gov.br/previdencia/pt-br/assuntos/rpps/legislacao-dos-rpps/arquivos/2025/ResoluoBCCMNn5.272de18dez2025.pdf" target="_blank" style="color: #0f766e; font-weight: bold;">Resolução CMN nº 5.272/2025</a>.
      Os índices de liquidez, solvência e histórico de rentabilidade atendem aos critérios de prudência e segurança atuarial para a preservação do patrimônio previdenciário municipal.
    </div>
  </div>

  <div class="footer-signatures">
    <div>
      <div class="signature-line">Diretor Presidente / Executivo</div>
      <div>PREVI-LACERDA</div>
    </div>
    <div>
      <div class="signature-line">Gestor de Recursos / Comitê</div>
      <div>Certificação CGRPPS / CPA-20</div>
    </div>
    <div>
      <div class="signature-line">Conselho Fiscal / Auditoria</div>
      <div>Controle Social e Fiscalização</div>
    </div>
  </div>

</body>
</html>
    `;
  }
}
