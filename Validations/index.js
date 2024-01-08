import { body } from "express-validator";

import {
  validationChainEmail,
  validationChainPassword,
  validationChainName,
  validationChainType,
  validationChainColor,
  validationChainUserName,
  validationChainAmount,
  validationChainCurrency,
  validationChainIcon,
} from "./chains.js";

export const signupValidation = [
  validationChainEmail,
  validationChainPassword,
  validationChainUserName,
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
  validationChainName,
  validationChainAmount,
  validationChainCurrency,
];

export const categoryCreateValidation = [
  validationChainName,
  validationChainType,
  validationChainColor,
  validationChainIcon,
];
