import { User } from "../models/userModel.js";
import { asyncErrorHandler } from "./asyncErrorHandler.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

export const isAuthorized = asyncErrorHandler(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("User isn't Authorized", 400));
  }
  const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = user;
  // req.user = await User.findById(verifiedUser.id);
  next();
});

export const isAdmin = asyncErrorHandler(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("User isn't Authorized", 400));
  }
  const verifiedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(verifiedUser.id);
  next();
});
