import mongoose from "mongoose";

import TransactionModel from "../Models/Transaction.js";
import CheckModel from "../Models/Check.js";

import serverErrorHandler from "../Utils/ServerErrorHandler.js";

import sortByDateInRange from "../Helpers/SortByDateInRange.js";
import updateCheckAmount from "../Helpers/UpdateCheckAmount.js";

import { strToBool } from "../Utils/StrtoBool.js";
import { getFakeId } from "../Utils/GetFakeId.js";

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

export const getOneById = async (req, res) => {
  try {
    const transaction = TransactionModel.findById(
      getFakeId(req.params.id, false)
    );

    if (req.query.populate) {
      const populate = req.query.populate;

      strToBool(populate.currency) && transaction.populate("currency");
      strToBool(populate.category) && transaction.populate("category");
      strToBool(populate.check) && transaction.populate("check");
    }

    await transaction.exec().then((data) => {
      if (!data) {
        return res.status(404).json({
          message: "Не удалось найти транзакцию",
        });
      }

      res.json(data);
    });
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось получить транзакцию");
  }
};

export const getAll = async (req, res) => {
  try {
    const filter = {
      user: req.userId,
    };

    if (req.query.filter) {
      const queryFilter = req.query.filter;

      if (queryFilter.check) filter.check = queryFilter.check;
      if (queryFilter.type) filter.type = queryFilter.type;
    }

    const transactions = TransactionModel.find(filter);

    if (req.query.populate) {
      const populate = req.query.populate;

      strToBool(populate.currency) && transactions.populate("currency");
      strToBool(populate.category) && transactions.populate("category");
      strToBool(populate.check) && transactions.populate("check");
    }

    await transactions.exec().then((data) => {
      if (req.query.sort) {
        const sort = req.query.sort;
        if (sort.startTime && sort.endTime) {
          data = sortByDateInRange(data, sort.startTime, sort.endTime);
        }
      }
      res.json(data);
    });
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось найти транзакции");
  }
};

