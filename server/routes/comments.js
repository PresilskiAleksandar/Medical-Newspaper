const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

router.get('/article/:articleId', commentController.getByArticle);
router.get('/', authenticate, authorizeAdmin, commentController.getAll);
router.post('/', authenticate, commentController.create);
router.put('/:id/approve', authenticate, authorizeAdmin, commentController.approve);
router.delete('/:id', authenticate, authorizeAdmin, commentController.remove);

module.exports = router;
