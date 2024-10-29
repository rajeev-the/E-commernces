import mongoose, { Types } from "mongoose";

const OrderSchema = new mongoose.Schema({

    products:[
        {
        type:mongoose.ObjectId,
        ref:"products"
    },
],
payment : {},
buyer:{
    type:mongoose.ObjectId,
    ref:'users'
},
status:{
    type:String,
    default:"Not Process",
    enum : ["Not Process", "Processing", "Shipped","Deliverd" , "Cancel"]


}
   
},{timestamps:true})

const Orders = mongoose.model("Order",OrderSchema)

export default Orders