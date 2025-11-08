import CurrencyModel from "../Models/Currency.js";

import serverErrorHandler from "../Utils/ServerErrorHandler.js";

export const getAll = async (_, res) => {
  try {
    const currencies = await CurrencyModel.find();

    res.json(currencies);
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось получить валюты");
  }
};

export const getOneById = async (req, res) => {
  try {
    const currency = await CurrencyModel.findById(req.params.id);

    if (!currency) {
      return res.status(404).json({ message: "Не удалось найти валюту" });
    }

    res.json(currency);
  } catch (err) {
    serverErrorHandler(res, err, "Не удалось получить валюту");
  }
};
