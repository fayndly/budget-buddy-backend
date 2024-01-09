import CheckModel from "../Models/Check.js";

import serverErrorHandler from "../Utils/ServerErrorHandler.js";

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

export const getAll = async (req, res) => {
  try {
    const checks = await CheckModel.find({ user: req.userId });

    res.json(checks);
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось найти счета");
  }
};

export const getOneById = async (req, res) => {
  try {
    const check = await CheckModel.findById(req.params.id);

    if (!check) {
      return res.status(404).json({
        message: "Не удалось найти счет",
      });
    }

    if (check.user.toString() !== req.userId) {
      return res.status(403).json({
        message: "У вас нет доступа к этому счету",
      });
    }

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
        user: req.userId,
      },
      {
        name: req.body.name,
        amount: req.body.amount,
        currency: req.body.currency,
      }
    )
      .then(async () => {
        await CheckModel.findById(req.params.id)
          .then((doc) => {
            res.json(doc);
          })
          .catch(() => {
            res.status(404).json({
              message: "Не удалось найти обновленный счет",
            });
          });
      })
      .catch(() => {
        res.status(404).json({
          message: "Не удалось найти счет",
        });
      });
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось обновить счет");
  }
};

export const remove = async (req, res) => {
  try {
    await CheckModel.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    })
      .then((doc) => {
        res.json({
          id: doc._id,
        });
      })
      .catch(() => {
        res.status(404).json({
          message: "Не удалось найти счет",
        });
      });
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось удалить счет");
  }
};
