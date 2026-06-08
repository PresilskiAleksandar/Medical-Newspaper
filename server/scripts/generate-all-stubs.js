const fs = require('fs');
const path = require('path');

const categories = [
  { slug: 'pedijatrija', name: 'pedijatrija', id: 4 },
  { slug: 'onkologija', name: 'onkologija', id: 5 },
  { slug: 'psihijatrija', name: 'psihijatrija', id: 6 },
  { slug: 'ishrana', name: 'ishrana', id: 9 },
  { slug: 'infektivni-bolesti', name: 'infektivni-bolesti', id: 11 },
  { slug: 'imunologija', name: 'imunologija', id: 13 },
  { slug: 'endokrinologija', name: 'endokrinologija', id: 14 },
  { slug: 'fitnes-i-prevencija', name: 'fitnes-i-prevencija', id: 15 },
  { slug: 'genetika', name: 'genetika', id: 16 },
  { slug: 'farmakologija', name: 'farmakologija', id: 17 },
  { slug: 'javno-zdravje', name: 'javno-zdravje', id: 18 },
  { slug: 'stomatologija', name: 'stomatologija', id: 7 },
  { slug: 'farmacija', name: 'farmacija', id: 8 },
  { slug: 'medicinski-tehnologii', name: 'medicinski-tehnologii', id: 10 },
  { slug: 'medicina-na-trud', name: 'medicina-na-trud', id: 12 },
  { slug: 'opsta-medicina', name: 'opsta-medicina', id: 1 },
];

