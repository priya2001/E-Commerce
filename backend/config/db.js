import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(" MongoDB connected ");
        console.log("Database:", mongoose.connection.name);
    }
    catch(error){
        console.error("MongoDB connetion failed",error);
        process.exit(1);    
    }
}

export default connectDB;