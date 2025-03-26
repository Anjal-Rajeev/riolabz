import jwt from "jsonwebtoken";
import { asyncErrorHandler, Error } from "express-error-catcher";
import model from "../models/index.js";
import { ACCESS_TOKEN_SECRET, PRIVILEGE } from "../config.js";
import { comparePrivilege } from "../helpers/functions.js";



const auth = asyncErrorHandler(async (req, res, next) => {
  const token = req.cookies.token || req.headers["x-access-token"];
  if (!token) throw new Error("Access Denied: No token provided", 403);

  try {
    const tokenDetails = jwt.verify(token, ACCESS_TOKEN_SECRET);
    const user = await model.User.findById(tokenDetails._id).select("-password");

    req.isAdmin = comparePrivilege(user?.privilege, PRIVILEGE.ADMIN)

    req.user = user;

    req.privilege = user.privilege;

    next();
  } catch (err) {
    console.log(err.message);
    if (err.name === "TokenExpiredError") throw new Error("Access Denied: Token Expired", 403);

    if (err.name === "JsonWebTokenError") throw new Error("Access Denied: Invalid token", 403);
    else throw new Error(`Access Denied: ${err.name}`, 403);
  }
});

export default auth;
