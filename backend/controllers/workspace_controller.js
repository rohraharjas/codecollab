const Workspace = require('../models/workspace');

const createWorkspace = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Ensure required fields are provided
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required.' });
    }

    // Create and save the workspace
    const workspace = new Workspace({
      name,
      description,
      organization: req.user.organization, // Associate with the user's organization
      createdBy: req.user._id, // Track the admin who created the workspace
    });

    await workspace.save();

    res.status(201).json({ message: 'Workspace created successfully.', workspace });
  } catch (error) {
    res.status(500).json({ message: 'Error creating workspace.', error: error.message });
  }
};

const getWorkspaces = async (req, res) => {
    try {
      const organizationId = req.user.organization; // Fetch user's organization
  
      // Find workspaces for the user's organization
      const workspaces = await Workspace.find({ organization: organizationId });
  
      res.status(200).json({ workspaces });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching workspaces.', error: error.message });
    }
};

const getWorkspaceById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the workspace by ID and ensure it belongs to the user's organization
      const workspace = await Workspace.findOne({
        _id: id,
        organization: req.user.organization, // Restrict access to workspaces in the user's organization
      });
  
      if (!workspace) {
        return res.status(404).json({ message: 'Workspace not found.' });
      }
  
      res.status(200).json({ workspace });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching workspace.', error: error.message });
    }
};

module.exports = {createWorkspace, getWorkspaces, getWorkspaceById};