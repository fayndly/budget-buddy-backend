import mongoose from "mongoose";

const CurrencySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Currency", CurrencySchema);
