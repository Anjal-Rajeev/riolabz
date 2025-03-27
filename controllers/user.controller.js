import { asyncErrorHandler, Error, Response } from "express-error-catcher";
import { COLLECTIONS, PRIVILEGE } from "../config.js";
import models from "../models/index.js";
import {
  comparePrivilege,
  getDate,
  getTime,
  isValidEmail,
  paginationValues,
} from "../helpers/functions.js";
import generateTokens from "../utils/generateTokens.js";


export const register = asyncErrorHandler(async (req) => {
  let { email, password } = req.body;

  if (isNull(email)) throw new Error("Email required..", 400);
  if (isNull(password)) throw new Error("Password required", 400);
  if (!isValidEmail(email)) throw new Error("Invalid email", 400);

  let isExists = await models.User.findOne({
    email: { $regex: `^${email}$`, $options: "i" },
    status: { $ne: 1 },
  });

  if (isExists) throw new Error("Account already exists", 400);

  let user = new models.User({
    email,
  });

  user.password = user.generatePasswordHash(password);
  user = await user.save();

  let data = await models.User.findById(user._id)
    .populate("privilege")
    .lean()
    .select("-password -createdAt -updatedAt -__v");

  return new Response(null, { data }, 201);
});


export const loginUser = asyncErrorHandler(async (req, res) => {
  let { email, password } = req.body;

  if (isNull(email)) throw new Error("Email required..", 400);
  if (isNull(password)) throw new Error("Password required", 400);
  if (!isValidEmail(email)) throw new Error("Invalid email", 400);

  let user = await models.User.findOne({ email, status: 0 });

  if (user) {
    // <<======= Validate Password =======>>
    let pass = user.validatePassword(password, user.password);
    if (pass) {
      user = user.toObject();
      delete user.password;
      delete user.date;
      delete user.time;
      const { accessToken, refreshToken } = await generateTokens(user);
      res.cookie("token", accessToken, {
        maxAge: 15 * 60 * 1000,
        secure: true,
        sameSite: "none",
      });
      return new Response(null, { data: user, accessToken, refreshToken }, 200);
    } else {
      throw new Error("Password is incorrect", 401);
    }
  } else {
    throw new Error("No account found", 400);
  }
});


export const updateAccount = asyncErrorHandler(async (req) => {
  let { name, address, email } = req.body;

  if (isNull(email)) throw new Error("Email required..", 400);
  if (!isValidEmail(email)) throw new Error("Invalid email", 400);

  let isExists = await models.User.findOne({
    email: { $regex: `^${email}$`, $options: "i" },
    status: { $ne: 1 },
    _id: { $ne: req.user?._id },
  });

  if (isExists) throw new Error("Account already exists", 400);

  let data = await models.User.findByIdAndUpdate(req.user?._id, {
    email,
    address,
    name,
    upDate: getDate(),
    upTime: getTime(),
  });

  if (!data) throw new Error("failed to update, Please try again", 400);
  return new Response("Account updated successfully", null, 200);
});


// Function to list all users - (For Admin)
export const listUsers = asyncErrorHandler(async (req) => {
  if (!req.isAdmin)
    throw new Error("You have no permission to this resourse", 400);
  let { skip, limit } = paginationValues(req.query);

  let condition = {
    status: { $ne: 1 },
  };

  let count = await models.User.countDocuments(condition);
  let data = await models.User.aggregate([
    {
      $match: condition,
    },
    { $sort: { _id: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: COLLECTIONS.PRIVILEGE,
        localField: "privilege",
        foreignField: "_id",
        as: "privilege",
      },
    },
    {
      $project: {
        name: 1,
        email: 1,
        address: 1,
        privilege: { $first: "$privilege.name" },
        date: 1,
        time: 1,
      },
    },
  ]);

  return new Response(null, { count, data }, 200);
});


// Function to list the details of user account for updating
export const listUserForUpdate = asyncErrorHandler(async (req) => {
  let { id } = req.query;
  if (isNull(id)) throw new Error("Account not found", 400);
  let condition = {
    status: { $ne: 1 },
    _id: id,
  };

  let data = await models.User.findOne(condition, "name email address");

  return new Response(null, { data }, 200);
});


export const privilegeOptions = asyncErrorHandler(async (req) => {
  let data = await models.Privilege.find({}, OPTIONS_FIELD).sort({ _id: -1 });
  return new Response(null, { data }, 200);
});


// Function to change normal user in to Admin - (For Admin)
export const changeAccountPrivilege = asyncErrorHandler(async (req) => {
  let { id } = req.body;
  if (!req.isAdmin) throw new Error("You have no permission for this action", 400);
  if (isNull(id)) throw new Error("Account not found", 400);

  let user = await models.User.findOne({ _id: id, status: { $ne: 1 } });
  if(!user) throw new Error("Account not found", 400);
  
  if(comparePrivilege(PRIVILEGE.ADMIN, user?.privilege)) throw new Error("This account is already an Admin", 400);

  user.privilege = PRIVILEGE.ADMIN
  user.upDate = getDate() 
  user.upTime = getTime() 

  await user.save();

  return new Response("Privilege changed to Admin", null, 400);
});
