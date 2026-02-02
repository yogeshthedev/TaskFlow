import ApiResponse from "../../utils/apiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { LoginUser, RegisterUser } from "./auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const user = await RegisterUser(req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully"));
});

export const login = asyncHandler(async (req, res) => {
  const data = await LoginUser(req.body);
  res.cookie("token", data.token);
  return res
    .status(200)
    .json(new ApiResponse(200, data, "User logged in successfully"));
});
