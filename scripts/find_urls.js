const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('C:/Users/Jansen.Pinho/.gemini/antigravity/brain/1f6f19e8-d1ed-4123-b435-b7e5aa359ea7/.system_generated/logs/transcript.jsonl')
});

rl.on('line', (line) => {
  try {
    const obj = JSON.parse(line);
    if (obj.source === 'MODEL' && obj.content) {
      const urls = obj.content.match(/https?:\/\/[^\s\)\"\'\`]+/g);
      if (urls) {
        const filtered = urls.filter(u => !u.includes('gov.br') && !u.includes('supabase.co'));
        if (filtered.length) {
          console.log('Step', obj.step_index, filtered);
        }
      }
    }
  } catch {}
});
