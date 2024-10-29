import slugify from "slugify"
import categoryModel from "../models/categoryModel.js"

export const createCategoryController = async(req,res)=>{

    try {
        const {name} = req.body
        if(!name){
            return res.send.status(401).send({message:'name is require'})
        }

        const existingCatgeory = await categoryModel.findOne({name})
        if(existingCatgeory){
            return res.status(200).send({
                succes:true,
                message:'Category Already Exists'
            })
        }
        const category = await new categoryModel({name,slug:slugify(name)}).save()
        res.status(201).send({
            succes:true,
            message:'new category created',
            category
        })


    } catch (error) {
        console.log(error)
        res.status(500).send({
            succes:false,
            error,
            message:'error in category'
        })
        
    }

}


 //update category

 export const updatecategoryController = async (req,res)=>{
    try {

        const {name} = req.body
        const {id} = req.params

        const category = await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})
        res.status(200).send({
            succes:true,
            message:"category Update Sucessfully",
            category
        })
        
    } catch (error) {
        console.log(error)
          res.status(500).send({
            message:'Error while Uploading Category',
            succes:false,
            error
        })
        
    }
}


// getall category 

export const categoryController= async(req,res) =>{
    try {
        const category = await categoryModel.find({})
        res.status(200).send({
            message:"All category",
            succes:true,
            category
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message:'Error while Uploading Category',
            succes:false,
            error
        })
        
    }
}


export const singlecategoryController =async (req,res) =>{
    try {
        
        const Category = await categoryModel.findOne({slug :req.params.slug});
        res.status(200).send({
            succes:true,
            message:"Get Single Category Successfully",
            Category,
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: 'Error while getting Single Category',
            succes:false,
            error,
        })
        
    }
}

//delete category

export const deletecategoryController = async (req,res) =>{

try {

    const {id} = req.params
    await categoryModel.findByIdAndDelete(id)
    res.status(200).send({
        succes:true,
        message:"Delete is Successfully",


    })
    
} catch (error) {
    res.status(500).send({
        message: 'Error while Deleteing Category',
        succes:false,
        error,
    })
    
}

}