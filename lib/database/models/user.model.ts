import { model, models, Schema } from "mongoose";

const userSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  userName: { type: String, required: false, default: "" }, // 👈 safe now
  firstName: { type: String, required: false, default: "" },
  lastName: { type: String, required: false, default: "" },
  photo: { type: String, required: false, default: "" },
});
const User = models.User || model("User", userSchema);

export default User;
