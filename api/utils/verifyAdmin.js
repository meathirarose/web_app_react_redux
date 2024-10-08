import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const verifyAdmin = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(errorHandler(401, "You are not authenticated!"));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {      
      if (err.name === "TokenExpiredError") {
        return next(errorHandler(401, "Session expired, please log in again."));
      }
      return next(errorHandler(403, "Token is not valid!"));
    }

    if (user.isAdmin !== 1)
      return next(
        errorHandler(403, "You are not allowed to access this resource!")
      );

    req.user = user;
    next();
  });
};
