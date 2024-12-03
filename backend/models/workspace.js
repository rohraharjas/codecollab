const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema({
    "title": {
        type: String,
        required: true,
    },
    "organization": {
        type: String,
        required: true,
    },
    "developer" : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    "reviewer" : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    "admin" : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

const Workspace = mongoose.model('workspace', workspaceSchema);
module.exports = Workspace;