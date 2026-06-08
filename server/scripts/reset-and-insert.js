require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const PROD = 'postgresql://neondb_owner:npg_lZTFJVIW34cD@ep-blue-sound-agmpejdk-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require';
const pool = new Pool({ connectionString: PROD });

// Category slug -> DB id mapping (from the DB schema)
const CATEGORIES = {
  'opsta-medicina': 1,
  'kardiologija': 2,
  'nevrologija': 3,
  'pedijatrija': 4,
  'onkologija': 5,
  'psihijatrija': 6,
  'stomatologija': 7,
  'farmacija': 8,
  'ishrana': 9,
  'medicinski-tehnologii': 10,
  'infektivni-bolesti': 11,
  'medicina-na-trud': 12,
  'imunologija': 13,
  'endokrinologija': 14,
  'fitnes-i-prevencija': 15,
  'genetika': 16,
  'farmakologija': 17,
  'javno-zdravje': 18
};

function slugify(text) {
  let s = text.toLowerCase().replace(/[а-я]/g, c => {
    const m = { 'а':'a','б':'b','в':'v','г':'g','д':'d','ѓ':'gj','е':'e','ж':'z','з':'z','ѕ':'dz','и':'i','ј':'j','к':'k','л':'l','љ':'lj','м':'m','н':'n','њ':'nj','о':'o','п':'p','р':'r','с':'s','т':'t','ќ':'kj','у':'u','ф':'f','х':'h','ц':'c','ч':'ch','џ':'dz','ш':'sh' };
    return m[c] || c;
  });
  return s.replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').substring(0, 200);
}

async function main() {
  // 1. DELETE ALL ARTICLES
  console.log('Deleting all existing articles...');
  const delResult = await pool.query('DELETE FROM articles');
  console.log(`Deleted ${delResult.rowCount} articles`);

  // Reset sequence
  await pool.query("ALTER SEQUENCE articles_id_seq RESTART WITH 1");

  // 2. INSERT 5 PER CATEGORY
  const articlesDir = path.join(__dirname, '..', 'articles');
  const catDirs = fs.readdirSync(articlesDir, { withFileTypes: true }).filter(d => d.isDirectory());

  let totalInserted = 0;

  for (const catDir of catDirs) {
    const catSlug = catDir.name;
    const categoryId = CATEGORIES[catSlug];
    if (!categoryId) {
      console.log(`  SKIP: unknown category ${catSlug}`);
      continue;
    }

    const dirPath = path.join(articlesDir, catSlug);
    // Find content files sorted
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('-content.txt')).sort();

    for (const file of files) {
      const baseName = file.replace('-content.txt', '');
      const jsonFile = path.join(dirPath, baseName + '.json');
      const contentFile = path.join(dirPath, file);

      // Check JSON exists
      if (!fs.existsSync(jsonFile)) {
        console.log(`  SKIP: no metadata for ${file}`);
        continue;
      }

      const content = fs.readFileSync(contentFile, 'utf8').trim();
      const meta = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

      let slug = slugify(meta.title);
      // Make unique
      const { rows: existing } = await pool.query('SELECT id FROM articles WHERE slug = $1', [slug]);
      if (existing.length > 0) {
        slug = slug + '-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
      }

      try {
        await pool.query(
          `INSERT INTO articles (title, content, slug, category_id, meta_description)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            meta.title,
            content,
            slug,
            categoryId,
            meta.meta_description || null
          ]
        );
        totalInserted++;
        console.log(`  ✓ ${catSlug}: ${meta.title.substring(0, 50)}...`);
      } catch (err) {
        console.log(`  ✗ ${catSlug}: ${meta.title.substring(0, 50)}... ERROR: ${err.message}`);
      }
    }
  }

  // 3. VERIFY
  const { rows: count } = await pool.query('SELECT COUNT(*) as cnt FROM articles');
  const { rows: cats } = await pool.query(
    "SELECT c.name, COUNT(a.id) as cnt FROM categories c LEFT JOIN articles a ON a.category_id = c.id GROUP BY c.id, c.name ORDER BY c.id"
  );

  console.log(`\n=== FINAL: ${count[0].cnt} articles ===`);
  cats.forEach(r => console.log(`  ${r.name}: ${r.cnt}`));

  await pool.end();
}
main().catch(e => { console.error(e); process.exit(1); });
