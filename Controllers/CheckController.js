import CheckModel from "../Models/Check.js";

import serverErrorHandler from "../Utils/ServerErrorHandler.js";

export const create = async (req, res) => {
  try {
    const checkDoc = new CheckModel({
      user: req.userId,
      name: req.body.name,
      amount: req.body.amount,
      currency: req.body.currency,
      color: req.body.color,
      transactions: {
        expense: [],
        income: [],
      },
    });

    await checkDoc.save();

    res.json({
      success: true,
    });
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось создать счет");
  }
};

export const getAll = async (req, res) => {
  try {
    const checks = await CheckModel.find({ user: req.userId }).populate({
      path: "currency",
      options: { strictPopulate: false },
    });

    res.json(checks);
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось найти счет");
  }
};
