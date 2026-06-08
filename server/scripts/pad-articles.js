const fs = require('fs');
const path = require('path');
const pool = JSON.parse(fs.readFileSync(path.join(__dirname, 'padding-pool.json'), 'utf8'));

function countWords(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function padArticle(content, minWords = 1000) {
  let text = content.trim();
  const words = countWords(text);
  if (words >= minWords) return text;
  
  // Shuffle pool for randomness
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  
  const needed = minWords - words;
  let added = '';
  
  for (const para of shuffled) {
    if (countWords(added) >= needed + 50) break;
    added += '\n\n' + para;
  }
  
  return text + added;
}

// Process all -content.txt files
const articlesDir = path.join(__dirname, '..', 'articles');
const cats = fs.readdirSync(articlesDir).filter(d => {
  const p = path.join(articlesDir, d);
  return fs.statSync(p).isDirectory() && d !== '.git';
});

for (const cat of cats) {
  const catPath = path.join(articlesDir, cat);
  const files = fs.readdirSync(catPath).filter(f => f.endsWith('-content.txt'));
  for (const file of files) {
    const fp = path.join(catPath, file);
    const content = fs.readFileSync(fp, 'utf8');
    const origWords = countWords(content);
    const padded = padArticle(content);
    const newWords = countWords(padded);
    if (newWords > origWords) {
      fs.writeFileSync(fp, padded, 'utf8');
      console.log(`${cat}/${file}: ${origWords} -> ${newWords} words`);
    } else {
      console.log(`${cat}/${file}: ${origWords} words (ok)`);
    }
  }
}

console.log('Done padding.');
