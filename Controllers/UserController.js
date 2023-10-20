import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserModel from "../Models/User.js";

export const signup = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      userName: req.body.userName,
      passwordHash: hash,
    });

    const user = await doc.save();
    console.log(req.body);

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "123345",
      {
        expiresIn: "30d",
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
