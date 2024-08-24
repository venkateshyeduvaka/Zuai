const mongoose=require("mongoose")

const UserSchema= new  mongoose.Schema({
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, required: true },
},


{
    timestamps:true,
}

)

const UserModel=mongoose.model("users",UserSchema)

module.exports=UserModel