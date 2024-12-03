const { Review, Snippet } = require("../models/data");
const addReview = async (req, res) => {
  try {
    const { snippetId } = req.params;
    const { comments } = req.body; // Array of { lineNumber, commentText }

    // Validate comments structure
    if (!Array.isArray(comments) || comments.length === 0) {
      return res.status(400).json({ message: 'Comments must be a non-empty array.' });
    }

    // Check if the snippet exists and belongs to the user's organization
    const snippet = await Snippet.findOne({
      _id: snippetId,
    }).populate('workspace', 'organization');

    if (!snippet || snippet.workspace.organization.toString() !== req.user.organization.toString()) {
      return res.status(404).json({ message: 'Snippet not found or not accessible.' });
    }

    // Create and save the review
    const review = new Review({
      snippet: snippetId,
      reviewer: req.user._id,
      comments, // Array of { lineNumber, commentText }
    });

    await review.save();

    res.status(201).json({ message: 'Review added successfully.', review });
  } catch (error) {
    res.status(500).json({ message: 'Error adding review.', error: error.message });
  }
};

const updateReviewStatus = async (req, res) => {
  try {
    const { snippetId } = req.params;
    const { status } = req.body; // Expected values: 'approved', 'rejected'

    // Validate the status field
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Use "approved" or "rejected".' });
    }

    // Find the review for the snippet by the current reviewer
    const review = await Review.findOne({
      snippet: snippetId,
      reviewer: req.user._id,
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    // Update the review status
    review.status = status;
    await review.save();

    // Optionally update the snippet's reviewStatus
    const snippet = await Snippet.findById(snippetId);
    if (snippet) {
      snippet.reviewStatus = status;
      await snippet.save();
    }

    res.status(200).json({ message: 'Review status updated successfully.', review });
  } catch (error) {
    res.status(500).json({ message: 'Error updating review status.', error: error.message });
  }
};

module.exports = {addReview, updateReviewStatus};