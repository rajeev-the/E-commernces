import JWT from "jsonwebtoken"
import userModels from "../models/UserModel.js"

//protected Routes token base

export const requireSignIn = async (req,res,next) =>{


    try {
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        req.user = decode;
        next()
        
    } catch (error) {
        console.log(error)
        
    }
    
}

//admin access

export const isAdmin = async(req,res,next)=>{
    try {
        const user = await userModels.findById(req.user._id);
        if(user.role !==1 ){
            return res.status(401).send({
                sucess:false,
                message:"unautherised Access"
            })
            }

            else{
                next()
            }
        
    } catch (error) {
        console.log(error);
        res.send(401).send({
            sucess:false,
            message:"error in admin middleware",
            error
        })
        
    }
}
