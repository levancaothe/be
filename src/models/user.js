// models/User.js
const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["Admin", "Manager", "Customer"],
      default: "Customer",
    },
    isActive: { type: Boolean, default: true },
    phone: { type: String, default: "" },
    avatar: { type: String, default: "https://img.icons8.com/color/48/user-male-circle.png" },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

// Ẩn password khi JSON.stringify
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  return obj;
};

module.exports = model("User", userSchema);
