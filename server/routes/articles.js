const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', articleController.getAll);
router.get('/featured', articleController.getFeatured);
router.get('/:id', articleController.getById);
router.post('/', authenticate, authorizeAdmin, upload.single('image'), articleController.create);
router.put('/:id', authenticate, authorizeAdmin, upload.single('image'), articleController.update);
router.delete('/:id', authenticate, authorizeAdmin, articleController.delete);

module.exports = router;
