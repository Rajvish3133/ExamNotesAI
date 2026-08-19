import express from "express";
import dotenv from "dotenv";
import connectDb from "./utils/connectDb.js";   
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import notesRouter from "./routes/generate.route.js";
import pdfRouter from "./routes/pdf.route.js";
import creditRouter from "./routes/credits.route.js";

const PORT  = process.env.PORT || 8000;

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/notes",notesRouter);
app.use("/api/pdf", pdfRouter);
app.use("/api/credit",creditRouter)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDb();
});