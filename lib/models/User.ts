import bcrypt from "bcrypt";
import mongoose from "mongoose";

export type UserDocument = mongoose.Document & {
  email: string;
  password: string;
};

export interface AuthToken {
  accessToken: string;
  kind: string;
}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

userSchema.pre("save", function save(next) {
  const user = this as UserDocument;
  const saltRounds = 10;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.hash(user.password, saltRounds, (err: mongoose.Error, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

export const User = mongoose.model<UserDocument>("User", userSchema);
