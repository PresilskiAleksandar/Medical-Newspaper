const imageService = require('../services/imageService');

function resetUsedImages() { imageService.resetUsedImages(); }
function markUsed(imagePath) { imageService.markUsed(imagePath); }
function getCategoryImage(slug) { return imageService.getCategoryImage(slug); }
function getImageForArticle(article) {
  return imageService.getArticleImage(
    article.title || '',
    article.content || '',
     article.category_slug || article.categorySlug || '',
    article.tags || ''
  );
}
function extractKeywords(title, content) { return imageService.extractKeywords(title || '', content || '', ''); }

module.exports = { getCategoryImage, getImageForArticle, extractKeywords, resetUsedImages, markUsed };
