const express = require('express');
const {requireAuth} = require('../middleware/auth');
const rbacMiddleware = require('../middleware/rbac');
const {createWorkspace, getWorkspaces, getWorkspaceById} = require('../controllers/workspace_controller');

const router = express.Router();

// Create a workspace (admin only)
router.post('/workspaces', requireAuth, rbacMiddleware(['admin']), createWorkspace);

// Get all workspaces
router.get('/workspaces', requireAuth, getWorkspaces);

// Get a specific workspace by ID
router.get('/workspaces/:id', requireAuth, getWorkspaceById);

module.exports = router;
