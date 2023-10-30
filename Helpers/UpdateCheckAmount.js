import CheckModel from "../Models/Check.js";

export default async function updateCheckAmount(checkId) {
  try {
    const check = await CheckModel.findById(checkId).populate({
      path: "transactions.expense transactions.income",
      options: { strictPopulate: false },
      select: "amount",
    });

    if (!check) {
      throw new Error("Не удалось найти счет");
    }

    const expensesTransactions = check.transactions.expense.reduce(
      (acc, val) => {
        acc -= val.amount;
        return acc;
      },
      0
    );
    const incomesTransactions = check.transactions.income.reduce((acc, val) => {
      acc += val.amount;
      return acc;
    }, 0);

    check.amount = expensesTransactions + incomesTransactions;
    await check.save();
  } catch (err) {
    throw new Error("Не удалось обновить сумму счета");
  }
}
