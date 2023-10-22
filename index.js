import express from "express";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

import {
  signupValidation,
  loginValidation,
  transactionCreateValidation,
} from "./Validations/index.js";

import { handleValidationErrors, checkAuth } from "./Utils/index.js";

import {
  UserController,
  TransactionController,
  CheckController,
} from "./Controllers/index.js";

const mongoUrl = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER_NAME}.1r0hst3.mongodb.net/${process.env.MONGODB_DB_NAME}?retryWrites=true&w=majority`;

mongoose
  .connect(mongoUrl)
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

const app = express();

app.use(express.json());
app.use(cors());

// user
app.post(
  "/auth/signup",
  signupValidation,
  handleValidationErrors,
  UserController.signup
);
app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.get("/auth/check", checkAuth, UserController.getCheckMe);

// transactions
app.post(
  "/transactions",
  checkAuth,
  transactionCreateValidation,
  handleValidationErrors,
  TransactionController.create
);
app.get("/transactions", checkAuth, TransactionController.getAll);
app.get(
  "/transactions/:check/:type/:startDate/:endDate",
  checkAuth,
  TransactionController.getAllByDate
);

// checks
app.get("/checks", checkAuth, CheckController.getAll);

app.listen(process.env.PORT, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});
