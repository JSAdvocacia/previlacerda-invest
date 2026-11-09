const https = require('https');
const SECRET_KEY = process.env.SUPABASE_SECRET_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';
const options = {
  hostname: 'emwutayyleogkfyfhkpd.supabase.co',
  path: '/rest/v1/assets?select=id,name,trading_name,cnpj,portfolio_allocations(total_invested,weight_pct)&order=name.asc',
  headers: { 'apikey': SECRET_KEY, 'Authorization': 'Bearer ' + SECRET_KEY }
};

https.get(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const list = JSON.parse(data);
      console.log('Total de Ativos no Supabase:', list.length);
      let totalInvested = 0;
      list.forEach((a, idx) => {
        const alloc = a.portfolio_allocations && a.portfolio_allocations[0];
        const val = alloc ? Number(alloc.total_invested) : 0;
        totalInvested += val;
        console.log(`${idx + 1}. ${a.trading_name} | CNPJ: ${a.cnpj} | R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
      });
      console.log('----------------------------------------------------');
      console.log('SALDO TOTAL CONSOLIDADO: R$', totalInvested.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
    } catch (e) {
      console.error('Erro:', e.message, data);
    }
  });
}).on('error', console.error);
