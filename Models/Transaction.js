import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    type: {
      type: String, // expense - расход || income - доход
      require: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    shortDescription: {
      type: String,
      require: true,
    },
    amount: {
      type: Number,
      require: true,
    },
    check: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Check",
      require: true,
    },
    category: {
      type: String,
      require: true,
    },
    date: {
      type: Date,
      require: true,
    },
    fullDescription: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Transaction", TransactionSchema);
