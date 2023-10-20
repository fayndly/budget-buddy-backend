import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
    },
    userId: {
      type: String,
    },
    shortDescription: {
      type: String,
    },
    amount: {
      type: Number,
    },
    check: {
      type: String,
    },
    category: {
      type: String,
    },
    date: {
      type: Date,
      // default: new Date.now()
    },
    fullDescription: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Transaction", TransactionSchema);
