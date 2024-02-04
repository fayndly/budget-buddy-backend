import CategoryModel from "../Models/Category.js";

import serverErrorHandler from "../Utils/ServerErrorHandler.js";

import { strToBool } from "../Utils/StrtoBool.js";
import { getFakeId } from "../Utils/GetFakeId.js";

export const create = async (req, res) => {
  try {
    const categoryDoc = new CategoryModel({
      user: req.userId,
      name: req.body.name,
      type: req.body.type,
      color: req.body.color,
      icon: req.body.icon,
    });

    await categoryDoc.save();

    res.json(categoryDoc);
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось создать категорию");
  }
};

export const getOneById = async (req, res) => {
  try {
    const category = CategoryModel.findById(req.params.id);

    await category
      .exec()
      .then((data) => {
        if (data.user.toString() !== req.userId) {
          return res
            .status(403)
            .json({ message: "У вас не доступа к этой категории" });
        }

        res.json(data);
      })
      .catch((err) => {
        if (err.name === "CastError") {
          return res.status(404).json({
            message: "Не удалось найти категорию",
            error: err,
          });
        }
        serverErrorHandler(res, err, "Не удалось получить категорию");
      });
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось получить категорию");
  }
};

export const getAll = async (req, res) => {
  try {
    const filter = {
      user: req.userId,
    };

    if (req.query.filter) {
      if (req.query.filter.type) filter.type = req.query.filter.type;
    }

    const categories = CategoryModel.find(filter);

    await categories
      .exec()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        serverErrorHandler(res, err, "Не удалось получить категории");
      });
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось получить категории");
  }
};

export const update = async (req, res) => {
  try {
    const category = await CategoryModel.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!category) {
      return res.status(404).json({
        message: "Не удалось найти категорию",
      });
    }

    if (category.isSpecial) {
      return res.status(403).json({
        message: "Вы не можете редактировать эту категорию",
      });
    }

    if (req.body.icon === "null") req.body.icon = null;

    await CategoryModel.updateOne(
      { _id: category._id, user: category.user },
      {
        name: req.body.name,
        type: req.body.type,
        color: req.body.color,
        icon: req.body.icon,
      }
    )
      .then(async () => {
        await CategoryModel.findById(category._id)
          .then((doc) => {
            res.json(doc);
          })
          .catch(() => {
            res.status(404).json({
              message: "Не удалось найти обновленную категорию",
            });
          });
      })
      .catch(() => {
        res.status(404).json({
          message: "Не удалось найти категорию",
        });
      });
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось обновить категорию");
  }
};

export const remove = async (req, res) => {
  try {
    const category = await CategoryModel.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Не удалось найти категорию",
      });
    }

    if (category.user.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "У вас не доступа к этой категории" });
    }

    if (category.isSpecial) {
      return res.status(403).json({
        message: "Вы не можете удалить эту категорию",
      });
    }

    await CategoryModel.findByIdAndDelete(category._id)
      .then((data) => {
        if (!data) {
          return res.status(404).json({
            message: "Не удалось найти категорию",
          });
        }

        res.json({
          id: data._id,
        });
      })
      .catch((err) => {
        serverErrorHandler(res, err, "Не удалось удалить категорию");
      });
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось удалить категорию");
  }
};
