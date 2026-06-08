require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { spawn } = require('child_process');
const path = require('path');

console.log('=== МедИнфо Seed Статии ===');
console.log('Оваа скрипта ги креира првичните 26 статии (2 по категорија)');
console.log('Повикува daily_generator.js со --count=2\n');

const child = spawn('node', [path.join(__dirname, 'daily_generator.js'), '--count=2'], {
  stdio: 'inherit',
  cwd: path.join(__dirname, '..'),
  env: { ...process.env },
});

child.on('exit', (code) => {
  console.log(`\nSeed скриптата заврши со код ${code}`);
  process.exit(code);
});
