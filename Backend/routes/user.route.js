
import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  resetPassword,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

userRouter.patch("/passwordReset", resetPassword);

userRouter.get("/logout", logoutUser);

export default userRouter ;
