const express = require('express');
const { requireAuth } = require('../middleware/auth');
const rbacMiddleware = require('../middleware/rbac');
const { addReview, updateReviewStatus } = require('../controllers/review_controller');

const router = express.Router();

// Add a review (reviewer only)
router.post('/reviews/:snippetId', requireAuth, rbacMiddleware(['reviewer']), addReview);

// Update review status (reviewer only)
router.patch('/reviews/:snippetId/status', requireAuth, rbacMiddleware(['reviewer']), updateReviewStatus);

module.exports = router;
