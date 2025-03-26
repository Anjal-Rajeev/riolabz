import jwt from "jsonwebtoken";
import models from "../models/index.js";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config.js";

const generateTokens = async (user) => {
  try {
    const payload = { _id: user._id };
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {expiresIn: "15m"});
    let refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "30d" });

    const userToken = await models.UserToken.findOne({ userId: user._id });

    if (userToken) {
      refreshToken = userToken.token;
    } else {
      await new models.UserToken({ userId: user._id, token: refreshToken }).save();
    }

    return Promise.resolve({ accessToken, refreshToken });
  } catch (err) {
    return Promise.reject(err);
  }
};


export default generateTokens;
