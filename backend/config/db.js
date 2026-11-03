import mongoose from "mongoose"

const connectDb= async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("mongoose database is connected successfully");
    }catch(error){
        console.log("error connecting mongoose database", error)
    }
}

export default connectDb;