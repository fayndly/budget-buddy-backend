import CurrencyModel from "../Models/Currency.js";

import serverErrorHandler from "../Utils/ServerErrorHandler.js";

export const getAll = async (_, res) => {
  try {
    const checks = await CurrencyModel.find();
    res.json(checks);
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось найти транзакции");
  }
};