// Topics for each category (prevention, treatment, research, lifestyle, emergency)
const topics = {
  pedijatrija: [
    { title: 'Вакцинација кај деца – нови препораки и безбедност', angle: 'prevention' },
    { title: 'Астма кај деца – современи пристапи во дијагноза и третман', angle: 'treatment' },
    { title: 'Развојна педијатрија – рана интервенција кај развојни нарушувања', angle: 'research' },
    { title: 'Исхрана и физичка активност кај деца – превенција на дебелина', angle: 'lifestyle' },
    { title: 'Итни состојби во педијатријата – препознавање и менаџмент', angle: 'emergency' },
  ],
  onkologija: [
    { title: 'Скрининг програми за рак – значење и предизвици', angle: 'prevention' },
    { title: 'Имунотерапија во онкологијата – нови хоризонти во третманот', angle: 'treatment' },
    { title: 'Персонализирана медицина во третман на рак – геномско профилирање', angle: 'research' },
    { title: 'Живот после рак – значењето на рехабилитација и поддршка', angle: 'lifestyle' },
    { title: 'Итни состојби во онкологијата – тумор лиза синдром и неутропенична треска', angle: 'emergency' },
  ],
  psihijatrija: [
    { title: 'Превенција на ментални растројства – стратегии на популациско ниво', angle: 'prevention' },
    { title: 'Нови антидепресиви и терапии за резистентна депресија', angle: 'treatment' },
    { title: 'Неуробиологија на менталните растројства – нови сознанија', angle: 'research' },
    { title: 'Влијание на социјалните мрежи врз менталното здравје на младите', angle: 'lifestyle' },
    { title: 'Акутна психијатриска состојба – суицидална криза и психоза', angle: 'emergency' },
  ],
  ishrana: [
    { title: 'Медитеранска исхрана и превенција на хронични болести', angle: 'prevention' },
    { title: 'Нутритивна поддршка кај хронични заболувања', angle: 'treatment' },
    { title: 'Микробиом и исхрана – влијание на цревната флора врз здравјето', angle: 'research' },
    { title: 'Растителна исхрана – здравствени придобивки и нутритивна комплетност', angle: 'lifestyle' },
    { title: 'Акутни нутритивни состојби – неухранетост и рефидинг синдром', angle: 'emergency' },
  ],
  'infektivni-bolesti': [
    { title: 'Вакцинација како најмоќна алатка за превенција на инфекции', angle: 'prevention' },
    { title: 'Антимикробна резистенција – глобален предизвик за современата медицина', angle: 'treatment' },
    { title: 'Нови антивирусни лекови во развој – од грип до хепатит', angle: 'research' },
    { title: 'Инфекции поврзани со патувања – превенција и совети за патници', angle: 'lifestyle' },
    { title: 'Итни инфективни состојби – сепса и менингитис', angle: 'emergency' },
  ],
  imunologija: [
    { title: 'Имунизација и имунолошки одговор – како функционира вакцинацијата', angle: 'prevention' },
    { title: 'Автоимуни болести – современи пристапи во третманот', angle: 'treatment' },
    { title: 'Алергии и имунолошка толеранција – нови терапевтски стратегии', angle: 'research' },
    { title: 'Зајакнување на имунитетот преку исхрана и животни навики', angle: 'lifestyle' },
    { title: 'Акутни алергиски реакции – анафилакса и ургентен третман', angle: 'emergency' },
  ],
  endokrinologija: [
    { title: 'Превенција на дијабетес тип 2 – улога на животниот стил', angle: 'prevention' },
    { title: 'Третман на дијабетес – нови инсулини и технологија', angle: 'treatment' },
    { title: 'Тироидни заболувања – дијагноза и современи пристапи', angle: 'research' },
    { title: 'Метаболички синдром – управување со ризик факторите', angle: 'lifestyle' },
    { title: 'Акутни ендокринолошки состојби – дијабетична кетоацидоза и тироидна бура', angle: 'emergency' },
  ],
  'fitnes-i-prevencija': [
    { title: 'Редовна физичка активност за превенција на хронични болести', angle: 'cardio' },
    { title: 'Тренинг со тегови и здравје – придобивки за мускулно-скелетниот систем', angle: 'strength' },
    { title: 'Флексибилност и мобилност – значење за превенција на повреди', angle: 'flexibility' },
    { title: 'Наука за вежбање – оптимален тренинг за различни возрасти', angle: 'exercise_science' },
    { title: 'Превенција на спортски повреди – правилна техника и опоравување', angle: 'injury_prevention' },
  ],
  genetika: [
    { title: 'Генетски скрининг и превенција на наследни болести', angle: 'screening' },
    { title: 'Генска терапија – лекување на наследни заболувања', angle: 'therapy' },
    { title: 'Епигенетика – како животната средина ги менува гените', angle: 'research' },
    { title: 'Генетско тестирање – етички прашања и клиничка примена', angle: 'ethics' },
    { title: 'Ретки генетски болести – дијагноза и менаџмент', angle: 'rare_diseases' },
  ],
  farmakologija: [
    { title: 'Безбедна употреба на лекови – превенција на несакани реакции', angle: 'drug_safety' },
    { title: 'Нови генерации на лекови – од молекула до клиничка пракса', angle: 'new_drugs' },
    { title: 'Клинички испитувања – фази, етика и значење за медицината', angle: 'clinical_trials' },
    { title: 'Фармакогенетика – персонализиран пристап кон терапијата', angle: 'pharmacogenomics' },
    { title: 'Интеракции меѓу лекови – препознавање и менаџмент', angle: 'drug_interactions' },
  ],
  'javno-zdravje': [
    { title: 'Епидемиолошко следење на болести – значење за јавното здравје', angle: 'epidemiology' },
    { title: 'Здравствени политики и реформи во Северна Македонија', angle: 'policy' },
    { title: 'Здравствени системи – организација и финансирање', angle: 'health_systems' },
    { title: 'Национални скрининг програми – организација и ефективност', angle: 'screenings' },
    { title: 'Промоција на здравјето и здравствена едукација на популацијата', angle: 'health_promotion' },
  ],
  stomatologija: [
    { title: 'Превенција на кариес кај деца и возрасни', angle: 'prevention' },
    { title: 'Дигитална стоматологија – CAD/CAM и 3Д печатење', angle: 'treatment' },
    { title: 'Дентална естетика – избелување и композитни реставрации', angle: 'aesthetics' },
    { title: 'Имплантологија – современи техники и материјали', angle: 'surgery' },
    { title: 'Педијатриска стоматологија – пристап кон детскиот пациент', angle: 'pediatric' },
  ],
  farmacija: [
    { title: 'Клиничка фармација – улога на фармацевтот во болнички услови', angle: 'clinical_pharmacy' },
    { title: 'Аптекарска пракса – современи стандарди и услуги', angle: 'community_pharmacy' },
    { title: 'Фармацевтска технологија – нови дозирани форми', angle: 'industrial_pharmacy' },
    { title: 'Регулатива и обезбедување квалитет во фармацијата', angle: 'regulatory' },
    { title: 'Фармацевтска едукација и професионален развој', angle: 'education' },
  ],
  'medicinski-tehnologii': [
    { title: 'Вештачка интелигенција во дијагностиката – нови можности', angle: 'diagnostics' },
    { title: 'Носливи уреди за следење на здравјето', angle: 'wearables' },
    { title: 'Телемедицина – дигитална трансформација на здравството', angle: 'telemedicine' },
    { title: 'Роботска хирургија – прецизност и минимална инвазивност', angle: 'robotics' },
    { title: 'Дигитални здравствени записи – интероперабилност и безбедност', angle: 'ai' },
  ],
  'medicina-na-trud': [
    { title: 'Ергономија на работното место – превенција на повреди', angle: 'ergonomics' },
    { title: 'Професионална изложеност на хемиски супстанции – заштита и превенција', angle: 'chemical_exposure' },
    { title: 'Burnout синдром кај здравствени работници – препознавање и превенција', angle: 'burnout' },
    { title: 'Професионални заболувања – дијагноза и менаџмент', angle: 'occupational_disease' },
    { title: 'Безбедност при работа – проценка на ризик и превентивни мерки', angle: 'workplace_safety' },
  ],
  'opsta-medicina': [
    { title: 'Превентивни прегледи – значење за рано откривање на болести', angle: 'prevention' },
    { title: 'Хронични болести во општа медицина – интегриран пристап', angle: 'chronic_care' },
    { title: 'Дијагноза и третман на акутни инфекции во примарна здравствена заштита', angle: 'acute_care' },
    { title: 'Геријатриска медицина – специфичности на постариот пациент', angle: 'diagnosis' },
    { title: 'Палијативна нега во примарната здравствена заштита', angle: 'referrals' },
  ],
};

