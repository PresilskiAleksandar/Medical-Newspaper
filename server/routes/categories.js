const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

router.get('/', categoryController.getAll);
router.get('/:slug', categoryController.getBySlug);
router.post('/', authenticate, authorizeAdmin, categoryController.create);
router.delete('/:id', authenticate, authorizeAdmin, categoryController.remove);

module.exports = router;
