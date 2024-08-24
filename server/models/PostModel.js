const mongoose=require("mongoose")

const PostSchema= new  mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref: 'users'},
    title:{type: String, required: true},
    image:{type:String,required:true},
    text: { type: String, required: true },
    likes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    comments: [
        {
          text: {
            type: String,
            required: true,
          },
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
        },
    ],

},

{
    timestamps:true,
}

)
const PostModel=mongoose.model("posts",PostSchema)

module.exports=PostModel