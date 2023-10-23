import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

import {
  signupValidation,
  loginValidation,
  transactionCreateValidation,
  checkCreateValidation,
} from "./Validations/index.js";

import { handleValidationErrors, checkAuth } from "./Utils/index.js";

import {
  UserController,
  TransactionController,
  CheckController,
  CurrencyController,
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
// app.post(
//   "/transactions",
//   checkAuth,
//   transactionCreateValidation,
//   handleValidationErrors,
//   TransactionController.create
// ); // create transaction
// app.patch(
//   "/transactions/:id",
//   checkAuth,
//   transactionCreateValidation,
//   handleValidationErrors,
//   TransactionController.update
// ); // update transaction
// app.delete("/transactions/:id", checkAuth, TransactionController.remove); // remove transaction
// app.get("/transactions", checkAuth, TransactionController.getAll); // get all transactions
// app.get("/transactions/:id", checkAuth, TransactionController.getById); // get by id transactions
// app.get(
//   "/transactions/:check/:type/:startDate/:endDate",
//   checkAuth,
//   TransactionController.getAllByDate
// ); // get all by date transactions

// checks
app.post(
  "/checks",
  checkAuth,
  checkCreateValidation,
  handleValidationErrors,
  CheckController.create
); // create check
app.get("/checks", checkAuth, CheckController.getAll); // get all checks
// app.patch(
//   "/checks/:id",
//   checkAuth,
//   checkCreateValidation,
//   handleValidationErrors,
//   CheckController.update
// ); // update check
// app.delete("/checks/:id", checkAuth, CheckController.remove); // remove check

// currencies
app.get("/currencies", checkAuth, CurrencyController.getAll); // get all currencies

app.listen(process.env.PORT, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});
