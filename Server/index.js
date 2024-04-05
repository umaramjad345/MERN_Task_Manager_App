import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { dbConnection } from "./dbConnection/dbConnection.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { errorMiddleware } from "./middlewares/error.js";
import fileUpload from "express-fileupload";
import cloudinary from "cloudinary";

const app = express();
dotenv.config({ path: "./config/config.env" });
const Port = process.env.PORT || 3000;

dbConnection();

app.use(
  cors({
    origin: process.env.FRONT_END_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/temp/",
  })
);

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(Port, () => {
  try {
    console.log(`Server is Listening on http://localhost:${Port}`);
  } catch (error) {
    console.log("Server Couldn't be Started");
  }
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/task", taskRoutes);

app.use(errorMiddleware);
