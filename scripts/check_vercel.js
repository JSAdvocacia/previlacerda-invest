const https = require('https');
https.get('https://previlacerda-invest-blue.vercel.app/', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('HTML from Vercel Blue:');
    console.log(data);
  });
}).on('error', console.error);
