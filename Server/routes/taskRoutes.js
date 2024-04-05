import express from "express";
import {
  createTask,
  updateTask,
  deleteTask,
  getMyTasks,
  getAllTasks,
  getSingleTask,
} from "../controllers/taskControllers.js";
import { isAuthorized } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", isAuthorized, createTask);
router.delete("/delete/:id", isAuthorized, deleteTask);
router.put("/update/:id", isAuthorized, updateTask);
router.get("/mytasks", isAuthorized, getMyTasks);
router.get("/alltasks", isAuthorized, getAllTasks);
router.get("/single/:id", isAuthorized, getSingleTask);

export default router;
