 import userModels from "../models/UserModel.js"
 import OrderModel from "../models/OrderModel.js"
 import {hashpassword , comparePassword} from "../helpers/authHelper.js"
 import JWT from "jsonwebtoken"
 import dotenv from "dotenv"
 
//envirmantal 
dotenv.config()

export const registerController = async(req,res)=>{

    try {
        const {name,password,address,phone,email,answer} = req.body

        if(!name){
            return res.send({message:"name is Required"})
        }
        if(!password){
            return res.send({message:"password is Required"})
        }
        if(!phone){
            return res.send({message:"phone is Required"})
        }
        if(!email){
            return res.send({message:"email is Required"})
        }
        if(!answer){
            return res.send({message:"email is answer"})
        }


        //checking users
        const exisitingUser = await  userModels.findOne({email})

        if(exisitingUser){
            return res.status(200).send({
                success:true,
                message:"Users is Already exist"
            })
        }

        //register user
        const hashedpassword = await hashpassword(password)
        //save
        const user = new userModels({
            name,email,phone,address,password:hashedpassword,answer
        }).save()

        res.status(201).send({
            success:true,
            message:'user Register success',
            user
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Registeration',
            error
        })
        
    }
 }

 //POST login
 export const loginController = async (req,res) =>{

try {

    const {email,password} = req.body
    //validation 
    if(!email || !password){
        return res.status(404).send({
            success:true,
            message:"Invaild email or password"
        })
    }
    //check user
    const user = await userModels.findOne({email})
    if(!user){
        return res.status(404).send({
            success:false,
            message:"Invalid Email "
        })
    }
    const match = await comparePassword(password,user.password)
    if(!match){
        return res.status(200).send({
            success:false,
            message:"Invaild Password"
        })
   }

   const token = await JWT.sign({_id:user._id},process.env.JWT_SECRET,{
    expiresIn:"7d",
   });
   res.status(200).send({
    success:true,
    message:"login successfully",
    user:{
        name:user.name,
        email:user.email,
        phone: user.phone,
        address:user.address,
        role: user.role
    },
    token
   })

    
} catch (error) {
    console.log(error)
    res.status(500).send({
        success:false,
        message:"error in login",
        error
    })
    
}

 }

export const ForgotPasswordController = async(req,res)=>{


     try {
        const {email,newpassword,answer} = req.body
        if(!email){
            res.status(400).send({message:'Email is required'})
        }
        if(!answer){
            res.status(400).send({message:'answer is required'})
        }
        if(!newpassword){
            res.status(400).send({message:'New password is required'})
        }

        //checking 
        const user = await userModels.findOne({email,answer})
        //vaildation
        
        if(!user){
            return res.status(404).send({
                success:false,
                message:'wrong Email or Answer'
            })
        }

        const hasheded = await hashpassword(newpassword);
        
        await userModels.findByIdAndUpdate(user._id,{password:hasheded})
        res.status(200).send({
            success:true,
            message:"password Rest Succesfully"
        })
        
     } catch (error) {
        res.status(500).send({
            success:false,
            message:'something went wrong',
            error
        })
        
     }

}


//Orders

export const getOrderController = async(req,res)=>{

    try {

        const order = await OrderModel.find({buyer:req.user._id}).populate("products","-photo").populate("buyer")
        res.json(order)
        
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"Error  in Order ",
            error
        })
    }
}




/// test routest

export const testController = (req,res)=>{
    res.send("procted routes")
}