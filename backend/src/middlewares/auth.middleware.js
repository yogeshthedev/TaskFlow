import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded);

    req.user = decoded;
    next();
  } catch (error) {
    throw new ApiError(401, "Unauthorized");
  }
};
