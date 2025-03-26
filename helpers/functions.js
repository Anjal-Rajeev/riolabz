import { PRIVILEGE } from "../config.js";
import moment from "moment";

export const paginationValues = ({ page, limit }) => {
  if (isNull(page) || page < 1) page = 1;
  else page = Number(page);

  if (isNull(limit) || limit < 1) limit = 20;
  else limit = Number(limit);

  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

export const comparePrivilege = (privilege, compare) => privilege?.toString() === compare?.toString();

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const getDate = () => moment().format("YYYY-MM-DD");
export const getTime = () => moment().format("HH:mm:ss");