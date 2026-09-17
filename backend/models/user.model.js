import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },

    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    phone:{
        type:String,
        default:"",
        trim:true,
    },
    gender:{
        type:String,
        enum:["male","female","other",""],
        default:"",
    },
    password:{
        type:String,
        required:true,

    },
    role:{
        type:String,
        enum:["customer","admin"],
        default:"customer",
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
},
{
    timestamps:true,
});

const User = mongoose.model("User",userSchema);

export default User;
