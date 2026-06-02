const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

router.get('/stats', authenticate, authorizeAdmin, adminController.getStats);
router.get('/users', authenticate, authorizeAdmin, adminController.getUsers);
router.put('/users/:id/role', authenticate, authorizeAdmin, adminController.toggleUserRole);

module.exports = router;
