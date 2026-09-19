import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/user.repository.js";

const register = async (userData) =>{
    if (!userData || Object.keys(userData).length === 0) {
        throw new Error("No user data provided");
    }
    const {name,email,password}=userData;
    const existingUser = await userRepository.findUserByEmail(email);

    if(existingUser){
        throw new Error("user already exists ");
    }

    const hashedpassword = await bcrypt.hash(password,10);
    const newUser = await userRepository.createUser({
        name,
        email,
        password:hashedpassword,
        role:"customer",
    });
    return newUser;
};

const login = async (userData) => {
    const { email, password } = userData;
    const user = await userRepository.findUserByEmail(email);

    if (!user) {
        throw new Error("invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("invalid credentials");
    }

    if (user.isVerified === false) {
        throw new Error("Please verify your OTP before login");
    }

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET ,
        { expiresIn: "7d" }
    );

    return { user, token };
};

const verifyOtp = async (userData) => {
    const { email, otp } = userData;

    if (!email || !otp) {
        throw new Error("Email and OTP are required");
    }

    if (otp !== "123456") {
        throw new Error("Invalid OTP");
    }

    const user = await userRepository.findUserByEmail(email);

    if (!user) {
        throw new Error("User not found");
    }

    if (user.isVerified) {
        return user;
    }

    return await userRepository.verifyUser(email);
};

export default { register, login, verifyOtp };
