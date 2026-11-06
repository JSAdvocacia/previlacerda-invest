import React, { useState, useEffect } from 'react';
import {
  Sliders,
  DollarSign,
  TrendingUp,
  Percent,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';

export const InvestmentSimulator: React.FC = () => {
  const [initialAmount, setInitialAmount] = useState<number>(10000000); // 10 Milhões
  const [monthlyContribution, setMonthlyContribution] = useState<number>(250000); // 250 mil/mês
  const [periodYears, setPeriodYears] = useState<number>(5); // 5 anos (60 meses)
  const [annualBenchmarkRatePct, setAnnualBenchmarkRatePct] = useState<number>(11.25); // CDI / Selic
  const [annualInflationPct, setAnnualInflationPct] = useState<number>(4.50); // IPCA
  const [riskPremiumPct, setRiskPremiumPct] = useState<number>(5.50); // Spread Meta Atuarial RPPS

  const [simulationResult, setSimulationResult] = useState<any>(null);

  useEffect(() => {
    runSimulation();
  }, [initialAmount, monthlyContribution, periodYears, annualBenchmarkRatePct, annualInflationPct, riskPremiumPct]);

  const runSimulation = async () => {
    try {
      const data = await api.simulateInvestment({
        initialAmount,
        monthlyContribution,
        periodMonths: periodYears * 12,
        annualBenchmarkRatePct,
        annualInflationPct,
        riskPremiumPct
      });
      setSimulationResult(data);
    } catch (err) {
      console.error('Falha na simulação', err);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Banner Superior do Simulador */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-800 text-xs px-2.5 py-1 rounded-full font-bold mb-2 border border-teal-200">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Calculadora Previdenciária & Estudo de Convergência Atuarial</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Simulador de Investimentos & Meta Atuarial RPPS
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Projete o crescimento futuro da carteira do PREVI-LACERDA sob premissas de aportes regulares, inflação (IPCA), taxa de juros básica e prêmio atuarial.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel Esquerdo: Parametrização */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-900 font-bold text-sm">
            <Sliders className="w-4 h-4 text-teal-700" />
            <span>Parâmetros de Entrada</span>
          </div>

          {/* Saldo Inicial */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span>Saldo Inicial / Patrimônio</span>
              <span className="text-teal-800">{formatCurrency(initialAmount)}</span>
            </div>
            <input
              type="range"
              min={100000}
              max={100000000}
              step={500000}
              value={initialAmount}
              onChange={(e) => setInitialAmount(Number(e.target.value))}
              className="w-full accent-teal-700 cursor-pointer"
            />
          </div>

          {/* Aporte Mensal Recorrente */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span>Aporte Mensal (Servidores + Patronal)</span>
              <span className="text-teal-800">{formatCurrency(monthlyContribution)}/mês</span>
            </div>
            <input
              type="range"
              min={0}
              max={2000000}
              step={25000}
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              className="w-full accent-teal-700 cursor-pointer"
            />
          </div>

          {/* Prazo em Anos */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span>Horizonte de Tempo</span>
              <span className="text-teal-800">{periodYears} anos ({periodYears * 12} meses)</span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={periodYears}
              onChange={(e) => setPeriodYears(Number(e.target.value))}
              className="w-full accent-teal-700 cursor-pointer"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Premissas Macroeconômicas
            </span>

            {/* Inflação IPCA */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Inflação Projetada (IPCA)</span>
                <span className="text-slate-900 font-bold">{annualInflationPct}% a.a.</span>
              </div>
              <input
                type="number"
                step="0.25"
                value={annualInflationPct}
                onChange={(e) => setAnnualInflationPct(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2 font-bold"
              />
            </div>

            {/* Spread da Meta Atuarial */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Spread Meta Atuarial (RPPS)</span>
                <span className="text-teal-800 font-bold">+{riskPremiumPct}% a.a.</span>
              </div>
              <input
                type="number"
                step="0.25"
                value={riskPremiumPct}
                onChange={(e) => setRiskPremiumPct(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2 font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Padrão Conselho Monetário Nacional: 5,50%</span>
            </div>

            {/* Taxa CDI / Selic */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Taxa Selic / CDI Comparativo</span>
                <span className="text-sky-700 font-bold">{annualBenchmarkRatePct}% a.a.</span>
              </div>
              <input
                type="number"
                step="0.25"
                value={annualBenchmarkRatePct}
                onChange={(e) => setAnnualBenchmarkRatePct(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Painel Direito: Resultados & Projeções */}
        <div className="lg:col-span-2 space-y-6">
          {simulationResult && (
            <>
              {/* Cards de Saldo Futuro Projetado */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Meta Atuarial Acumulada */}
                <div className="bg-gradient-to-br from-teal-800 to-teal-950 text-white rounded-xl p-5 shadow-sm">
                  <div className="text-xs text-teal-200 font-bold uppercase">Saldo Final (Meta Atuarial)</div>
                  <div className="text-2xl font-black mt-2">
                    {formatCurrency(simulationResult.finalBalanceActuarial)}
                  </div>
                  <div className="text-[11px] text-teal-300 font-semibold mt-1">
                    Meta: {simulationResult.actuarialTargetAnnualPct}% a.a. (IPCA + spread)
                  </div>
                </div>

                {/* Saldo Benchmark CDI */}
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                  <div className="text-xs text-slate-400 font-bold uppercase">Saldo Final (CDI / Selic)</div>
                  <div className="text-2xl font-black text-slate-900 mt-2">
                    {formatCurrency(simulationResult.finalBalanceBenchmark)}
                  </div>
                  <div className="text-[11px] text-sky-700 font-semibold mt-1">
                    Taxa: {annualBenchmarkRatePct}% a.a.
                  </div>
                </div>

                {/* Total Aportado vs Juros */}
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                  <div className="text-xs text-slate-400 font-bold uppercase">Juros Compostos Ganhos</div>
                  <div className="text-2xl font-black text-emerald-600 mt-2">
                    {formatCurrency(simulationResult.totalInterestEarned)}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-1">
                    Total em aportes: {formatCurrency(simulationResult.totalInvested)}
                  </div>
                </div>
              </div>

              {/* Tabela de Evolução da Simulação */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                  <h2 className="text-sm font-bold text-slate-900">Cronograma de Crescimento Patrimonial Projetado</h2>
                  <span className="text-xs text-slate-400">Valores nominais projetados</span>
                </div>

                <div className="overflow-x-auto max-h-72">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider sticky top-0 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-4">Prazo</th>
                        <th className="py-2.5 px-4 text-right">Total Aportado</th>
                        <th className="py-2.5 px-4 text-right">Saldo CDI</th>
                        <th className="py-2.5 px-4 text-right">Saldo Meta Atuarial</th>
                        <th className="py-2.5 px-4 text-right text-teal-800">Rendimento Acumulado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {simulationResult.timeline.map((point: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-4 font-bold text-slate-900">
                            {point.year} {point.year === 1 ? 'ano' : 'anos'} ({point.month} meses)
                          </td>
                          <td className="py-2.5 px-4 text-right text-slate-600">
                            {formatCurrency(point.totalDeposited)}
                          </td>
                          <td className="py-2.5 px-4 text-right font-semibold text-slate-800">
                            {formatCurrency(point.balanceBenchmark)}
                          </td>
                          <td className="py-2.5 px-4 text-right font-black text-teal-800">
                            {formatCurrency(point.balanceActuarial)}
                          </td>
                          <td className="py-2.5 px-4 text-right font-bold text-emerald-600">
                            +{formatCurrency(point.earningsActuarial)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
