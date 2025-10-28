import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Provide a valid email address."],
    },
  },
  { timestamps: true }
);

export const Subscriber =
  mongoose.models.Subscriber || mongoose.model("Subscriber", subscriberSchema);
