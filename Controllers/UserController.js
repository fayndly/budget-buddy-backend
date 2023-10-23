import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserModel from "../Models/User.js";
import CheckModel from "../Models/Check.js";

export const signup = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const docUser = new UserModel({
      email: req.body.email,
      userName: req.body.userName,
      passwordHash: hash,
      checks: [],
    });

    const user = await docUser.save();

    const docCheck = new CheckModel({
      name: "общий",
      user: user,
      amount: 0,
      color: "#2A5A1E",
      transactions: {
        expense: [],
        income: [],
      },
    });

    await docCheck.save();
    docUser.checks.push(docCheck._id);
    await docUser.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_TOKEN,
      {
        expiresIn: process.env.JWT_LIVE,
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось зарегистрироваться",
    });
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

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось авторизоваться",
    });
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
    console.log(err);
    res.status(500).json({
      message: "Нет доступа",
    });
  }
};
