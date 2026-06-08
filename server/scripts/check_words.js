const fs = require('fs');
const data = fs.readFileSync('D:/MedicalNewspaper/server/scripts/daily_generator.js', 'utf8');

const articles = [
  [1, 'kardiologija', 'артериска хипертензија'],
  [2, 'kardiologija', 'седечкиот начин'],
  [3, 'nevrologija', 'Алцхајмерова болест'],
  [4, 'nevrologija', 'мултиплекс склероза'],
  [5, 'pedijatrija', 'имунизацијата кај'],
  [6, 'pedijatrija', 'детска исхрана'],
  [7, 'onkologija', 'имунотерапијата за'],
  [8, 'onkologija', 'колоректален карцином'],
  [9, 'psihijatrija', 'Депресија кај'],
  [10, 'psihijatrija', 'нарушувањата на спиењето'],
  [11, 'ishrana', 'Медитеранската исхрана'],
  [12, 'ishrana', 'ултра-обработената храна'],
  [13, 'infektivni-bolesti', 'Антимикробна резистенција'],
  [14, 'infektivni-bolesti', 'Нови вакцини во'],
  [15, 'imunologija', 'третманот на автоимуни'],
  [16, 'imunologija', 'микробиомот го обликува'],
  [17, 'endokrinologija', 'дијабетес тип 2'],
  [18, 'endokrinologija', 'Тироидни заболувања'],
  [19, 'fitnes-i-prevencija', 'Оптимално вежбање'],
  [20, 'fitnes-i-prevencija', 'мускулно-скелетни'],
  [21, 'genetika', 'CRISPR и генско'],
  [22, 'genetika', 'Фармакогенетика'],
  [23, 'farmakologija', 'Развој на нови лекови'],
  [24, 'farmakologija', 'Интеракции меѓу'],
  [25, 'javno-zdravje', 'Здравствените нееднаквости'],
  [26, 'javno-zdravje', 'Улогата на јавното'],
];

let total = 0;
for (const [num, cat, titlePat] of articles) {
  const idx = data.indexOf(titlePat);
  if (idx === -1) { console.log(`#${num} (${cat}): NOT FOUND`); continue; }
  const cs = data.indexOf('content: `', idx);
  if (cs === -1) { console.log(`#${num} (${cat}): content: not found`); continue; }
  const ce = data.indexOf('`,\n', cs + 10);
  if (ce === -1) { console.log(`#${num} (${cat}): closing backtick not found`); continue; }
  const content = data.substring(cs + 10, ce).trim();
  const wc = content.split(/\s+/).length;
  const status = wc >= 1500 ? 'OK' : (wc >= 800 ? 'LOW' : 'SHORT');
  console.log(`#${num} (${cat}): ${wc} words [${status}]`);
  total += wc;
}
console.log(`\nTotal: ${total} words`);
console.log(`Average: ${Math.round(total / 26)} words/article`);
