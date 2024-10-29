import express from "express";
import dotenv from "dotenv"
import morgan from "morgan";
import connectDB from "./Config/db.js";
import authRoutes from "./routes/authRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import cors from "cors"




//envirmantal 
dotenv.config()

//rest object
const app = express();

//database
connectDB()


//middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

//routes
app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/category",categoryRoutes)
app.use("/api/v1/prodyct",productRoutes)


//rest API
app.get("/",(req,res)=>{
    res.send('hello')
})

const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log(`server is on ${process.env.DEV_MODE} Running ${PORT}`)
})