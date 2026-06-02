const bcrypt = require('bcryptjs');
const db = require('./config/db');
require('dotenv').config();

const seed = async () => {
  try {
    console.log('Сеење податоци...');

    const hashedPassword = await bcrypt.hash('admin123', 10);

    await db.query(
      `INSERT INTO users (full_name, email, password, role) VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING`,
      ['Администратор', 'admin@medinfo.mk', hashedPassword, 'admin']
    );
    console.log('✅ Admin user created (admin@medinfo.mk / admin123)');

    const cats = [
      ['Општа медицина', 'opsta-medicina'],
      ['Кардиологија', 'kardiologija'],
      ['Неврологија', 'nevrologija'],
      ['Педијатрија', 'pedijatrija'],
      ['Онкологија', 'onkologija'],
      ['Психијатрија', 'psihijatrija'],
      ['Стоматологија', 'stomatologija'],
      ['Фармација', 'farmacija'],
      ['Исхрана и здравје', 'ishrana-i-zdravje'],
      ['Медицински технологии', 'medicinski-tehnologii'],
    ];

    for (const [name, slug] of cats) {
      await db.query(
        'INSERT INTO categories (name, slug) VALUES ($1, $2) ON CONFLICT (slug) DO NOTHING',
        [name, slug]
      );
    }
    console.log('✅ Categories created');

    const articles = [
      {
        title: 'Нови откритија во лекувањето на дијабетес',
        slug: 'novi-otkritija-lekuvanje-dijabetes',
        excerpt: 'Научниците открија нов пристап во третманот на дијабетес тип 2.',
        content: '<p>Научниците од Медицинскиот факултет во Скопје објавија револуционерно истражување за нов пристап во лекувањето на дијабетес тип 2.</p><p>Новата терапија се базира на комбинација на природни состојки и модерна медицина.</p>',
        category_slug: 'opsta-medicina',
        featured: true,
      },
      {
        title: 'Како да го намалите ризикот од срцев удар',
        slug: 'namalete-rizik-srcev-udar',
        excerpt: 'Превенцијата е клучот за здраво срце.',
        content: '<p>Кардиолозите препорачуваат најмалку 30 минути физичка активност дневно и редовни контроли на крвниот притисок.</p>',
        category_slug: 'kardiologija',
        featured: true,
      },
      {
        title: 'Вакцинација кај деца: Што треба да знаете',
        slug: 'vakcinacija-deca',
        excerpt: 'Комплетен водич за вакцинација кај децата.',
        content: '<p>Вакцинацијата е еден од најважните медицински пронајдоци кој спаси милиони животи.</p>',
        category_slug: 'pedijatrija',
        featured: true,
      },
      {
        title: 'Нов пробив во третманот на рак на дојка',
        slug: 'probiv-tretman-rak-dojka',
        excerpt: 'Најновите терапии за рак на дојка покажуваат извонредни резултати.',
        content: '<p>Најновите клинички испитувања покажаа извонредни резултати во третманот на рак на дојка со имунотерапија.</p>',
        category_slug: 'onkologija',
        featured: true,
      },
      {
        title: 'Ментално здравје: Како да се справите со анксиозноста',
        slug: 'mentalno-zdravje-anksioznost',
        excerpt: 'Практични совети за справување со анксиозноста.',
        content: '<p>Анксиозноста е еден од најчестите ментални нарушувања во современото општество.</p>',
        category_slug: 'psihijatrija',
        featured: false,
      },
      {
        title: 'Вештачка интелигенција во медицината',
        slug: 'vestacka-inteligencija-medicina',
        excerpt: 'Како вештачката интелигенција го трансформира здравствениот сектор.',
        content: '<p>Вештачката интелигенција го револуционизира здравствениот сектор со нови дијагностички алатки.</p>',
        category_slug: 'medicinski-tehnologii',
        featured: true,
      },
    ];

    const userResult = await db.query("SELECT id FROM users WHERE email = 'admin@medinfo.mk'");
    const adminId = userResult.rows[0].id;

    for (const article of articles) {
      const catResult = await db.query('SELECT id FROM categories WHERE slug = $1', [article.category_slug]);
      const catId = catResult.rows[0]?.id || null;

      await db.query(
        `INSERT INTO articles (title, slug, excerpt, content, category_id, author_id, featured)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (slug) DO NOTHING`,
        [article.title, article.slug, article.excerpt, article.content, catId, adminId, article.featured]
      );
    }
    console.log('✅ Articles created');

    console.log('\n🎉 Сеењето е завршено!');
    console.log('   Admin login: admin@medinfo.mk / admin123');
    process.exit(0);
  } catch (err) {
    console.error('Грешка при сеење:', err);
    process.exit(1);
  }
};

seed();
