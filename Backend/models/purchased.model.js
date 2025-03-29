import mongoose from "mongoose";

const purchasedSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    ids: { type: Array, required: true },
  },
  {
    versionKey: false,
  }
);

const PurchaseModel = mongoose.model("purchase", purchasedSchema);

export { PurchaseModel };
