import express from "express";
import isAuth from "../middleware/isAuth.js";
import {
  createCreditsOrder,
  verifyRazorpayPayment,
} from "../controllers/credits.controller.js";

const creditRouter = express.Router();

creditRouter.post("/order", isAuth, createCreditsOrder);
creditRouter.post("/verify", isAuth, verifyRazorpayPayment);

export default creditRouter;
