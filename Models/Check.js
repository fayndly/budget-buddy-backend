import mongoose from "mongoose";

const CheckSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    isGeneral: {
      type: Boolean,
      default: false,
    },
    includedChecks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Check",
      },
    ],
    name: {
      type: String,
      require: true,
    },
    amount: {
      type: Number,
      require: true,
    },
    currency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Currency",
      require: true,
    },
    color: {
      type: String,
      require: true,
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
