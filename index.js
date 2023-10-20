import express from "express";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

import { signupValidation } from "./Validations/index.js";

import { handleValidationErrors } from "./Utils/index.js";

import { UserController } from "./Controllers/index.js";

const mongoUrl = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER_NAME}.1r0hst3.mongodb.net/${process.env.MONGODB_DB_NAME}?retryWrites=true&w=majority`;

mongoose
  .connect(mongoUrl)
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

const app = express();

app.use(express.json());
app.use(cors());

app.post(
  "/auth/signup",
  signupValidation,
  handleValidationErrors,
  UserController.signup
);

app.listen(process.env.PORT, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});
