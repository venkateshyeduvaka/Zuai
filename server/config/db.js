

const dotenv=require("dotenv")

const mongoose=require("mongoose")

dotenv.config()



const connectDb=async()=>{
    try {
        //console.log("Database URL:", process.env.JWT_SECRET);
        await mongoose.connect(process.env.DATABASE_URL)
    } catch (error) {
        //console.log("DBBBBB")
        console.log(error)
    }
}

module.exports=connectDb 
