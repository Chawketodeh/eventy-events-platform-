import { model, models, Schema } from "mongoose";

const userSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  userName: { type: String, default: "" },
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  photo: { type: String, default: "" },
});

const User = models.User || model("User", userSchema);

export default User;
