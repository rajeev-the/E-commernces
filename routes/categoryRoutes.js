import  express  from "express";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import { categoryController, createCategoryController ,deletecategoryController,singlecategoryController,updatecategoryController } from "../controllers/createCategoryController.js";

const router = express.Router()

//routes
router.post('/create-category',requireSignIn,isAdmin,createCategoryController)
//update
router.put('/update-category/:id',requireSignIn,isAdmin,updatecategoryController)

//getAll category
router.get('/get-category',categoryController)

//single category
router.get("/single-category/:slug",singlecategoryController)

//delete category
router.delete('/delete-category/:id',requireSignIn,isAdmin,deletecategoryController)

export default router