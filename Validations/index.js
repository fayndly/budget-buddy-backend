import { body } from "express-validator";

export const signupValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен быть минимум 6 символов").isLength({
    min: 6,
  }),
  body("userName", "Укажите имя").isLength({ min: 3 }),
];

export const loginValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен быть минимум 6 символов").isLength({
    min: 6,
  }),
];

export const transactionCreateValidation = [
  body("type", "Неверный тип транзакции").isString(),
  body("shortDescription", "Введите краткое описание транзакции").isString(),
  body(
    "currency",
    "Выберите валюту по которой была совершена транзакция"
  ).isString(),
  body("amount", "Введите сумму транзакции").isFloat(),
  body("check", "Выберите счет").isString(),
  body("category", "Выберите категорию транзакции").isString(),
  body("time", "Выберите дату транзакции").isString(),
  body("fullDescription", "Не верный формат записи описания")
    .optional()
    .isString(),
];

export const checkCreateValidation = [
  body("isGeneral", "Выберите является ли  счет основным").isBoolean(),
  body("name", "Неверное имя счета").isString(),
  body("amount", "Неверное первоначальная сумма счета").isFloat(),
  body("currency", "Выберите основную валюту счета").isFloat(),
  body("color", "Неправильный цвет").isHexColor(),
];

export const categoryCreateValidation = [
  body("name", "Неверное имя категории").isString(),
  body("type", "Неверный тип категории").isString(),
  body("color", "Неправильный цвет").isHexColor(),
  body("icon", "Неправильный иконка").optional().isString(),
];
