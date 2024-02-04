import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import serverErrorHandler from "../Utils/ServerErrorHandler.js";

import UserModel from "../Models/User.js";
import CategoryModel from "../Models/Category.js";
import CheckModel from "../Models/Check.js";
import CurrencyModel from "../Models/Currency.js";

import { getDefaultCategories } from "../mocks/categories.js";
import { getDefaultChecks } from "../mocks/checks.js";

const createDefaultCategories = async (user) => {
  await CategoryModel.insertMany(getDefaultCategories(user)).catch(() => {
    throw new Error("Не удалось создать категории по умолчанию");
  });
};

const createDefaultChecks = async (user, currency) => {
  await CheckModel.insertMany(getDefaultChecks(user, currency)).catch(() => {
    throw new Error("Не удалось создать счет по умолчанию");
  });
};

export const signup = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    const docUser = new UserModel({
      email: req.body.email,
      userName: req.body.userName,
      passwordHash: hash,
    });

    const user = await docUser.save();

    let defaultCurrency = await CurrencyModel.findOne({
      name: "RUB",
    });

    if (!defaultCurrency) defaultCurrency = CurrencyModel.find()[0];

    await createDefaultCategories(user);
    await createDefaultChecks(user, defaultCurrency._id);

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_TOKEN,
      {
        expiresIn: process.env.JWT_LIVE,
      }
    );

    res.json({
      token,
    });
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось зарегистрироваться");
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email }).exec();

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return res.status(401).json({
        message: "Неверный логин или пароль",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_TOKEN,
      {
        expiresIn: process.env.JWT_LIVE,
      }
    );

    res.json({
      token,
    });
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось авторизоваться");
  }
};

export const getCheckMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).exec();

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    res.json({ id: user._id });
  } catch (err) {
    serverErrorHandler(res, err, "Нет доступа");
  }
};
