import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  username: string;
  password: string;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

/**
 * ## User schema for MongoDB.
 * @interface IUser - Interface for User
 * @property {string} username - Username of the user.
 * @property {string} password - Hashed password of the user.
 */
const userSchema: Schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * ## Compares the entered password with the stored password hash.
 *
 * @param {string} enteredPassword - The password entered by the user.
 * @return {Promise<boolean>} A promise that resolves to true if the passwords match, false otherwise.
 */
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
