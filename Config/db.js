import mongoose from "mongoose";
import dotenv from "dotenv"

//envirmantal 
dotenv.config()



const connectDB = async()=>{

    try {
        const conn = await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000 }
        )
        console.log(`connection  to mongoose Database ${conn.connection.host}`)
        
    } catch (error) {
        console.log(`error in mongoose ${error}`)
        
    }

}

export default connectDB;