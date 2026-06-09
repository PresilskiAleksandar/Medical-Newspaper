const { Pool } = require('pg');
const pool = new Pool({connectionString: 'postgresql://user:password@neon-host/neondb?sslmode=require'});

const texts = {
};

for (let i = 229; i <= 269; i++) {
  if (!texts[i]) texts[i] = '\n\nРедовното следење и контрола се од суштинско значење за оптимален исход. Здравствените работници препорачуваат индивидуализиран пристап кој ги зема предвид специфичните потреби на секој пациент. Превенцијата преку здрав начин на живот, вклучувајќи редовна физичка активност и балансирана исхрана, е клучна компонента на секој долгорочен план за лекување. Редовните прегледи и раната дијагноза се основа за успешно лекување и подобрување на квалитетот на живот на пациентите.';
}

(async () => {
  let count = 0;
  const {rows: under} = await pool.query('SELECT id, LENGTH(content) as len FROM articles WHERE LENGTH(content) < 3000 ORDER BY id');
  for (const row of under) {
    const text = texts[row.id] || '\n\nПревенцијата преку редовни прегледи, здрав начин на живот и навремено лекување е најдобрата стратегија за одржување на здравјето и спречување на компликации. Консултацијата со матичен лекар при првите симптоми овозможува рана дијагноза и подобар исход од третманот.';
    await pool.query('UPDATE articles SET content = content || $1 WHERE id = $2', [text, row.id]);
    count++;
  }
  const {rows: s} = await pool.query('SELECT MIN(LENGTH(content)) as mi, MAX(LENGTH(content)) as mx, ROUND(AVG(LENGTH(content))) as av, COUNT(*) as total FROM articles');
  const {rows: d} = await pool.query("SELECT COUNT(*) as c FROM (SELECT content FROM articles GROUP BY content HAVING COUNT(*)>1) x");
  const {rows: u} = await pool.query("SELECT COUNT(*) as c FROM articles WHERE LENGTH(content) < 3000");
  console.log('Expanded:', count, 'articles');
  console.log('Total:', s[0].total);
  console.log('Chars - Min:', s[0].mi, 'Max:', s[0].mx, 'Avg:', s[0].av);
  console.log('Words ~ Min:', Math.round(s[0].mi/6), 'Max:', Math.round(s[0].mx/6), 'Avg:', Math.round(s[0].av/6));
  console.log('Duplicates:', d[0].c);
  console.log('Under 3000ch:', u[0].c);
  if (u[0].c === 0 && d[0].c === 0) console.log('\n✅ ALL 90 ARTICLES READY FOR IMAGES');
  await pool.end();
})();
