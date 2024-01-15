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
    const check = await CheckModel.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!check) {
      return res.status(404).json({
        message: "Не удалось найти счет",
      });
    }

    res.json(check);
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось найти счет");
  }
};

export const update = async (req, res) => {
  try {
    const check = await CheckModel.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!check) {
      return res.status(404).json({
        message: "Не удалось найти счет",
      });
    }

    await CheckModel.updateOne(
      {
        _id: check._id,
        user: check.user,
      },
      {
        name: req.body.name,
        currency: req.body.currency,
      }
    )
      .then(async () => {
        await CheckModel.findById(check._id)
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
    const check = await CheckModel.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!check) {
      return res.status(404).json({
        message: "Не удалось найти счет",
      });
    }

    await CheckModel.deleteOne({ _id: check._id, user: check.user })
      .then(() => {
        res.json({
          id: check._id,
        });
      })
      .catch(() => {
        return res.status(404).json({
          message: "Не удалось найти счет",
        });
      });
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось удалить счет");
  }
};
