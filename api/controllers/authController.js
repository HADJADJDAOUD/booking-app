import User from "../models/userModul.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const access_token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Allow client-side JavaScript access
    secure: true, // Only send cookie over HTTPS
  };

  res.cookie("access_token", access_token, cookieOptions);
  console.log("this is token in createsendtoken", access_token);

  // Remove sensitive information before sending response
  console.log("this is user in createsendtoken", user);
  const { isAdmin, ...rest } = user;

  res.status(statusCode).json({ details: { ...rest }, isAdmin });
};

///////////////
export const register = async (req, res, next) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return next(errorHandler(404, "all info are requirred"));
  }

  // Check if the username or email already exists
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return next(errorHandler(401, "this user is exists try to login"));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username });
    console.log("this is req.body in login", req.body);
    if (!user) return next(errorHandler(404, "user not found"));
    const isCorrectPass = await bcryptjs.compareSync(password, user.password);
    if (!isCorrectPass) return next(errorHandler(401, "password wrong"));
    const { password: pass, ...rest } = user._doc;
    createSendToken(rest, 200, res);
  } catch (error) {
    next(error);
  }
};
