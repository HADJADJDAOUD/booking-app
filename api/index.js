import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/userRouter.js";
import roomsRoute from "./routes/roomRouter.js";
import hotelRoute from "./routes/hotelsRouter.js";
import cors from "cors";

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("connected to database");
  } catch (error) {
    throw error;
  }
};
mongoose.connection.on("disconnected", () => {
  console.log("Mongo DB disconnected");
});
mongoose.connection.on("connected", () => {
  console.log("Mongo DB connected");
});

//// middleware

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelRoute);
app.use("/api/rooms", roomsRoute);
app.use("*", (req, res) => {
  res.send("wrong api");
});
app.use((err, req, res, next) => {
  const errStatus = err.status || 500;
  const errMessage = err.message || "something went wrong";
  return res.status(200).json({
    success: false,
    status: errStatus,
    message: errMessage,
    stack: err.stack,
  });
});

app.listen(3000, () => {
  connect();
  console.log("port 3000");

  console.log("connected to bakcend");
});
