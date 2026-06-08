const path = require('path');
const fs = require('fs');

const CONFIG_PATH = path.join(__dirname, '..', 'config', 'images.json');
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

let usedImages = new Set();

function resetUsedImages() {
  usedImages = new Set();
}

function markUsed(imagePath) {
  if (imagePath) usedImages.add(imagePath);
}

function getAvailableSVGs(prefix) {
  const files = fs.readdirSync(UPLOADS_DIR).filter(f => f.startsWith(prefix) && f.endsWith('.svg'));
  const available = files.filter(f => !usedImages.has('/uploads/' + f));
  return available.length > 0 ? available : files;
}

function getCategoryImage(slug) {
  const catConfig = config.categories[slug];
  if (!catConfig) return '/uploads/medical-fallback.svg';

  // Try SVG first
  const svgFiles = getAvailableSVGs('cat-' + slug);
  if (svgFiles.length > 0) {
    usedImages.add('/uploads/' + svgFiles[0]);
    return '/uploads/' + svgFiles[0];
  }

  // Try JPG
  const jpgPath = path.join(UPLOADS_DIR, 'cat-' + slug + '.jpg');
  if (fs.existsSync(jpgPath)) {
    const imgPath = '/uploads/cat-' + slug + '.jpg';
    usedImages.add(imgPath);
    return imgPath;
  }

  return '/uploads/medical-fallback.svg';
}

function getArticleImage(categorySlug, title, keywords) {
  const catConfig = config.categories[categorySlug];
  if (!catConfig) return '/uploads/medical-fallback.svg';

  // 1. Try specific article mapping
  const specificMap = config.specificArticleImages[categorySlug];
  if (specificMap) {
    for (const [articleTitle, searchTerm] of Object.entries(specificMap)) {
      if (title && title.includes(articleTitle.substring(0, 20))) {
        const topicIdx = config.articleImageKeywords[categorySlug]?.indexOf(searchTerm);
        if (topicIdx >= 0) {
          const svgPath = '/uploads/topic-' + categorySlug + '-' + String(topicIdx + 1).padStart(2, '0') + '.svg';
          if (!usedImages.has(svgPath)) {
            usedImages.add(svgPath);
            return svgPath;
          }
        }
      }
    }
  }

  // 2. Try topic keyword images
  const topicImages = getAvailableSVGs('topic-' + categorySlug);
  if (topicImages.length > 0) {
    usedImages.add('/uploads/' + topicImages[0]);
    return '/uploads/' + topicImages[0];
  }

  // 3. Fallback to category image
  return getCategoryImage(categorySlug);
}

function getImageForArticle(article) {
  const slug = article.category_slug || article.categorySlug || '';
  const title = article.title || '';
  const keywords = (article.tags || '').split(',').map(t => t.trim());
  return getArticleImage(slug, title, keywords);
}

module.exports = { getCategoryImage, getArticleImage, getImageForArticle, resetUsedImages, markUsed };
