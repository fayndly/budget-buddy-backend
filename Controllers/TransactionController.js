import mongoose from "mongoose";

import TransactionModel from "../Models/Transaction.js";
import CheckModel from "../Models/Check.js";

import serverErrorHandler from "../Utils/ServerErrorHandler.js";

import sortByDateInRange from "../Helpers/SortByDateInRange.js";
import updateCheckAmount from "../Helpers/UpdateCheckAmount.js";

Array.prototype.findAndRemove = function (val) {
  const index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};

export const create = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const transactionDoc = new TransactionModel({
      user: req.userId,
      type: req.body.type,
      name: req.body.name,
      currency: req.body.currency,
      amount: req.body.amount,
      check: req.body.check,
      category: req.body.category,
      time: req.body.time,
      description: req.body.description,
    });

    await transactionDoc.save({ session });

    const check = await CheckModel.findById(req.body.check).session(session);

    if (!check) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Не удалось найти счет",
      });
    }

    check.transactions[req.body.type].push(transactionDoc);

    if (transactionDoc.type === "expense") {
      check.amount -= transactionDoc.amount;
    } else if (req.body.type === "income") {
      check.amount += transactionDoc.amount;
    }

    await check.save({ session });

    await session.commitTransaction();

    res.json(transactionDoc);
  } catch (err) {
    await session.abortTransaction();
    serverErrorHandler(res, err, "Не удалось создать транзакцию");
  } finally {
    session.endSession();
  }
};

export const getAll = async (req, res) => {
  try {
    let transactions = await TransactionModel.find({ user: req.userId });

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
    const transaction = await TransactionModel.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Не удалось найти транзакцию",
      });
    }

    res.json(transaction);
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось найти транзакцию");
  }
};

export const update = async (req, res) => {
  try {
    const transaction = await TransactionModel.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Не удалось найти транзакцию",
      });
    }

    const oldTransaction = { ...transaction.toObject() };

    transaction.set(req.body);
    await transaction.save();

    if (oldTransaction.check.toString() !== transaction.check.toString()) {
      const oldCheck = await CheckModel.findById(
        oldTransaction.check.toString()
      );
      const newCheck = await CheckModel.findById(transaction.check.toString());

      if (!newCheck || !oldCheck) {
        return res.status(404).json({
          message: "Не удалось найти счет",
        });
      }

      const oldTransactions = oldCheck.transactions[oldTransaction.type];
      const newTransactions = newCheck.transactions[transaction.type];

      oldTransactions.findAndRemove(oldTransaction._id);
      newTransactions.push(transaction);

      await oldCheck.save();
      await newCheck.save();

      updateCheckAmount(oldTransaction.check.toString());
      updateCheckAmount(transaction.check.toString());

      return res.json(transaction);
    }

    if (oldTransaction.type !== transaction.type) {
      const check = await CheckModel.findById(transaction.check.toString());

      if (!check) {
        return res.status(404).json({
          success: false,
          message: "Не удалось найти счет",
        });
      }

      const transactionsIncome = check.transactions.income;
      const transactionsExpense = check.transactions.expense;

      if (transaction.type === "expense") {
        transactionsIncome.findAndRemove(transaction._id);
        transactionsExpense.push(transaction);
      } else if (transaction.type === "income") {
        transactionsExpense.findAndRemove(transaction._id);
        transactionsIncome.push(transaction);
      }

      await check.save();

      updateCheckAmount(check._id.toString());

      return res.json(transaction);
    }

    if (oldTransaction.amount !== transaction.amount) {
      const check = await CheckModel.findById(transaction.check.toString());

      if (!check) {
        return res.status(404).json({
          success: false,
          message: "Не удалось найти счет",
        });
      }

      updateCheckAmount(check._id.toString());

      return res.json(transaction);
    }

    return res.json(transaction);
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось обновить транзакцию");
  }
};

export const remove = async (req, res) => {
  try {
    const transaction = await TransactionModel.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Не удалось найти транзакцию",
      });
    }

    await TransactionModel.deleteOne({
      _id: transaction._id,
      user: transaction.user,
    })
      .then(async () => {
        const check = await CheckModel.findById(transaction.check.toString());

        if (!check) {
          return res.status(404).json({
            message: "Не удалось найти счет",
          });
        }

        check.transactions[transaction.type].findAndRemove(
          transaction._id.toString()
        );

        await check.save();
        updateCheckAmount(check._id.toString());

        res.json({
          id: transaction._id,
        });
      })
      .catch(() => {
        return res.status(404).json({
          message: "Не удалось найти транзакцию",
        });
      });
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось удалить транзакцию");
  }
};
