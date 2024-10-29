import slugify from "slugify";
import productModel from "../models/productModel.js"
import fs from "fs"
import categoryModel from "../models/categoryModel.js";
import OrderModel from "../models/OrderModel.js";
import braintree from "braintree";
import  dotenv  from "dotenv";

dotenv.config()
//payment gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
  });



export const createproductController = async (req,res) =>{


    try {

        const {name,slug,description,price,category,quantity,shipping} = req.fields;
        const {photo} = req.files;

        //alidation
        switch(true){
            case !name:
                return res.status(500).send({error: " Name is Require"})

            case !description:
                return res.status(500).send({error: "description  is Require"})   
                    
            case !category:
                return res.status(500).send({error: " price is Require"})   

            case !quantity:
                return res.status(500).send({error: " price is Require"})
                
            case photo && photo.size > 1000000:
                return res.status(500).send({error: " photo is Require and should be less then 1mb"})  
                
        }

         const products = new productModel({...req.fields,slug:slugify(name)})
         if(photo){
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
         }

        await products.save();
        res.status(201).send({
            success:true,
            message : 'Product is craete sucessfully'
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error in creating product '
        })
        
    }


}


//get all products

export const getproductController = async (req,res)=>{

    try {
        const products  = await productModel
        .find({})
        .populate('category')
        .select("-photo")
        .limit(12)
        .sort({createdAt:-1})
        res.status(200).send({
            success:true,
            message:"All Products",
            counTotal: products.length,
            products,
            
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({

            success :false,
            message :"Error is Not Getting products",
            error:error.message
        })
       

        
    }
}

//get single product 

export const getSingleProductController = async(req,res)=>{

    try {

        const product = await productModel
        .findOne({slug:req.params.slug})
        .populate('category')
        .select("-photo")
        res.status(200).send({
            success:true,
            message:"Single Products Fetched",
            product
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error in get product"
           
        })

        
    }
}

// get photo

export const productPhotoController = async(req,res)=>{

    try {

        const product = await productModel.findOne({_id: req.params.pid }).select("photo")
        
        if(product.photo.data){
            res.set("Content-type",product.photo.contentType);
            return res.status(200).send(product.photo.data)
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error While getting photo',
            error
        })
        
    }

}

// delete the product

export const deleteproductController = async (req,res)=>{

    try {

        await productModel.findByIdAndDelete(req.params.pid).select("-photo")
        req.status(200).send({
            success:true,
            message:'Product Deleted sucessfully',
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error while deleting products',
            error
        })
        
    }

}


// upadte product

export const updateproductController = async (req,res)=>{

    try {

        const {name,slug,description,price,category,quantity,shipping} = req.fields;
        const {photo} = req.files;

        //validation
        switch(true){
            case !name:
                return res.status(500).send({error: " Name is Require"})

            case !description:
                return res.status(500).send({error: "description  is Require"})   
                    
            case !category:
                return res.status(500).send({error: " category is Require"})   

            case !quantity:
                return res.status(500).send({error: " quantity is Require"})
                
            case photo && photo.size > 1000000:
                return res.status(500).send({error: " photo is Require and should be less then 1mb"})  
                
        }

         const products = await new productModel.findOneAndUpdate(req.params.pid,
            {...req.fields,slug:slugify(name)} ,{new:true}
            )
         if(products.photo){
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
         }

        await products.save();
        res.status(201).send({
            success:true,
            message : 'Product is updated sucessfully'
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error in update product '
        })
    }
}


// filter products

export const productFilterController = async (req,res)=>{



    try {
    
        const { checked , radio} = req.body

        let args = {}
        if(checked.length > 0) args.category = checked
        if(radio.length) args.price = {$gte : radio[0] , $lte:radio[1]}
        const products = await productModel.find(args)
        res.status(200).send({
            success: true,
            products
        })
        
    } catch (error) {
        console.log(error)
        res.status(200).send({
        success: false,
        message:'Error While Filteing Products',
        error
        })
        
    }
}

// product count


export const productCountController = async (req,res)=>{


    try {
        

        const total = await productModel.find({}).estimatedDocumentCount()
        res.status(200).send({
            success:true,
            total
        })


    } catch (error) {
      console.log(error)
      res.status(400).send({
        message:'Error in Product Count',
        error,
        success:false
      })

        
    }
}


export const productListController = async(req,res)=>{

    try {

        const perpage = 6 
        const page = req.params.page ? req.params.page : 1 ;
        const products = await productModel
         .find({})
         .select("-photo")
         .skip((page -1)* perpage)
         .limit(perpage)
         .sort({createdAt :-1})
        res.status(200).send({
            success:true,
            products,
        }) 
        
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            message:'Error in per page ctrl'
        })
        
    }
}


// seacrching controller

export const searchProductController = async(req,res)=>{

    try {

        const {keyword} = req.params
        const result = await productModel.find({
            $or:[
                {name:{$regex : keyword , $options:"i"}},
                {description:{$regex : keyword , $options:"i"}}

            ]
        }).select('-photo')
        res.json(result)
        
    } catch (error) {
        console.log(error)
        res.status(200).send({
            success:false,
            message: 'Error in seaching product API'

        })
        
    }

} 

// realted Products

export const relatedSimilarController = async (req,res)=>{
    try {

        const { pid , cid} = req.params
        const products = await  productModel.find({
            category:cid,
            _id: {$ne: pid }
        })
        .select("-photo")
        .limit(3)
        .populate("category");
        res.status(200).send({
            success:true,
            message:" success similar ",
            products
        })

        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error in Realted Poducts",
            error
        })
        
    }

}


// get prodcuts by category 

export const ProductCategoryController = async (req,res)=>{

    try {
        const category = await categoryModel.findOne({ slug: req.params.slug});
       const prodcuts = await productModel.find({category}).populate("category");
       res.status(200).send({
        success:true,
        category,
        prodcuts
       })
        
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success:false,
            message:"Error While Getting Products",
            error
        })
        
    }
}


//payment gateway api

export const braintreeTokenController =async (req,res)=>{

    try {
        gateway.clientToken.generate({},function(err,response){
            if(err){
                res.status(500).send(err)
            }
            else{
                res.send(response)
            }
        })
        
    } catch (error) {
        console.log(error)
        
    }
}


//payment

export const brainTreePaymentController =async (req,res)=>{

    try {

        const {cart,nonce} = req.body;
        let total = 0 ;
        cart.map((i)=>{
            total += i.price;
        })

        let newtransaction = gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options:{
                submitForSettlement:true,
            },
        },
        function (error,result){
            if(result){
                const order = new OrderModel({

                    products:cart,
                    payment:result,
                    buyer:req.user._id,

                }).save();
                res.json({ok:true})
            }
            else{
                res.status(500).send(error);
            }
        }
    
    );

        
    } catch (error) {
        console.log(error)

        
    }
}