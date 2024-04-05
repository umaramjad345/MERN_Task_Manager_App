import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Required"],
      minLenth: [3, "Name Must Contain atleast 3 Characters"],
      maxLength: [30, "Name can't Exceed 30 Characters"],
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: [true, "User Already Registered!"],
      validate: [validator.isEmail, "Please Provid a Valid Email!"],
    },
    phone: {
      type: Number,
      required: [true, "Phone Number is Required!"],
      minLenth: [11, "Name Must Contain 11 Characters"],
      maxLenth: [11, "Name Must Contain 11 Characters"],
    },
    password: {
      type: String,
      required: [true, "Password is Required!"],
      minLenth: [5, "Password Must Contain atleast 5 Characters"],
      maxLength: [32, "Password can't Exceed 32 Characters"],
      // select: false,
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
        default: "1qazxsw23edcvfr4",
      },
      url: {
        type: String,
        required: true,
        default:
          "https://www.murrayglass.com/wp-content/uploads/2020/10/avatar-768x768.jpeg",
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

export const User = mongoose.model("User", userSchema);
