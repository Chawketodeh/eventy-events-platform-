import { Document, model, models, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  createdAt?: Date;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default models.Category || model<ICategory>("Category", CategorySchema);
