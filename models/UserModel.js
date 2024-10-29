import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true
    },
    email:{
        type:String,
        require:true,
        unquie:true
    },
    password:{
        type:String,
        require:true,

    },
    phone:{
        type:String,
        require:true,

    },
    address:{
        type:String,
        require:true
    },
    answer:{
        type:String,
        require:true
    },
    role:{
        type:Number,
    }

},{timestamps:true})

const users = mongoose.model("users",UserSchema)

export default users