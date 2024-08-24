const PostModel=require("../models/PostModel")

const UserModel=require("../models/UserModel")

const { v2 } = require("cloudinary");
const cloudinary = v2;



const createPost = async (req, res) => {
    try {
      let { text, image,title } = req.body;
  
      const userId = req.user._id;
      const user = await UserModel.findById(userId);
      if (!user) {
        throw Error("User not found");
      }

      const test1 = await PostModel.findOne({ title: title });
      if(test1){
        throw Error("Title Must Me Unique")
      }
  
      if ((!text && !image) && title) {
        throw Error("Post must have text or image and title");
      }
  
      const newPost = new PostModel({
        user: user._id,
        title:title||"",
        image: image || "",
        text: text || "",
      });
      const post = await newPost.save();
  
      res.json({
        message: "Post created successfully",
        data: post,
        success: true,
        error: false,
      });
    } catch (err) {
      res.json({
        message: err.message || err,
        success: false,
        error: true,
      });
    }
  };


  const deletePost = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;
      const user = await UserModel.findById(userId);
      if (!user) {
        throw Error("User not found");
      }
  
      const post = await PostModel.findById(id);
      if (!post) {
        throw Error("Post not found");
      }
  
      if (user._id.toString() !== post.user.toString()) {
        throw Error("You don't have authorize to delete this post");
      }
  
      if (post.image) {
        await cloudinary.uploader.destroy(
          post.image.split("/").pop().split(".")[0]
        );
      }
  
      await PostModel.findByIdAndDelete(id);
  
      res.json({
        message: "Post deleted successfully",
        data: {},
        success: true,
        error: false,
      });
    } catch (err) {
      res.json({
        message: err.message || err,
        success: false,
        error: true,
      });
    }
  };


  const likeUnlikePost = async (req, res) => {
    try {
      const { id: postId } = req.body;
      const userId = req.user._id;
      const post = await PostModel.findById(postId);
      if (!post) {
        throw Error("Post not found");
      }
  
      const userLikedPost = post.likes.includes(userId.toString());
  
      if (userLikedPost) {
        // unlike post
        await PostModel.findByIdAndUpdate(
          { _id: postId },
          { $pull: { likes: userId } }
        );
        //await UserModel.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
  
        res.json({
          message: "Post unliked successfully",
          type: "unlike",
          data: {},
          success: true,
          error: false,
        });
      } else {
        // like post
        post.likes.push(userId);
        //await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
        await post.save();
  
  
        res.json({
          message: "Post liked successfully",
          data: {},
          type: "like",
          success: true,
          error: false,
        });
      }
    } catch (err) {
      res.json({
        message: err.message || "Internal server error",
        success: false,
        error: true,
      });
    }
  };
  
  const commentOnPost = async (req, res) => {
    try {
      const { text } = req.body;
      const { id: postId } = req.params;
      const userId = req.user._id;
  
      if (!text) {
        throw Error("Text field is required");
      }
  
      const post = await PostModel.findById(postId);
      if (!post) {
        throw Error("Post not found");
      }
  
      post.comments.push({ user: userId, text });
  
      await post.save();
  
      res.json({
        message: "comment send successfully",
        data: {},
        success: true,
        error: false,
      });
    } catch (err) {
      res.json({
        message: err.message || err,
        success: false,
        error: true,
      });
    }
  };



  const updatePost = async (req, res) => {
    try {
      const { id } = req.params; 
      const { text,image,title } = req.body; 
      const userId = req.user._id; 
  
     
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
  
      
      const post = await PostModel.findById(id);
      if (!post) {
        throw new Error("Post not found");
      }

  
      
      if (user._id.toString() !== post.user.toString()) {
        throw new Error("You don't have authorization to update this post");
      }

      /*const test1 = await PostModel.findOne({ title: title });
      if(test1){
        throw Error("Title Must Me Unique")
      }
  */
 
      
      if (image) {
        
        if (post.image) {
          await cloudinary.uploader.destroy(
            post.image.split("/").pop().split(".")[0]
          );
        }
  
        // Upload the new image to Cloudinary
        const uploadedImage = await cloudinary.uploader.upload(image, {
          upload_preset: "venkatesh", // Replace with your Cloudinary upload preset
        });
  
        // Update the post with the new image URL
        post.image = uploadedImage.secure_url;
      }
  
      // Update the text if provided
      if (text) {
        post.text = text;
      }
      if(title){
        post.title=title;
      }
  
      // Save the updated post
      const updatedPost = await post.save();
  
      res.json({
        message: "Post updated successfully",
        data: updatedPost,
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

  

  const getSpecificPost=async(req,res)=>{
    try {
      const { id } = req.params;
      const userId = req.user._id;
      const user = await UserModel.findById(userId);
      if (!user) {
        throw Error("User not found");
      }
      const post = await PostModel.findById(id);
      if (!post) {
        throw Error("Post not found");
      }
      res.json({
        message: "Post fetched successfully",
        data: post,
        success: true,
        error: false,
      });

        
    } catch (error) {
        res.json({
            message: err.message || "Internal server error",
            success: false,
            error: true,
          });
    }
  }

  const getAllPosts = async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await UserModel.findById(userId);
      if (!user) {
        throw Error("User not found");
      }
  
      const allPosts = await PostModel.find()
        .sort({ createdAt: -1 })
        .populate({
          path: "user",
          select: "-password",
        })
  
      res.json({
        message: "Posts fetched successfully",
        data: allPosts.length === 0 ? [] : allPosts,
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


  module.exports={createPost,deletePost,updatePost,getAllPosts,getSpecificPost,commentOnPost,likeUnlikePost}