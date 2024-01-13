import { validationChain as chain } from "./chains.js";

export const signupValidation = [chain.email, chain.password, chain.userName];

export const loginValidation = [chain.email, chain.password];

export const transactionCreateValidation = [
  chain.type,
  chain.name,
  chain.currency,
  chain.amount,
  chain.check,
  chain.category,
  chain.time,
  chain.description,
];

export const checkCreateValidation = [chain.name, chain.amount, chain.currency];

export const categoryCreateValidation = [
  chain.name,
  chain.type,
  chain.color,
  chain.icon,
];
