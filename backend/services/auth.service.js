import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/user.repository.js";

const register = async (userData) =>{
    if (!userData || Object.keys(userData).length === 0) {
        throw new Error("No user data provided");
    }
    const {name,email,password,role}=userData;
    const existingUser = await userRepository.findUserByEmail(email);

    if(existingUser){
        throw new Error("user already exists ");
    }

    const hashedpassword = await bcrypt.hash(password,10);
    const newUser = await userRepository.createUser({
        name,
        email,
        password:hashedpassword,
        role,
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

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || "jwt_secret_key",
        { expiresIn: "7d" }
    );

    return { user, token };
};

export default { register, login };