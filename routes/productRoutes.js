import express from 'express'
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import { ProductCategoryController, brainTreePaymentController, braintreeTokenController, createproductController, deleteproductController, getSingleProductController, getproductController, productCountController, productFilterController, productListController, productPhotoController, relatedSimilarController, searchProductController, updateproductController } from '../controllers/productController.js';
import formidable from "express-formidable"

const router = express.Router()

//post 
router.post('/create-product',requireSignIn,isAdmin,formidable(),createproductController)

//  all get products
router.get('/get-product',getproductController)


//single products
router.get("/get-product/:slug",getSingleProductController);

//get photo
router.get('/product-photo/:pid',productPhotoController);

//delete product
router.delete('/product/:pid',deleteproductController);

//update product
router.put('/update-product/:pid',requireSignIn,isAdmin,formidable(),updateproductController)

// product filter
router.post('/product-filters', productFilterController)


// product count

router.get('/product-count' , productCountController)

// product per page

router.get('/product-list/:page',productListController)

//searching router

router.get("/search/:keyword", searchProductController)

// similar product 

router.get("/related-product/:pid/:cid",relatedSimilarController)


// get product by cat

router.get("/product-category/:slug",ProductCategoryController)

//payment gateway

//token
router.get("/braintree/token", braintreeTokenController)


//payment
router.post("/braintree/payment",requireSignIn,brainTreePaymentController)

export default router