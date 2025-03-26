import { Types } from "mongoose";



global.isNull = (field) => {
  return (
    field === undefined ||
    field === "undefined" ||
    field === "" ||
    field === null ||
    field === "null"
  );
};


global.OPTIONS_FIELD = { label: "$name", value: "$_id" };

global.ObjectId = (obj) => new Types.ObjectId(obj);
