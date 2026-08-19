import crypto from "crypto";
import Razorpay from "razorpay";
import UserModel from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("Razorpay keys missing in .env");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const CREDIT_MAP = {
  100: 50,
  200: 120,
  500: 300,
};

export const createCreditsOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { amount } = req.body;

    if (!CREDIT_MAP[amount]) {
      return res.status(400).json({
        message: "Invalid credit plan",
      });
    }

    const order = await razorpay.orders.create({
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: `credits_${userId}_${Date.now()}`,
      notes: {
        userId: String(userId),
        credits: String(CREDIT_MAP[amount]),
      },
    });

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay order error:", error);
    res.status(500).json({ message: "Unable to create payment order" });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const userId = req.userId;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const order = await razorpay.orders.fetch(razorpay_order_id);
    const orderUserId = order.notes?.userId;
    const creditsToAdd = Number(order.notes?.credits);

    if (
      orderUserId !== String(userId) ||
      !creditsToAdd ||
      order.status !== "paid"
    ) {
      return res.status(400).json({ message: "Invalid or unpaid order" });
    }

    const user = await UserModel.findOneAndUpdate(
      {
        _id: userId,
        razorpayOrderIds: { $ne: razorpay_order_id },
      },
      {
        $inc: { credits: creditsToAdd },
        $set: { isCreditAvailable: true },
        $addToSet: { razorpayOrderIds: razorpay_order_id },
      },
      { new: true },
    );

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified and credits added",
      credits: user.credits,
    });
  } catch (error) {
    console.error("Razorpay verification error:", error);
    return res.status(500).json({ message: "Payment verification failed" });
  }
};
