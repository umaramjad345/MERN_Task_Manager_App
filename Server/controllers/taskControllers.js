import { asyncErrorHandler } from "../middlewares/asyncErrorHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { Task } from "../models/taskModel.js";
import { User } from "../models/userModel.js";

export const createTask = asyncErrorHandler(async (req, res, next) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return next(new ErrorHandler("All Fields are Required", 400));
  }
  const createdBy = req.user.id;
  const task = await Task.create({ title, description, createdBy });
  res
    .status(200)
    .json({ success: true, task, message: "Task Created Successfully" });
});

export const updateTask = asyncErrorHandler(async (req, res, next) => {
  const taskId = req.params.id;
  let task = await Task.findById(taskId);
  if (!task) {
    return next(new ErrorHandler("Task Not Found", 400));
  }
  task = await Task.findByIdAndUpdate(taskId, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res
    .status(200)
    .json({ success: true, message: "Task Updated Successfully", task });
});

export const deleteTask = asyncErrorHandler(async (req, res, next) => {
  const taskId = req.params.id;
  const task = await Task.findById(taskId);
  if (!task) {
    return next(new ErrorHandler("Task Not Found!", 400));
  }
  await task.deleteOne();
  res.status(200).json({ success: true, message: "Task Deleted Successfully" });
});

export const getMyTasks = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user.id;
  const tasks = await Task.find({ createdBy: userId });
  if (!tasks) {
    return next(new ErrorHandler("No Task Found", 400));
  }
  res.status(200).json({ success: true, tasks });
});

export const getAllTasks = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user.id;
  let user = await User.findById(userId);
  if (!user.isAdmin) {
    return next(
      new ErrorHandler("You're not Allowed to Access all Tasks", 400)
    );
  }
  try {
    const tasks = await Task.find();
    if (!tasks) {
      return next(new ErrorHandler("Not Task Found", 400));
    }
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    next(error);
  }
});

export const getSingleTask = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const task = await Task.findById(id);
  if (!task) {
    return next(new ErrorHandler("Task Not Found", 400));
  }
  res.status(200).json({ success: true, task });
});
