import CheckModel from "../Models/Check.js";

import serverErrorHandler from "../Utils/ServerErrorHandler.js";

import { strToBool } from "../Utils/StrtoBool.js";

export const create = async (req, res) => {
  try {
    const checkDoc = new CheckModel({
      user: req.userId,
      name: req.body.name,
      amount: req.body.amount,
      currency: req.body.currency,
      transactions: {
        expense: [],
        income: [],
      },
    });

    await checkDoc.save();

    res.json(checkDoc);
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось создать счет");
  }
};

export const getOneById = async (req, res) => {
  try {
    const check = CheckModel.findById(req.params.id);

    if (req.query.populate) {
      const populate = req.query.populate;

      strToBool(populate.currency) && check.populate("currency");

      if (populate.transactions) {
        strToBool(populate.transactions.expense) &&
          check.populate("transactions.expense");
        strToBool(populate.transactions.income) &&
          check.populate("transactions.income");
      }
    }

    await check.exec().then((data) => {
      if (!data) {
        return res.status(404).json({
          message: "Не удалось найти счет",
        });
      }

      if (data.user.toString() !== req.userId) {
        return res
          .status(403)
          .json({ message: "У вас не доступа к этому счету" });
      }

      res.json(data);
    });
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось получить счет");
  }
};

export const getAll = async (req, res) => {
  try {
    const checks = CheckModel.find({
      user: req.userId,
    });

    if (req.query.populate) {
      const populate = req.query.populate;

      strToBool(populate.currency) && checks.populate("currency");

      if (populate.transactions) {
        strToBool(populate.transactions.expense) &&
          checks.populate("transactions.expense");
        strToBool(populate.transactions.income) &&
          checks.populate("transactions.income");
      }
    }

    await checks.exec().then((data) => {
      res.json(data);
    });
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось получить счета");
  }
};

export const update = async (req, res) => {
  try {
    const check = await CheckModel.findById(req.params.id);

    if (!check) {
      return res.status(404).json({
        message: "Не удалось найти счет",
      });
    }

    if (check.user.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "У вас не доступа к этому счету" });
    }

    await CheckModel.findByIdAndUpdate(
      check._id,
      {
        name: req.body.name,
        currency: req.body.currency,
      },
      { new: true }
    ).then((data) => {
      if (!data) {
        return res.status(404).json({
          message: "Не удалось найти счет",
        });
      }

      res.json(data);
    });
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось обновить счет");
  }
};

export const remove = async (req, res) => {
  try {
    const check = await CheckModel.findById(req.params.id);

    if (!check) {
      return res.status(404).json({
        message: "Не удалось найти счет",
      });
    }

    if (check.user.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "У вас не доступа к этому счету" });
    }

    await CheckModel.findByIdAndDelete(check._id).then((data) => {
      if (!data) {
        return res.status(404).json({
          message: "Не удалось найти счет",
        });
      }

      res.json({
        id: data._id,
      });
    });
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось удалить счет");
  }
};
