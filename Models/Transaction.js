import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    type: {
      type: "expense" || "income",
      require: true,
    },
    shortDescription: {
      type: String,
      require: true,
    },
    currency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Currency",
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      require: true,
    },
    time: {
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
