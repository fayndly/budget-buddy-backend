import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import serverErrorHandler from "../Utils/ServerErrorHandler.js";

import UserModel from "../Models/User.js";
import CategoryModel from "../Models/Category.js";

const createDefaultCategories = async (user) => {
  const defaultCategories = [
    {
      user,
      name: "Продукты",
      type: "expense",
      color: "#1a1a1a",
      icon: "icon-category-expense",
    },
    {
      user,
      name: "Транспорт",
      type: "expense",
      color: "#1a1a1a",
      icon: "icon-category-expense",
    },
    {
      user,
      name: "Зарплата",
      type: "income",
      color: "#1a1a1a",
      icon: "icon-category-income",
    },
    {
      user,
      name: "Инвестиции",
      type: "income",
      color: "#1a1a1a",
      icon: "icon-category-income",
    },
  ];
  await CategoryModel.insertMany(defaultCategories).catch(() => {
    throw new Error("Не удалось создать категории по умолчанию");
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

    createDefaultCategories(user);

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
      success: true,
      token,
    });
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось зарегистрироваться");
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

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
      return res.status(400).json({
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
      success: true,
      token,
    });
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось авторизоваться");
  }
};

export const getCheckMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (err) {
    serverErrorHandler(res, err, "Нет доступа");
  }
};
