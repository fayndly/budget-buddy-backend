import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import serverErrorHandler from "../Utils/ServerErrorHandler.js";

import UserModel from "../Models/User.js";
import CategoryModel from "../Models/Category.js";

const defaultCategories = {
  expense: [
    {
      name: "Продукты",
      type: "expense",
      color: "#1a1a1a",
      icon: "icon-category-expense",
    },
    {
      name: "Транспорт",
      type: "expense",
      color: "#1a1a1a",
      icon: "icon-category-expense",
    },
  ],
  income: [
    {
      name: "Зарплата",
      type: "income",
      color: "#1a1a1a",
      icon: "icon-category-income",
    },
    {
      name: "Инвестиции",
      type: "income",
      color: "#1a1a1a",
      icon: "icon-category-income",
    },
  ],
};

const createDefaultCategories = (user) => {
  defaultCategories.expense.forEach(async (val) => {
    const docCategory = new CategoryModel({
      user,
      name: val.name,
      type: val.type,
      color: val.color,
      icon: val.icon,
    });
    await docCategory.save();
  });

  defaultCategories.income.forEach(async (val) => {
    const docCategory = new CategoryModel({
      user,
      name: val.name,
      type: val.type,
      color: val.color,
      icon: val.icon,
    });
    await docCategory.save();
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
