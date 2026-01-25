import { model, models, Schema, Document } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  email: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  photo?: string;
  createdAt?: Date;
}

const userSchema = new Schema<IUser>({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  userName: { type: String, required: false, default: "" },
  firstName: { type: String, required: false, default: "" },
  lastName: { type: String, required: false, default: "" },
  photo: { type: String, required: false, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const User = models.User || model<IUser>("User", userSchema);

export default User;
