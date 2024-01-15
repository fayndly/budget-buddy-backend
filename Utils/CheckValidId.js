import { isValidObjectId } from "../Validations/helpers.js";

export default (req, res, next) => {
  try {
    if (isValidObjectId(req.params.id)) {
      next();
    } else {
      return res.status(404).json({
        message: "Не верный id",
      });
    }
  } catch (e) {
    return res.status(404).json({
      message: "Не верный id",
    });
  }
};
