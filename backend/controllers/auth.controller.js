import authservice from "../services/auth.service.js";

const register = async (req,res)=>{
    console.log("register req.body:", req.body);
    try{
        const user = await authservice.register(req.body);
        res.status(201).json({
            success:true,
            message:"user registered scuccessfully",
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
            },

        });
    }
        catch(error){
            res.status(400).json({
                success:false,
                message:error.message,
            });
            
        }
}

const login = async (req,res)=>{
    try{
        const { user, token } = await authservice.login(req.body);
        res.status(200).json({
            success:true,
            message:"user logged in successfully",
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
            },
        });
    }
    catch(error){
        console.error(error);
        res.status(400).json({
            success:false,
            message:error.message,
        });
    }
}

export default {register,login};
