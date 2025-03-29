import mongoose from "mongoose";

const userSchema =new  mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  {
    versionKey: false,
  }
);

const UserModel = mongoose.model("user", userSchema);

export { UserModel };