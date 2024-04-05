import { asyncErrorHandler } from "../middlewares/asyncErrorHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userModel.js";
import cloudinary from "cloudinary";
import { sendToken } from "../utils/jwtToken.js";

export const registerUser = asyncErrorHandler(async (req, res, next) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password) {
    return next(new ErrorHandler("All Details are Required", 400));
  }
  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler("User Already Exists", 400));
  }
  try {
    user = await User.create({
      name,
      email,
      phone,
      password,
    });
    sendToken("User Registered Successfully", user, res, 200);
  } catch (error) {
    next(error);
  }
});

export const loginUser = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("All Details are Required", 400));
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorHandler("User Not Found", 400));
    }
    const isPassword = await user.comparePassword(password);
    if (!isPassword) {
      return next(new ErrorHandler("Incorrect Password", 400));
    }
    sendToken("User Logged In Successfully", user, res, 200);
  } catch (error) {
    next(error);
  }
});

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(new ErrorHandler("You're not Allowed to Update this User"));
  }
  if (req.body.password) {
    if (req.body.password.length < 5) {
      return next(new ErrorHandler("Password Must be Atleast 6 Characters"));
    }
    const salt = genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }
  let updateFields = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
  };

  if (req.files && req.files.avatar) {
    const { avatar } = req.files;
    const allowedFormats = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/webp",
    ];
    if (!allowedFormats.includes(avatar.mimetype)) {
      return next(
        new ErrorHandler(
          "Please Upload Avatar in png, jpg, jpeg, webp Formats",
          400
        )
      );
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(
      avatar.tempFilePath
    );
    if (!cloudinaryResponse || cloudinary.error) {
      return next(
        new ErrorHandler("Error Uploading Avatar to Cloudinary", 400)
      );
    }
    updateFields.avatar = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: updateFields,
      },
      { new: true }
    );
    sendToken("User Updated Successfully", updatedUser, res, 200);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId);
  if (!user.isAdmin && user._id !== req.params.userId) {
    return next(
      new ErrorHandler("You're not Allowed to delete this User", 400)
    );
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res
      .status(200)
      .clearCookie("token")
      .json({ success: true, message: "User has been Deleted Successfully" });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = asyncErrorHandler(async (req, res, next) => {
  res
    .status(200)
    .clearCookie("token")
    .json({ success: true, message: "User Logged Out Successfully" });
});

export const getAllUsers = asyncErrorHandler(async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(
      new ErrorHandler("You're not Allowed to Access all Users", 400)
    );
  }
  try {
    const users = await User.find();
    if (!users) {
      return next(new ErrorHandler("No User Found", 400));
    }
    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
});
