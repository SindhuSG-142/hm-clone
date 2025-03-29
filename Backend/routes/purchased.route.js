import express from "express";
import auth from "../middlewares/auth.middleware.js";
import { postPurchase, getPurchasedProducts } from "../controllers/product.controller.js";

const purchaseRouter = express.Router();

purchaseRouter.post("/purchased", auth, postPurchase);
purchaseRouter.get("/purchased", auth, getPurchasedProducts);

export default purchaseRouter;
