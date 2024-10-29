import express from "express";
import {registerController , loginController , testController, ForgotPasswordController, getOrderController} from "../controllers/authcontroller.js";
import { requireSignIn ,isAdmin } from "../middleware/authMiddleware.js";


const router = express.Router()

//routing
//Register||post method
router.post('/register',registerController)

//LOGIN || POST

router.post("/login",loginController)

//forgot password 
router.post('/forget-password',ForgotPasswordController)

//test routes || test
router.get("/test",  requireSignIn ,isAdmin ,testController)


/// proctected routh auth 
router.get("/user-auth",requireSignIn ,(req,res)=>{
  res.status(200).send({ok:true})
})


/// proctected route auth For Admin 
router.get("/admin-auth",requireSignIn,isAdmin ,(req,res)=>{
  res.status(200).send({ok:true})
})

router.get("/orders",requireSignIn,getOrderController);

export default router
  






