require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Pool } = require('pg');

function countWords(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function trimContentToLength(content, minWords = 1000, maxWords = 2500, targetWords = 1600) {
  const words = content.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (wordCount >= minWords && wordCount <= maxWords) return { text: content, original: wordCount, final: wordCount };

  if (wordCount > maxWords) {
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim());
    let result = [];
    let accumulated = 0;
    for (const p of paragraphs) {
      const pWordCount = p.split(/\s+/).filter(Boolean).length;
      if (accumulated + pWordCount > targetWords && accumulated >= minWords) break;
      if (accumulated + pWordCount > maxWords && accumulated < minWords) {
        result.push(p);
        break;
      }
      result.push(p);
      accumulated += pWordCount;
    }
    const trimmed = result.join('\n\n');
    return { text: trimmed, original: wordCount, final: countWords(trimmed) };
  }

  return { text: content, original: wordCount, final: wordCount };
}

const TEMPLATE_CONTENT_BY_CATEGORY = {};

const CATEGORY_SLUG_BY_ID = {};

const CATEGORY_FALLBACK = {
  stomatologija: 'kardiologija',
  farmacija: 'farmakologija',
  'medicinski-tehnologii': 'onkologija',
  'medicina-na-trud': 'fitnes-i-prevencija',
  'opsta-medicina': 'kardiologija',
};

function getTemplateContentForCategory(slug) {
  const { ARTICLE_TEMPLATES } = require('./daily_generator');
  const templates = ARTICLE_TEMPLATES[slug];
  if (templates && templates.length > 0) {
    return trimContentToLength(templates[0].content).text;
  }
  const fallbackSlug = CATEGORY_FALLBACK[slug];
  if (fallbackSlug) {
    const fallbackTemplates = ARTICLE_TEMPLATES[fallbackSlug];
    if (fallbackTemplates && fallbackTemplates.length > 0) {
      return trimContentToLength(fallbackTemplates[0].content).text;
    }
  }
  return null;
}

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }

  const db = new Pool({ connectionString: dbUrl });

  console.log('=== Trim Article Content + Fill Short Articles ===\n');

  const cats = await db.query('SELECT id, slug FROM categories');
  for (const c of cats.rows) {
    CATEGORY_SLUG_BY_ID[c.id] = c.slug;
  }

  const articles = await db.query(`
    SELECT a.id, a.title, a.content, a.category_id
    FROM articles a
    ORDER BY a.id
  `);
  console.log(`Total articles: ${articles.rows.length}\n`);

  let trimmed = 0;
  let filled = 0;
  let unchanged = 0;
  let errors = 0;

  for (const article of articles.rows) {
    const { text: newContent, original, final } = trimContentToLength(article.content);

    if (original >= 1000 && original <= 2500) {
      unchanged++;
      continue;
    }

    if (original > 2500) {
      await db.query('UPDATE articles SET content = $1 WHERE id = $2', [newContent, article.id]);
      console.log(`  TRIM  id=${article.id} (${original}->${final}) ${article.title.substring(0, 50)}`);
      trimmed++;
      continue;
    }

    if (original < 1000) {
      const catSlug = CATEGORY_SLUG_BY_ID[article.category_id];
      if (!catSlug) {
        console.log(`  SKIP  id=${article.id} (${original}) no category mapping`);
        unchanged++;
        continue;
      }

      let catContent = TEMPLATE_CONTENT_BY_CATEGORY[catSlug];
      if (!catContent) {
        catContent = getTemplateContentForCategory(catSlug);
        if (catContent) TEMPLATE_CONTENT_BY_CATEGORY[catSlug] = catContent;
      }

      if (catContent) {
        await db.query('UPDATE articles SET content = $1 WHERE id = $2', [catContent, article.id]);
        console.log(`  FILL  id=${article.id} (${original}->${countWords(catContent)}) ${article.title.substring(0, 50)}`);
        filled++;
      } else {
        console.log(`  SKIP  id=${article.id} (${original}) no template for ${catSlug}`);
        unchanged++;
      }
    }
  }

  console.log(`\n=== Results ===`);
  console.log(`  Trimmed (over 2500): ${trimmed}`);
  console.log(`  Filled (under 1000): ${filled}`);
  console.log(`  Unchanged (in range): ${unchanged}`);
  console.log(`  Errors: ${errors}`);

  await db.end();
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
