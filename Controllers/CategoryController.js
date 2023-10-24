import CategoryModel from "../Models/Category.js";

import serverErrorHandler from "../Utils/ServerErrorHandler.js";

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

    res.json({
      success: true,
    });
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось создать категорию");
  }
};

export const getAll = async (req, res) => {
  try {
    const categories = await CategoryModel.find({ user: req.userId });

    res.json(categories);
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось найти категории");
  }
};
