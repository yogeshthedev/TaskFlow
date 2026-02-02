import ApiError from "../../utils/apiError.js";
import User from "./../../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const RegisterUser = async ({ email, password }) => {
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new ApiError(400, "User already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
  });

  return user;
};

export const LoginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  console.log(user)

  if (!user) {
    throw new ApiError(400, "Invalid email or password");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid email or password");
  }
  const token = jwt.sign({ _id: user._id ,role:user.role}, process.env.JWT_SECRET, {
    expiresIn: "5h",
  });


  return { user, token };
};
