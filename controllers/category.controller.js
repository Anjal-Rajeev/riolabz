import { asyncErrorHandler, Error, Response } from "express-error-catcher";
import { COLLECTIONS, PRIVILEGE } from "../config.js";
import models from "../models/index.js";
import {
  comparePrivilege,
  getDate,
  getTime,
  paginationValues,
} from "../helpers/functions.js";
import { isValidObjectId } from "mongoose";

// Function to create menu category - (For Admin)
export const createCategory = asyncErrorHandler(async (req) => {
  let { name, parent } = req.body;
  if (!req.isAdmin) throw new Error("You have no permission to this action", 400);

  if (isNull(name)) throw new Error("Name required", 400);
  if (!isNull(parent) && !isValidObjectId(parent)) throw new Error("Invalid parent category", 400);

  let data = await models.Category({
    name,
    parent,
    addedBy: req.user?._id,
  }).save();

  if (!data) throw new Error("Failed to create, Please try again", 400);
  return new Response("Category created successfully", null, 200);
});



// Function to update menu category - (For Admin)
export const updateCategory = asyncErrorHandler(async (req) => {
  let { id, name, parent } = req.body;
  if (!req.isAdmin) throw new Error("You have no permission to this action", 400);

  if (isNull(id)) throw new Error("No data found", 400);
  if (isNull(name)) throw new Error("Name required", 400);
  if (!isNull(parent) && !isValidObjectId(parent)) throw new Error("Invalid parent category", 400);

  let data = {
    name,
    parent,
    upDate: getDate(),
    upTime: getTime(),
  }

  let updated = await models.Category.findOneAndUpdate({ _id: id }, data)

  if (!updated) throw new Error("Failed to update, Please try again", 400);
  return new Response("Category updated successfully", null, 200);
});


// Function to list menu - (For public)
export const listCategories = asyncErrorHandler(async (req) => {

  async function getCategoryTree(parent = null) {
    const categories = await models.Category.find({ parent, status: 0 }, "name parent").lean();

    for (const category of categories) {
      category.child = await getCategoryTree(category._id);
    }

    return categories;
  }

  let data = await getCategoryTree();

  return new Response(null, { data }, 200);
})