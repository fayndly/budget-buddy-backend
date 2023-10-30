import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    type: {
      type: String, // "expense" || "income",
      require: true,
    },
    color: {
      type: String,
      require: true,
    },
    icon: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Category", CategorySchema);
