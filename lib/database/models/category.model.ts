import { Document, model, models, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
});

export default models.Category || model<ICategory>("Category", CategorySchema);
