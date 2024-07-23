import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/errorHandler.js";
import User from "../models/userModul.js";
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandler(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return next(errorHandler(403, "Token is not valid!"));
    const valid = await User.findById(user.id);
    req.user = valid;
    console.log("this is user", user);
    next();
  });
};
export const verifyUser = (req, res, next) => {
  verifyToken(req, res, (err) => {
    if (err) return next(err);
    if (req.user.id === req.params.id || req.user.isAdmin) {
      console.log("its true");
      next();
    } else {
      return next(errorHandler(403, "You are not authorized!"));
    }
  });
};
export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, (err) => {
    if (err) return next(err);

    if (req.user.isAdmin) {
      console.log("this is suer", req.user.isAdmin);
      next();
    } else {
      return next(errorHandler(403, "You are not authorized!"));
    }
  });
};
