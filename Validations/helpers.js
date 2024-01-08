import { materialIcons } from "../Utils/MaterialIcons.js";

export const isValidObjectId = (str) => {
  str = str + "";
  var len = str.length,
    valid = false;
  if (len == 12 || len == 24) {
    valid = /^[0-9a-fA-F]+$/.test(str);
  }
  return valid;
};

export const isValidType = (val) => {
  return val === "expense" || val === "income";
};

export const isValidIcon = (val) => {
  return materialIcons.includes(val);
};
