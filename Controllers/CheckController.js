import CheckModel from "../Models/Check.js";

export const getAll = async (req, res) => {
  try {
    const checks = await CheckModel.find({ user: req.userId }).populate(
      "user",
      "transaction"
    );
    return res.json(checks);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось найти транзакции",
    });
  }
};
