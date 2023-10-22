import mongoose from "mongoose";

const CheckSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    transactions: {
      expense: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Transaction",
        },
      ],
      income: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Transaction",
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Check", CheckSchema);
