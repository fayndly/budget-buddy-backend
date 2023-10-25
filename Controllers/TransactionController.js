import mongoose from "mongoose";

import TransactionModel from "../Models/Transaction.js";
import CheckModel from "../Models/Check.js";

import serverErrorHandler from "../Utils/ServerErrorHandler.js";

function sortByDateInRange(array, startDate, endDate) {
  const filteredArray = array.filter(function (item) {
    const date = new Date(item.time);
    return date >= startDate && date <= endDate;
  });
  filteredArray.sort(function (a, b) {
    const dateA = new Date(a.time);
    const dateB = new Date(b.time);
    return dateB - dateA;
  });
  return filteredArray;
}

export const create = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const transaction = new TransactionModel({
      user: req.userId,
      type: req.body.type,
      shortDescription: req.body.shortDescription,
      currency: req.body.currency,
      amount: req.body.amount,
      check: req.body.check,
      category: req.body.category,
      time: req.body.time,
      fullDescription: req.body.fullDescription,
    });
    await transaction.save({ session });

    const check = await CheckModel.findById(req.body.check).session(session);

    if (!check) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Не удалось найти счет",
      });
    }

    check.transactions[req.body.type].push(transaction);
    await check.save({ session });

    await session.commitTransaction();
    res.json({
      success: true,
    });
  } catch (err) {
    await session.abortTransaction();
    serverErrorHandler(res, err, "Не удалось создать транзакцию");
  } finally {
    session.endSession();
  }
};

export const getAll = async (req, res) => {
  try {
    let transactions = await TransactionModel.find({ user: req.userId })
      .populate({
        path: "check",
        options: { strictPopulate: false },
        select:
          "-transactions -user -amount -currency -color -createdAt -updatedAt -__v",
      })
      .populate({
        path: "category",
        options: { strictPopulate: false },
        select: "-createdAt -updatedAt -__v -user",
      })
      .populate({
        path: "currency",
        options: { strictPopulate: false },
        select: "-createdAt -updatedAt -__v",
      })
      .exec();

    if (!transactions.length) {
      return res.status(404).json({
        message: "Не удалось найти транзакции у пользователя",
      });
    }

    if (req.query.check) {
      transactions = transactions.filter(
        (val) => val.check._id.toString() === req.query.check
      );
    }

    if (req.query.type) {
      transactions = transactions.filter((val) => val.type === req.query.type);
    }

    if (req.query.startTime && req.query.endTime) {
      transactions = sortByDateInRange(
        transactions,
        new Date(req.query.startTime),
        new Date(req.query.endTime)
      );
    }

    return res.json(transactions);
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось найти транзакции");
  }
};

export const getOneById = async (req, res) => {
  try {
    const transaction = await TransactionModel.findById(req.params.id)
      .populate({
        path: "check",
        options: { strictPopulate: false },
        select:
          "-transactions -user -amount -currency -color -createdAt -updatedAt -__v",
      })
      .populate({
        path: "category",
        options: { strictPopulate: false },
        select: "-createdAt -updatedAt -__v -user",
      })
      .populate({
        path: "currency",
        options: { strictPopulate: false },
        select: "-createdAt -updatedAt -__v",
      })
      .exec();

    res.json(transaction);
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось найти транзакцию");
  }
};

export const update = async (req, res) => {
  try {
    await TransactionModel.updateOne(
      {
        _id: req.params.id,
      },
      {
        type: req.body.type,
        shortDescription: req.body.shortDescription,
        currency: req.body.currency,
        amount: req.body.amount,
        check: req.body.check,
        category: req.body.category,
        time: req.body.time,
        fullDescription: req.body.fullDescription,
      }
    ).catch((err) => {
      console.log(err);
      res.status(404).json({
        success: false,
        message: "Не удалось найти транзакцию",
      });
    });

    res.json({
      success: true,
    });
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось обновить транзакцию");
  }
};
