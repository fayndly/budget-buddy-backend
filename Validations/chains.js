import { isValidObjectId, isValidType, isValidIcon } from "./helpers.js";
import { body } from "express-validator";

export const validationChainEmail = body("email")
  .trim()
  .notEmpty()
  .withMessage("Поле должно быть заполнено")
  .isEmail()
  .withMessage("Неверный формат почты");

export const validationChainPassword = body("password")
  .notEmpty()
  .withMessage("Поле должно быть заполнено")
  .isLength({
    min: 6,
    max: 128,
  })
  .withMessage("Пароль должен быть от 6 до 128 символов");

export const validationChainName = body("name")
  .notEmpty()
  .withMessage("Поле должно быть заполнено")
  .isString()
  .withMessage("Поле должно быть строкой")
  .isLength({
    min: 1,
    max: 32,
  })
  .withMessage("Поле должно содержать от 1 до 32 символов");

export const validationChainType = body("type")
  .trim()
  .notEmpty()
  .withMessage("Поле должно быть заполнено")
  .custom((val) => isValidType(val))
  .withMessage("Неверный формат");

export const validationChainColor = body("color")
  .trim()
  .notEmpty()
  .withMessage("Поле должно быть заполнено")
  .isHexColor()
  .withMessage("Поле должно быть цветом в формате hex");

export const validationChainUserName = body("userName")
  .notEmpty()
  .withMessage("Поле должно быть заполнено")
  .isLength({
    min: 2,
    max: 24,
  })
  .withMessage("Пароль должен быть от 2 до 24 символов");

export const validationChainAmount = body("amount")
  .trim()
  .notEmpty()
  .withMessage("Поле должно быть заполнено")
  .isFloat({
    min: 0,
  })
  .withMessage("Поле должно быть десятичным числом и не меньше нуля");
export const validationChainCurrency = body("currency")
  .trim()
  .notEmpty()
  .withMessage("Поле должно быть заполнено")
  .custom((val) => isValidObjectId(val))
  .withMessage("Неверный формат");

export const validationChainIcon = body("icon", "Неправильный иконка")
  .trim()
  .optional()
  .custom((val) => isValidIcon(val))
  .withMessage("Неверный формат");
// export const validationChainType =
