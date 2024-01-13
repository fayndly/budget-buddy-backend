import { isValidObjectId, isValidType, isValidIcon } from "./helpers.js";
import { body } from "express-validator";

export const validationChain = {
  email: body("email")
    .trim()
    .notEmpty()
    .withMessage("Поле должно быть заполнено")
    .isEmail()
    .withMessage("Неверный формат почты"),
  password: body("password")
    .notEmpty()
    .withMessage("Поле должно быть заполнено")
    .isLength({
      min: 6,
      max: 128,
    })
    .withMessage("Пароль должен быть от 6 до 128 символов"),
  name: body("name")
    .notEmpty()
    .withMessage("Поле должно быть заполнено")
    .isString()
    .withMessage("Поле должно быть строкой")
    .isLength({
      min: 1,
      max: 32,
    })
    .withMessage("Поле должно содержать от 1 до 32 символов"),
  type: body("type")
    .trim()
    .notEmpty()
    .withMessage("Поле должно быть заполнено")
    .custom((val) => isValidType(val))
    .withMessage("Неверный формат"),
  color: body("color")
    .trim()
    .notEmpty()
    .withMessage("Поле должно быть заполнено")
    .isHexColor()
    .withMessage("Поле должно быть цветом в формате hex"),
  userName: body("userName")
    .notEmpty()
    .withMessage("Поле должно быть заполнено")
    .isLength({
      min: 2,
      max: 24,
    })
    .withMessage("Пароль должен быть от 2 до 24 символов"),
  amount: body("amount")
    .trim()
    .notEmpty()
    .withMessage("Поле должно быть заполнено")
    .isFloat({
      min: 0,
    })
    .withMessage("Поле должно быть десятичным числом и не меньше нуля"),
  currency: body("currency")
    .trim()
    .notEmpty()
    .withMessage("Поле должно быть заполнено")
    .custom((val) => isValidObjectId(val))
    .withMessage("Неверный формат"),
  icon: body("icon", "Неправильный иконка")
    .trim()
    .optional()
    .custom((val) => isValidIcon(val))
    .withMessage("Неверный формат"),
  check: body("check")
    .trim()
    .notEmpty()
    .withMessage("Поле должно быть заполнено")
    .custom((val) => isValidObjectId(val))
    .withMessage("Неверный формат"),
  category: body("category")
    .trim()
    .notEmpty()
    .withMessage("Поле должно быть заполнено")
    .custom((val) => isValidObjectId(val))
    .withMessage("Неверный формат"),
  time: body("time")
    .trim()
    .notEmpty()
    .withMessage("Поле должно быть заполнено")
    .isString()
    .withMessage("Поле должно быть строкой"),
  description: body("description")
    .trim()
    .optional()
    .isString()
    .withMessage("Поле должно быть строкой")
    .isLength({
      min: 1,
    })
    .withMessage("Минимальная длина 1 символ"),
};
