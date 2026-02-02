import ApiError from "../utils/apiError.js";

export const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      throw new ApiError(401, "Unauthorized");
    }

    if (req.user.role !== requiredRole) {
      throw new ApiError(403, "Forbidden: Insufficient permissions");
    }

    next();
  };
};
