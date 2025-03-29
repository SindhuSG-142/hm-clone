import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connection from "./config/db.js";
import prodRouter from "./routes/product.routes.js";
import userRouter from "./routes/user.route.js";
import purchaseRouter from "./routes/purchased.route.js";

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors());
app.use("/products", prodRouter);
app.use("/user", userRouter);
app.use("/purchase", purchaseRouter);

app.get("/", (req, res) => {
  res.status(200).send("Health check is fine");
});

app.listen(port, async () => {
  try {
    await connection;
    console.log(`Server is running on port ${port} and DB is connected`);
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
});

export default app;
