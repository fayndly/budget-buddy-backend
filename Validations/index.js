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
  body("amount", "Введите сумму транзакции").isFloat(),
  body("check", "Выберите счет").isString(),
  body("date", "Выберите дату транзакции").isString(),
  body("fullDescription", "Не верный формат записи описания")
    .optional()
    .isString(),
];
