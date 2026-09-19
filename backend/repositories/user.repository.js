import User from "../models/user.model.js";

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const createUser = async (userData) => {
  return await User.create(userData);
};

const verifyUser = async (email) => {
  return await User.findOneAndUpdate(
    { email },
    { isVerified: true },
    { returnDocument: "after" }
  );
};

export default {findUserByEmail,createUser,verifyUser};
