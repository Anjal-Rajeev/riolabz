import { Schema, model } from "mongoose";
import moment from "moment";
import { COLLECTIONS, PRIVILEGE } from "../config.js";

const schema = new Schema(
  {
    name: String,
    parent: {
      type: Schema.Types.ObjectId,
      ref: COLLECTIONS.CATEGORY,
      default: null,
    },
    status: { type: Number, default: 0, enum: [0, 1, 2] }, // 0- Active, 1- Deleted, 2- Inactive

    addedBy: { type: Schema.Types.ObjectId, ref: COLLECTIONS.USERS },
    date: { type: String, default: () => moment().format("YYYY-MM-DD") },
    time: { type: String, default: () => moment().format("HH:mm:ss") },
    upDate: String,
    upTime: String,
  },
  { timestamps: true, collection: COLLECTIONS.CATEGORY }
);

export default model(COLLECTIONS.CATEGORY, schema);
