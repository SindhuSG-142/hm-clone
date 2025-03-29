import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    image1: { type: String, required: true },
    image2: { type: String, required: true },
    category: { type: String, required: true },
    related_to: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  {
    versionKey: false,
  }
);

const ProductModel = mongoose.model("product", productSchema);

export { ProductModel };
