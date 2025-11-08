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
  categoryCreateValidation,
  checkUpdateValidation,
  transactionUpdateValidation,
  categoryUpdateValidation,
} from "./Validations/index.js";

import {
  handleValidationErrors,
  checkAuth,
  checkValidId,
} from "./Utils/index.js";

import {
  UserController,
  TransactionController,
  CheckController,
  CurrencyController,
  CategoryController,
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
app.get("/auth/me", checkAuth, UserController.getCheckMe);

// transactions
app.get("/transactions", checkAuth, TransactionController.getAll);
app.get(
  "/transactions/:id",
  checkAuth,
  checkValidId,
  TransactionController.getOneById
);
app.post(
  "/transactions",
  checkAuth,
  transactionCreateValidation,
  handleValidationErrors,
  TransactionController.create
);
app.patch(
  "/transactions/:id",
  checkAuth,
  checkValidId,
  transactionUpdateValidation,
  handleValidationErrors,
  TransactionController.update
);
app.delete(
  "/transactions/:id",
  checkAuth,
  checkValidId,
  TransactionController.remove
);

// checks
app.get("/checks", checkAuth, CheckController.getAll);
app.get("/checks/:id", checkAuth, checkValidId, CheckController.getOneById);
app.post(
  "/checks",
  checkAuth,
  checkCreateValidation,
  handleValidationErrors,
  CheckController.create
);
app.patch(
  "/checks/:id",
  checkAuth,
  checkValidId,
  checkUpdateValidation,
  handleValidationErrors,
  CheckController.update
);
app.delete("/checks/:id", checkAuth, checkValidId, CheckController.remove);

// categories
app.get("/categories", checkAuth, CategoryController.getAll);
app.get(
  "/categories/:id",
  checkAuth,
  checkValidId,
  CategoryController.getOneById
);
app.post(
  "/categories",
  checkAuth,
  categoryCreateValidation,
  handleValidationErrors,
  CategoryController.create
);
app.patch(
  "/categories/:id",
  checkAuth,
  checkValidId,
  categoryUpdateValidation,
  handleValidationErrors,
  CategoryController.update
);
app.delete(
  "/categories/:id",
  checkAuth,
  checkValidId,
  CategoryController.remove
);

// currencies
app.get("/currencies", checkAuth, CurrencyController.getAll);
app.get(
  "/currencies/:id",
  checkAuth,
  checkValidId,
  CurrencyController.getOneById
);

app.listen(process.env.PORT, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});
