import { Schema, model } from "mongoose";
import moment from "moment";
import { COLLECTIONS, PRIVILEGE } from "../config.js";
import bcrypt from "bcryptjs";

const schema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    address: String,
    privilege: { type: Schema.Types.ObjectId, ref: COLLECTIONS.PRIVILEGE, default: PRIVILEGE.USER },
    status: { type: Number, default: 0, enum: [0, 1, 2] }, // 0- Active, 1- Deleted, 2- Inactive

    date: { type: String, default: () => moment().format("YYYY-MM-DD") },
    time: { type: String, default: () => moment().format("HH:mm:ss") },
    upDate: String,
    upTime: String,
  },
  { timestamps: true, collection: COLLECTIONS.USERS }
);

schema.methods.generatePasswordHash = (password) => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

schema.methods.validatePassword = (password, hashedPassword) => {
  const res = bcrypt.compareSync(password, hashedPassword);
  return res;
};

export default model(COLLECTIONS.USERS, schema)