export const update = async (req, res) => {
  try {
    const transaction = await TransactionModel.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        message: "Не удалось найти транзакцию",
      });
    }

    if (transaction.user.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "У вас не доступа к этой транзакции" });
    }

    await TransactionModel.findByIdAndUpdate(
      transaction._id,
      {
        type: req.body.type,
        name: req.body.name,
        currency: req.body.currency,
        amount: req.body.amount,
        check: req.body.check,
        category: req.body.category,
        time: req.body.time,
        description: req.body.description,
      },
      {
        new: true,
      }
    ).then(async (newTransaction) => {
      if (transaction.check.toString() !== newTransaction.check.toString()) {
        const oldCheck = await CheckModel.findById(
          transaction.check.toString()
        );

        const newCheck = await CheckModel.findById(
          newTransaction.check.toString()
        );

        if (!newCheck || !oldCheck) {
          return res.status(404).json({
            message: "Не удалось найти счет",
          });
        }

        const oldTransactions = oldCheck.transactions[transaction.type];
        const newTransactions = newCheck.transactions[newTransaction.type];

        oldTransactions.findAndRemove(transaction._id);
        newTransactions.push(newTransaction._id);

        await oldCheck.save();
        await newCheck.save();

        updateCheckAmount(transaction.check.toString());
        updateCheckAmount(newTransaction.check.toString());

        return res.json(newTransaction);
      }

      if (transaction.type !== newTransaction.type) {
        const check = await CheckModel.findById(
          newTransaction.check.toString()
        );

        if (!check) {
          return res.status(404).json({
            success: false,
            message: "Не удалось найти счет",
          });
        }

        const transactionsIncome = check.transactions.income;
        const transactionsExpense = check.transactions.expense;

        if (newTransaction.type === "expense") {
          transactionsIncome.findAndRemove(newTransaction._id);
          transactionsExpense.push(newTransaction);
        } else if (newTransaction.type === "income") {
          transactionsExpense.findAndRemove(newTransaction._id);
          transactionsIncome.push(newTransaction);
        }

        await check.save();

        updateCheckAmount(check._id.toString());

        return res.json(newTransaction);
      }

      if (transaction.amount !== newTransaction.amount) {
        const check = await CheckModel.findById(
          newTransaction.check.toString()
        );

        if (!check) {
          return res.status(404).json({
            success: false,
            message: "Не удалось найти счет",
          });
        }

        updateCheckAmount(check._id.toString());

        return res.json(newTransaction);
      }
    });

    // const oldTransaction = { ...transaction.toObject() };

    // transaction.set(req.body);
    // await transaction.save();

    // if (oldTransaction.check.toString() !== transaction.check.toString()) {
    //   const oldCheck = await CheckModel.findById(
    //     oldTransaction.check.toString()
    //   );
    //   const newCheck = await CheckModel.findById(transaction.check.toString());

    //   if (!newCheck || !oldCheck) {
    //     return res.status(404).json({
    //       message: "Не удалось найти счет",
    //     });
    //   }

    //   const oldTransactions = oldCheck.transactions[oldTransaction.type];
    //   const newTransactions = newCheck.transactions[transaction.type];

    //   oldTransactions.findAndRemove(oldTransaction._id);
    //   newTransactions.push(transaction);

    //   await oldCheck.save();
    //   await newCheck.save();

    //   updateCheckAmount(oldTransaction.check.toString());
    //   updateCheckAmount(transaction.check.toString());

    //   return res.json(transaction);
    // }

    // if (oldTransaction.type !== transaction.type) {
    //   const check = await CheckModel.findById(transaction.check.toString());

    //   if (!check) {
    //     return res.status(404).json({
    //       success: false,
    //       message: "Не удалось найти счет",
    //     });
    //   }

    //   const transactionsIncome = check.transactions.income;
    //   const transactionsExpense = check.transactions.expense;

    //   if (transaction.type === "expense") {
    //     transactionsIncome.findAndRemove(transaction._id);
    //     transactionsExpense.push(transaction);
    //   } else if (transaction.type === "income") {
    //     transactionsExpense.findAndRemove(transaction._id);
    //     transactionsIncome.push(transaction);
    //   }

    //   await check.save();

    //   updateCheckAmount(check._id.toString());

    //   return res.json(transaction);
    // }

    // if (oldTransaction.amount !== transaction.amount) {
    //   const check = await CheckModel.findById(transaction.check.toString());

    //   if (!check) {
    //     return res.status(404).json({
    //       success: false,
    //       message: "Не удалось найти счет",
    //     });
    //   }

    //   updateCheckAmount(check._id.toString());

    //   return res.json(transaction);
    // }

    // return res.json(transaction);
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось обновить транзакцию");
  }
};

export const remove = async (req, res) => {
  try {
    const transaction = await TransactionModel.findById(
      getFakeId(req.params.id, false)
    );

    if (!transaction) {
      return res.status(404).json({
        message: "Не удалось найти транзакцию",
      });
    }

    if (transaction.user.toString() !== getFakeId(req.userId, false)) {
      return res
        .status(403)
        .json({ message: "У вас не доступа к этой транзакции" });
    }

    await TransactionModel.findByIdAndDelete(
      getFakeId(transaction._id.toString(), false)
    ).then(async (data) => {
      if (!data) {
        return res.status(404).json({
          message: "Не удалось найти транзакцию",
        });
      }

      const check = await CheckModel.findById(transaction.check.toString());

      if (!check) {
        return res.json({
          id: data._id,
        });
      }

      check.transactions[transaction.type].findAndRemove(
        transaction._id.toString()
      );

      await check.save();
      updateCheckAmount(check._id.toString());

      res.json({
        id: data._id,
      });
    });

    // await TransactionModel.deleteOne({
    //   _id: transaction._id,
    //   user: transaction.user,
    // })
    //   .then(async () => {
    //     const check = await CheckModel.findById(transaction.check.toString());

    //     if (!check) {
    //       return res.status(404).json({
    //         message: "Не удалось найти счет",
    //       });
    //     }

    //     check.transactions[transaction.type].findAndRemove(
    //       transaction._id.toString()
    //     );

    //     await check.save();
    //     updateCheckAmount(check._id.toString());

    //     res.json({
    //       id: transaction._id,
    //     });
    //   })
    //   .catch(() => {
    //     return res.status(404).json({
    //       message: "Не удалось найти транзакцию",
    //     });
    //   });
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось удалить транзакцию");
  }
};
