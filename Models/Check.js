import { Schema, model } from "mongoose";

const CheckSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    amount: {
      type: Number,
      require: true,
    },
    currency: {
      type: Schema.Types.ObjectId,
      ref: "Currency",
      require: true,
    },
    transactions: {
      expense: [
        {
          type: Schema.Types.ObjectId,
          ref: "Transaction",
        },
      ],
      income: [
        {
          type: Schema.Types.ObjectId,
          ref: "Transaction",
        },
      ],
    },
  },
  { timestamps: true }
);

export default model("Check", CheckSchema);
