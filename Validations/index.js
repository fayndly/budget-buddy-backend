import { body } from "express-validator";

const validationChainEmail = body("email")
  .notEmpty()
  .withMessage("Поле должно быть заполнено")
  .trim()
  .isEmail()
  .withMessage("Неверный формат почты");

const validationChainPassword = body("password")
  .notEmpty()
  .withMessage("Поле должно быть заполнено")
  .isLength({
    min: 6,
    max: 128,
  })
  .withMessage("Пароль должен быть от 6 до 128 символов");

export const signupValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен быть минимум 6 символов").isLength({
    min: 6,
  }),
  body("userName", "Укажите имя").isLength({ min: 3 }),
];

export const loginValidation = [validationChainEmail, validationChainPassword];

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
  body("name", "Неверное имя счета").isString(),
  body("amount", "Неверное первоначальная сумма счета").isFloat(),
  body("currency", "Выберите основную валюту счета").isString(),
  body("color", "Неправильный цвет").isHexColor(),
];

export const categoryCreateValidation = [
  body("name", "Неверное имя категории").isString(),
  body("type", "Неверный тип категории").isString(),
  body("color", "Неправильный цвет").isHexColor(),
  body("icon", "Неправильный иконка").optional().isString(),
];
