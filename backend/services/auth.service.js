import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/user.repository.js";
import AppError from "../utils/appError.js";

const register = async (userData) => {
    if (!userData || Object.keys(userData).length === 0) {
        throw new AppError("No user data provided", 400);
    }

    const { name, email, password } = userData;

    if (!name || !email || !password) {
        throw new AppError("Name, email and password are required", 400);
    }

    const existingUser = await userRepository.findUserByEmail(email);

    if (existingUser) {
        throw new AppError("User already exists", 409);
    }

    const hashedpassword = await bcrypt.hash(password, 10);
    const newUser = await userRepository.createUser({
        name,
        email,
        password: hashedpassword,
        role: "customer",
    });

    return newUser;
};

const login = async (userData) => {
    if (!userData?.email || !userData?.password) {
        throw new AppError("Email and password are required", 400);
    }

    const { email, password } = userData;
    const user = await userRepository.findUserByEmail(email);

    if (!user) {
        throw new AppError("Invalid credentials", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new AppError("Invalid credentials", 401);
    }

    if (user.isVerified === false) {
        throw new AppError("Please verify your OTP before login", 403);
    }

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    return { user, token };
};

const verifyOtp = async (userData) => {
    const { email, otp } = userData || {};

    if (!email || !otp) {
        throw new AppError("Email and OTP are required", 400);
    }

    if (otp !== "123456") {
        throw new AppError("Invalid OTP", 400);
    }

    const user = await userRepository.findUserByEmail(email);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (user.isVerified) {
        return user;
    }

    return await userRepository.verifyUser(email);
};

export default { register, login, verifyOtp };
