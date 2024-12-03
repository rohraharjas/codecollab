const { Snippet } = require('../models/data.js');
const Workspace = require('../models/workspace.js');

const createSnippet = async (req, res) => {
  try {
    const { title, code, workspaceId } = req.body;

    // Validate required fields
    if (!title || !code || !workspaceId) {
      return res.status(400).json({ message: 'Title, code, and workspaceId are required.' });
    }

    // Check if the workspace exists and belongs to the same organization as the user
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      organization: req.user.organization,
    });

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found or not accessible.' });
    }

    // Create and save the snippet
    const snippet = new Snippet({
      title,
      code,
      workspace: workspaceId,
      uploadedBy: req.user._id, // Developer who uploaded the snippet
    });

    await snippet.save();

    res.status(201).json({ message: 'Snippet created successfully.', snippet });
  } catch (error) {
    res.status(500).json({ message: 'Error creating snippet.', error: error.message });
  }
};

const getSnippetsByWorkspace = async (req, res) => {
    try {
      const { workspaceId } = req.params;
  
      // Check if the workspace belongs to the user's organization
      const workspace = await Workspace.findOne({
        _id: workspaceId,
        organization: req.user.organization,
      });
  
      if (!workspace) {
        return res.status(404).json({ message: 'Workspace not found or not accessible.' });
      }
  
      // Fetch snippets for the specified workspace
      const snippets = await Snippet.find({ workspace: workspaceId });
  
      res.status(200).json({ snippets });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching snippets.', error: error.message });
    }
};

const getSnippetById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the snippet by ID
      const snippet = await Snippet.findOne({
        _id: id,
      }).populate('workspace', 'organization');
  
      // Ensure the snippet's workspace belongs to the user's organization
      if (!snippet || snippet.workspace.organization.toString() !== req.user.organization.toString()) {
        return res.status(404).json({ message: 'Snippet not found or not accessible.' });
      }
  
      res.status(200).json({ snippet });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching snippet.', error: error.message });
    }
  };

  module.exports = {createSnippet, getSnippetsByWorkspace, getSnippetById};