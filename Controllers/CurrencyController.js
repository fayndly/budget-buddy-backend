import CurrencyModel from "../Models/Currency.js";

import serverErrorHandler from "../Utils/ServerErrorHandler.js";

export const getAll = async (_, res) => {
  try {
    const currencies = await CurrencyModel.find();
    res.json(currencies);
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось найти валюты");
  }
};

export const getOneById = async (req, res) => {
  try {
    const currency = await CurrencyModel.findById(req.params.id);
    res.json(currency);
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось найти валюту");
  }
};
