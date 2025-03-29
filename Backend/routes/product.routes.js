import express from "express";
import {
  postProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  findProduct,
  getMany,
  getSuggestions,
} from "../controllers/product.controller.js";
import auth from "../middleware/auth.middleware.js";

const prodRouter = express.Router();

prodRouter.post("/products", auth, postProduct);
prodRouter.get("/products", getProduct);
prodRouter.get("/products/:_id", findProduct);
prodRouter.post("/productsMany", getMany);
prodRouter.patch("/updateProducts/:_id", auth, updateProduct);
prodRouter.delete("/deleteProducts/:_id", auth, deleteProduct);
prodRouter.get("/suggestions", getSuggestions);

export default prodRouter;
