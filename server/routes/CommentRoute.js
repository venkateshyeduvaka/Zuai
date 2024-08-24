const express=require("express")

const {createComment,deleteComment}=require("../controllers/CommentController")

const protectRoute=require("../middleware/protectRoute")



const router=express.Router()

router.post("/create",protectRoute,createComment)
router.delete("/remove",protectRoute,deleteComment)

module.exports=router