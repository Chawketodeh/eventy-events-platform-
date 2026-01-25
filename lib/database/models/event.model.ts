import { Document, model, models, Schema, Types } from "mongoose";

export interface IEvent extends Document {
  // Removed _id because Document already defines it as ObjectId
  // Redefining it as string causes a TypeScript conflict

  title: string;
  description?: string;
  location?: string;

  latitude?: number; // Correct type: number
  longitude?: number; // Correct type: number

  createdAt: Date;
  imageUrl: string;
  startDateTime: Date;
  endDateTime: Date;
  price: string;
  isFree: boolean;
  url?: string;

  // Changed from inline object to ObjectId to match the schema reference
  category?: Types.ObjectId;

  // Changed from inline object to ObjectId to match the schema reference
  organizer?: Types.ObjectId;
}

const EventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String },

  latitude: { type: Number },
  longitude: { type: Number },

  createdAt: { type: Date, default: Date.now },
  imageUrl: { type: String, required: true },
  startDateTime: { type: Date, default: Date.now },
  endDateTime: { type: Date, default: Date.now },
  price: { type: String },
  isFree: { type: Boolean, default: false },
  url: { type: String },

  // Schema uses ObjectId references, interface must match
  category: { type: Schema.Types.ObjectId, ref: "Category" },

  // Schema uses ObjectId references, interface must match
  organizer: { type: Schema.Types.ObjectId, ref: "User" },
});

const Event = models.Event || model<IEvent>("Event", EventSchema);
export default Event;
