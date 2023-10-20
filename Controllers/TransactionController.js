import TransactionModel from "../Models/Transaction.js";

export const create = async (req, res) => {
  try {
    const doc = new TransactionModel({
      type: req.body.type,
      userId: req.userId,
      shortDescription: req.body.shortDescription,
      amount: req.body.amount,
      check: req.body.check,
      category: req.body.category,
      date: req.body.date,
      fullDescription: req.body.fullDescription,
    });

    const transaction = await doc.save();
    return res.json({
      success: true,
      body: { ...transaction._doc },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать транзакцию",
    });
  }
};

// export const getAll = async (req, res) => {
//   try {
//     const transactions = await TransactionModel.find({ userId: req.userId });
//     return res.json(transactions);
//     // return res.json({ TransactionModel: doc });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: "Не удалось найти транзакции",
//     });
//   }
// };
