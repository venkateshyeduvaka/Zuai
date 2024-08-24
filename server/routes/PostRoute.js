const express=require("express")

const {createPost,deletePost,updatePost,getAllPosts,getSpecificPost,likeUnlikePost,commentOnPost}=require("../controllers/PostController")

const protectRoute=require("../middleware/protectRoute")



const router=express.Router()


router.post("/create", protectRoute, createPost);
router.delete("/delete/:id", protectRoute, deletePost);
router.put("/update/:id", protectRoute, updatePost);

router.get("/all", protectRoute, getAllPosts);
router.get("/post/:id", protectRoute, getSpecificPost);


router.put("/like", protectRoute, likeUnlikePost);
router.put("/comment:id", protectRoute, commentOnPost);

module.exports=router
