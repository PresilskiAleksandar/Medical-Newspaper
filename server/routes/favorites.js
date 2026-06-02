const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, favoriteController.getUserFavorites);
router.post('/', authenticate, favoriteController.add);
router.delete('/:id', authenticate, favoriteController.remove);
router.get('/check/:articleId', authenticate, favoriteController.check);

module.exports = router;
