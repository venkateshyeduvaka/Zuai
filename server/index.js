const express=require("express")
const mongoose=require("mongoose")
const dotenv=require("dotenv")

const cors=require("cors")
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");


dotenv.config()

require("cloudinary").config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
 });



const connectDB = require("./config/db");

const UserRoute=require("./routes/UserRoute")
const PostRoute=require("./routes/PostRoute")



const PORT = 4002 || process.env.PORT;

const app=express()



app.use(
   cors({
     origin: "http://localhost:3004",
     credentials: true,
   })
 );

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(express.json())
app.use(cookieParser());


app.use("/api/auth", UserRoute);
app.use("/api/posts",PostRoute)



connectDB().then(()=>{
   app.listen(PORT,()=>{
      console.log("Connected to db",PORT);
      console.log("Server is running");
   })
})


