import { Schema, model } from "mongoose";
import moment from "moment";
import { COLLECTIONS } from "../config.js";

const schema = new Schema(
  {
    name: String,
  },
  { timestamps: true, collection: COLLECTIONS.PRIVILEGE }
);

export default model(COLLECTIONS.PRIVILEGE, schema)