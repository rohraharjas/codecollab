const express = require('express');
const { requireAuth } = require('../middleware/auth');
const rbacMiddleware = require('../middleware/rbac');
const { createSnippet, getSnippetsByWorkspace, getSnippetById } = require('../controllers/snippets_controller');

const router = express.Router();

// Create a snippet (developer only)
router.post('/snippets', requireAuth, rbacMiddleware(['developer']), createSnippet);

// Get all snippets for a specific workspace
router.get('/snippets/:workspaceId', requireAuth, getSnippetsByWorkspace);

// Get a specific snippet by ID
router.get('/snippets/:id', requireAuth, getSnippetById);

module.exports = router;
