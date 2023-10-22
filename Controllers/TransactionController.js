import TransactionModel from "../Models/Transaction.js";
import CheckModel from "../Models/Check.js";

import mongoose from "mongoose";

function sortByDateInRange(array, startDate, endDate) {
  const filteredArray = array.filter(function (item) {
    const date = new Date(item.date);
    return date >= startDate && date <= endDate;
  });
  filteredArray.sort(function (a, b) {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });
  return filteredArray;
}

export const create = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const transaction = new TransactionModel({
      type: req.body.type,
      user: req.userId,
      shortDescription: req.body.shortDescription,
      amount: req.body.amount,
      check: req.body.check,
      category: req.body.category,
      date: req.body.date,
      fullDescription: req.body.fullDescription,
    });
    await transaction.save({ session });

    const check = await CheckModel.findById(req.body.check).session(session);
    check.transactions[req.body.type].push(transaction);
    await check.save({ session });

    await session.commitTransaction();

    res.json({
      success: true,
      body: { ...transaction._doc },
    });
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать транзакцию",
    });
  } finally {
    session.endSession();
  }
  // try {
  //   const doc = new TransactionModel({
  //     type: req.body.type,
  //     user: req.userId,
  //     shortDescription: req.body.shortDescription,
  //     amount: req.body.amount,
  //     check: req.body.check,
  //     category: req.body.category,
  //     date: req.body.date,
  //     fullDescription: req.body.fullDescription,
  //   });

  //   const transaction = await doc.save();
  //   return res.json({
  //     success: true,
  //     body: { ...transaction._doc },
  //   });
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).json({
  //     message: "Не удалось создать транзакцию",
  //   });
  // }
};

export const getAll = async (req, res) => {
  try {
    const transactions = await TransactionModel.find({ user: req.userId })
      .populate("check")
      .exec();
    return res.json(transactions);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось найти транзакции",
    });
  }
};

export const getAllByDate = async (req, res) => {
  try {
    // const transactions = await CheckModel.find({
    //   check: req.params.check,
    //   type: req.params.type,
    //   userId: req.userId,
    //   date: { $gte: req.params.startDate, $lte: req.params.endDate },
    // });

    const docTransactions = await CheckModel.findOne({ _id: req.params.check })
      .populate({
        path: "transactions.expense",
        options: { strictPopulate: false },
      })
      .populate({
        path: "transactions.income",
        options: { strictPopulate: false },
      })
      .exec()
      .then((doc) => {
        return sortByDateInRange(
          doc.transactions[req.params.type],
          new Date(req.params.startDate),
          new Date(req.params.endDate)
        );
      })
      .catch((err) => {
        console.log(err);
        res.status(404).json({
          message: "Не удалось найти транзакции",
        });
      });

    res.json({
      start: req.params.startDate,
      stop: req.params.endDate,
      data: docTransactions,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить транзакции",
    });
  }
};

export const getById = async (req, res) => {
  try {
    const docTransaction = await TransactionModel.findById(req.params.id);

    res.json(docTransaction);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось найти транзакцию",
    });
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
        user: req.userId,
        shortDescription: req.body.shortDescription,
        amount: req.body.amount,
        check: req.body.check,
        category: req.body.category,
        date: req.body.date,
        fullDescription: req.body.fullDescription,
      }
    ).catch((err) => {
      console.log(err);
      res.status(404).json({
        message: "Не удалось найти транзакцию",
      });
    });

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить транзакцию",
    });
  }
};

export const remove = async (req, res) => {
  try {
    TransactionModel.findOneAndDelete({
      _id: req.params.id,
    })
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({
            message: "Транзакция не найдена",
          });
        }
        res.json({
          success: true,
        });
      })
      .catch((err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Не удалось удалить транзакцию",
          });
        }
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить транзакцию",
    });
  }
};
