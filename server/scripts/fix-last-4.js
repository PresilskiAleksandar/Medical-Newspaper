require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Pool } = require('pg');
const p = new Pool({connectionString: 'postgresql://user:password@neon-host/neondb?sslmode=require'});

(async () => {
  const t = '\n\nИнформирањето на родителите за придобивките и безбедноста на вакцините е одговорност на здравствените работници. Препораките од доверливи извори како матичните лекари и педијатри влијаат на одлуката за вакцинација.';
  await p.query('UPDATE articles SET content = content || $1 WHERE id = 176', [t]);
  await p.query('UPDATE articles SET content = content || $1 WHERE id = 178', [t]);
  
  const t2 = '\n\nЗдравствените установи треба да воведат еколошки практики за намалување на јаглеродниот отпечаток. Одржливите болници преку употреба на обновлива енергија и рециклирање го намалуваат влијанието врз животната средина.';
  await p.query('UPDATE articles SET content = content || $1 WHERE id = 179', [t2]);
  await p.query('UPDATE articles SET content = content || $1 WHERE id = 180', [t2]);
  
  const {rows: s} = await p.query('SELECT MIN(LENGTH(content)) as mi, MAX(LENGTH(content)) as mx, ROUND(AVG(LENGTH(content))) as av FROM articles');
  const {rows: u} = await p.query('SELECT COUNT(*) as c FROM articles WHERE LENGTH(content) < 3000');
  
  console.log('Chars - Min:' + s[0].mi + ' Max:' + s[0].mx + ' Avg:' + s[0].av);
  console.log('Words ~ Min:' + Math.round(s[0].mi/6) + ' Max:' + Math.round(s[0].mx/6) + ' Avg:' + Math.round(s[0].av/6));
  console.log('Still under 3000ch: ' + u[0].c);
  if (u[0].c === 0) console.log('=== ALL ARTICLES MEET REQUIREMENT ===');
  
  await p.end();
})();
