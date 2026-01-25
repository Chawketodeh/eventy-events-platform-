import { Document, model, models, Schema, Types } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description?: string;
  location?: string;

  latitude?: number;
  longitude?: number;

  createdAt: Date;
  imageUrl: string;
  startDateTime: Date;
  endDateTime: Date;
  price: string;
  isFree: boolean;
  url?: string;

  // Category can be ObjectId or populated object (after .populate())
  category?: Types.ObjectId | { _id: Types.ObjectId; name: string };

  // Organizer can be ObjectId or populated object (after .populate())
  organizer?:
    | Types.ObjectId
    | {
        _id: Types.ObjectId;
        clerkId: string;
        firstName: string;
        lastName: string;
      };
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

  category: { type: Schema.Types.ObjectId, ref: "Category" },

  organizer: { type: Schema.Types.ObjectId, ref: "User" },
});

const Event = models.Event || model<IEvent>("Event", EventSchema);
export default Event;
