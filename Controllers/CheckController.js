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
    serverErrorHandler(res, err, "Не удалось найти счета");
  }
};

export const getOneById = async (req, res) => {
  try {
    const check = await CheckModel.findById(req.params.id);

    res.json(check);
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось найти счет");
  }
};

export const update = async (req, res) => {
  try {
    await CheckModel.updateOne(
      {
        _id: req.params.id,
      },
      {
        name: req.body.name,
        amount: req.body.amount,
        currency: req.body.currency,
        color: req.body.color,
      }
    ).catch((err) => {
      console.log(err);
      res.status(404).json({
        success: false,
        message: "Не удалось найти счет",
      });
    });

    res.json({
      success: true,
    });
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось обновить счет");
  }
};

export const remove = async (req, res) => {
  try {
    await CheckModel.findOneAndDelete({
      _id: req.params.id,
    })
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({
            success: false,
            message: "Счет не найден",
          });
        }
        res.json({
          success: true,
        });
      })
      .catch((err) => {
        return serverErrorHandler(res, err, "Не удалось удалить счет");
      });
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось удалить счет");
  }
};
