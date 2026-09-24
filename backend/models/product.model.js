import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
        },
        slug:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        description:{
            type:String,
            required:true,
            trim:true,
        },
        price:{
            type:Number,
            required:true,
            min:0,
        },
        discountPrice:{
            type:Number,
            default:null,
            min:0,
        },
        stock:{
            type:Number,
            required:true,
            min:0,
        },
        brand:{
            type:String,
            default:"",
            trim:true,
        },
        images:{
            type:[String],
            default:[],
        },
        category:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Category",
            required:true,
        },
        subcategory:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Subcategory",
            required:true,
        },
        isActive:{
            type:Boolean,
            default:true,
        },
    },
    {
        timestamps:true,
    }
);
        
productSchema.index({"category":1});
productSchema.index({"subcategory":1});

const Product = mongoose.model("Product",productSchema);

export default Product;
    
