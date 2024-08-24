const express=require("express")

const {signup,login,logout,getMe,userProfile}=require("../controllers/UserController")

const protectRoute=require("../middleware/protectRoute")

const router=express.Router()

router.get("/me",protectRoute,getMe)
router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
router.get("/profile/:id",userProfile)

module.exports=router