import { body } from "express-validator";

export const signupValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен быть минимум 6 символов").isLength({
    min: 6,
  }),
  body("userName", "Укажите имя").isLength({ min: 3 }),
];
