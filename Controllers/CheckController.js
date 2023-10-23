import CheckModel from "../Models/Check.js";
import UserModel from "../Models/User.js";

import mongoose from "mongoose";

export const getAll = async (req, res) => {
  try {
    const checks = await CheckModel.find({ user: req.userId })
      .populate({
        path: "transactions.expense",
        options: { strictPopulate: false },
      })
      .populate({
        path: "transactions.income",
        options: { strictPopulate: false },
      });
    return res.json(checks);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось найти транзакции",
    });
  }
};

export const create = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const checkDoc = new CheckModel({
      name: req.body.name,
      user: req.userId,
      amount: req.body.amount,
      transactions: {
        expense: [],
        income: [],
      },
    });
    await checkDoc.save({ session });

    await UserModel.findById(req.userId)
      .session(session)
      .then(async (doc) => {
        doc.checks.push(checkDoc);
        await doc.save({ session });

        await session.commitTransaction();

        return res.json({
          success: true,
          body: { ...checkDoc._doc },
        });
      })
      .catch(async (err) => {
        await session.abortTransaction();
        console.log(err);
        return res.status(500).json({
          message: "Не удалось найти пользователя",
        });
      });
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать счет",
    });
  } finally {
    session.endSession();
  }
};
