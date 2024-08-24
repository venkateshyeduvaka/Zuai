const CommentModel = require("../models/CommentModel");
const PostModel = require("../models/PostModel");
const UserModel = require("../models/UserModel");

const createComment = async (req, res) => {
  try {
    const { postId, comment } = req.body; 
    const userId = req.user._id;

    const post = await PostModel.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const newComment = new CommentModel({
      user: userId,
      post: postId,
      comment,
    });

    // Save the comment
    const savedComment = await newComment.save();

    res.json({
      message: "Comment created successfully",
      data: savedComment,
      success: true,
      error: false,
    });
  } catch (err) {
    res.json({
      message: err.message || "Internal server error",
      success: false,
      error: true,
    });
  }
};


const deleteComment = async (req, res) => {
  try {
    const { id } = req.params; 
    const userId = req.user._id; 

    
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

   
    const comment = await CommentModel.findById(id);
    if (!comment) {
      throw new Error("Comment not found");
    }

    
    if (comment.user.toString() !== userId.toString()) {
      throw new Error("You don't have authorization to delete this comment");
    }

    
    await CommentModel.findByIdAndDelete(id);

    res.json({
      message: "Comment deleted successfully",
      data: {},
      success: true,
      error: false,
    });
  } catch (err) {
    res.json({
      message: err.message || "Internal server error",
      success: false,
      error: true,
    });
  }
};


module.exports={createComment,deleteComment}