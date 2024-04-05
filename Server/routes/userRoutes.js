import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
  deleteUser,
  getAllUsers,
} from "../controllers/userControllers.js";
import { isAdmin, isAuthorized } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.put("/update/:userId", isAuthorized, updateUser);
router.delete("/delete/:userId", isAuthorized, deleteUser);
router.get("/all-users", isAdmin, getAllUsers);

export default router;