const articlesDir = path.join(__dirname, '..', 'articles');

for (const cat of categories) {
  const dir = path.join(articlesDir, cat.slug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  const catTopics = topics[cat.slug] || [];
  catTopics.forEach((topic, idx) => {
    const n = idx + 1;
    const contentFile = path.join(dir, `article-00${n}-content.txt`);
    const metaFile = path.join(dir, `article-00${n}.json`);
    
    if (!fs.existsSync(contentFile)) {
      const content = `${topic.title}\n\nСодржината на овој напис ги обработува клучните аспекти на "${topic.title}" од перспектива на ${topic.angle} кластерот. Написот покрива вовед, позадина, најнови развојни сознанија, симптоми, дијагноза, третман, превенција и заклучок. Овој напис е наменет за медицински професионалци и информирана јавност.`;
      fs.writeFileSync(contentFile, content, 'utf8');
    }
    
    if (!fs.existsSync(metaFile)) {
      const meta = {
        title: topic.title,
        seo_title: topic.title + ' | МедИнфо',
        meta_description: topic.title.substring(0, 155),
        keywords: [topic.title, cat.slug, topic.angle],
        image_prompt: 'Medical illustration related to ' + topic.title,
      };
      fs.writeFileSync(metaFile, JSON.stringify(meta, null, 2), 'utf8');
    }
  });
}

console.log('All category directories and article stubs created.');
