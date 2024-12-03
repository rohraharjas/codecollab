const mongoose = require("mongoose");

const snippetSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true }, 
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  }, { timestamps: true });

  const reviewSchema = new mongoose.Schema({
    snippet: { type: mongoose.Schema.Types.ObjectId, ref: 'Snippet', required: true },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comments: [
      {
        lineNumber: { type: Number, required: true }, 
        comment: { type: String, required: true },   
      },
    ],
    status: { type: String, enum: ['approved', 'rejected'], required: true },
    reason: { type: String }, 
  }, { timestamps: true });

const Snippet = mongoose.model('snippet', snippetSchema);
const Review = mongoose.model('comment', reviewSchema);

module.exports = [Snippet, Review];