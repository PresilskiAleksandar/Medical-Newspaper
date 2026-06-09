require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const PROD = 'postgresql://user:password@neon-host/neondb?sslmode=require';
const pool = new Pool({ connectionString: PROD });

function slugify(text) {
  const cyrl = 'абвгдѓежзѕијклљмнњопрстќуфхцчџшАБВГДЃЕЖЗЅИЈКЛЉМНЊОПРСТЌУФХЦЧЏШ';
  const lat =  'abvgdjaezzsijklljmnnjoprstkufhccdzsABVGDJAEZZSIJKLLJMNNJOPRSTKUFHCCDZS';
  let s = '';
  for (const ch of text) {
    const idx = cyrl.indexOf(ch);
    s += idx >= 0 ? lat[idx] : ch;
  }
  return s.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 200) || 'article';
}

async function insertArticle(article) {
  const { title, content, category_id, seo_title, meta_description, keywords, image_prompt } = article;
  const excerpt = content.split('\n\n')[0].substring(0, 200);
  const slug = slugify(title) + '-' + Date.now();
  try {
    await pool.query(
      `INSERT INTO articles (title, slug, excerpt, content, image, category_id, author_id, featured, status, meta_title, meta_description, source_name, source_url, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())`,
      [
        title,
        slug,
        excerpt,
        content,
        'pending-image',
        category_id,
        1,
        false,
        'DRAFT',
        seo_title || title,
        meta_description || excerpt.substring(0, 155),
        'МедИнфо',
        'https://medinfo.mk',
      ]
    );
    console.log(`  ✓ Inserted: ${title.substring(0, 60)}`);
    return true;
  } catch (e) {
    if (e.code === '23505') {
      console.log(`  ~ Duplicate slug, retrying with unique...`);
      const uniqueSlug = slugify(title) + '-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
      try {
        await pool.query(
          `INSERT INTO articles (title, slug, excerpt, content, image, category_id, author_id, featured, status, meta_title, meta_description, source_name, source_url, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())`,
          [title, uniqueSlug, excerpt, content, 'pending-image', category_id, 1, false, 'DRAFT', seo_title || title, meta_description || excerpt.substring(0, 155), 'МедИнфо', 'https://medinfo.mk']
        );
        console.log(`  ✓ Inserted (with unique slug): ${title.substring(0, 60)}`);
        return true;
      } catch(e2) {
        console.log(`  ✗ Insert error: ${e2.message}`);
        return false;
      }
    }
    console.log(`  ✗ Insert error: ${e.message}`);
    return false;
  }
}

async function main() {
  const articlesDir = path.join(__dirname, '..', 'articles');
  
  if (!fs.existsSync(articlesDir)) {
    console.log('No articles directory found.');
    await pool.end();
    return;
  }
  
  const categories = fs.readdirSync(articlesDir).filter(d => {
    return fs.statSync(path.join(articlesDir, d)).isDirectory();
  });
  
  let totalInserted = 0;
  
  for (const catDir of categories) {
    const catPath = path.join(articlesDir, catDir);
    const files = fs.readdirSync(catPath).filter(f => f.endsWith('-content.txt'));
    
    if (files.length === 0) continue;
    console.log(`\nCategory: ${catDir} (${files.length} articles)`);
    
    // Get category_id
    const {rows: catRow} = await pool.query('SELECT id FROM categories WHERE slug = $1', [catDir]);
    if (catRow.length === 0) {
      console.log(`  Unknown category: ${catDir}, skipping`);
      continue;
    }
    const categoryId = catRow[0].id;
    
    for (const file of files) {
      const contentPath = path.join(catPath, file);
      const content = fs.readFileSync(contentPath, 'utf8').trim();
      
      // Check word count
      const words = content.split(/\s+/).filter(Boolean).length;
      if (words < 1000) {
        console.log(`  ✗ ${file}: ${words} words (too short, skipping)`);
        continue;
      }
      
      // Read corresponding metadata if exists
      const metaFile = file.replace('-content.txt', '.json');
      const metaPath = path.join(catPath, metaFile);
      let meta = {};
      if (fs.existsSync(metaPath)) {
        meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      }
      
      // Extract title from first line of content
      const lines = content.split('\n');
      const title = lines[0].trim() || meta.title || file.replace('-content.txt', '');
      const body = lines.slice(1).join('\n').trim();
      
      const article = {
        title,
        content: body || content,
        category_id: categoryId,
        seo_title: meta.seo_title || title,
        meta_description: meta.meta_description || title.substring(0, 155),
        keywords: meta.keywords || [],
        image_prompt: meta.image_prompt || '',
      };
      
      const ok = await insertArticle(article);
      if (ok) totalInserted++;
    }
  }
  
  console.log(`\n=== Total inserted: ${totalInserted} articles ===`);
  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
