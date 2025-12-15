import { Schema, model, Document, Types } from "mongoose";

export interface IAchievement extends Document {
  user: Types.ObjectId;
  title?: string;
  body?: string;
}
export type AchievementDocument = IAchievement;
const achievementSchema = new Schema<IAchievement>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "EmployeeProfile",
      required: true,
      index: true,
    },
    title: { type: String },
    body: { type: String },
  },
  { timestamps: true }
);

export default model<IAchievement>("Achievement", achievementSchema);
