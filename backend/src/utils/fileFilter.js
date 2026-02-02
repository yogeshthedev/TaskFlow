import ApiError from "../utils/apiError.js";

export const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new ApiError(400, "Only images (jpg, png, webp) and PDFs are allowed"),
      false,
    );
  }

  cb(null, true);
};
