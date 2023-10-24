import CategoryModel from "../Models/Category.js";

import serverErrorHandler from "../Utils/ServerErrorHandler.js";

export const create = async (req, res) => {
  try {
    const categoryDoc = new CategoryModel({
      user: req.userID,
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
